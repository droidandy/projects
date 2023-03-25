<?php

namespace AppBundle\Elastic\User\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Property\Query\BoundLocationQueryStrategy;
use AppBundle\Elastic\Property\Query\LocationQueryStrategyInterface;
use AppBundle\Elastic\Property\Query\PlaceIdLocationQueryStrategy;
use AppBundle\Service\User\AdjacencyRegistry;
use AppBundle\Elastic\User\Mapping\UserMapping;

class UserLocationQuery implements QueryInterface
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
     * @var string
     */
    private $userType;

    /**
     * @param AdjacencyRegistry $adjacencyRegistry
     * @param string            $strategy
     * @param string            $userType
     */
    public function __construct(AdjacencyRegistry $adjacencyRegistry, $strategy = 'place_id', $userType = 'user')
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
        $this->userType = $userType;
    }

    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('user', 'integer')
            ->add('language', 'language')
            ->add('with_properties', 'boolean', [
                '__default' => false,
            ])
            ->add('sort', 'sort_bc')
            ->add('limit', 'pagination')
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

        $filters = [];
        if ($criteria['user']) {
            $ids = $this->adjacencyRegistry->getAllChildIds($criteria['user']);

            $filters[] = [
                'ids' => [
                    'values' => $ids,
                ],
            ];
        }

        if ($criteria['location']) {
            $filters = array_merge($filters, $this->strategy->getLocationFilters($criteria['location']));
        }

        if ($criteria['language']) {
            $filters[] = [
                'bool' => [
                    'should' => [
                        [
                            'term' => ['spokenLanguages' => $criteria['language']],
                        ],
                        [
                            'term' => ['primaryLanguage' => $criteria['language']],
                        ],
                    ],
                ],
            ];
        }

        if ($criteria['with_properties']) {
            $filters[] = ['range' => [
                'propertyCount' => ['gt' => 0],
            ]];
        }

        if ('all' !== $this->userType) {
            $filters[] = [
                'term' => [
                    'type' => $this->userType,
                ],
            ];
        }

        $query['query'] = [
            'bool' => [
                'filter' => $filters,
                'must_not' => [
                    'exists' => [
                        'field' => 'deletedAt',
                    ],
                ],
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
                $query['sort'] = [
                    [
                        key($criteria['sort']) => current($criteria['sort']),
                    ],
                ];
            }
        }

        return $requestFactory->createRequest($query, $this->getTypes());
    }

    /**
     * @return string
     */
    public function getTypes()
    {
        return UserMapping::TYPE;
    }
}
