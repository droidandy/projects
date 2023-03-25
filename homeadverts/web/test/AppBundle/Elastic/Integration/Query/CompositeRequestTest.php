<?php

namespace Test\AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Mapping\MappingFactoryInterface;
use AppBundle\Elastic\Integration\Query\CompositeRequest;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use function React\Promise\resolve;
use GuzzleHttp\Promise\PromiseInterface;
use GuzzleHttp\Ring\Future\FutureArray;
use GuzzleHttp\Ring\Future\FutureInterface;

class CompositeRequestTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @expectedException \LogicException
     * @expectedExceptionMessage Composite is not allowed to return body
     */
    public function testGetBody()
    {
        $compositeRequest = $this->getCompositeRequest([]);

        $compositeRequest->getBody();
    }

    public function testExecute()
    {
        $requests = $futures = [];
        $mappingFactory = $this->getMappingFactory();
        for ($i = 0; $i < 3; ++$i) {
            $futures[] = $future = $this->getFuture();
            $requests[] = $request = $this->getRequest();
            $request
                ->expects($this->once())
                ->method('execute')
                ->with($mappingFactory)
                ->willReturn($future)
            ;
        }

        $compositeRequest = $this->getCompositeRequest($requests);

        $all = $compositeRequest->execute($mappingFactory);
        $this->assertInstanceOf(PromiseInterface::class, $all);
    }

    public function testCompositeInComposite()
    {
        $requests = $futures = [];
        $mappingFactory = $this->getMappingFactory();
        for ($i = 0; $i < 3; ++$i) {
            $futures[] = $future = new FutureArray(resolve($i));
            $requests[] = $request = $this->getRequest();
            $request
                ->expects($this->once())
                ->method('execute')
                ->with($mappingFactory)
                ->willReturn($future)
            ;
        }

        $compositeSubRequest = $this->getCompositeRequest($requests);
        $compositeRequest = $this->getCompositeRequest(['sub_request' => $compositeSubRequest]);

        $all = $compositeRequest->execute($mappingFactory);
        $this->assertInstanceOf(PromiseInterface::class, $all);

        $result = $all->wait(true);
        for ($i = 0; $i < 3; ++$i) {
            $this->assertEquals($i, $result['sub_request'][$i]);
        }
    }

    private function getCompositeRequest($requests)
    {
        return new CompositeRequest($requests);
    }

    private function getRequest()
    {
        return $this->getMockBuilder(RequestInterface::class)
            ->getMock()
        ;
    }

    private function getMappingFactory()
    {
        return $this->getMockBuilder(MappingFactoryInterface::class)
            ->getMock()
        ;
    }

    private function getFuture()
    {
        return $this->getMockBuilder(FutureInterface::class)
            ->getMock()
        ;
    }
}
