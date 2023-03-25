<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;
use AppBundle\Elastic\Integration\Query\RequestInterface;

class PropertyByCountryCountQuery implements QueryInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('market', 'market')
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
            'query' => [
                'bool' => [
                    'filter' => [
                        [
                            'exists' => ['field' => 'userID'],
                        ],
                        [
                            'term' => ['status' => Property::STATUS_ACTIVE],
                        ],
                    ],
                    'must_not' => [
                        'exists' => [
                            'field' => 'deletedAt',
                        ],
                    ],
                ],
            ],
            'aggregations' => [
                'by_country' => [
                    'terms' => ['field' => 'country'],
                ],
            ],
        ];

        if (Property::MARKET_ALL !== $criteria['market']) {
            $query['query']['bool']['filter'][] = [
                'term' => [
                    'rental' => Property::MARKET_RENTAL === $criteria['market'],
                ],
            ];
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
