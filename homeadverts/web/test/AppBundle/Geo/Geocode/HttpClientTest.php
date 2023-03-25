<?php

namespace Test\AppBundle\Geo\Geocode;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Geo\Geocode\HttpClient;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\RequestInterface;
use Psr\Log\LoggerInterface;

class HttpClientTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var MockHandler
     */
    private $guzzleHandler;
    /**
     * @var Client
     */
    private $guzzleClient;
    /**
     * @var HttpClient
     */
    private $httpClient;
    /**
     * @var LoggerInterface
     */
    private $logger;

    protected function setUp()
    {
        $this->guzzleHandler = new MockHandler();
        $this->guzzleClient = $this->getGuzzleClient(HandlerStack::create($this->guzzleHandler));

        $this->logger = $this->getLogger();

        $this->httpClient = new HttpClient($this->guzzleClient, 'apikey', $this->logger, true);
    }

    public function testGeocodeAsync()
    {
        $this->_testGeocode(function (...$args) {
            return $this
                ->httpClient
                ->geocodeAsync(...$args)
                ->wait()
            ;
        });
    }

    public function testGeocode()
    {
        $this->_testGeocode(function (...$args) {
            return $this
                ->httpClient
                ->geocode(...$args)
            ;
        });
    }

    private function _testGeocode(callable $geocode)
    {
        $geocodeUrls[] = $this->getGeocodeUrl('address_part11%2C%20address_part12', 'US', 'apikey');
        $geocodeUrlsObfuscated[] = $this->getGeocodeUrl(
            'address_part11%2C%20address_part12',
            'US',
            '***'
        );
        $geocodeUrls[] = $this->getGeocodeUrl('address_part21%2C%20address_part22', 'US', 'apikey');
        $geocodeUrlsObfuscated[] = $this->getGeocodeUrl(
            'address_part21%2C%20address_part22',
            'US',
            '***'
        );
        $geocodeUrls[] = $this->getGeocodeUrl('address_part31%2C%20address_part32', 'US', 'apikey');
        $geocodeUrlsObfuscated[] = $this->getGeocodeUrl(
            'address_part31%2C%20address_part32',
            'US',
            '***'
        );

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(6))
            ->method('debug')
            ->withConsecutive(
                ['[({country}) {path}] : Request started', [
                    'country' => 'US',
                    'path' => 'address_part11, address_part12',
                ]],
                ['[({country}) {path}] : [{status}] {total_time} {url}', [
                    'country' => 'US',
                    'path' => 'address_part11, address_part12',
                    'status' => '200 OK',
                    'total_time' => 0,
                    'url' => $geocodeUrlsObfuscated[0],
                ]],
                ['[({country}) {path}] : Request started', [
                    'country' => 'US',
                    'path' => 'address_part21, address_part22',
                ]],
                ['[({country}) {path}] : [{status}] {total_time} {url}', [
                    'country' => 'US',
                    'path' => 'address_part21, address_part22',
                    'status' => '400 Bad Request',
                    'total_time' => 0,
                    'url' => $geocodeUrlsObfuscated[1],
                ]],
                ['[({country}) {path}] : Request started', [
                    'country' => 'US',
                    'path' => 'address_part31, address_part32',
                ]],
                ['[({country}) {path}] : [{status}] {total_time} {url}', [
                    'country' => 'US',
                    'path' => 'address_part31, address_part32',
                    'status' => 'NO_RESPONSE',
                    'total_time' => 0,
                    'url' => $geocodeUrlsObfuscated[2],
                ]]
            )
        ;

        $this
            ->guzzleHandler
            ->append(
                new Response(200, [], '{}'),
                new Response(400, [], '{"error_message" : "Invalid request. Invalid \'latlng\' parameter.","results" : [],"status" : "INVALID_REQUEST"}'),
                new \RuntimeException('something wrong here')
            )
        ;

        $this->assertInstanceOf(
            \stdClass::class,
            $geocode('address_part11, address_part12', 'US')
        );

        $this->assertInstanceOf(
            \stdClass::class,
            $geocode('address_part21, address_part22', 'US')
        );

        try {
            $geocode('address_part31, address_part32', 'US');
        } catch (\Exception $e) {
            $this->assertInstanceOf(\RuntimeException::class, $e);
        }
    }

    public function testReverseGeocodeAsync()
    {
        $this->_testReverseGeocode(function (Address $address) {
            return $this
                ->httpClient
                ->reverseGeocodeAsync($address)
                ->wait()
            ;
        });
    }

    public function testReverseGeocode()
    {
        $this->_testReverseGeocode(function (Address $address) {
            return $this
                ->httpClient
                ->reverseGeocode($address)
            ;
        });
    }

    private function _testReverseGeocode(callable $reverseGeocode)
    {
        $reverseGeocodeUrls[] = $this->getReverseGeocodeUrl(100, -100, 'apikey');
        $reverseGeocodeUrlsObfuscated[] = $this->getReverseGeocodeUrl(100, -100, '***');

        $reverseGeocodeUrls[] = $this->getReverseGeocodeUrl(101, -101, 'apikey');
        $reverseGeocodeUrlsObfuscated[] = $this->getReverseGeocodeUrl(101, -101, '***');

        $reverseGeocodeUrls[] = $this->getReverseGeocodeUrl(102, -102, 'apikey');
        $reverseGeocodeUrlsObfuscated[] = $this->getReverseGeocodeUrl(102, -102, '***');

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(6))
            ->method('debug')
            ->withConsecutive(
                ['[({coords}) {country} {address}] : Request started', [
                    'coords' => '100,-100',
                    'country' => 'country',
                    'address' => '1, street, city, state zip',
                ]],
                ['[({coords}) {country} {address}] : [{status}] {total_time} {url}', [
                    'coords' => '100,-100',
                    'country' => 'country',
                    'address' => '1, street, city, state zip',
                    'status' => '200 OK',
                    'total_time' => 0,
                    'url' => $reverseGeocodeUrlsObfuscated[0],
                ]],
                ['[({coords}) {country} {address}] : Request started', [
                    'coords' => '101,-101',
                    'country' => 'country2',
                    'address' => '2, street2, city2, state2 zip2',
                ]],
                ['[({coords}) {country} {address}] : [{status}] {total_time} {url}', [
                    'coords' => '101,-101',
                    'country' => 'country2',
                    'address' => '2, street2, city2, state2 zip2',
                    'status' => '400 Bad Request',
                    'total_time' => 0,
                    'url' => $reverseGeocodeUrlsObfuscated[1],
                ]],
                ['[({coords}) {country} {address}] : Request started', [
                    'coords' => '102,-102',
                    'country' => 'country3',
                    'address' => '3, street3, city3, state3 zip3',
                ]],
                ['[({coords}) {country} {address}] : [{status}] {total_time} {url}', [
                    'coords' => '102,-102',
                    'country' => 'country3',
                    'address' => '3, street3, city3, state3 zip3',
                    'status' => 'NO_RESPONSE',
                    'total_time' => 0,
                    'url' => $reverseGeocodeUrlsObfuscated[2],
                ]]
            )
        ;

        $this
            ->guzzleHandler
            ->append(
                new Response(200, [], '{}'),
                new Response(400, [], '{"error_message" : "Invalid request. Invalid \'latlng\' parameter.","results" : [],"status" : "INVALID_REQUEST"}'),
                new \RuntimeException()
            )
        ;

        $address = new Address('street', 1, 'city', 'state', 'country', 'zip');
        $address->setCoords(new Coords(100, -100));

        $this->assertInstanceOf(
            \stdClass::class,
            $reverseGeocode($address)
        );

        $address = new Address('street2', 2, 'city2', 'state2', 'country2', 'zip2');
        $address->setCoords(new Coords(101, -101));

        $this->assertInstanceOf(
            \stdClass::class,
            $reverseGeocode($address)
        );

        try {
            $address = new Address('street3', 3, 'city3', 'state3', 'country3', 'zip3');
            $address->setCoords(new Coords(102, -102));

            $this->assertInstanceOf(
                \stdClass::class,
                $reverseGeocode($address)
            );

            $this->fail('\RuntimeException expected during 3rd call');
        } catch (\Exception $e) {
            $this->assertInstanceOf(\RuntimeException::class, $e);
        }
    }

    private function getGuzzleClient($handler)
    {
        return new Client(['handler' => $handler]);
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;
    }

    private function getRequest()
    {
        return $this
            ->getMockBuilder(RequestInterface::class)
            ->getMock()
        ;
    }

    private function getGeocodeUrl($address, $country, $key)
    {
        return sprintf(
            'https://maps.googleapis.com/maps/api/geocode/json?address=%s&components=country:%s&key=%s',
            $address,
            $country,
            $key
        );
    }

    private function getReverseGeocodeUrl($lat, $lng, $key)
    {
        return sprintf(
            'https://maps.googleapis.com/maps/api/geocode/json?latlng=%s&key=%s',
            $lat.','.$lng,
            $key
        );
    }
}
