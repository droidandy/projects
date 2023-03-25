<?php

namespace Test\AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Mapping\MappingFactoryInterface;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Elastic\Integration\Query\Request;
use GuzzleHttp\Ring\Future\FutureArrayInterface;
use React\Promise\PromiseInterface;

class RequestTest extends \PHPUnit_Framework_TestCase
{
    public function testGetBody()
    {
        $callable = $this->createPartialMock(\stdClass::class, ['__invoke']);
        $callable
            ->expects($this->never())
            ->method('__invoke')
        ;

        $request = $this->getRequest(['query' => []], 'test_type', $callable);

        $this->assertEquals(['query' => []], $request->getBody());
    }

    public function testExecute()
    {
        $callable = $this->createPartialMock(\stdClass::class, ['__invoke']);
        $callable
            ->expects($this->never())
            ->method('__invoke')
        ;

        $request = $this->getRequest(['query' => []], 'test_type', $callable);

        $promiseDerived = $this->getPromise();

        $promise = $this->getFutureArray();
        $promise
            ->expects($this->once())
            ->method('then')
            ->with($this->isType('callable'))
            ->willReturn($promiseDerived)
        ;

        $mapping = $this->getMapping();
        $mapping
            ->expects($this->once())
            ->method('execute')
            ->with($request)
            ->willReturn($promise)
        ;

        $mappingFactory = $this->getMappingFactory();
        $mappingFactory
            ->expects($this->once())
            ->method('get')
            ->with('test_type')
            ->willReturn($mapping)
        ;

        $this->assertInstanceOf(FutureArrayInterface::class, $request->execute($mappingFactory));
    }

    private function getRequest($body, $type, $callable)
    {
        return new Request($body, $type, $callable);
    }

    private function getMappingFactory()
    {
        return $this->getMockBuilder(MappingFactoryInterface::class)
            ->getMock()
        ;
    }

    private function getMapping()
    {
        return $this->getMockBuilder(MappingInterface::class)
            ->getMock()
        ;
    }

    private function getPromise()
    {
        return $this->getMockBuilder(PromiseInterface::class)
            ->getMock()
        ;
    }

    private function getFutureArray()
    {
        return $this->getMockBuilder(FutureArrayInterface::class)
            ->getMock()
        ;
    }
}
