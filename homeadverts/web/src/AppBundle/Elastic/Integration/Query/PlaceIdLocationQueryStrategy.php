<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;

class PlaceIdLocationQueryStrategy implements LocationQueryStrategyInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('locations', 'locations_simple')
        ;
    }

    /**
     * @param string   $field
     * @param Location $location
     *
     * @return array
     */
    public function locationQuery($field, Location $location)
    {
        if ($location->isCountry()) {
            $field = 'country';
            $term = $location->getCountry();
        } else {
            $term = $location->getPlaceId();
        }

        return [
            'term' => [
                $field => $term,
            ],
        ];
    }
}
