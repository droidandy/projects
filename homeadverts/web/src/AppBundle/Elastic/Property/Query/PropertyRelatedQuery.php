<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;

class PropertyRelatedQuery implements QueryInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('property', 'property', [
                '__required' => true,
            ])
            ->add('limit', 'fromto', [
                '__default' => [
                    'from' => 0,
                    'to' => 6,
                ],
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
        /** @var Property $property */
        $property = $criteria['property'];
        $address = $property->getAddress();

        $query = [
            'from' => $criteria['limit']['from'],
            'size' => $criteria['limit']['to'] - $criteria['limit']['from'],
            'query' => [
                'bool' => [
                    'must_not' => [
                        [
                            'term' => [
                                '_id' => $property->getId(),
                            ],
                        ],
                        [
                            'exists' => [
                                'field' => 'deletedAt',
                            ],
                        ],
                    ],
                    'must' => [
                        'geo_distance' => [
                            'point' => [
                                'lat' => $address->getLatitude(),
                                'lon' => $address->getLongitude(),
                            ],
                            'distance' => '100km',
                        ],
                    ],
                ],
            ],
            'sort' => [
                '_geo_distance' => [
                    'point' => [
                        'lat' => $address->getLatitude(),
                        'lon' => $address->getLongitude(),
                    ],
                    'order' => 'asc',
                    'unit' => 'km',
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
