<?php

namespace AppBundle\Entity\Location;

use Doctrine\ORM\EntityRepository;

class GoogleLocationRepository extends EntityRepository
{
    public function findByHierarchies(array $hierarchies = [])
    {
        return $this
            ->_em
            ->createQuery('SELECT l FROM AppBundle:Location\GoogleLocation WHERE path IN (:paths)')
            ->setParameter('paths', $this->buildPaths($hierarchies))
            ->getResult()
        ;
    }

    private function buildPaths(array $hierarchies)
    {
        $paths = [];
        foreach ($hierarchies as $hierarchy) {
            $paths[] = join(', ', $hierarchy);
        }

        return $paths;
    }
}
