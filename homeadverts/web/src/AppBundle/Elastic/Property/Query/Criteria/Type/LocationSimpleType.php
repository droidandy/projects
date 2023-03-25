<?php

namespace AppBundle\Elastic\Property\Query\Criteria\Type;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;
use AppBundle\Search\NullLocation;
use Doctrine\ORM\EntityRepository;

class LocationSimpleType extends TypeTemplate
{
    /**
     * @var EntityRepository
     */
    private $locationRepo;

    /**
     * LocationType constructor.
     *
     * @param EntityRepository $locationRepo
     */
    public function __construct(EntityRepository $locationRepo)
    {
        $this->locationRepo = $locationRepo;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'location_simple';
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
                $location['placeId'] = $value->getPlaceId();

                $location['locality'] = null;

                if (!$value->isCountry()) {
                    $location['lat'] = $value->getCoords()->getLatitude();
                    $location['lng'] = $value->getCoords()->getLongitude();
                    $location['shapeType'] = 'circle';
                    $location['coordinates'] = [
                        (float) $value->getCoords()->getLongitude(),
                        (float) $value->getCoords()->getLatitude(),
                    ];
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
