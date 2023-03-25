<?php

namespace AppBundle\Geo\Geocode;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Entity\Location\GoogleLocationRepository;
use AppBundle\Service\Lock\LockInterface;
use Doctrine\ORM\EntityManager;
use function GuzzleHttp\Promise\coroutine;
use GuzzleHttp\Promise\PromiseInterface;
use function GuzzleHttp\Promise\promise_for;
use function GuzzleHttp\Promise\settle;
use Psr\Log\LoggerInterface;

class ReverseGeocodeLocationUnfolder
{
    /**
     * @var HttpClientInterface
     */
    private $httpClient;
    /**
     * @var GoogleLocationRepository
     */
    private $googleLocationRepo;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var EmAwareLocationArrayCache
     */
    private $cacheLocationMap;
    /**
     * @var LockInterface
     */
    private $lock;

    /**
     * @param HttpClientInterface      $httpClient
     * @param GoogleLocationRepository $googleLocationRepo
     * @param EntityManager            $em
     */
    public function __construct(
        HttpClientInterface $httpClient,
        GoogleLocationRepository $googleLocationRepo,
        EntityManager $em,
        EmAwareLocationArrayCache $cacheLocationMap,
        LockInterface $lock,
        LoggerInterface $logger
    ) {
        $this->httpClient = $httpClient;
        $this->googleLocationRepo = $googleLocationRepo;
        $this->em = $em;
        $this->cacheLocationMap = $cacheLocationMap;
        $this->lock = $lock;
        $this->logger = $logger;
    }

    /**
     * @param UnfoldableInterface $entity
     *
     * @return PromiseInterface
     */
    public function unfold(UnfoldableInterface $entity)
    {
        $address = $entity->getAddress();
        if (GoogleLocation::STATUS_PROCESSED_WITH_ADDRESS === $entity->getGoogleLocationsStatus()) {
            return promise_for(null);
        }

        return coroutine(function () use ($entity, $address) {
            $status = $entity->getGoogleLocationsStatus();
            if (GoogleLocation::STATUS_PROCESSED !== $entity->getGoogleLocationsStatus()) {
                if ($address->hasCoords()) {
                    list($results, $status) = (yield $this
                        ->httpClient
                        ->reverseGeocodeAsync($address)
                        ->then(
                            function ($results) use ($entity, $address) {
                                if ('OK' != $results->status) {
                                    $reason = $results->status;
                                    if (!empty($results->error_message)) {
                                        $reason .= ' '.$results->error_message;
                                    }

                                    $this->logRequestFailureMain(
                                        $entity,
                                        $address,
                                        new \RuntimeException($reason)
                                    );

                                    return [false, GoogleLocation::STATUS_FAILED];
                                }

                                [
                                    $locations,
                                    $completionStatus
                                ] = $this->getLocationsFromResults($results->results);

                                $entity->setGoogleLocations(array_values($locations));

                                return [
                                    $results,
                                    $completionStatus,
                                ];
                            },
                            function ($reason) use ($entity, $address) {
                                $this->logRequestFailureMain($entity, $address, $reason);

                                return [false, GoogleLocation::STATUS_FAILED];
                            }
                        ))
                    ;
                } else {
                    $results = false;
                    $status = GoogleLocation::STATUS_FAILED;
                }

                $significantParts = $this->getMissingSignificantParts($address, $results);
                if ($significantParts) {
                    list($_, $fallbackStatus) = (yield settle(array_map(
                        function ($part) use ($address) {
                            return $this
                                ->httpClient
                                ->geocodeAsync($part, $address->getCountry())
                                ;
                        },
                        array_map(
                            function ($significantPart) {
                                return $significantPart['search_term'];
                            },
                            $significantParts
                        )
                    ))->then(function ($results) use ($entity, $significantParts) {
                        list($results, $failures) = $this->parseSettleResults($results, $entity, $significantParts);

                        [
                            $locations,
                            $_
                        ] = $this->getLocationsFromResults($results);
                        foreach ($locations as $location) {
                            $entity->addGoogleLocation($location);
                        }

                        $status = $this->getFallbackStatus($results, $failures);

                        return [$results, $status];
                    }));

                    $status = $this->deriveStatusFromFallback($status, $fallbackStatus);
                }
            }

            $fullAddresses = $address->getStreetAndStreetWithAptBldgAddresses();
            if ($fullAddresses) {
                $fullAddressesStatus = (yield settle(array_map(
                    function ($part) use ($address) {
                        return $this
                            ->httpClient
                            ->geocodeAsync($part, $address->getCountry())
                        ;
                    },
                    array_map(
                        function ($fullAddress) {
                            return $fullAddress['name'];
                        },
                        $fullAddresses
                    )
                ))->then(function ($results) use ($entity, $fullAddresses) {
                    list($results, $failures) = $this->parseSettleResults(
                        $results,
                        $entity,
                        $fullAddresses,
                        function ($response, $fullAddress, &$errorMsg) {
                            if (empty(array_intersect((array) $fullAddress['type'], $response->types))) {
                                $errorMsg = sprintf(
                                    '"%s" not in "%s"',
                                    implode(',', (array) $fullAddress['type']),
                                    implode(',', $response->types)
                                );

                                return false;
                            }

//                            if (!$this->isInsideBoundBox($response, $fullAddress, $errorMsg)) {
//                                return false;
//                            }

                            return true;
                        }
                    );

                    [
                        $locations,
                        $_
                    ] = $this->getLocationsFromResults($results);
                    foreach ($locations as $location) {
                        $entity->addGoogleLocation($location);
                    }

                    if (count($locations) !== count($fullAddresses)) {
                        $fullAddressStatus = GoogleLocation::STATUS_PROCESSED;
                    } else {
                        $fullAddressStatus = GoogleLocation::STATUS_PROCESSED_WITH_ADDRESS;
                    }

                    $entity->setGoogleLocationsFullAddressStatus($fullAddressStatus);
                    $entity->setGoogleLocationsFullAddressStatusCreatedAt(new \DateTime());
                    $entity->setGoogleLocationsFullAddressStatusReport([
                        'loc_cnt' => count($locations),
                        'fa_cnt' => count($fullAddresses),
                        'res_cnt' => count((array) $results),
                        'fail_cnt' => count((array) $failures),
                    ]);

                    return $fullAddressStatus;
                }));

                if (GoogleLocation::STATUS_PROCESSED === $status) {
                    $status = $fullAddressesStatus;
                }
            }

            $entity->setGoogleLocationsStatus($status);
        });
    }

    /**
     * @param GoogleLocation[] $googleLocations
     */
    public function release(array $googleLocations = [])
    {
        $this->cacheLocationMap->release($googleLocations);
    }

    public function purge()
    {
        $this->cacheLocationMap->purge();
    }

    public function reset()
    {
        $this->cacheLocationMap->reset();
    }

    /**
     * @param Address     $address
     * @param object|bool $results
     *
     * @return array
     */
    private function getMissingSignificantParts(Address $address, $results)
    {
        $missingParts = [
            'locality' => [
                'path' => ['TownCity', 'StateCounty', 'Country'],
                'name' => 'TownCity',
            ],
            'administrative_area_level_1' => [
                'path' => ['StateCounty', 'Country'],
                'name' => 'StateCounty',
            ],
        ];
        if ($results) {
            foreach ($results->results as $result) {
                switch (true) {
                    case in_array('administrative_area_level_1', $result->types):
                        unset($missingParts['administrative_area_level_1']);
                        break;
                    case in_array('locality', $result->types):
                        unset($missingParts['locality']);
                        break;
                }
            }
        }

        $missingPartsCompiled = [];
        foreach ($missingParts as $missingPartKey => $missingPartValue) {
            $missingPartsCompiled[] = [
                'search_term' => implode(
                    ', ',
                    array_filter(array_map(
                        function ($component) use ($address) {
                            return $address->{'get'.$component}();
                        },
                        $missingPartValue['path']
                    ))
                ),
                'type' => $missingPartKey,
                'address' => $address,
                'name' => $address->{'get'.$missingPartValue['name']}(),
            ];
        }

        return $missingPartsCompiled;
    }

    /**
     * @param object $response
     * @param array  $significantPart
     *
     * @return bool
     */
    private function matchPart(\stdClass $response, array $significantPart, &$errorMsg)
    {
        if (empty(array_intersect((array) $significantPart['type'], $response->types))) {
            $errorMsg = sprintf(
                '"%s" not in "%s"',
                implode(',', (array) $significantPart['type']),
                implode(',', $response->types)
            );

            return false;
        }

        $googleLocationNames = $response->address_components[0];
        if (
            $googleLocationNames->long_name != $significantPart['name']
            && $googleLocationNames->short_name != $significantPart['name']
        ) {
            if (!$this->isInsideBoundBox($response, $significantPart, $errorMsg)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param object $response
     * @param array  $significantPart
     *
     * @return bool
     */
    private function isInsideBoundBox(\stdClass $response, array $significantPart, &$errorMsg)
    {
        if (isset($response->geometry->bounds)) {
            $boundBox = $response->geometry->bounds;
        } elseif (isset($response->geometry->viewport)) {
            $boundBox = $response->geometry->viewport;
        } else {
            $errorMsg = 'No boundaries';

            return false;
        }

        $lat = $significantPart['address']->getCoords()->getLatitude();
        $lng = $significantPart['address']->getCoords()->getLongitude();

        if (
            $lat <= $boundBox->northeast->lat && $lat >= $boundBox->southwest->lat
            && $lng <= $boundBox->northeast->lng && $lng >= $boundBox->southwest->lng
        ) {
            return true;
        }

        $errorMsg = sprintf(
            '"%s,%s" out of boundaries. "%s"',
            $lat,
            $lat,
            json_encode($boundBox)
        );

        return false;
    }

    /**
     * @param array               $results
     * @param UnfoldableInterface $entity
     * @param array               $significantParts
     * @param callable|null       $matcher
     *
     * @return array
     */
    private function parseSettleResults(
        array $results,
        UnfoldableInterface $entity,
        array $significantParts,
        callable $matcher = null
    ) {
        $matcher = $matcher ?? function ($response, $significantPart, &$errorMsg) {
            return $this->matchPart($response, $significantPart, $errorMsg);
        };
        $responses = $failures = [];
        foreach ($results as $idx => $result) {
            if (PromiseInterface::FULFILLED === $result['state']) {
                if ('OK' != $result['value']->status) {
                    $failures[$idx] = true;

                    $reason = $result['value']->status;
                    if (!empty($result['value']->error_message)) {
                        $reason .= ' '.$result['value']->error_message;
                    }
                    $this->logRequestFailureFallback(
                        $entity,
                        $significantParts[$idx],
                        new \RuntimeException($reason)
                    );

                    continue;
                }

                $response = $result['value']->results[0];
                if ($matcher($response, $significantParts[$idx], $errorMsg)) {
                    $responses[$idx] = $response;
                } else {
                    $failures[$idx] = true;
                    $this->logMatchFailureFallback(
                        $entity,
                        $significantParts[$idx],
                        $response,
                        $errorMsg
                    );
                }
            } elseif (PromiseInterface::REJECTED === $result['state']) {
                $failures[$idx] = true;
                $this->logRequestFailureFallback($entity, $significantParts[$idx], $result['reason']);
            }
        }

        return [$responses, $failures];
    }

    /**
     * @param array $results
     * @param array $failures
     *
     * @return string
     */
    private function getFallbackStatus(array $results, array $failures)
    {
        if (empty($results)) {
            $status = GoogleLocation::STATUS_FAILED;
        } elseif (!empty($failures)) {
            $status = GoogleLocation::STATUS_PARTIALLY_PROCESSED;
        } else {
            $status = GoogleLocation::STATUS_PROCESSED;
        }

        return $status;
    }

    /**
     * @param string $status
     * @param string $fallbackStatus
     *
     * @return string
     */
    private function deriveStatusFromFallback($status, $fallbackStatus)
    {
        if (
            GoogleLocation::STATUS_PROCESSED === $status
        ) {
            if (
                GoogleLocation::STATUS_FAILED === $fallbackStatus
                || GoogleLocation::STATUS_PARTIALLY_PROCESSED === $fallbackStatus
            ) {
                $status = GoogleLocation::STATUS_PARTIALLY_PROCESSED;
            }
        } else { // $status === GoogleLocation::STATUS_FAILED
            if (
                GoogleLocation::STATUS_PROCESSED === $fallbackStatus
                || GoogleLocation::STATUS_PARTIALLY_PROCESSED === $fallbackStatus
            ) {
                $status = GoogleLocation::STATUS_PARTIALLY_PROCESSED;
            }
        }

        return $status;
    }

    /**
     * @param array $results
     *
     * @return array
     */
    private function getLocationsFromResults(array $results)
    {
        if (empty($results)) {
            return [
                [],
                GoogleLocation::STATUS_FAILED,
            ];
        }

        $locationResultsMap = [];
        foreach ($results as $result) {
            $locationResultsMap[$result->place_id] = $result;
        }

        $locations = $this->tryToLoadFromCache($locationResultsMap);

        if (!empty($locationResultsMap)) {
            $locations = array_merge($locations, $this->loadDBLocations($locationResultsMap));
            $locations = array_merge($locations, $this->createNewLocations($locationResultsMap));
        }

        switch (count($locationResultsMap)) {
            case 0:
                $status = GoogleLocation::STATUS_PROCESSED; break;
            case count($locations):
                $status = GoogleLocation::STATUS_FAILED; break;
            default:
                $status = GoogleLocation::STATUS_PARTIALLY_PROCESSED; break;
        }

        return [
            $locations,
            $status,
        ];
    }

    /**
     * @param array $locationResultsMap
     *
     * @return array
     */
    private function loadDBLocations(&$locationResultsMap)
    {
        $placeIds = array_keys($locationResultsMap);

        $locations = $this->googleLocationRepo->findByPlaceId($placeIds);

        $locationMap = [];
        foreach ($locations as $location) {
            $locationMap[$location->getPlaceId()] = $location;

            $this->cacheLocationMap->add($location);
            unset($locationResultsMap[$location->getPlaceId()]);
        }

        return $locationMap;
    }

    /**
     * @param array $locationResultsMap
     *
     * @return array
     */
    private function createNewLocations(&$locationResultsMap)
    {
        $locationMap = [];
        foreach ($locationResultsMap as $locationResult) {
            $this->lock->executeInLock(
                $locationResult->place_id,
                3,
                3,
                function () use ($locationResult, &$locationResultsMap, &$locationMap) {
                    $lastResortEntity = $this->googleLocationRepo->findOneByPlaceId($locationResult->place_id);
                    if ($lastResortEntity) {
                        $locationMap[$locationResult->place_id] = $location = $lastResortEntity;
                    } else {
                        $locationMap[$locationResult->place_id] = $location = new GoogleLocation($locationResult);
                        $this->em->persist($location);
                        $this->em->flush($location); // bad practice but important to flush instantly to reduce possibility of race conditions
                    }

                    $this->cacheLocationMap->add($location);
                    unset($locationResultsMap[$locationResult->place_id]);
                },
                function () use ($locationResult, &$locationResultsMap) {
                    $this->logger->error(
                        sprintf(
                            'Failed to acquire lock for [%s] %s',
                            $locationResult->place_id,
                            json_encode($locationResult)
                        )
                    );
                }
            );
        }

        return $locationMap;
    }

    /**
     * @param array $locationResultsMap
     *
     * @return array
     */
    private function tryToLoadFromCache(&$locationResultsMap)
    {
        $placeIds = array_keys($locationResultsMap);

        $cacheLocationMap = [];
        foreach ($placeIds as $placeId) {
            if ($this->cacheLocationMap->has($placeId)) {
                $cacheLocationMap[$placeId] = $this->cacheLocationMap->get($placeId);

                unset($locationResultsMap[$placeId]);
            }
        }

        return $cacheLocationMap;
    }

    /**
     * @param UnfoldableInterface $entity
     * @param array               $significantPart
     * @param \stdClass           $response
     * @param string              $errorMsg
     */
    private function logMatchFailureFallback(
        UnfoldableInterface $entity,
        array $significantPart,
        \stdClass $response,
        $errorMsg
    ) {
        $this->logFailure(
            'MATCH_FAILURE',
            'FALLBACK',
            $entity,
            implode(',', (array) $significantPart['type']).' '.$significantPart['search_term'],
            json_encode([
                'formatted_address' => $response->formatted_address,
                'place_id' => $response->place_id,
                'types' => $response->types,
                'error_msg' => $errorMsg,
            ])
        );
    }

    /**
     * @param UnfoldableInterface $entity
     * @param array               $significantPart
     * @param \Exception          $reason
     */
    private function logRequestFailureFallback(UnfoldableInterface $entity, array $significantPart, \Exception $reason)
    {
        $this->logFailure(
            'REQUEST_FAILURE',
            'FALLBACK',
            $entity,
            implode(',', (array) $significantPart['type']).' '.$significantPart['search_term'],
            $reason->getMessage()
        );
    }

    /**
     * @param UnfoldableInterface $entity
     * @param Address             $address
     * @param \Exception          $reason
     */
    private function logRequestFailureMain(UnfoldableInterface $entity, Address $address, \Exception $reason)
    {
        $this->logFailure(
            'REQUEST_FAILURE',
            'MAIN',
            $entity,
            (string) $address->getCoords(),
            $reason->getMessage()
        );
    }

    /**
     * @param string              $failureType
     * @param string              $senderType
     * @param UnfoldableInterface $entity
     * @param string              $searchArgs
     * @param string              $responseOrReason
     */
    private function logFailure($failureType, $senderType, UnfoldableInterface $entity, $searchArgs, $responseOrReason)
    {
        $this->logger->error(
            '[{failure_type}] [{sender_type}] {entity_type} {entity_id} ({search_args}): {reason_or_response}',
            [
                'failure_type' => $failureType,
                'sender_type' => $senderType,
                'entity_type' => $entity->getEntityType(),
                'entity_id' => $entity->getId(),
                'search_args' => $searchArgs,
                'reason_or_response' => $responseOrReason,
            ]
        );
    }
}
