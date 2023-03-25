<?php

namespace Test\AppBundle\Geo\Geocode;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Geo\Geocode\CachedHttpClient;
use AppBundle\Geo\Geocode\HttpClientInterface;
use Doctrine\Common\Cache\ArrayCache as BaseArrayCache;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Promise as P;
use GuzzleHttp\Psr7\Request;

class CachedHttpClientTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var CachedHttpClient
     */
    private $cachedHttpClient;
    /**
     * @var ArrayCache
     */
    private $cache;
    /**
     * @var HttpClientInterface
     */
    private $httpClient;
    /**
     * @var Address
     */
    private $address;

    protected function setUp()
    {
        $this->cache = new ArrayCache();
        $this->httpClient = $this->getHttpClient();
        $this->address = new Address();
        $this->address->setCoords(new Coords(100, -100));

        $this->cachedHttpClient = new CachedHttpClient($this->cache, $this->httpClient);
    }

    public function testGeocodeAsync()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('geocodeAsync')
            ->with('path', 'country')
            ->willReturn(
                P\promise_for(
                    (object) [
                        'status' => 'OK',
                        'results' => [1, 2, 3],
                    ]
                )
            )
        ;

        $this->_testGeocode(function () {
            return $this->cachedHttpClient->geocodeAsync('path', 'country')->wait();
        });
    }

    public function testGeocode()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('geocode')
            ->with('path', 'country')
            ->willReturn(
                (object) [
                    'status' => 'OK',
                    'results' => [1, 2, 3],
                ]
            )
        ;

        $this->_testGeocode(function () {
            return $this->cachedHttpClient->geocode('path', 'country');
        });
    }

    public function testGeocodeAsyncShortTime()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('geocodeAsync')
            ->with('path', 'country')
            ->willReturn(
                P\promise_for(
                    (object) [
                        'status' => 'ZERO_RESULTS',
                        'results' => [],
                    ]
                )
            )
        ;

        $this->_testGeocodeShortTime(function () {
            return $this->cachedHttpClient->geocodeAsync('path', 'country')->wait();
        });
    }

    public function testGeocodeShortTime()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('geocode')
            ->with('path', 'country')
            ->willReturn(
                (object) [
                    'status' => 'ZERO_RESULTS',
                    'results' => [],
                ]
            )
        ;

        $this->_testGeocodeShortTime(function () {
            return $this->cachedHttpClient->geocode('path', 'country');
        });
    }

    public function testGeocodeAsyncNoCache()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->exactly(3))
            ->method('geocodeAsync')
            ->with('path', 'country')
            ->willReturn(
                P\rejection_for(new RequestException('bad request', new Request('GET', 'uri')))
            )
        ;

        $this->_testGeocodeNoCache(function () {
            return $this->cachedHttpClient->geocodeAsync('path', 'country')->wait();
        });
    }

    public function testGeocodeNoCache()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->exactly(3))
            ->method('geocode')
            ->with('path', 'country')
            ->willThrowException(
                new RequestException('bad request', new Request('GET', 'uri'))
            )
        ;

        $this->_testGeocodeNoCache(function () {
            return $this->cachedHttpClient->geocode('path', 'country');
        });
    }

    public function testReverseGeocodeAsync()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($this->address)
            ->willReturn(
                P\promise_for(
                    (object) [
                        'status' => 'OK',
                        'results' => [1, 2, 3],
                    ]
                )
            )
        ;

        $this->_testGeocode(function () {
            return $this->cachedHttpClient->reverseGeocodeAsync($this->address)->wait();
        });
    }

    public function testReverseGeocode()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocode')
            ->with($this->address)
            ->willReturn(
                (object) [
                    'status' => 'OK',
                    'results' => [1, 2, 3],
                ]
            )
        ;

        $this->_testGeocode(function () {
            return $this->cachedHttpClient->reverseGeocode($this->address);
        });
    }

    public function testReverseGeocodeAsyncShortTime()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocodeAsync')
            ->with($this->address)
            ->willReturn(
                P\promise_for(
                    (object) [
                        'status' => 'ZERO_RESULTS',
                        'results' => [],
                    ]
                )
            )
        ;

        $this->_testGeocodeShortTime(function () {
            return $this->cachedHttpClient->reverseGeocodeAsync($this->address)->wait();
        });
    }

    public function testReverseGeocodeShortTime()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->once())
            ->method('reverseGeocode')
            ->with($this->address)
            ->willReturn(
                (object) [
                    'status' => 'ZERO_RESULTS',
                    'results' => [],
                ]
            )
        ;

        $this->_testGeocodeShortTime(function () {
            return $this->cachedHttpClient->reverseGeocode($this->address);
        });
    }

    public function testReverseGeocodeAsyncNoCache()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->exactly(3))
            ->method('reverseGeocodeAsync')
            ->with($this->address)
            ->willReturn(
                P\rejection_for(new RequestException('bad request', new Request('GET', 'uri')))
            )
        ;

        $this->_testGeocodeNoCache(function () {
            return $this->cachedHttpClient->reverseGeocodeAsync($this->address)->wait();
        });
    }

    public function testReverseGeocodeNoCache()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->expects($this->exactly(3))
            ->method('reverseGeocode')
            ->with($this->address)
            ->willThrowException(
                new RequestException('bad request', new Request('GET', 'uri'))
            )
        ;

        $this->_testGeocodeNoCache(function () {
            return $this->cachedHttpClient->reverseGeocode($this->address);
        });
    }

    private function _testGeocode(callable $request)
    {
        $this->assertEquals(
            (object) [
                'status' => 'OK',
                'results' => [1, 2, 3],
            ],
            $request()
        );
        $this->assertEquals(
            (object) [
                'status' => 'OK',
                'results' => [1, 2, 3],
            ],
            $request()
        );
        $this->assertEquals(
            (object) [
                'status' => 'OK',
                'results' => [1, 2, 3],
            ],
            $request()
        );

        $this->assertEquals(
            CachedHttpClient::CACHE_TTL,
            $this->cache->ttl
        );
        $this->assertEquals(
            1,
            $this->cache->saveHits
        );
        $this->assertEquals(
            3,
            $this->cache->fetchHits
        );
    }

    private function _testGeocodeShortTime(callable $request)
    {
        $this->assertEquals(
            (object) [
                'status' => 'ZERO_RESULTS',
                'results' => [],
            ],
            $request()
        );
        $this->assertEquals(
            (object) [
                'status' => 'ZERO_RESULTS',
                'results' => [],
            ],
            $request()
        );
        $this->assertEquals(
            (object) [
                'status' => 'ZERO_RESULTS',
                'results' => [],
            ],
            $request()
        );

        $this->assertEquals(
            CachedHttpClient::CACHE_ZERO_RESULT_OR_FAILURE_TTL,
            $this->cache->ttl
        );
        $this->assertEquals(
            1,
            $this->cache->saveHits
        );
        $this->assertEquals(
            3,
            $this->cache->fetchHits
        );
    }

    private function _testGeocodeNoCache(callable $request)
    {
        try {
            $request();
            $this->fail('RequestException should be thrown');
        } catch (\Exception $e) {
            $this->assertInstanceOf(RequestException::class, $e);
        }
        try {
            $request();
            $this->fail('RequestException should be thrown');
        } catch (\Exception $e) {
            $this->assertInstanceOf(RequestException::class, $e);
        }
        try {
            $request();
            $this->fail('RequestException should be thrown');
        } catch (\Exception $e) {
            $this->assertInstanceOf(RequestException::class, $e);
        }

        $this->assertNull($this->cache->ttl);
        $this->assertEquals(
            0,
            $this->cache->saveHits
        );
        $this->assertEquals(
            3,
            $this->cache->fetchHits
        );
    }

    private function getHttpClient()
    {
        return $this
            ->getMockBuilder(HttpClientInterface::class)
            ->getMock()
        ;
    }
}

class ArrayCache extends BaseArrayCache
{
    public $ttl;
    public $saveHits = 0;
    public $fetchHits = 0;

    protected function doSave($id, $data, $lifeTime = 0)
    {
        if (false === strpos($id, 'DoctrineNamespaceCacheKey')) {
            $this->ttl = $lifeTime;
            ++$this->saveHits;
        }

        return parent::doSave($id, $data, $lifeTime);
    }

    protected function doFetch($id)
    {
        if (false === strpos($id, 'DoctrineNamespaceCacheKey')) {
            ++$this->fetchHits;
        }

        return parent::doFetch($id);
    }
}
