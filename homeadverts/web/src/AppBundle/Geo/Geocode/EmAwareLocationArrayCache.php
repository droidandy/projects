<?php

namespace AppBundle\Geo\Geocode;

use AppBundle\Entity\Location\GoogleLocation;
use Doctrine\ORM\EntityManager;

class EmAwareLocationArrayCache
{
    const FIRST_TURN_TYPES = [
        'street_address',
        'route',
        'intersection',
        'country',
        'administrative_area_level_1',
        'administrative_area_level_2',
        'administrative_area_level_3',
        'administrative_area_level_4',
        'administrative_area_level_5',
        'colloquial_area',
        'locality',
        'ward',
        'sublocality',
        'sublocality_level_1',
        'sublocality_level_2',
        'sublocality_level_3',
        'sublocality_level_4',
        'sublocality_level_5',
        'neighborhood',
        'premise',
        'subpremise',
        'postal_code',
        'natural_feature',
        'airport',
        'park',
        'point_of_interest',
    ];

    const NON_PURGE_TYPES = [
        'country',
        'administrative_area_level_1',
        'administrative_area_level_2',
        'administrative_area_level_3',
        'locality',
        'postal_code',
    ];

    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var GoogleLocation[]
     */
    private $locationMap;
    /**
     * @var array
     */
    private $typeMap = [];
    /**
     * @var array
     */
    private $refCount = [];

    /**
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
        $this->typeMap['generic_to_be_purged_type'] = [];
    }

    /**
     * @param GoogleLocation $location
     */
    public function add(GoogleLocation $location)
    {
        $placeId = $location->getPlaceId();
        $this->refCount[$placeId] = isset($this->refCount[$placeId])
            ? $this->refCount[$placeId] + 1
            : 1
        ;

        if (isset($this->locationMap[$placeId])) {
            return;
        }

        $this->locationMap[$location->getPlaceId()] = $location;
        $this->typeMap[$this->getLocationType($location)][] = $location->getPlaceId();
    }

    /**
     * @param string $placeId
     *
     * @return bool
     */
    public function has($placeId)
    {
        return isset($this->locationMap[$placeId]);
    }

    /**
     * @param $placeId
     *
     * @return GoogleLocation|null
     */
    public function get($placeId)
    {
        if (!$this->has($placeId)) {
            return null;
        }

        $this->refCount[$placeId] = isset($this->refCount[$placeId])
            ? $this->refCount[$placeId] + 1
            : 1
        ;

        return $this->locationMap[$placeId];
    }

    /**
     * @param GoogleLocation[] $googleLocations
     */
    public function release(array $googleLocations = [])
    {
        foreach ($googleLocations as $googleLocation) {
            $placeId = $googleLocation->getPlaceId();
            if (isset($this->refCount[$placeId])) {
                --$this->refCount[$placeId];
            }
        }
    }

    public function purge()
    {
        foreach ($this->typeMap['generic_to_be_purged_type'] as $placeId) {
            if (isset($this->refCount[$placeId]) && $this->refCount[$placeId] > 0) {
                continue;
            }

            $location = $this->locationMap[$placeId];

            $this->em->detach($location);
            unset($this->locationMap[$placeId]);
        }

        $this->typeMap['generic_to_be_purged_type'] = [];
    }

    public function reset()
    {
        $this->typeMap = [];
        $this->typeMap['generic_to_be_purged_type'] = [];
        $this->locationMap = [];
        $this->refCount = [];
    }

    /**
     * @param GoogleLocation $location
     *
     * @return string
     */
    private function getLocationType(GoogleLocation $location)
    {
        $types = $location->getTypes();

        $nonPurgeTypes = array_intersect($types, self::NON_PURGE_TYPES);
        if (!empty($nonPurgeTypes)) {
            return current($nonPurgeTypes);
        }

        return 'generic_to_be_purged_type';
    }
}
