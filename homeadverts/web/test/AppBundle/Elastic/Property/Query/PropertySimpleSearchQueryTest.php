<?php

namespace Test\AppBundle\Elastic\Property\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;
use AppBundle\Elastic\Property\Query\PropertySimpleSearchQuery;

class PropertySimpleSearchQueryTest extends \PHPUnit_Framework_TestCase
{
    public function testConfigureCriteria()
    {
        $criteriaBuilder = $this->getCriteriaBuilder();
        $criteriaBuilder
            ->expects($this->once())
            ->method('add')
            ->with(
                'term',
                'string',
                $this->callback(function ($el) {
                    if (array_keys($el) != ['__required', '__validate']) {
                        return false;
                    }
                    if (!array_key_exists('__required', $el) || !is_bool($el['__required'])) {
                        return false;
                    }
                    if (!array_key_exists('__validate', $el) || !is_callable($el['__validate'])) {
                        return false;
                    }

                    return true;
                })
            )
            ->willReturnSelf()
        ;

        $this->getPropertySimpleSearchQuery('id')->configureCriteria($criteriaBuilder);
    }

    public function testBuildWithId()
    {
        $criteria = [
            'term' => 'term_to_search',
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'query' => [
                        'constant_score' => [
                            'filter' => [
                                'bool' => [
                                    'filter' => [
                                        'ids' => [
                                            'values' => ['term_to_search'],
                                        ],
                                    ],
                                    'must_not' => [
                                        'exists' => [
                                            'field' => 'deletedAt',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                PropertyMapping::TYPE
            )
            ->willReturn($request)
        ;

        $query = $this->getPropertySimpleSearchQuery('id');
        $request = $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildWithMls()
    {
        $criteria = [
            'term' => 'term_to search',
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 1,
                    'query' => [
                        'constant_score' => [
                            'filter' => [
                                'bool' => [
                                    'must' => [
                                        [
                                            'wildcard' => [
                                                'mlsRef' => '*term_to*',
                                            ],
                                        ],
                                        [
                                            'wildcard' => [
                                                'mlsRef' => '*search*',
                                            ],
                                        ],
                                    ],
                                    'filter' => [
                                        [
                                            'term' => [
                                                'status' => 100,
                                            ],
                                        ],
                                    ],
                                    'must_not' => [
                                        'exists' => [
                                            'field' => 'deletedAt',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        'mlsRef' => 'asc',
                    ],
                ],
                PropertyMapping::TYPE
            )
            ->willReturn($request)
        ;

        $query = $this->getPropertySimpleSearchQuery('mls');
        $request = $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildWithSourceRef()
    {
        $criteria = [
            'term' => 'term_to search',
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 1,
                    'query' => [
                        'constant_score' => [
                            'filter' => [
                                'bool' => [
                                    'must' => [
                                        [
                                            'wildcard' => [
                                                'sourceRef' => '*term_to*',
                                            ],
                                        ],
                                        [
                                            'wildcard' => [
                                                'sourceRef' => '*search*',
                                            ],
                                        ],
                                    ],
                                    'filter' => [
                                        [
                                            'term' => [
                                                'status' => 100,
                                            ],
                                        ],
                                    ],
                                    'must_not' => [
                                        'exists' => [
                                            'field' => 'deletedAt',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        'sourceRef' => 'asc',
                    ],
                ],
                PropertyMapping::TYPE
            )
            ->willReturn($request)
        ;

        $query = $this->getPropertySimpleSearchQuery('sourceRef');
        $request = $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildWithSourceGuid()
    {
        $criteria = [
            'term' => 'term_to search',
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 1,
                    'query' => [
                        'constant_score' => [
                            'filter' => [
                                'bool' => [
                                    'must' => [
                                        [
                                            'wildcard' => [
                                                'sourceGuid' => '*term_to*',
                                            ],
                                        ],
                                        [
                                            'wildcard' => [
                                                'sourceGuid' => '*search*',
                                            ],
                                        ],
                                    ],
                                    'filter' => [
                                        [
                                            'term' => [
                                                'status' => 100,
                                            ],
                                        ],
                                    ],
                                    'must_not' => [
                                        'exists' => [
                                            'field' => 'deletedAt',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        'sourceGuid' => 'asc',
                    ],
                ],
                PropertyMapping::TYPE
            )
            ->willReturn($request)
        ;

        $query = $this->getPropertySimpleSearchQuery('sourceGuid');
        $request = $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildWithZip()
    {
        $criteria = [
            'term' => 'term_to search',
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 1,
                    'query' => [
                        'constant_score' => [
                            'filter' => [
                                'bool' => [
                                    'must' => [
                                        [
                                            'wildcard' => [
                                                'zip' => '*term_to*',
                                            ],
                                        ],
                                        [
                                            'wildcard' => [
                                                'zip' => '*search*',
                                            ],
                                        ],
                                    ],
                                    'filter' => [
                                        [
                                            'term' => [
                                                'status' => 100,
                                            ],
                                        ],
                                    ],
                                    'must_not' => [
                                        'exists' => [
                                            'field' => 'deletedAt',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        'zip' => 'asc',
                    ],
                ],
                PropertyMapping::TYPE
            )
            ->willReturn($request)
        ;

        $query = $this->getPropertySimpleSearchQuery('zip');
        $request = $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage Field should be of value "id", "mls", "sourceRef", "sourceGuid", "zip". "another_field" provided
     */
    public function testBuildWithException()
    {
        $criteria = [
            'term' => 'term_not_to_be_searched',
            'field' => 'another_field',
        ];
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->never())
            ->method('createRequest')
        ;

        $query = $this->getPropertySimpleSearchQuery('another_field');
        $query->build($criteria, $requestFactory);
    }

    private function getPropertySimpleSearchQuery($field)
    {
        return new PropertySimpleSearchQuery($field);
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
