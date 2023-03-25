<?php

namespace Test\AppBundle\Import_;

use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClient;
use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncPropertyNormalizer;
use AppBundle\Import\NormalisedProperty;
use AppBundle\Import\NormalisedPropertyProxy;
use GuzzleHttp\Promise;
use Test\AppBundle\AbstractFrameworkTestCase;
use Test\Utils\Traits\DataSyncTrait;

class NormalisedPropertyProxyTest extends AbstractFrameworkTestCase
{
    use DataSyncTrait;

    public function testProxy()
    {
        $propertyResponse = $this->getProperty3d();
        $normalisedProperty = $this->getNormalisedProperty3d();

        $dataSyncClient = $this->getDataSyncClient();
        $dataSyncClient
            ->expects($this->once())
            ->method('getListingById')
            ->with('d740ee9b-0385-444f-b6d8-3b3c999b8550')
            ->willReturn(
                Promise\promise_for(
                    $propertyResponse
                )
            )
        ;

        $dataSyncPropertyNormalizer = $this->getDataSyncPropertyNormalizer();
        $dataSyncPropertyNormalizer
            ->expects($this->once())
            ->method('normalize')
            ->with($propertyResponse)
            ->willReturn($this->getNormalisedProperty3d())
        ;

        $normalisedPropertyProxy = new NormalisedPropertyProxy(
            'd740ee9b-0385-444f-b6d8-3b3c999b8550',
            $dataSyncClient,
            $dataSyncPropertyNormalizer
        );

        $refl = new \ReflectionClass(NormalisedProperty::class);
        foreach ($refl->getMethods(\ReflectionMethod::IS_PUBLIC & ~\ReflectionMethod::IS_STATIC) as $reflectionMethod) {
            $method = $reflectionMethod->getName();
            if (0 === strpos($method, 'get') && 'getHash' !== $method) {
                $this->assertEquals(
                    $normalisedProperty->$method(),
                    $normalisedPropertyProxy->$method(),
                    "$method failed"
                );
            }
        }

        $this->assertEquals(
            $normalisedProperty->getHash(),
            $normalisedPropertyProxy->getHash(),
            'hashing failed'
        );
    }

    private function getDataSyncClient()
    {
        return $this
            ->getMockBuilder(DataSyncClient::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getDataSyncPropertyNormalizer()
    {
        return $this
            ->getMockBuilder(DataSyncPropertyNormalizer::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
