<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;
use Doctrine\Common\Cache\CacheProvider;
use AppBundle\Entity\Location\FollowedLocation;
use AppBundle\Entity\Location\Location;
use AppBundle\Entity\User\User;

class LocationService
{
    const CACHE_NAMESPACE = 'location';
    const CACHE_TTL = 3600;

    /**
     * @var CacheProvider
     */
    protected $cache;
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @param CacheProvider $cache
     * @param EntityManager $entityManager
     */
    public function __construct(CacheProvider $cache, EntityManager $entityManager)
    {
        $this->cache = $cache;
        $this->em = $entityManager;
    }

    /**
     * @param User     $user
     * @param Location $location
     *
     * @return FollowedLocation
     */
    public function followLocation(User $user, Location $location)
    {
        $followedLocation = new FollowedLocation();
        $followedLocation->setUser($user);
        $followedLocation->setLocation($location);

        $this->em->persist($followedLocation);

        return $followedLocation;
    }

    /**
     * @return int
     */
    public function getTotalLocationsUsingCache()
    {
        $cacheKey = 'location_total';
//        $this->cache->setNamespace(self::CACHE_NAMESPACE);
        $total = $this->cache->fetch($cacheKey);

        if (!$total) {
            $countries = $this
                ->em
                ->getRepository(Location::class)
                ->getCountriesISO2();
            $total = count($countries);

            $this->cache->save($cacheKey, $total, self::CACHE_TTL);
        }

        return $total;
    }
}
