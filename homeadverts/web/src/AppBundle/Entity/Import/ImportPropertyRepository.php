<?php

namespace AppBundle\Entity\Import;

use Doctrine\ORM\EntityRepository;

class ImportPropertyRepository extends EntityRepository
{
    public function findUnprocessedProperties()
    {
        return $this->_em
            ->createQueryBuilder()
            ->select('ip')
            ->from(ImportProperty::class, 'ip')
            ->where('ip.errors != :errors')->setParameter('errors','[]')
            ->getQuery()
            ->getResult()
        ;

    }

}
