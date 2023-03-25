<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Service\User\AdjacencyRegistry;

class PropertyLocationQuery implements QueryInterface
{
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;
    /**
     * @var LocationQueryStrategyInterface
     */
    private $strategy;

    /**
     * @param string $strategy
     */
    public function __construct(AdjacencyRegistry $adjacencyRegistry, $strategy = 'place_id')
    {
        switch ($strategy) {
            case 'bound':
                $this->strategy = new BoundLocationQueryStrategy(); break;
            case 'place_id':
                $this->strategy = new PlaceIdLocationQueryStrategy(); break;
            default:
                throw new \InvalidArgumentException(sprintf(
                    'Only "bound" and "place_id" strategies supported. "%s" given',
                    $strategy
                ));
        }

        $this->adjacencyRegistry = $adjacencyRegistry;
    }

    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('type', 'property_type')
            ->add('market', 'market')
            ->add('user', 'integer')
            ->add('status', 'property_status')
            ->add('media', 'option', [
                'options' => Property::getMediaTypes(),
            ])
            ->add('bedrooms', 'integer', [
                '__validate' => function ($value) {
                    return $value > 0;
                },
            ])
            ->add('bathrooms', 'integer', [
                '__validate' => function ($value) {
                    return $value > 0;
                },
            ])
            ->add('price', 'price')
            ->add('featured', 'boolean', [
                '__default' => false,
            ])
            ->add('ids', function () {
                return [
                    '__default' => null,
                    '__required' => false,
                ];
            })
            ->add('sort', 'sort_bc')
            ->add('period', 'string')
            ->add('distance', 'distance')
            ->add('since', 'date', [
                '__normalize' => function ($value) {
                    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
                        $dateAdded = new \DateTime($value);
                    }

                    $since = isset($dateAdded) && $dateAdded instanceof \DateTime
                        ? $dateAdded
                        // The hrs is not valid and throws an exception
                        : new \DateTime('-'.str_replace('hrs', 'hours', $value))
                    ;

                    return $since;
                },
            ])
            ->add('limit', 'pagination')
            ->add('aggregations', function () {
                return [
                    '__default' => [
                        'min_price' => ['min' => ['field' => 'basePrice']],
                        'max_price' => ['max' => ['field' => 'basePrice']],
                        'avg_price' => ['avg' => ['field' => 'basePrice']],
                    ],
                    '__required' => false,
                ];
            })
        ;

        $this
            ->strategy
            ->configureCriteria($criteriaBuilder)
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
        $query = [
            'from' => $criteria['limit']['from'],
            'size' => $criteria['limit']['size'],
        ];

        $ranges = [];

        if ($criteria['bedrooms']) {
            $ranges[]['range']['bedrooms']['gte'] = $criteria['bedrooms'];
        }

        if ($criteria['bathrooms']) {
            $ranges[]['range']['bathrooms']['gte'] = $criteria['bathrooms'];
        }

        if ($criteria['since'] instanceof \DateTime && $criteria['since']->getTimestamp() > 0) {
            $ranges[]['range']['dateAdded']['gte'] = $criteria['since']->format('c');
        }

        if ($criteria['price']['from'] || $criteria['price']['to']) {
            $range = [];
            if ($criteria['price']['from']) {
                $range['gte'] = $criteria['price']['from'];
            }
            if ($criteria['price']['to']) {
                $range['lte'] = $criteria['price']['to'];
            }
            $ranges[]['range']['basePrice'] = $range;
        }

        $terms = [];

        //if the requested market is all, then dont add this bit at all
        if (Property::MARKET_ALL !== $criteria['market']) {
            $terms[] = ['term' => [
                'rental' => 'to-rent' === $criteria['market'],
            ]];
        }

        if ($criteria['user']) {
            $userId = (string) $criteria['user'];

//            $terms[] = ['term' => [
//                'userID' => (string) $criteria['user'],
//            ]];

            $ids = array_merge([$userId], $this->adjacencyRegistry->getAllChildIds($criteria['user']));
//            $terms[] = ['terms' => [
//                'companyId.id' => $ids,
//            ]];

            $terms[] = [
                'bool' => [
                    'should' => [
                        [
                            'term' => [
                                'userID' => (string) $criteria['user'],
                            ],
                        ],
                        [
                            'terms' => [
                                'companyId.id' => $ids,
                            ],
                        ],
                    ],
                ],
            ];
        }

        if ($criteria['status']) {
            $terms[] = ['term' => [
                'status' => (int) $criteria['status'],
            ]];
        }

        if ($criteria['period']) {
            $terms[] = ['term' => [
                'period' => $criteria['period'],
            ]];
        }

        if (is_array($criteria['type'])) {
            $terms[] = ['terms' => [
                'type' => array_map(function ($term) {
                    return (int) $term;
                }, $criteria['type']),
            ]];
        } elseif ($criteria['type']) {
            $terms[] = ['term' => [
                'type' => (int) $criteria['type'],
            ]];
        }

        if ($criteria['featured']) {
            $terms[] = [
                'term' => [
                    'featured' => $criteria['featured'],
                ], ];
        }

        if ($criteria['ids']) {
            $terms[] = [
                'ids' => [
                    'values' => $criteria['ids'],
                ],
            ];
        }

        $filters = [];

        if ($criteria['location']) {
            $location = $criteria['location'];

            $filters = array_merge($filters, $this->strategy->getLocationFilters($location));

            if ($location['locality']) {
                $results = [];
                $fields = ['address1', 'neighbourhood', 'townCity'];

                foreach ($fields as $field) {
                    $results[] = [
                        'regexp' => [
                            $field => [
                                'value' => '.*'.preg_quote(strtolower($location['locality'])).'.*',
                            ],
                        ],
                    ];
                }

                $query['query']['bool']['should'] = $results;
            }
        }

        $mustFilters = array_merge(
            $ranges,
            $terms,
            $filters
        );

        if (Property::MEDIA_VIDEO == $criteria['media']) {
            $mustFilters[] = [
                'exists' => [
                    'field' => 'videos',
                ],
            ];
        } elseif (Property::MEDIA_3D == $criteria['media']) {
            $mustFilters[] = [
                'exists' => [
                    'field' => 'videos3d',
                ],
            ];
        }

        if ($mustFilters) {
            $query['query']['bool']['filter'] = $mustFilters;
        }
        $query['query']['bool']['must_not'] = [
            'exists' => [
                'field' => 'deletedAt',
            ],
        ];

        if ($criteria['sort']) {
            if (isset($criteria['sort']['random']) && $criteria['sort']['random']) {
                $query['query'] = [
                    'function_score' => [
                        'query' => $query['query'],
                        'random_score' => [
                            'seed' => $criteria['sort']['seed'],
                        ],
                    ],
                ];
            } else {
                if ('price' == key($criteria['sort'])) {
                    $criteria['sort'] = [
                        'basePrice' => $criteria['sort']['price'],
                    ];
                }
                $query['sort'] = [
                    [
                        key($criteria['sort']) => current($criteria['sort']),
                    ],
                ];
            }
        }

        if ($criteria['aggregations']) {
            $query['aggregations'] = $criteria['aggregations'];
        }

        return $requestFactory->createRequest($query, $this->getTypes());
    }

    /**
     * @return string
     */
    public function getTypes()
    {
        return PropertyMapping::TYPE;
    }
}
