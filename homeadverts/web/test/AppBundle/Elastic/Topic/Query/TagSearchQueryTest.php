<?php

namespace Test\AppBundle\Elastic\Category\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Category\Mapping\TagMapping;
use AppBundle\Elastic\Category\Query\TagSearchQuery;

class TagSearchQueryTest extends \PHPUnit_Framework_TestCase
{
    public function testConfigureCriteria()
    {
        $criteriaBuilder = $this->getCriteriaBuilder();
        $criteriaBuilder
            ->expects($this->exactly(4))
            ->method('add')
            ->withConsecutive(
                ['term', 'string', $this->callback(function ($val) {
                    return true === $val['__required'] && is_callable($val['__validate']);
                })],
                ['filters', 'array'],
                ['limit', 'fromto'],
                ['sort', 'sort']
            )
            ->willReturnSelf()
        ;

        $tagSearchQuery = $this->getTagSearchQuery();
        $tagSearchQuery->configureCriteria($criteriaBuilder);
    }

    public function testBuildWithTerm()
    {
        $criteria = [
            'limit' => [
                'from' => 0,
                'to' => 10,
            ],
            'term' => 'Tag',
            'filters' => null,
            'sort' => null,
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 10,
                    'query' => [
                        'bool' => [
                            'must' => [
                                'bool' => [
                                    'should' => [
                                        [
                                            'prefix' => [
                                                'name' => 'Tag',
                                            ],
                                        ],
                                        [
                                            'match' => [
                                                'displayName' => 'Tag',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        '_score',
                    ],
                ],
                TagMapping::TYPE
            )
            ->willReturn($request)
        ;

        $tagSearchQuery = $this->getTagSearchQuery();
        $request = $tagSearchQuery->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildWithTermAndFilters()
    {
        $criteria = [
            'limit' => [
                'from' => 0,
                'to' => 10,
            ],
            'term' => 'Tag',
            'filters' => [
                'user' => [
                    'name' => 'Tag Creator',
                ],
                'private' => true,
            ],
            'sort' => null,
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 10,
                    'query' => [
                        'bool' => [
                            'must' => [
                                'bool' => [
                                    'should' => [
                                        [
                                            'prefix' => [
                                                'name' => 'Tag',
                                            ],
                                        ],
                                        [
                                            'match' => [
                                                'displayName' => 'Tag',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'filter' => [
                                [
                                    'term' => [
                                        'user.name' => 'Tag Creator',
                                    ],
                                ],
                                [
                                    'term' => [
                                        'private' => true,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        '_score',
                    ],
                ],
                TagMapping::TYPE
            )
            ->willReturn($request)
        ;

        $tagSearchQuery = $this->getTagSearchQuery();
        $request = $tagSearchQuery->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildWithTermAndSort()
    {
        $criteria = [
            'limit' => [
                'from' => 0,
                'to' => 10,
            ],
            'term' => 'Tag',
            'filters' => null,
            'sort' => [
                'createdAt' => 'desc',
                'displayName' => 'asc',
            ],
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 10,
                    'query' => [
                        'bool' => [
                            'must' => [
                                'bool' => [
                                    'should' => [
                                        [
                                            'prefix' => [
                                                'name' => 'Tag',
                                            ],
                                        ],
                                        [
                                            'match' => [
                                                'displayName' => 'Tag',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        '_score',
                        [
                            'createdAt' => 'desc',
                        ],
                        [
                            'displayName.raw' => 'asc',
                        ],
                    ],
                ],
                TagMapping::TYPE
            )
            ->willReturn($request)
        ;

        $tagSearchQuery = $this->getTagSearchQuery();
        $request = $tagSearchQuery->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildWithTermAndSortRandom()
    {
        $criteria = [
            'limit' => [
                'from' => 0,
                'to' => 10,
            ],
            'term' => 'Tag',
            'filters' => null,
            'sort' => [
                'random' => true,
                'seed' => 1,
            ],
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 10,
                    'query' => [
                        'function_score' => [
                            'query' => [
                                'bool' => [
                                    'must' => [
                                        'bool' => [
                                            'should' => [
                                                [
                                                    'prefix' => [
                                                        'name' => 'Tag',
                                                    ],
                                                ],
                                                [
                                                    'match' => [
                                                        'displayName' => 'Tag',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'random_score' => [
                                'seed' => 1,
                            ],
                        ],
                    ],
                ],
                TagMapping::TYPE
            )
            ->willReturn($request)
        ;

        $tagSearchQuery = $this->getTagSearchQuery();
        $request = $tagSearchQuery->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildWithTermAndFiltersAndSort()
    {
        $criteria = [
            'limit' => [
                'from' => 0,
                'to' => 10,
            ],
            'term' => 'Tag',
            'filters' => [
                'user' => [
                    'name' => 'Tag Creator',
                ],
                'private' => true,
            ],
            'sort' => [
                'createdAt' => 'desc',
                'displayName' => 'asc',
            ],
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 10,
                    'query' => [
                        'bool' => [
                            'must' => [
                                'bool' => [
                                    'should' => [
                                        [
                                            'prefix' => [
                                                'name' => 'Tag',
                                            ],
                                        ],
                                        [
                                            'match' => [
                                                'displayName' => 'Tag',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'filter' => [
                                [
                                    'term' => [
                                        'user.name' => 'Tag Creator',
                                    ],
                                ],
                                [
                                    'term' => [
                                        'private' => true,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        '_score',
                        [
                            'createdAt' => 'desc',
                        ],
                        [
                            'displayName.raw' => 'asc',
                        ],
                    ],
                ],
                TagMapping::TYPE
            )
            ->willReturn($request)
        ;

        $tagSearchQuery = $this->getTagSearchQuery();
        $request = $tagSearchQuery->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    private function getTagSearchQuery()
    {
        return new TagSearchQuery();
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
