<?php

namespace AppBundle\Elastic\User\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\User\Mapping\UserMapping;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;

class UserSimpleSearchQuery implements QueryInterface
{
    const SEARCH_SORT = 'asc';
    const SEARCH_LIMIT = 5;

    /**
     * @var string
     */
    private $userType;
    /**
     * @var int
     */
    private $searchLimit;

    /**
     * @param string $userType
     * @param int    $searchLimit
     */
    public function __construct($userType = 'user', $searchLimit = self::SEARCH_LIMIT)
    {
        $this->userType = $userType;
        $this->searchLimit = $searchLimit;
    }

    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('term', 'string', [
                '__validate' => function ($value) {
                    return mb_strlen($value) >= 3;
                },
            ])
        ;
    }

    /**
     * @param array                   $criteria
     * @param RequestFactoryInterface $requestFactory
     *
     * @return RequestInterface
     */
    public function build(array $criteria, RequestFactoryInterface $requestFactory)
    {
//        $query = $this->searchByField('name.autocomplete', $criteria['term']);
        $query = $this->fulltextSearch($criteria['term']);

        return $requestFactory->createRequest($query, $this->getTypes());
    }

    /**
     * @return string
     */
    public function getTypes()
    {
        return UserMapping::TYPE;
    }

    private function getFilters(): array
    {
        $filters = [];
        if ('all' !== $this->userType) {
            if ('user' == $this->userType) {
                $filters[] = [
                    'terms' => [
                        'hierarchyType' => ['user', 'agent'],
                    ],
                ];
            } else {
                $filters[] = [
                    'terms' => [
                        'hierarchyType' => ['company', 'office'],
                    ],
                ];
            }
        }

        return $filters;
    }

    /**
     * @param string $field
     * @param string $term
     *
     * @return array
     */
    private function searchByField($field, $term)
    {
        return [
            'from' => 0,
            'size' => $this->searchLimit,
            'query' => [
                'constant_score' => [
                    'filter' => [
                        'bool' => [
                            'must' => $this->wildcardQuery($field, $term),
                            'filter' => $this->getFilters(),
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
                $field => self::SEARCH_SORT,
            ],
        ];
    }

    /**
     * @param string $field
     * @param string $term
     *
     * @return array $wildcards
     */
    private function wildcardQuery($field, $term)
    {
        $terms = explode(' ', $term);
        $wildcards = [];

        foreach ($terms as $t) {
            $wildcards[] = [
                'wildcard' => [
                    $field => '*'.$t.'*',
                ],
            ];
        }

        return $wildcards;
    }

    /**
     * @param string $term
     *
     * @return array
     */
    private function fulltextSearch(string $term): array
    {
        $query = $this->fulltextQuery($term);
        $query['bool']['filter'] = $this->getFilters();
        $query['bool']['must_not'] = [
            'exists' => [
                'field' => 'deletedAt',
            ],
        ];

        return [
            'from' => 0,
            'size' => $this->searchLimit,
            'query' => $query,
        ];
    }

    /**
     * @param string $term
     *
     * @return array
     */
    private function fulltextQuery(string $term): array
    {
        return [
            'bool' => [
                'must' => [
                    [
                        'bool' => [
                            'should' => [
                                [
                                    'match' => [
                                        'name.text' => [
                                            'query' => $term,
                                            'boost' => 2,
                                        ],
                                    ],
                                ],
                                [
                                    'match' => [
                                        'name.suggest' => [
                                            'query' => $term,
                                            'analyzer' => 'standard',
                                        ],
                                    ],
                                ],
                                [
                                    'function_score' => [
                                        'query' => [
                                            'constant_score' => [
                                                'query' => [
                                                    'match' => [
                                                        'name.fullmatch' => [
                                                            'query' => $term,
                                                            'analyzer' => 'fullmatch',
                                                        ],
                                                    ],
                                                ],
                                                'boost' => 200,
                                            ],
                                        ],
                                        'boost_mode' => 'sum',
                                        'field_value_factor' => [
                                            'field' => 'searchBoost',
                                            'missing' => 0,
                                        ],
                                    ],
                                ],
                                [
                                    'function_score' => [
                                        'query' => [
                                            'constant_score' => [
                                                'query' => [
                                                    'match' => [
                                                        'name.wildcard' => [
                                                            'query' => $term,
                                                            'analyzer' => 'wildcard_search',
                                                        ],
                                                    ],
                                                ],
                                                'boost' => 100,
                                            ],
                                        ],
                                        'boost_mode' => 'sum',
                                        'field_value_factor' => [
                                            'field' => 'searchBoost',
                                            'missing' => 0,
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                'should' => [
                    [
                        'match' => [
                            'companyName.text' => [
                                'query' => $term,
                                'boost' => 0.7,
                            ],
                        ],
                    ],
                    [
                        'match' => [
                            'companyName.suggest' => [
                                'query' => $term,
                                'analyzer' => 'standard',
                            ],
                        ],
                    ],
                    [
                        'dis_max' => [
                            'tie_breaker' => 0.7,
                            'boost' => 1.2,
                            'queries' => [
                                [
                                    'match' => [
                                        'address1.suggest' => [
                                            'query' => $term,
                                            'analyzer' => 'standard',
                                        ],
                                    ],
                                ],
                                [
                                    'match' => [
                                        'townCity.suggest' => [
                                            'query' => $term,
                                            'analyzer' => 'standard',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'function_score' => [
                            'query' => [
                                'constant_score' => [
                                    'query' => [
                                        'match' => [
                                            'companyName.fullmatch' => [
                                                'query' => $term,
                                                'analyzer' => 'fullmatch',
                                            ],
                                        ],
                                    ],
                                    'boost' => 100,
                                ],
                            ],
                            'boost_mode' => 'sum',
                            'field_value_factor' => [
                                'field' => 'searchBoost',
                                'missing' => 0,
                            ],
                        ],
                    ],
                    [
                        'constant_score' => [
                            'query' => [
                                'match' => [
                                    'address1.text' => [
                                        'query' => $term,
                                    ],
                                ],
                            ],
                            'boost' => 2,
                        ],
                    ],
                    [
                        'constant_score' => [
                            'query' => [
                                'match' => [
                                    'townCity.text' => [
                                        'query' => $term,
                                    ],
                                ],
                            ],
                            'boost' => 2,
                        ],
                    ],
                    [
                        'constant_score' => [
                            'query' => [
                                'match' => [
                                    'townCity.lower' => [
                                        'query' => $term,
                                        'analyzer' => 'term_suggest',
                                    ],
                                ],
                            ],
                            'boost' => 50, // high score to imitate filtration
                        ],
                    ],
                    [
                        'constant_score' => [
                            'query' => [
                                'match' => [
                                    'county.lower' => [
                                        'query' => $term,
                                        'analyzer' => 'term_suggest',
                                    ],
                                ],
                            ],
                            'boost' => 20,
                        ],
                    ],
                    [
                        'constant_score' => [
                            'query' => [
                                'match' => [
                                    'country.lower' => [
                                        'query' => $term,
                                        'analyzer' => 'standard',
                                    ],
                                ],
                            ],
                            'boost' => 10,
                        ],
                    ],
                    [
                        'constant_score' => [
                            'query' => [
                                'match' => [
                                    'postcode.suggest' => [
                                        'query' => $term,
                                        'analyzer' => 'standard',
                                    ],
                                ],
                            ],
                            'boost' => 2,
                        ],
                    ],
                    [
                        'constant_score' => [
                            'query' => [
                                'match' => [
                                    'postcode' => [
                                        'query' => $term,
                                        'analyzer' => 'standard',
                                    ],
                                ],
                            ],
                            'boost' => 50,
                        ],
                    ],
                ],
            ],
        ];
    }
}
