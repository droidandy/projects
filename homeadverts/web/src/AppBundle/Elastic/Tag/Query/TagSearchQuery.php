<?php

namespace AppBundle\Elastic\Tag\Query;

use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Tag\Mapping\TagMapping;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;

class TagSearchQuery implements QueryInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('term', 'string', [
                '__required' => true,
                '__validate' => function ($value) {
                    return mb_strlen($value) >= 3;
                },
            ])
            ->add('filters', 'array')
            ->add('limit', 'fromto')
            ->add('sort', 'sort')
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
            'size' => $criteria['limit']['to'] - $criteria['limit']['from'],
        ];

        if ($criteria['term']) {
            $query['query']['bool']['must'] = [
                'bool' => [
                    'should' => [
                        [
                            'prefix' => [
                                'name' => $criteria['term'],
                            ],
                        ],
                        [
                            'match' => [
                                'displayName' => $criteria['term'],
                            ],
                        ],
                    ],
                ],
            ];
            $query['sort'][] = '_score';
        }

        if ($criteria['filters']) {
            foreach (['id', 'name', 'companyName'] as $field) {
                if (isset($criteria['filters']['user'][$field])) {
                    $query['query']['bool']['filter'][] = [
                        'term' => [
                            'user.'.$field => $criteria['filters']['user'][$field],
                        ],
                    ];
                }
            }
            if (isset($criteria['filters']['private'])) {
                $query['query']['bool']['filter'][] = [
                    'term' => [
                        'private' => (bool) $criteria['filters']['private'],
                    ],
                ];
            }
        }

        if ($criteria['sort']) {
            if (empty($criteria['sort']['random'])) {
                foreach (['createdAt' => 'createdAt', 'displayName' => 'displayName.raw'] as $filterField => $esField) {
                    if (isset($criteria['sort'][$filterField])) {
                        $query['sort'][] = [
                            $esField => $criteria['sort'][$filterField],
                        ];
                    }
                }
            } else {
                unset($query['sort']);
                if (empty($query['query'])) {
                    $query['query']['match_all'] = (object) [];
                }
                $query['query'] = [
                    'function_score' => [
                        'query' => $query['query'],
                        'random_score' => [
                            'seed' => $criteria['sort']['seed'],
                        ],
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
        return TagMapping::TYPE;
    }
}
