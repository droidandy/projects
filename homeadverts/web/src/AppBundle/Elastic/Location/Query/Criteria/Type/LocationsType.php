<?php

namespace AppBundle\Elastic\Location\Query\Criteria\Type;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;
use AppBundle\Geo\GeometryServiceInterface;

class LocationsType extends TypeTemplate
{
    /**
     * @var GeometryServiceInterface
     */
    private $geometryService;

    /**
     * LocationsType constructor.
     *
     * @param GeometryServiceInterface $geometryService
     */
    public function __construct(GeometryServiceInterface $geometryService)
    {
        $this->geometryService = $geometryService;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'locations';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__normalize' => function ($value) {
                foreach ($value as $location) {
                    $location->geoJson = $this->geometryService->getGeometry($location);
                }

                return $value;
            },
            '__validate' => function ($value) {
                return is_array($value) && array_reduce(
                        $value,
                        function ($carry, $item) {
                            return $carry && $item instanceof Location;
                        },
                        true
                )
                    ;
            },
        ];
    }
}
