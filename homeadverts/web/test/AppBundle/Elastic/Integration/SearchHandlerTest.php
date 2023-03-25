<?php

namespace Test\AppBundle\Elastic\Integration;

use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Integration\Mapping\MappingFactoryInterface;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Integration\SearchHandler;
use AppBundle\Elastic\Integration\View\ViewInterface;
use AppBundle\Elastic\Integration\View\ViewRegistry;
use GuzzleHttp\Ring\Future\FutureArrayInterface;

class SearchHandlerTest extends \PHPUnit_Framework_TestCase
{
    public function testExecuteWithCallableView()
    {
        $mappingFactory = $this->getMappingFactory();
        $criteriaBuilder = $this->getCriteriaBuilder();
        $viewRegistry = $this->getViewRegistry();

        $query = $this->getQuery();
        $criteria = $this->getCriteria();
        $criteriaData = [
            'field1' => 1,
        ];
        $resolvedCriteriaData = [
            'root' => [
                'field1' => 1,
            ],
        ];

        $requestFactory = $this->getRequestFactory();
        $request = $this->getRequest();
        $future = $this->getFuture();
        $searchResults = $this->getSearchResults();

        $criteriaBuilder
            ->expects($this->once())
            ->method('fromQuery')
            ->with('root', $query)
        ;
        $criteriaBuilder
            ->expects($this->once())
            ->method('getCriteria')
            ->willReturn($criteria)
        ;
        $criteria
            ->expects($this->once())
            ->method('resolve')
            ->with($criteriaData)
            ->willReturn($resolvedCriteriaData)
        ;
        $query
            ->expects($this->once())
            ->method('build')
            ->with($resolvedCriteriaData['root'], $requestFactory)
            ->willReturn($request)
        ;
        $request
            ->expects($this->once())
            ->method('execute')
            ->with($mappingFactory)
            ->willReturn($future)
        ;
        $future
            ->expects($this->once())
            ->method('wait')
            ->with(true)
            ->willReturn($searchResults)
        ;

        $callableView = $this->createPartialMock(\stdClass::class, ['__invoke']);
        $callableView
            ->expects($this->once())
            ->method('__invoke')
            ->with($searchResults)
            ->willReturnArgument(0)
        ;

        $searchHandler = new SearchHandler($mappingFactory, $criteriaBuilder, $viewRegistry, $requestFactory);

        $result = $searchHandler->execute($query, $criteriaData, $callableView);

        $this->assertSame($searchResults, $result);
    }

    public function testExecuteWithRegistryView()
    {
        $mappingFactory = $this->getMappingFactory();
        $criteriaBuilder = $this->getCriteriaBuilder();
        $viewRegistry = $this->getViewRegistry();

        $query = $this->getQuery();
        $criteria = $this->getCriteria();
        $criteriaData = [
            'field1' => 1,
        ];
        $resolvedCriteriaData = [
            'root' => [
                'field1' => 1,
            ],
        ];

        $requestFactory = $this->getRequestFactory();
        $request = $this->getRequest();
        $future = $this->getFuture();
        $searchResults = $this->getSearchResults();

        $criteriaBuilder
            ->expects($this->once())
            ->method('fromQuery')
            ->with('root', $query)
        ;
        $criteriaBuilder
            ->expects($this->once())
            ->method('getCriteria')
            ->willReturn($criteria)
        ;
        $criteria
            ->expects($this->once())
            ->method('resolve')
            ->with($criteriaData)
            ->willReturn($resolvedCriteriaData)
        ;
        $query
            ->expects($this->once())
            ->method('build')
            ->with($resolvedCriteriaData['root'], $requestFactory)
            ->willReturn($request)
        ;
        $request
            ->expects($this->once())
            ->method('execute')
            ->with($mappingFactory)
            ->willReturn($future)
        ;
        $future
            ->expects($this->once())
            ->method('wait')
            ->with(true)
            ->willReturn($searchResults)
        ;

        $view = $this->getView();
        $view
            ->expects($this->once())
            ->method('__invoke')
            ->with($searchResults)
            ->willReturnArgument(0)
        ;
        $viewRegistry
            ->expects($this->once())
            ->method('get')
            ->with('raw_view')
            ->willReturn($view)
        ;

        $searchHandler = new SearchHandler($mappingFactory, $criteriaBuilder, $viewRegistry, $requestFactory);

        $result = $searchHandler->execute($query, $criteriaData, 'raw_view');

        $this->assertSame($searchResults, $result);
    }

    private function getMappingFactory()
    {
        return $this->getMockBuilder(MappingFactoryInterface::class)
            ->getMock()
        ;
    }

    private function getCriteriaBuilder()
    {
        return $this->getMockBuilder(CriteriaBuilderInterface::class)
            ->getMock()
        ;
    }

    private function getCriteria()
    {
        return $this->getMockBuilder(CriteriaInterface::class)
            ->getMock()
        ;
    }

    private function getViewRegistry()
    {
        return $this->getMockBuilder(ViewRegistry::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getView()
    {
        return $this->getMockBuilder(ViewInterface::class)
            ->getMock()
        ;
    }

    private function getQuery()
    {
        return $this->getMockBuilder(QueryInterface::class)
            ->getMock()
        ;
    }

    private function getRequestFactory()
    {
        return $this->getMockBuilder(RequestFactoryInterface::class)
            ->getMock()
        ;
    }

    private function getRequest()
    {
        return $this->getMockBuilder(RequestInterface::class)
            ->getMock()
        ;
    }

    private function getFuture()
    {
        return $this->getMockBuilder(FutureArrayInterface::class)
            ->getMock()
        ;
    }

    private function getSearchResults()
    {
        return $this->getMockBuilder(SearchResults::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
