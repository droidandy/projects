<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;

class BoundLocationQueryStrategy implements LocationQueryStrategyInterface
{
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('location', 'location')
        ;
    }

    public function getLocationFilters($location)
    {
        $filters = [];
        if ($location['country']) {
            $filters[] = ['term' => [
                'country' => $location['country'],
            ]];
        }

        if (!$location['isCountry']) {
            if (!isset($location['shapeType'])) {
                // nothing to do
            } elseif ('circle' == $location['shapeType']) {
                $filters[] = [
                    'geo_shape' => [
                        'location' => [
                            'shape' => [
                                'type' => $location['shapeType'],
                                'coordinates' => $location['coordinates'],
                                'radius' => ($location['distance'] + $location['customDistance'])
                                            .Location::SEARCH_DISTANCE_UNIT,
                            ],
                        ],
                    ],
                ];
            } else {
                $filters[] = [
                    'geo_shape' => [
                        'location' => [
                            'shape' => [
                                'type' => $location['shapeType'],
                                'coordinates' => $location['coordinates'],
                            ],
                        ],
                    ],
                ];
            }
        }

        return $filters;
    }
}
