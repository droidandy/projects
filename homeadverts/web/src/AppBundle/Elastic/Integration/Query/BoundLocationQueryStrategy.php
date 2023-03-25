<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Geo\GeometryServiceInterface;

class BoundLocationQueryStrategy implements LocationQueryStrategyInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('locations', 'locations')
        ;
    }

    /**
     * @param string   $field
     * @param Location $location
     *
     * @return array $wildcards
     */
    public function locationQuery($field, Location $location)
    {
        if ($location->isCountry()) {
            $location = [
                'term' => [
                    'country' => $location->getCountry(),
                ],
            ];
        } else {
            $location = [
                'geo_shape' => [
                    $field => [
                        'shape' => $this->getShapeFromLocation($location),
                    ],
                ],
            ];
        }

        return $location;
    }

    /**
     * @param Location $location
     *
     * @return array|null
     */
    private function getShapeFromLocation(Location $location)
    {
        if (!$shape = $this->getGeometryClause($location)) {
            $shape = $this->getCircleClause($location);
        }

        return $shape;
    }

    /**
     * @param Location $location
     *
     * @return array
     */
    private function getCircleClause(Location $location)
    {
        $dist = $location->getDistance().Location::SEARCH_DISTANCE_UNIT;

        return [
            'type' => 'circle',
            'coordinates' => [(float) $location->getCoords()->getLongitude(), (float) $location->getCoords()->getLatitude()],
            'radius' => $dist,
        ];
    }

    /**
     * @param Location $location
     *
     * @return array|null
     */
    private function getGeometryClause(Location $location)
    {
        if (in_array(strtolower($location->getName()), GeometryServiceInterface::LOCATION_BLACKLIST)) {
            return null;
        }

        if (null === $location->geoJson) {
            return null;
        }

        return [
            'type' => strtolower($location->geoJson['type']),
            'coordinates' => $location->geoJson['coordinates'],
        ];
    }
}
