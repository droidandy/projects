<?php

namespace AppBundle\Elastic\Article\Query;

use AppBundle\Elastic\Article\Mapping\ArticleMapping;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Service\User\AdjacencyRegistry;

class ArticleTermQuery implements QueryInterface
{
    /**
     * @var bool
     */
    private $isAutocompleteMode;
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;

    /**
     * @param AdjacencyRegistry $adjacencyRegistry
     * @param bool              $isAutocompleteMode
     */
    public function __construct(AdjacencyRegistry $adjacencyRegistry, $isAutocompleteMode = false)
    {
        $this->adjacencyRegistry = $adjacencyRegistry;
        $this->isAutocompleteMode = $isAutocompleteMode;
    }

    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('user', 'integer')
            ->add('term', 'string', [
                '__required' => false,
                '__validate' => function ($value) {
                    return mb_strlen($value) >= 2;
                },
            ])
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
            ->add('sort', 'sort_bc')
            ->add('published', 'boolean', [
                '__default' => true,
            ])
        ;

        if ($this->isAutocompleteMode) {
            $criteriaBuilder
                ->add('limit', 'pagination', [
                    '__default' => [
                        'from' => 0,
                        'size' => 5,
                    ],
                ])
            ;
        } else {
            $criteriaBuilder
                ->add('limit', 'pagination')
            ;
        }
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
            'query' => [],
        ];

        if (null !== $criteria['term']) {
            $query['query']['bool'] = [
                'should' => [
                    [
                        'multi_match' => [
                            'query' => $criteria['term'],
                            'fields' => ['title', 'subtitle', 'description', 'body', 'tags'],
                        ],
                    ],
                    [
                        'term' => [
                            'token' => $criteria['term'],
                        ],
                    ],
                    [
                        'term' => [
                            'slug' => $criteria['term'],
                        ],
                    ],
                    [
                        'term' => [
                            'author.name' => $criteria['term'],
                        ],
                    ],
                    [
                        'term' => [
                            'author.companyName' => $criteria['term'],
                        ],
                    ],
                ],
                'minimum_should_match' => 1,
            ];
        }

        $filters = [];

        if (null !== $criteria['published']) {
            $filters[] = [
                'term' => [
                    'published' => $criteria['published'],
                ],
            ];
        }

        if ($criteria['user']) {
            $userId = $criteria['user'];
            $ids = array_merge([$userId], $this->adjacencyRegistry->getUnsharedChildIds($userId));

            $filters[] = [
                'bool' => [
                    'should' => [
                        [
                            'terms' => [
                                'author.id' => $ids,
                            ],
                        ],
                        [
                            'terms' => [
                                'assignee.id' => $ids,
                            ],
                        ],
                    ],
                ],
            ];
        }

        if ($criteria['since']) {
            $filters[] = [
                'range' => [
                    'publishedAt' => [
                        'gte' => $criteria['since']->format('c'),
                    ],
                ],
            ];
        }

        if ($filters) {
            $query['query']['bool']['filter'] = $filters;
        }

        if ($criteria['sort']) {
            $query['sort'] = [
                [
                    key($criteria['sort']) => current($criteria['sort']),
                ],
            ];
        }

        return $requestFactory->createRequest($query, $this->getTypes());
    }

    /**
     * @return array|string
     */
    public function getTypes()
    {
        return ArticleMapping::TYPE;
    }
}
