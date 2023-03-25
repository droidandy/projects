<?php

namespace Test\AppBundle\Import_;

use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClient;
use AppBundle\Import\Adapter\Sothebys\DataSync\Normalizer\UserNormalizer;
use AppBundle\Import\NormalisedUserInterface;
use AppBundle\Import\NormalisedUserProxy;
use Test\AppBundle\AbstractFrameworkTestCase;
use Test\Utils\Traits\DataSyncTrait;
use GuzzleHttp\Promise;

class NormalisedUserProxyTest extends AbstractFrameworkTestCase
{
    use DataSyncTrait;

    public function testProxy()
    {
        $userResponse = $this->getUser();
        $normalisedUser = $this->getNormalisedUser();

        $dataSyncClient = $this->getDataSyncClient();
        $dataSyncClient
            ->expects($this->once())
            ->method('getAgentById')
            ->with('d693de6e-2de4-45ea-ba02-53944df70c10')
            ->willReturn(
                Promise\promise_for($userResponse)
            )
        ;

        $dataSyncUserNormalizer = $this->getDataSyncUserNormalizer();
        $dataSyncUserNormalizer
            ->expects($this->once())
            ->method('normalize')
            ->with($userResponse)
            ->willReturn($normalisedUser)
        ;

        $normalisedUserProxy = new NormalisedUserProxy(
            'd693de6e-2de4-45ea-ba02-53944df70c10',
            $dataSyncClient,
            $dataSyncUserNormalizer
        );

        $relf = new \ReflectionClass(NormalisedUserInterface::class);

        foreach ($relf->getMethods(\ReflectionMethod::IS_PUBLIC & ~\ReflectionMethod::IS_STATIC) as $reflectionMethod) {
            $method = $reflectionMethod->getName();
            if (0 === strpos($method, 'get')) {
                $this->assertEquals($normalisedUser->$method(), $normalisedUserProxy->$method());
            }
        }

        $this->assertEquals(
            sha1($normalisedUser->getValueToHash()),
            sha1($normalisedUserProxy->getValueToHash()),
            'hasing failed'
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

    private function getDataSyncUserNormalizer()
    {
        return $this
            ->getMockBuilder(UserNormalizer::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
