<?php

namespace Test\AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Query\CompositeQuery;
use AppBundle\Elastic\Integration\Query\CompositeRequest;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;

class CompositeQueryTest extends \PHPUnit_Framework_TestCase
{
    public function testConfigureCriteria()
    {
        $criteriaBuilder = $this->getCriteriaBuilder();
        $queries = [];
        foreach (['query1', 'query2', 'query3'] as $namespace) {
            $queries[$namespace] = $query = $this->getQuery();
        }
        $criteriaBuilder
            ->expects($this->exactly(3))
            ->method('fromQuery')
            ->withConsecutive(
                ['query1', $queries['query1']],
                ['query2', $queries['query2']],
                ['query3', $queries['query3']]
            )
        ;

        $compositeQuery = $this->getCompositeQuery($queries);

        $compositeQuery->configureCriteria($criteriaBuilder);
    }

    public function testBuild()
    {
        $criteria = [
            'query1' => ['id' => 1],
            'query2' => ['id' => 1],
            'query3' => ['id' => 1],
        ];
        $requestFactory = $this->getRequestFactory();
        $queries = $requests = [];
        foreach (['query1', 'query2', 'query3'] as $namespace) {
            $requests[$namespace] = $request = $this->getRequest();
            $queries[$namespace] = $query = $this->getQuery();
            $query
                ->expects($this->once())
                ->method('build')
                ->with($criteria[$namespace], $requestFactory)
                ->willReturn($request)
            ;
        }

        $compositeQuery = $this->getCompositeQuery($queries);

        $compositeRequest = $compositeQuery->build($criteria, $requestFactory);

        $this->assertInstanceOf(CompositeRequest::class, $compositeRequest);

        $refl = new \ReflectionObject($compositeRequest);
        $requestsProp = $refl->getProperty('requests');
        $requestsProp->setAccessible(true);

        $this->assertSame($requestsProp->getValue($compositeRequest), $requests);
    }

    private function getCompositeQuery($queries)
    {
        return new CompositeQuery($queries);
    }

    private function getQuery()
    {
        return $this->getMockBuilder(QueryInterface::class)
            ->getMock()
        ;
    }

    private function getCriteriaBuilder()
    {
        return $this->getMockBuilder(CriteriaBuilderInterface::class)
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
}
