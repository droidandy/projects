<?php

namespace AppBundle\Geo\Geocode;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Promise\PromiseInterface;
use function GuzzleHttp\Promise\rejection_for;
use GuzzleHttp\TransferStats;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;

class HttpClient implements HttpClientInterface
{
    /**
     * @var string
     */
    const ENDPOINT_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=%s&components=country:%s&key=%s';
    /**
     * @var string
     */
    const ENDPOINT_REVERSE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=%s&key=%s';
    /**
     * @var Client
     */
    private $guzzleClient;
    /**
     * @var string
     */
    private $apiKey;
    /**
     * @var HandlerStack
     */
    private $handler;
    /**
     * @var bool
     */
    private $debug;
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @return Client
     */
    public static function getGuzzleHttpClient()
    {
        $handler = HandlerStack::create();
        $handler->push(Middleware::retry(function ($retries, $request, $response, $reason) {
            if ($response) {
                $response = json_decode($response->getBody());
                if (
                    !empty($response->status)
                    && in_array($response->status, ['REQUEST_DENIED', 'UNKNOWN_ERROR'])
                    && $retries < 3
                ) {
                    return true;
                }
            }

            if (null === $reason || $retries > 3) {
                return false;
            }

            return true;
        }), 'retry');

        return new Client([
            'handler' => $handler,
        ]);
    }

    /**
     * @param Client $guzzleClient
     * @param $apiKey
     */
    public function __construct(Client $guzzleClient, $apiKey, $logger, $debug = false)
    {
        $this->guzzleClient = $guzzleClient;
        $this->apiKey = $apiKey;
        $this->logger = $logger;
        $this->debug = $debug;
    }

    /**
     * @param string $path
     * @param string $country
     *
     * @return PromiseInterface
     */
    public function geocodeAsync($path, $country)
    {
        $this->logRequestStarted(compact(['path', 'country']));

        return $this
            ->guzzleClient
            ->getAsync(
                $this->buildGeocodeQuery($path, $country),
                $this->getGuzzleOptions(compact(['path', 'country']))
            )
            ->then(
                function (ResponseInterface $response) {
                    return json_decode($response->getBody());
                },
                $this->handleRejection()
            )
        ;
    }

    /**
     * @param string $path
     * @param string $country
     *
     * @return object
     */
    public function geocode($path, $country)
    {
        $this->logRequestStarted(compact(['path', 'country']));

        return $this->handleThrowableRequest(function () use ($path, $country) {
            $response = $this
                ->guzzleClient
                ->get(
                    $this->buildGeocodeQuery($path, $country),
                    $this->getGuzzleOptions(compact(['path', 'country']))
                )
            ;

            return json_decode($response->getBody());
        });
    }

    /**
     * @param Address $address
     *
     * @return PromiseInterface
     */
    public function reverseGeocodeAsync(Address $address)
    {
        $this->logRequestStarted($address);

        return $this
            ->guzzleClient
            ->getAsync(
                $this->buildReverseGeocodeQuery($address->getCoords()),
                $this->getGuzzleOptions($address)
            )
            ->then(
                function (ResponseInterface $response) {
                    return json_decode($response->getBody());
                },
                $this->handleRejection()
            )
        ;
    }

    /**
     * @param Address $address
     *
     * @return object
     */
    public function reverseGeocode(Address $address)
    {
        $this->logRequestStarted($address);

        return $this->handleThrowableRequest(function () use ($address) {
            $response = $this
                ->guzzleClient
                ->get(
                    $this->buildReverseGeocodeQuery($address->getCoords()),
                    $this->getGuzzleOptions($address)
                )
            ;

            return json_decode($response->getBody());
        });
    }

    /**
     * @param string $path
     * @param string $country
     *
     * @return string
     */
    private function buildGeocodeQuery($path, $country)
    {
        return sprintf(self::ENDPOINT_GEOCODE_URL, rawurlencode($path), $country, $this->apiKey);
    }

    /**
     * @param Coords $coords
     *
     * @return string
     */
    private function buildReverseGeocodeQuery(Coords $coords)
    {
        return sprintf(self::ENDPOINT_REVERSE_GEOCODE_URL, (string) $coords, $this->apiKey);
    }

    /**
     * @param Address|array $addressOrPathAndCountry
     *
     * @return array
     */
    private function getGuzzleOptions($addressOrPathAndCountry)
    {
        $configs = [];

        if ($this->debug) {
            list($logPrefix, $params) = $this->getPrefixVars($addressOrPathAndCountry);

            $configs['on_stats'] = function (
                TransferStats $transferStats
            ) use ($logPrefix, $params) {
                $request = $transferStats->getRequest();
                $response = $transferStats->getResponse();
                $totalTime = $transferStats->getTransferTime();
                $url = preg_replace('~key=[^&]+(?=&|$)~', 'key=***', (string) $request->getUri());

                $this->logger->debug(
                    sprintf('[%s] : [{status}] {total_time} {url}', $logPrefix),
                    $params + [
                        'status' => $response
                            ? $response->getStatusCode().' '.$response->getReasonPhrase()
                            : 'NO_RESPONSE',
                        'total_time' => $totalTime,
                        'url' => $url,
                    ]
                );
            };
        }

        return $configs;
    }

    /**
     * @param Address|array $addressOrPathAndCountry
     */
    private function logRequestStarted($addressOrPathAndCountry)
    {
        if ($this->debug) {
            list($logPrefix, $params) = $this->getPrefixVars($addressOrPathAndCountry);

            $this->logger->debug(
                sprintf('[%s] : Request started', $logPrefix),
                $params
            );
        }
    }

    /**
     * @param Address|array $addressOrPathAndCountry
     *
     * @return array
     */
    private function getPrefixVars($addressOrPathAndCountry)
    {
        if ($addressOrPathAndCountry instanceof Address) {
            $logPrefix = '({coords}) {country} {address}';
            $params = [
                'coords' => (string) $addressOrPathAndCountry->getCoords(),
                'country' => $addressOrPathAndCountry->getCountry(),
                'address' => $addressOrPathAndCountry->getFullAddress(','),
            ];
        } else {
            $logPrefix = '({country}) {path}';
            $params = [
                'country' => $addressOrPathAndCountry['country'],
                'path' => $addressOrPathAndCountry['path'],
            ];
        }

        return [$logPrefix, $params];
    }

    /**
     * @param callable $request
     *
     * @return object
     */
    private function handleThrowableRequest(callable $request)
    {
        try {
            $result = $request();
        } catch (RequestException $e) {
            list($isParsed, $result) = $this->parseExceptionResponse($e);
            if (!$isParsed) {
                throw $e;
            }
        }

        return $result;
    }

    /**
     * @return callable
     */
    private function handleRejection()
    {
        return function ($reason) {
            list($isParsed, $result) = $this->parseExceptionResponse($reason);
            if ($isParsed) {
                return $result;
            }

            return rejection_for($reason);
        };
    }

    /**
     * @param $reason
     *
     * @return array
     */
    private function parseExceptionResponse($reason)
    {
        if (
            $reason instanceof RequestException
            && $reason->getResponse()
        ) {
            $result = json_decode($reason->getResponse()->getBody());
            if (!empty($result->status)) {
                return [true, $result];
            }
        }

        return [false, null];
    }
}
