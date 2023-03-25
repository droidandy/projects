<?php

namespace AppBundle\Entity\Location;

use Doctrine\ORM\EntityRepository;

class LocationRepository extends EntityRepository
{
    /**
     * @param int $offset
     * @param int $limit
     *
     * @return mixed
     */
    public function getCountriesISO2()
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('l.country')
            ->from('AppBundle\Entity\Location\Location', 'l')
            ->where('l.country IS NOT NULL')
            ->groupBy('l.country')
            ->getQuery()
            ->getScalarResult()
        ;
    }
}
