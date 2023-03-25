<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Location\LocationRepo;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;

class PropertySimpleSearchQuery implements QueryInterface
{
    const AVAILABLE_SEARCH_FIELDS = [
        'id',
        'mls',
        'sourceRef',
        'sourceGuid',
        'zip',
    ];
    const SEARCH_SORT = 'asc';
    const SEARCH_LIMIT = 1;
    /**
     * @var string
     */
    private $field;

    /**
     * PropertySimpleSearchQuery constructor.
     *
     * @param string $field
     */
    public function __construct($field)
    {
        if (!in_array($field, self::AVAILABLE_SEARCH_FIELDS)) {
            $this->throwInvalidArgumentException($field);
        }

        $this->field = $field;
    }

    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('term', 'string', [
                '__required' => true,
                '__validate' => function ($value) {
                    return mb_strlen($value) >= LocationRepo::TERM_MIN_LENGTH;
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
        switch ($this->field) {
            case 'id':
                $query = $this->searchById($criteria['term']);
                break;
            case 'mls':
                $query = $this->searchByField('mlsRef', $criteria['term']);
                break;
            case 'sourceRef':
                $query = $this->searchByField('sourceRef', $criteria['term']);
                break;
            case 'sourceGuid':
                $query = $this->searchByField('sourceGuid', $criteria['term']);
                break;
            case 'zip':
                $query = $this->searchByField('zip', $criteria['term']);
                break;
            default:
                $this->throwInvalidArgumentException($this->field);
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

    /**
     * @param string $term
     *
     * @return array
     */
    private function searchById($term)
    {
        return [
            'query' => [
                'constant_score' => [
                    'filter' => [
                        'bool' => [
                            'filter' => [
                                'ids' => [
                                    'values' => [$term],
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
        ];
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
            'size' => self::SEARCH_LIMIT,
            'query' => [
                'constant_score' => [
                    'filter' => [
                        'bool' => [
                            'must' => $this->wildcardQuery($field, $term),
                            'filter' => [
                                [
                                    'term' => [
                                        'status' => Property::STATUS_ACTIVE,
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
     * @param mixed $value
     *
     * @throws \InvalidArgumentException
     */
    private function throwInvalidArgumentException($value)
    {
        throw new \InvalidArgumentException(
            sprintf(
                'Field should be of value "%s". "%s" provided',
                implode('", "', self::AVAILABLE_SEARCH_FIELDS),
                $value
            )
        );
    }
}
