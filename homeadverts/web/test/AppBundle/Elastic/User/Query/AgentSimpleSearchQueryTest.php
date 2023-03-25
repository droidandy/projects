<?php

namespace Test\AppBundle\Elastic\User\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\User\Mapping\UserMapping;
use AppBundle\Elastic\User\Query\UserSimpleSearchQuery;

class UserSimpleSearchQueryTest extends \PHPUnit_Framework_TestCase
{
    public function testConfigureCriteria()
    {
        $criteriaBuilder = $this->getCriteriaBuilder();
        $criteriaBuilder
            ->expects($this->once())
            ->method('add')
            ->with('term', 'string', $this->callback(function ($options) {
                if (array_keys($options) != ['__validate']) {
                    return false;
                }
                if (!is_callable($options['__validate'])) {
                    return false;
                }

                return true;
            }))
        ;

        $this->getUserSimpleSearchQuery()->configureCriteria($criteriaBuilder);
    }

    public function testBuild()
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
                                                'name.autocomplete' => '*term_to*',
                                            ],
                                        ],
                                        [
                                            'wildcard' => [
                                                'name.autocomplete' => '*search*',
                                            ],
                                        ],
                                    ],
                                    'filter' => [
                                        [
                                            'term' => [
                                                'status' => 1,
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
                        'name.autocomplete' => 'asc',
                    ],
                ],
                UserMapping::TYPE
            )
            ->willReturn($request)
        ;

        $query = $this->getUserSimpleSearchQuery();
        $request = $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    private function getUserSimpleSearchQuery()
    {
        return new UserSimpleSearchQuery();
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
