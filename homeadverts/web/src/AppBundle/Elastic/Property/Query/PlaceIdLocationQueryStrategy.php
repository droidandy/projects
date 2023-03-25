<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;

class PlaceIdLocationQueryStrategy implements LocationQueryStrategyInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('location', 'location_simple')
        ;
    }

    /**
     * @param array $location
     *
     * @return array
     */
    public function getLocationFilters($location)
    {
        if ($location['isCountry']) {
            $field = 'country';
            $term = $location['country'];
        } else {
            $field = 'googleLocations.placeId';
            $term = $location['placeId'];
        }

        return [
            [
                'term' => [
                    $field => $term,
                ],
            ],
        ];
    }
}
