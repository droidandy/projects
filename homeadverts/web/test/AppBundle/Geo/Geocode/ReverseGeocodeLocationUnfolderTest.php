<?php

namespace Test\AppBundle\Geo\Geocode;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Entity\Location\GoogleLocationRepository;
use AppBundle\Entity\Traits\GoogleLocationTrait;
use AppBundle\Geo\Geocode\EmAwareLocationArrayCache;
use AppBundle\Geo\Geocode\HttpClient;
use AppBundle\Geo\Geocode\ReverseGeocodeLocationUnfolder;
use AppBundle\Geo\Geocode\UnfoldableInterface;
use AppBundle\Service\Lock\LockInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use function GuzzleHttp\Promise\each_limit_all;
use function GuzzleHttp\Promise\promise_for;
use function GuzzleHttp\Promise\rejection_for;
use Psr\Log\LoggerInterface;
use Test\AppBundle\AbstractFrameworkTestCase;

class ReverseGeocodeLocationUnfolderTest extends AbstractFrameworkTestCase
{
    const LOGGER_FROMAT_MSG = '[{failure_type}] [{sender_type}] {entity_type} {entity_id} ({search_args}): {reason_or_response}';
    /**
     * @var HttpClient
     */
    private $httpClient;
    /**
     * @var GoogleLocationRepository
     */
    private $googleLocationRepository;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var EmAwareLocationArrayCache
     */
    private $emAwareLocationArrayCache;
    /**
     * @var LockInterface
     */
    private $lock;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var ReverseGeocodeLocationUnfolder
     */
    private $reverseGeocodeLocationUnfolder;
    /**
     * @var array
     */
    private $persistedLocations;

    protected function setUp()
    {
        $this->httpClient = $this->getHttpClient();
        $this->googleLocationRepository = $this->getGoogleLocationRepository();
        $this->em = $this->getEm();
        $this->emAwareLocationArrayCache = $this->getEmAwareLocationArrayCache();
        $this->lock = $this->getLock();
        $this->logger = $this->getLogger();
        /** @var \PHPUnit_Framework_MockObject_MockObject $lock */
        $lock = $this->lock;
        $lock
            ->method('executeInLock')
            ->willReturnCallback(
                function ($placeId, $lockTimeout, $waitTimeout, $fn, $failureCb) {
                    $fn();
                }
            )
        ;

        $this->reverseGeocodeLocationUnfolder = new ReverseGeocodeLocationUnfolder(
            $this->httpClient,
            $this->googleLocationRepository,
            $this->em,
            $this->emAwareLocationArrayCache,
            $this->lock,
            $this->logger
        );
    }

    public function testUnfoldAddressAlreadyUnfolded()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('117 Route 10', null, 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        $entity->setGoogleLocations([
            $this->getGoogleLocation(1, 'ChIJE9sPnj-TtEwRLbBUIyNV5jI'),
            $this->getGoogleLocation(2, 'ChIJK4lKlK-TtEwRfgIcSmSPk5U'),
            $this->getGoogleLocation(3, 'ChIJb3iTZ7GTtEwRpclNjdjYLLU'),
            $this->getGoogleLocation(4, 'ChIJfbdvuEy2tEwRL92SqAnWXPQ'),
            $this->getGoogleLocation(5, 'ChIJzThguhF_s0wRPG8XeyZNifk'),
        ]);
        $entity->setGoogleLocationsStatus(GoogleLocation::STATUS_PROCESSED_WITH_ADDRESS);

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->never())
            ->method('reverseGeocodeAsync')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->never())
            ->method('findByPlaceId')
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(5, $entity->getGoogleLocations()->count());
    }

    public function testUnfoldAddressWithoutDBEntities()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('Route 10', '117', 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($address)
            ->willReturn(
                $this->getPromiseWithReverseGeocodeResponse('piermont_new_hampshire')
            )
        ;
        $httpClient
            ->expects($this->exactly(2))
            ->method('geocodeAsync')
            ->withConsecutive(
                ['117, Route 10 Piermont NH 03779'],
                ['Route 10 Piermont NH 03779']
            )
            ->willReturnOnConsecutiveCalls(
                $this->getPromiseWithGeocodeResponse('piermont/street_from_forward_search'),
                $this->getPromiseWithGeocodeResponse('piermont/route_from_forward_search')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->exactly(2))
            ->method('findByPlaceId')
            ->withConsecutive(
                [
                    [
                        'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                        'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                        'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                        'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                        'ChIJzThguhF_s0wRPG8XeyZNifk',
                        'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                        'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                        'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                    ]
                ],
                [
                    [
                        'ChIJS00nTUCTtEwRslkj5STTVn8',
                        'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU'
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                [],
                []
            )
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(10, $entity->getGoogleLocations()->count());
        $this->assertEquals(
            GoogleLocation::STATUS_PROCESSED_WITH_ADDRESS,
            $entity->getGoogleLocationsStatus()
        );
        $this->assertArraysEqualNoOrder(
            [
                'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                'ChIJzThguhF_s0wRPG8XeyZNifk',
                'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                'ChIJS00nTUCTtEwRslkj5STTVn8',
                'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU',
            ],
            array_map(
                function (GoogleLocation $location) {
                    return $location->getPlaceId();
                },
                $entity->getGoogleLocations()->toArray()
            )
        );
    }

    public function testUnfoldAddressWithDBEntities()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('Route 10', '117', 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($address)
            ->willReturn(
                $this->getPromiseWithReverseGeocodeResponse('piermont_new_hampshire')
            )
        ;
        $httpClient
            ->expects($this->exactly(2))
            ->method('geocodeAsync')
            ->withConsecutive(
                ['117, Route 10 Piermont NH 03779'],
                ['Route 10 Piermont NH 03779']
            )
            ->willReturnOnConsecutiveCalls(
                $this->getPromiseWithGeocodeResponse('piermont/street_from_forward_search'),
                $this->getPromiseWithGeocodeResponse('piermont/route_from_forward_search')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->exactly(2))
            ->method('findByPlaceId')
            ->withConsecutive(
                [
                    [
                        'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                        'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                        'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                        'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                        'ChIJzThguhF_s0wRPG8XeyZNifk',
                        'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                        'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                        'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                    ],
                ],
                [
                    [
                        'ChIJS00nTUCTtEwRslkj5STTVn8',
                        'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU',
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                [
                    $this->getGoogleLocation(1, 'ChIJE9sPnj-TtEwRLbBUIyNV5jI'),
                    $this->getGoogleLocation(2, 'ChIJfbdvuEy2tEwRL92SqAnWXPQ'),
                    $this->getGoogleLocation(3, 'ChIJCzYy5IS16lQRQrfeQ5K5Oxw'),
                ],
                [
                    $this->getGoogleLocation(5, 'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU'),
                ]
            )
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(10, $entity->getGoogleLocations()->count());
        $this->assertEquals(GoogleLocation::STATUS_PROCESSED_WITH_ADDRESS, $entity->getGoogleLocationsStatus());
        $this->assertArraysEqualNoOrder(
            [
                'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                'ChIJzThguhF_s0wRPG8XeyZNifk',
                'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                'ChIJS00nTUCTtEwRslkj5STTVn8',
                'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU',
            ],
            array_map(
                function (GoogleLocation $location) {
                    return $location->getPlaceId();
                },
                $entity->getGoogleLocations()->toArray()
            )
        );
        $this->assertArraysEqualNoOrder(
            [1, 2, 3, 5],
            array_filter(
                array_map(
                function (GoogleLocation $location) {
                    return $location->getId();
                },
                    $entity->getGoogleLocations()->toArray()
            )
            )
        );
    }

    public function testUnfoldAddressWithMissingParts()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('Route 10', '117', 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($address)
            ->willReturn(
                $this->getPromiseWithReverseGeocodeResponse('piermont_new_hampshire_with_missing_state_and_locality')
            )
        ;
        $httpClient
            ->expects($this->exactly(4))
            ->method('geocodeAsync')
            ->withConsecutive(
                ['Piermont, NH, US', 'US'],
                ['NH, US', 'US'],
                ['117, Route 10 Piermont NH 03779'],
                ['Route 10 Piermont NH 03779']
            )
            ->willReturnOnConsecutiveCalls(
                $this->getPromiseWithGeocodeResponse('piermont/locality'),
                $this->getPromiseWithGeocodeResponse('piermont/state'),
                $this->getPromiseWithGeocodeResponse('piermont/street_from_forward_search'),
                $this->getPromiseWithGeocodeResponse('boise/locality')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->exactly(3))
            ->method('findByPlaceId')
            ->withConsecutive(
                [
                    [
                        'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                        'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                        'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                        'ChIJzThguhF_s0wRPG8XeyZNifk',
                        'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                        'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                    ],
                ],
                [
                    [
                        'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                        'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                    ],
                ],
                [
                    [
                        'ChIJS00nTUCTtEwRslkj5STTVn8',
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                [
                    $this->getGoogleLocation(1, 'ChIJfbdvuEy2tEwRL92SqAnWXPQ'),
                    $this->getGoogleLocation(2, 'ChIJCzYy5IS16lQRQrfeQ5K5Oxw'),
                ],
                [
                    $this->getGoogleLocation(3, 'ChIJ66bAnUtEs0wR64CmJa8CyNc'),
                ],
                []
            )
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(9, $entity->getGoogleLocations()->count());
        $this->assertEquals(GoogleLocation::STATUS_PROCESSED, $entity->getGoogleLocationsStatus());
        $this->assertArraysEqualNoOrder(
            [
                'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                'ChIJzThguhF_s0wRPG8XeyZNifk',
                'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                'ChIJS00nTUCTtEwRslkj5STTVn8',
            ],
            array_map(
                function (GoogleLocation $location) {
                    return $location->getPlaceId();
                },
                $entity->getGoogleLocations()->toArray()
            )
        );
        $this->assertArraysEqualNoOrder(
            [1, 2, 3],
            array_filter(
                array_map(
                function (GoogleLocation $location) {
                    return $location->getId();
                },
                    $entity->getGoogleLocations()->toArray()
            )
            )
        );
    }

    public function testUnfoldAddressWithMissingPartsAndFallbackMismatch()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('Route 10', '117', 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(2))
            ->method('error')
            ->withConsecutive(
                [
                    self::LOGGER_FROMAT_MSG,
                    [
                        'failure_type' => 'MATCH_FAILURE',
                        'sender_type' => 'FALLBACK',
                        'entity_type' => 'entity',
                        'entity_id' => 1,
                        'search_args' => 'locality Piermont, NH, US',
                        'reason_or_response' => json_encode(
                            [
                                'formatted_address' => 'Piermont, NH 03779, USA',
                                'place_id' => 'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                                'types' => ['postal_code'],
                                'error_msg' => '"locality" not in "postal_code"',
                            ]
                        ),
                    ]
                ],
                [
                    self::LOGGER_FROMAT_MSG,
                    [
                        'failure_type' => 'MATCH_FAILURE',
                        'sender_type' => 'FALLBACK',
                        'entity_type' => 'entity',
                        'entity_id' => 1,
                        'search_args' => 'street_address,route Route 10 Piermont NH 03779',
                        'reason_or_response' => json_encode(
                            [
                                'formatted_address' => 'Boise, ID, USA',
                                'place_id' => 'ChIJnbRH6XLxrlQRm51nNpuYW5o',
                                'types' => ['locality', 'political'],
                                'error_msg' => '"street_address,route" not in "locality,political"',
                            ]
                        ),
                    ]
                ]
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($address)
            ->willReturn(
                $this->getPromiseWithReverseGeocodeResponse('piermont_new_hampshire_with_missing_state_and_locality')
            )
        ;
        $httpClient
            ->expects($this->exactly(4))
            ->method('geocodeAsync')
            ->withConsecutive(
                ['Piermont, NH, US', 'US'],
                ['NH, US', 'US'],
                ['117, Route 10 Piermont NH 03779'],
                ['Route 10 Piermont NH 03779']
            )
            ->willReturnOnConsecutiveCalls(
                $this->getPromiseWithGeocodeResponse('piermont/postal_code'),
                $this->getPromiseWithGeocodeResponse('piermont/state'),
                $this->getPromiseWithGeocodeResponse('piermont/street_from_forward_search'),
                $this->getPromiseWithGeocodeResponse('boise/locality')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->exactly(3))
            ->method('findByPlaceId')
            ->withConsecutive(
                [
                    [
                        'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                        'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                        'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                        'ChIJzThguhF_s0wRPG8XeyZNifk',
                        'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                        'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                    ],
                ],
                [
                    [
                        'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                    ],
                ],
                [
                    [
                        'ChIJS00nTUCTtEwRslkj5STTVn8',
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                [
                    $this->getGoogleLocation(1, 'ChIJfbdvuEy2tEwRL92SqAnWXPQ'),
                    $this->getGoogleLocation(2, 'ChIJCzYy5IS16lQRQrfeQ5K5Oxw'),
                ],
                [
                    $this->getGoogleLocation(3, 'ChIJ66bAnUtEs0wR64CmJa8CyNc'),
                ],
                [
                    $this->getGoogleLocation(6, 'ChIJS00nTUCTtEwRslkj5STTVn8'),
                ]
            )
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(8, $entity->getGoogleLocations()->count());
        $this->assertEquals(GoogleLocation::STATUS_PARTIALLY_PROCESSED, $entity->getGoogleLocationsStatus());
        $this->assertArraysEqualNoOrder(
            [
                'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                'ChIJzThguhF_s0wRPG8XeyZNifk',
                'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                'ChIJS00nTUCTtEwRslkj5STTVn8',
            ],
            array_map(
                function (GoogleLocation $location) {
                    return $location->getPlaceId();
                },
                $entity->getGoogleLocations()->toArray()
            )
        );
        $this->assertArraysEqualNoOrder(
            [1, 2, 3, 6],
            array_filter(
                array_map(
                function (GoogleLocation $location) {
                    return $location->getId();
                },
                    $entity->getGoogleLocations()->toArray()
            )
            )
        );
    }

    public function testUnfoldAddressWithMissingPartsAndFallbackFailed()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('Route 10', '117', 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(3))
            ->method('error')
            ->withConsecutive(
                [
                    self::LOGGER_FROMAT_MSG,
                    [
                        'failure_type' => 'REQUEST_FAILURE',
                        'sender_type' => 'FALLBACK',
                        'entity_type' => 'entity',
                        'entity_id' => 1,
                        'search_args' => 'locality Piermont, NH, US',
                        'reason_or_response' => 'connection error',
                    ],
                ],
                [
                    self::LOGGER_FROMAT_MSG,
                    [
                        'failure_type' => 'REQUEST_FAILURE',
                        'sender_type' => 'FALLBACK',
                        'entity_type' => 'entity',
                        'entity_id' => 1,
                        'search_args' => 'street_address 117, Route 10 Piermont NH 03779',
                        'reason_or_response' => 'connection error',
                    ]
                ],
                [
                    self::LOGGER_FROMAT_MSG,
                    [
                        'failure_type' => 'MATCH_FAILURE',
                        'sender_type' => 'FALLBACK',
                        'entity_type' => 'entity',
                        'entity_id' => 1,
                        'search_args' => 'street_address,route Route 10 Piermont NH 03779',
                        'reason_or_response' => json_encode(
                            [
                                'formatted_address' => 'Boise, ID, USA',
                                'place_id' => 'ChIJnbRH6XLxrlQRm51nNpuYW5o',
                                'types' => ['locality', 'political'],
                                'error_msg' => '"street_address,route" not in "locality,political"',
                            ]
                        ),
                    ]
                ]
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($address)
            ->willReturn(
                $this->getPromiseWithReverseGeocodeResponse('piermont_new_hampshire_with_missing_state_and_locality')
            )
        ;
        $httpClient
            ->expects($this->exactly(4))
            ->method('geocodeAsync')
            ->withConsecutive(
                ['Piermont, NH, US', 'US'],
                ['NH, US', 'US'],
                ['117, Route 10 Piermont NH 03779'],
                ['Route 10 Piermont NH 03779']
            )
            ->willReturnOnConsecutiveCalls(
                rejection_for(
                    new \RuntimeException('connection error')
                ),
                $this->getPromiseWithGeocodeResponse('piermont/state'),
                rejection_for(
                    new \RuntimeException('connection error')
                ),
                $this->getPromiseWithGeocodeResponse('boise/locality')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->exactly(2))
            ->method('findByPlaceId')
            ->withConsecutive(
                [
                    [
                        'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                        'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                        'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                        'ChIJzThguhF_s0wRPG8XeyZNifk',
                        'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                        'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                    ],
                ],
                [
                    [
                        'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                [
                    $this->getGoogleLocation(1, 'ChIJfbdvuEy2tEwRL92SqAnWXPQ'),
                    $this->getGoogleLocation(2, 'ChIJCzYy5IS16lQRQrfeQ5K5Oxw'),
                ],
                [
                    $this->getGoogleLocation(3, 'ChIJ66bAnUtEs0wR64CmJa8CyNc'),
                ]
            )
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(7, $entity->getGoogleLocations()->count());
        $this->assertEquals(GoogleLocation::STATUS_PARTIALLY_PROCESSED, $entity->getGoogleLocationsStatus());
        $this->assertArraysEqualNoOrder(
            [
                'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                'ChIJzThguhF_s0wRPG8XeyZNifk',
                'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
            array_map(
                function (GoogleLocation $location) {
                    return $location->getPlaceId();
                },
                $entity->getGoogleLocations()->toArray()
            )
        );
        $this->assertArraysEqualNoOrder(
            [1, 2, 3],
            array_filter(
                array_map(
                function (GoogleLocation $location) {
                    return $location->getId();
                },
                    $entity->getGoogleLocations()->toArray()
            )
            )
        );
    }

    public function testUnfoldAddressMainFailed()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('Route 10', '117', 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->once())
            ->method('error')
            ->with(
                self::LOGGER_FROMAT_MSG,
                [
                    'failure_type' => 'REQUEST_FAILURE',
                    'sender_type' => 'MAIN',
                    'entity_type' => 'entity',
                    'entity_id' => 1,
                    'search_args' => '43.9697892,-72.0806443',
                    'reason_or_response' => 'connection error',
                ]
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($address)
            ->willReturn(
                rejection_for(
                    new \RuntimeException('connection error')
                )
            )
        ;
        $httpClient
            ->expects($this->exactly(4))
            ->method('geocodeAsync')
            ->withConsecutive(
                ['Piermont, NH, US', 'US'],
                ['NH, US', 'US'],
                ['117, Route 10 Piermont NH 03779'],
                ['Route 10 Piermont NH 03779']
            )
            ->willReturnOnConsecutiveCalls(
                $this->getPromiseWithGeocodeResponse('piermont/locality'),
                $this->getPromiseWithGeocodeResponse('piermont/state'),
                $this->getPromiseWithGeocodeResponse('piermont/street_from_forward_search'),
                $this->getPromiseWithGeocodeResponse('piermont/route_from_forward_search')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->exactly(2))
            ->method('findByPlaceId')
            ->withConsecutive(
                [
                    [
                        'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                        'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                    ],
                ],
                [
                    [
                        'ChIJS00nTUCTtEwRslkj5STTVn8',
                        'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU',
                    ],
                ]
            )
            ->willReturn([
                $this->getGoogleLocation(1, 'ChIJ66bAnUtEs0wR64CmJa8CyNc'),
                $this->getGoogleLocation(5, 'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU'),
            ])
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(4, $entity->getGoogleLocations()->count());
        $this->assertEquals(GoogleLocation::STATUS_PARTIALLY_PROCESSED, $entity->getGoogleLocationsStatus());
        $this->assertArraysEqualNoOrder(
            [
                'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                'ChIJS00nTUCTtEwRslkj5STTVn8',
                'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU',
            ],
            array_map(
                function (GoogleLocation $location) {
                    return $location->getPlaceId();
                },
                $entity->getGoogleLocations()->toArray()
            )
        );
        $this->assertArraysEqualNoOrder(
            [1, 5],
            array_filter(
                array_map(
                function (GoogleLocation $location) {
                    return $location->getId();
                },
                    $entity->getGoogleLocations()->toArray()
            )
            )
        );
    }

    public function testUnfoldAddressMainFailedAndFallbackFailed()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('Route 10', '117', 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(3))
            ->method('error')
            ->withConsecutive(
                [
                    self::LOGGER_FROMAT_MSG,
                    [
                        'failure_type' => 'REQUEST_FAILURE',
                        'sender_type' => 'MAIN',
                        'entity_type' => 'entity',
                        'entity_id' => 1,
                        'search_args' => '43.9697892,-72.0806443',
                        'reason_or_response' => 'connection error',
                    ],
                ],
                [
                    self::LOGGER_FROMAT_MSG,
                    [
                        'failure_type' => 'MATCH_FAILURE',
                        'sender_type' => 'FALLBACK',
                        'entity_type' => 'entity',
                        'entity_id' => 1,
                        'search_args' => 'locality Piermont, NH, US',
                        'reason_or_response' => json_encode(
                            [
                                'formatted_address' => 'Piermont, NH 03779, USA',
                                'place_id' => 'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                                'types' => ['postal_code'],
                                'error_msg' => '"locality" not in "postal_code"',
                            ]
                        ),
                    ],
                ],
                [
                    self::LOGGER_FROMAT_MSG,
                    [
                        'failure_type' => 'REQUEST_FAILURE',
                        'sender_type' => 'FALLBACK',
                        'entity_type' => 'entity',
                        'entity_id' => 1,
                        'search_args' => 'administrative_area_level_1 NH, US',
                        'reason_or_response' => 'unknown error',
                    ],
                ]
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($address)
            ->willReturn(
                rejection_for(
                    new \RuntimeException('connection error')
                )
            )
        ;
        $httpClient
            ->expects($this->exactly(4))
            ->method('geocodeAsync')
            ->withConsecutive(
                ['Piermont, NH, US', 'US'],
                ['NH, US', 'US'],
                ['117, Route 10 Piermont NH 03779'],
                ['Route 10 Piermont NH 03779']
            )
            ->willReturnOnConsecutiveCalls(
                $this->getPromiseWithGeocodeResponse('piermont/postal_code'),
                rejection_for(
                    new \RuntimeException('unknown error')
                ),
                $this->getPromiseWithGeocodeResponse('piermont/street_from_forward_search'),
                $this->getPromiseWithGeocodeResponse('piermont/route_from_forward_search')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->exactly(1))
            ->method('findByPlaceId')
            ->withConsecutive([
                [
                    'ChIJS00nTUCTtEwRslkj5STTVn8',
                    'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU',
                ],
            ])
            ->willReturn(
                [
                    $this->getGoogleLocation(6, 'ChIJS00nTUCTtEwRslkj5STTVn8'),
                ]
            )
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(2, $entity->getGoogleLocations()->count());
        $this->assertEquals(GoogleLocation::STATUS_FAILED, $entity->getGoogleLocationsStatus());
        $this->assertArraysEqualNoOrder(
            [
                'ChIJS00nTUCTtEwRslkj5STTVn8',
                'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU',
            ],
            array_map(
                function (GoogleLocation $location) {
                    return $location->getPlaceId();
                },
                $entity->getGoogleLocations()->toArray()
            )
        );
        $this->assertArraysEqualNoOrder(
            [6,],
            array_filter(
                array_map(
                    function (GoogleLocation $location) {
                        return $location->getId();
                    },
                    $entity->getGoogleLocations()->toArray()
                )
            )
        );
    }

    public function testUnfoldAddressWithMissingPartsFallbackCacheUsage()
    {
        $coords = new Coords(43.9697892, -72.0806443);

        $address = new Address('Route 10', '117', 'Piermont', 'NH', 'US', '03779');
        $address->setCoords($coords);

        $entity = new Entity($address);

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($address)
            ->willReturn(
                $this->getPromiseWithReverseGeocodeResponse('piermont_new_hampshire_with_missing_state_and_locality')
            )
        ;
        $httpClient
            ->expects($this->exactly(4))
            ->method('geocodeAsync')
            ->withConsecutive(
                ['Piermont, NH, US', 'US'],
                ['NH, US', 'US'],
                ['117, Route 10 Piermont NH 03779'],
                ['Route 10 Piermont NH 03779']
            )
            ->willReturnOnConsecutiveCalls(
                $this->getPromiseWithGeocodeResponse('piermont/locality'),
                $this->getPromiseWithGeocodeResponse('piermont/state'),
                $this->getPromiseWithGeocodeResponse('piermont/street_from_forward_search'),
                $this->getPromiseWithGeocodeResponse('piermont/route_from_forward_search')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $emAwareLocationArrayCache */
        $emAwareLocationArrayCache = $this->emAwareLocationArrayCache;
        $emAwareLocationArrayCache
            ->expects($this->exactly(10))
            ->method('has')
            ->willReturnMap([
                ['ChIJE9sPnj-TtEwRLbBUIyNV5jI', false],
                ['ChIJb3iTZ7GTtEwRpclNjdjYLLU', false],
                ['ChIJfbdvuEy2tEwRL92SqAnWXPQ', false],
                ['ChIJzThguhF_s0wRPG8XeyZNifk', false],
                ['ChIJcQMTR6C_tEwR1_07BdQuYWU', false],
                ['ChIJCzYy5IS16lQRQrfeQ5K5Oxw', true],
                ['ChIJK4lKlK-TtEwRfgIcSmSPk5U', false],
                ['ChIJ66bAnUtEs0wR64CmJa8CyNc', true],
                ['ChIJS00nTUCTtEwRslkj5STTVn8', false],
                ['Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU', true],
            ])
        ;
        $emAwareLocationArrayCache
            ->expects($this->exactly(3))
            ->method('get')
            ->withConsecutive(
                ['ChIJCzYy5IS16lQRQrfeQ5K5Oxw'],
                ['ChIJ66bAnUtEs0wR64CmJa8CyNc'],
                ['Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU']
            )
            ->willReturnOnConsecutiveCalls(
                $this->getGoogleLocation(2, 'ChIJCzYy5IS16lQRQrfeQ5K5Oxw'),
                $this->getGoogleLocation(3, 'ChIJ66bAnUtEs0wR64CmJa8CyNc'),
                $this->getGoogleLocation(5, 'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU')
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->exactly(3))
            ->method('findByPlaceId')
            ->withConsecutive(
                [
                    [
                        'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                        'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                        'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                        'ChIJzThguhF_s0wRPG8XeyZNifk',
                        'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                    ],
                ],
                [
                    [
                        'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                    ],
                ],
                [
                    [
                        'ChIJS00nTUCTtEwRslkj5STTVn8',
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                [
                    $this->getGoogleLocation(1, 'ChIJfbdvuEy2tEwRL92SqAnWXPQ'),
                ],
                [],
                [
                    $this->getGoogleLocation(6, 'ChIJS00nTUCTtEwRslkj5STTVn8'),
                ]
            )
        ;

        $this
            ->reverseGeocodeLocationUnfolder
            ->unfold($entity)
            ->wait()
        ;

        $this->assertEquals(10, $entity->getGoogleLocations()->count());
        $this->assertEquals(GoogleLocation::STATUS_PROCESSED_WITH_ADDRESS, $entity->getGoogleLocationsStatus());
        $this->assertArraysEqualNoOrder(
            [
            'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
            'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
            'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
            'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
            'ChIJzThguhF_s0wRPG8XeyZNifk',
            'ChIJcQMTR6C_tEwR1_07BdQuYWU',
            'ChIJ66bAnUtEs0wR64CmJa8CyNc',
            'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            'ChIJS00nTUCTtEwRslkj5STTVn8',
            'Eh5OSC0xMCwgUGllcm1vbnQsIE5IIDAzNzc5LCBVU0EiLiosChQKEgk_7JqWBf_hiRFegm5xG5gl3BIUChIJb3iTZ7GTtEwRpclNjdjYLLU',
        ],
            array_map(
                function (GoogleLocation $location) {
                    return $location->getPlaceId();
                },
                $entity->getGoogleLocations()->toArray()
            )
        );
        $this->assertArraysEqualNoOrder(
            [1, 2, 3, 5, 6],
            array_filter(
                array_map(
                    function (GoogleLocation $location) {
                        return $location->getId();
                    },
                    $entity->getGoogleLocations()->toArray()
            )
            )
        );
    }

    public function testUnfoldConcurrent()
    {
        $entities = [];
        foreach ([
                    'piermont_new_hampshire' => [
                        'coords' => [43.9697892, -72.0806443],
                        'args' => ['117 Route 10', null, 'Piermont', 'NH', 'US', '03779'],
                    ],
                     'piermont_barton_rd' => [
                        'coords' => [43.9761126, -72.0438281],
                        'args' => ['35 Barton Rd', null, 'Piermont', 'NH', 'US', '03779'],
                    ],
                     'hayden_south_street' => [
                        'coords' => [40.4894302, -107.2636842],
                        'args' => ['RCR 56', null, 'Hayden', 'CO', 'US', '81639'],
                    ],
                     'cobham_high_street' => [
                        'coords' => [51.3287830, -0.4108560],
                        'args' => ['Avenue Road Surrey', 'Woodpeckers', 'Cobham', 'SRY', 'GB', 'KT11 3NL'],
                    ],
                     'london_purley' => [
                        'coords' => [51.5073509, -0.1277583],
                        'args' => ['Cheval Three Quays 40 Lower Thames Street', 'The Tower Penthouse', 'London', 'ENG', 'GB', 'EC3R 6AG'],
                    ],
                 ] as $key => $addressItem) {
            $coords = new Coords(...$addressItem['coords']);

            $address = new Address(...$addressItem['args']);
            $address->setCoords($coords);

            $entities[$key] = new Entity($address);
        }

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->exactly(5))
            ->method('reverseGeocodeAsync')
            ->willReturnCallback(function (Address $address) {
                switch ($address->getStreet()) {
                    case '117 Route 10':
                        $path = 'piermont_new_hampshire_with_missing_state_and_locality'; break;
                    case '35 Barton Rd':
                        $path = 'piermont_barton_rd'; break;
                    case 'RCR 56':
                        $path = 'hayden_south_street'; break;
                    case 'Avenue Road Surrey':
                        $path = 'cobham_high_street'; break;
                    case 'Cheval Three Quays 40 Lower Thames Street':
                        $path = 'london_purley'; break;
                    default:
                        $this->fail(
                            sprintf('Unexpected argument "%s"', $address->getStreet())
                        ); break;
                }

                return $this->getPromiseWithReverseGeocodeResponse($path);
            })
        ;
        $httpClient
            ->expects($this->exactly(10))
            ->method('geocodeAsync')
            ->willReturnCallback(
                function ($path, $country) {
                    switch ($path) {
                        case '117 Route 10 Piermont NH 03779':
                            $filename = 'piermont/street_from_forward_search'; break;
                        case '35 Barton Rd Piermont NH 03779':
                            $filename = 'piermont_barton_rd/street_from_forward_search'; break;
                        case 'Piermont, NH, US':
                            $filename = 'piermont/locality'; break;
                        case 'NH, US':
                            $filename = 'piermont/state'; break;
                        case 'RCR 56 Hayden CO 81639':
                            $filename = 'hayden/street_from_forward_search'; break;
                        case 'Woodpeckers, Avenue Road Surrey Cobham SRY KT11 3NL':
                            $filename = 'cobham/street_from_forward_search'; break;
                        case 'Avenue Road Surrey Cobham SRY KT11 3NL':
                            return rejection_for(
                                new \RuntimeException('unknown error')
                            );
                        case 'The Tower Penthouse, Cheval Three Quays 40 Lower Thames Street London ENG EC3R 6AG':
                            $filename = 'london/street_from_forward_search'; break;
                        case 'Cheval Three Quays 40 Lower Thames Street London ENG EC3R 6AG':
                            return rejection_for(
                                new \RuntimeException('unknown error')
                            );
                        case 'SRY, GB':
                            $filename = 'sry_gb'; break;
                        default:
                            $this->fail(sprintf('Unexpected path "%s"', $path));
                    }

                    return $this->getPromiseWithGeocodeResponse($filename);
                }
            )
        ;

        $pathIds = [
            'piermont_new_hampshire' => [
                'ChIJE9sPnj-TtEwRLbBUIyNV5jI',
                'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                'ChIJzThguhF_s0wRPG8XeyZNifk',
                'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
                'ChIJS00nTUCTtEwRslkj5STTVn8',
            ],
            'piermont_barton_rd' => [
                'ChIJqXTbn6mTtEwRNXogpeecDw4',
                'ChIJK4lKlK-TtEwRfgIcSmSPk5U',
                'ChIJb3iTZ7GTtEwRpclNjdjYLLU',
                'ChIJfbdvuEy2tEwRL92SqAnWXPQ',
                'ChIJzThguhF_s0wRPG8XeyZNifk',
                'ChIJcQMTR6C_tEwR1_07BdQuYWU',
                'ChIJ66bAnUtEs0wR64CmJa8CyNc',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
            'hayden_south_street' => [
                'ChIJ5RVXVeBSQocRSxkYnkeCjE8',
                'ChIJoYNPNORSQocRqu7r5KhBNUE',
                'ChIJx3BRBttSQocRZnep-UiCmLw',
                'ChIJ-dGew1EYQocRZA3rearTJXE',
                'ChIJt1YYm3QUQIcR_6eQSTGDVMc',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
            'cobham_high_street' => [
                'ChIJ6UDit5nfdUgRQYiJaJGtB3k',
                'ChIJNdKLxpnfdUgR5Yf5BptoPW4',
                'ChIJGRU5HCvedUgRvgO6zujH2yc',
                'ChIJo7TVw5nfdUgR9eg2m24jR1o',
                'ChIJYyrcw5nfdUgRHYSGHup50j4',
                'ChIJYyrcw5nfdUgRXIM9vxz_NTo',
                'ChIJo7TVw5nfdUgRFmYnKqy5BWY',
                'ChIJYyrcw5nfdUgRWPV1kAGrmME',
                'ChIJo7TVw5nfdUgRevThuTPUINQ',
                'ChIJo7TVw5nfdUgRruhBiPySfQ0',
                'ChIJobTVw5nfdUgR09xw3r36SrI',
                'ChIJYyrcw5nfdUgREdUH_erJxrA',
                'ChIJobTVw5nfdUgR1s8QbTcLfUE',
                'ChIJobTVw5nfdUgRTMvRu2g_NNI',
                'ChIJYyrcw5nfdUgRrMKMXHVxlaQ',
                'ChIJobTVw5nfdUgRWcGT-CBG5dU',
                'ChIJobTVw5nfdUgRDLgT79sfbqI',
                'ChIJobTVw5nfdUgRgaRXdbgD1Do',
                'ChIJobTVw5nfdUgRGJU14Uvu9s8',
                'ChIJo7TVw5nfdUgRo4-ju9mkh3A',
                'ChIJobTVw5nfdUgRSI8WWdgbgiE',
                'ChIJobTVw5nfdUgRsoCuFcaEh40',
                'ChIJobTVw5nfdUgRpXy4TdbjFgo',
                'ChIJobTVw5nfdUgRGnlqGihId3g',
                'ChIJobTVw5nfdUgRyHQ7iNaoZJ0',
                'ChIJo7TVw5nfdUgRc2T2riCnQSk',
                'ChIJYyrcw5nfdUgRmE6UjXhYZ8A',
                'ChIJo7TVw5nfdUgRxjWmmc5yU6Q',
                'ChIJobTVw5nfdUgRezS72ho_k1s',
                'ChIJYyrcw5nfdUgRSjEQ8rCO9E4',
            ],
            'london_purley' => [
                'ChIJE1CsgJf9dUgRVFJbNaekiXw',
                'ChIJkdBxFnb9dUgRqACc8Rg4rPI',
                'ChIJo0ZFh5f9dUgRyZTns_MzGew',
                'ChIJaTq0pZT9dUgRwsEnNP23zEc',
                'ChIJnxWFCyr8dUgRLk9wNQnTdwI',
                'ChIJW_bCdKUAdkgREGjsoi2uDgQ',
                'ChIJcYFfUmEDdkgR4Xf_HPV-nVc',
                'ChIJb-IaoQug2EcRi-m4hONz8S8',
                'ChIJ3SIYXV0CdkgRmRTYeONPi-U',
                'ChIJ39UebIqp0EcRqI4tMyWV4fQ',
                'ChIJqZHHQhE7WgIReiWIMkOg-MQ',
            ],
        ];

        $cache = [
            'ChIJb3iTZ7GTtEwRpclNjdjYLLU' => $this->getGoogleLocation(6, 'ChIJb3iTZ7GTtEwRpclNjdjYLLU'),
            'ChIJfbdvuEy2tEwRL92SqAnWXPQ' => $this->getGoogleLocation(7, 'ChIJfbdvuEy2tEwRL92SqAnWXPQ'),
            'ChIJE1CsgJf9dUgRVFJbNaekiXw' => $this->getGoogleLocation(8, 'ChIJE1CsgJf9dUgRVFJbNaekiXw'),
        ];
        /** @var \PHPUnit_Framework_MockObject_MockObject $emAwareLocationArrayCache */
        $emAwareLocationArrayCache = $this->emAwareLocationArrayCache;
        $emAwareLocationArrayCache
            ->expects($this->any())
            ->method('has')
            ->willReturnCallback(function ($placeId) use (&$cache) {
                if (isset($cache[$placeId])) {
                    return true;
                }

                return false;
            })
        ;
        $emAwareLocationArrayCache
            ->expects($this->any())
            ->method('get')
            ->willReturnCallback(
                function ($placeId) use (&$cache) {
                    if (isset($cache[$placeId])) {
                        return $cache[$placeId];
                    }

                    return null;
                }
            )
        ;
        $emAwareLocationArrayCache
            ->expects($this->any())
            ->method('add')
            ->willReturnCallback(
                function ($googleLocation) use (&$cache) {
                    return $cache[$googleLocation->getPlaceId()] = $googleLocation;
                }
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->atLeastOnce())
            ->method('findByPlaceId')
            ->willReturnCallback(function ($placeIds) {
                $response = [];
                if (in_array('ChIJCzYy5IS16lQRQrfeQ5K5Oxw', $placeIds)) {
                    $response[] = $this->getGoogleLocation(1, 'ChIJCzYy5IS16lQRQrfeQ5K5Oxw');
                }
                if (in_array('ChIJ66bAnUtEs0wR64CmJa8CyNc', $placeIds)) {
                    $response[] = $this->getGoogleLocation(2, 'ChIJ66bAnUtEs0wR64CmJa8CyNc');
                }
                if (in_array('ChIJcQMTR6C_tEwR1_07BdQuYWU', $placeIds)) {
                    $response[] = $this->getGoogleLocation(3, 'ChIJcQMTR6C_tEwR1_07BdQuYWU');
                }
                if (in_array('ChIJYyrcw5nfdUgRSjEQ8rCO9E4', $placeIds)) {
                    $response[] = $this->getGoogleLocation(4, 'ChIJYyrcw5nfdUgRSjEQ8rCO9E4');
                }
                if (in_array('ChIJqZHHQhE7WgIReiWIMkOg-MQ', $placeIds)) {
                    $response[] = $this->getGoogleLocation(5, 'ChIJqZHHQhE7WgIReiWIMkOg-MQ');
                }

                return $response;
            })
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $googleLocationRepository */
        $googleLocationRepository = $this->googleLocationRepository;
        $googleLocationRepository
            ->expects($this->any())
            ->method('findOneByPlaceId')
            ->willReturn(null)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->atLeastOnce())
            ->method('persist')
            ->willReturnCallback(function (GoogleLocation $location) {
                $placeId = $location->getPlaceId();
                if (isset($this->persistedLocations[$placeId])) {
                    $this->fail(sprintf(
                        'Location with id "%s" already was persisted. Unique key constraint violation',
                        $placeId
                    ));
                }

                $this->persistedLocations[$placeId] = $location;
            })
        ;

        $promises = [];
        foreach ($entities as $entity) {
            $promises[] = $this
                ->reverseGeocodeLocationUnfolder
                ->unfold($entity)
            ;
        }

        $eachPromise = each_limit_all($promises, 2);
        $eachPromise->wait(true); // unwrap to get assertion exceptions if any

        /*
         * @var Address $address
         */
        foreach ($entities as $key => $entity) {
            if ('cobham_high_street' === $key) {
                $this->assertEquals(GoogleLocation::STATUS_PARTIALLY_PROCESSED, $entity->getGoogleLocationsStatus(), $key);
            } elseif ('london_purley' === $key) {
                $this->assertEquals(GoogleLocation::STATUS_PROCESSED, $entity->getGoogleLocationsStatus(), $key);
            } else {
                $this->assertEquals(GoogleLocation::STATUS_PROCESSED_WITH_ADDRESS, $entity->getGoogleLocationsStatus(), $key);
            }
            $this->assertEquals(count($pathIds[$key]), $entity->getGoogleLocations()->count());
            $this->assertArraysEqualNoOrder(
                $pathIds[$key],
                array_map(
                    function (GoogleLocation $location) {
                        return $location->getPlaceId();
                    },
                    $entity->getGoogleLocations()->toArray()
                )
            );
        }
    }

    private function getHttpClient()
    {
        return $this
            ->getMockBuilder(HttpClient::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getGoogleLocationRepository()
    {
        return $this
            ->getMockBuilder(GoogleLocationRepository::class)
            ->disableOriginalConstructor()
            ->setMethods(['findByPlaceId', 'findOneByPlaceId'])
            ->getMock()
        ;
    }

    private function getEm()
    {
        return $this
            ->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getEmAwareLocationArrayCache()
    {
        return $this
            ->getMockBuilder(EmAwareLocationArrayCache::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getLock()
    {
        return $this
            ->getMockBuilder(LockInterface::class)
            ->getMock()
        ;
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;
    }

    private function getGoogleLocation($id, $placeId)
    {
        $googleLocation = $this
            ->getMockBuilder(GoogleLocation::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $googleLocation
            ->method('getId')
            ->willReturn($id)
        ;
        $googleLocation
            ->method('getPlaceId')
            ->willReturn($placeId)
        ;

        return $googleLocation;
    }

    private function assertArraysEqualNoOrder($arr1, $arr2)
    {
        $this->assertEquals(
            $arr1,
            $arr2,
            '',
            0.0,
            10,
            true // compare arrays wihout respect to an order
        );
    }

    private function getPromiseWithReverseGeocodeResponse($filename)
    {
        return $this->getPromiseWithResponse('google-reverse-geocode/'.$filename);
    }

    private function getPromiseWithGeocodeResponse($filename)
    {
        return $this->getPromiseWithResponse('google-geocode/'.$filename);
    }

    private function getPromiseWithResponse($filename)
    {
        return promise_for(json_decode(
            file_get_contents(
                $this->getFixture(sprintf('geo/%s.json', $filename))
            )
        ));
    }
}

class Entity implements UnfoldableInterface
{
    use GoogleLocationTrait;
    /**
     * @var int
     */
    private $id = 1;
    /**
     * @var Address
     */
    private $address;

    public function __construct(Address $address)
    {
        $this->address = $address;
        $this->googleLocations = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param mixed $address
     */
    public function setAddress($address)
    {
        $this->address = $address;
    }

    public function getEntityType()
    {
        return 'entity';
    }
}
