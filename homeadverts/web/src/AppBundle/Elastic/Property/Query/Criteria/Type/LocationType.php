<?php

namespace AppBundle\Elastic\Property\Query\Criteria\Type;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;
use AppBundle\Geo\GeometryServiceInterface;
use AppBundle\Search\NullLocation;
use Doctrine\ORM\EntityRepository;

class LocationType extends TypeTemplate
{
    /**
     * @var EntityRepository
     */
    private $locationRepo;
    /**
     * @var GeometryServiceInterface
     */
    private $geometryService;

    /**
     * LocationType constructor.
     *
     * @param EntityRepository         $locationRepo
     * @param GeometryServiceInterface $geometryService
     */
    public function __construct(EntityRepository $locationRepo, GeometryServiceInterface $geometryService)
    {
        $this->locationRepo = $locationRepo;
        $this->geometryService = $geometryService;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'location';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__default' => null,
            '__required' => false,
            '__normalize' => function ($value) {
                if (!$value instanceof Location) {
                    $value = $this->locationRepo->find($value);

                    if (!$value) {
                        return null;
                    }
                }

                if ($value instanceof NullLocation) {
                    return null;
                }

                $location['country'] = $value->getCountry();
                $location['isCountry'] = $value->isCountry();
                $location['locality'] = null;

                $geoJson = $this->geometryService->getGeometry($value);
                if ($geoJson) {
                    $location['shapeType'] = strtolower($geoJson['type']);
                    $location['coordinates'] = $geoJson['coordinates'];
                } elseif (!$value->isCountry()) {
                    $location['lat'] = $value->getCoords()->getLatitude();
                    $location['lng'] = $value->getCoords()->getLongitude();
                    $location['shapeType'] = 'circle';
                    $location['coordinates'] = [(float) $value->getCoords()->getLongitude(), (float) $value->getCoords()->getLatitude()];
                    $location['distance'] = $value->getDistance();
                    $location['bounds'] = $value->getArea();
                    $location['customDistance'] = 0;

                    // Try and do a text search of the surrounding area
                    if ($value->isSearchForLocalityOrSmaller()) {
                        $location['locality'] = $value->getLocality();
                    }
                }

                return $location;
            },
        ];
    }
}
