<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;

class PropertyMarketCountQuery implements QueryInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('rental', 'boolean', [
                '__required' => true,
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
        $query = [
            'from' => 0,
            'size' => 0,
            'query' => (object) [
                'bool' => (object) [
                    'filter' => [ //not an object, defo an array
                        (object) [
                            'bool' => (object) [
                                'must' => [
                                    (object) [
                                        'exists' => (object) ['field' => 'userID'],
                                    ],
                                ],
                            ],
                        ],
                        (object) [
                            'term' => (object) ['status' => Property::STATUS_ACTIVE],
                        ],
                        (object) [
                            'term' => (object) ['rental' => $criteria['rental']],
                        ],
                    ],
                    'must_not' => (object) [
                        'exists' => (object) [
                            'field' => 'deletedAt',
                        ],
                    ],
                ],
            ],
            'aggregations' => (object) [
                'by_country' => (object) [
                    'terms' => (object) ['field' => 'country'],
                ],
            ],
        ];

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
