<?php

namespace AppBundle\Entity\Import;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\User\User;
use Doctrine\ORM\EntityRepository;
use Google\Cloud\Language\V1\PartOfSpeech\Proper;
use Google\Type\Date;

class ImportLedgerRepository extends EntityRepository
{
    /**
     * @param string $type
     */
    public function removeByType(string $type)
    {
        $this->_em
            ->createQueryBuilder()
            ->delete(ImportLedger::class, 'l')
            ->where('l.type = :type')->setParameter('type', $type)
            ->getQuery()
            ->execute();
    }

    public function removeAll()
    {
        $this->_em
            ->createQueryBuilder()
            ->delete(ImportLedger::class, 'l')
            ->getQuery()
            ->execute();
    }

    /**
     * @param string $type
     *
     * @return mixed
     *
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getTotalByType(string $type)
    {
        return $this->_em
            ->createQueryBuilder()
            ->select('COUNT(l.id)')
            ->from(ImportLedger::class, 'l')
            ->where('l.type = :type')->setParameter('type', $type)
            ->getQuery()
            ->getSingleResult();
    }

    /**
     * @return \DateTime|null
     */
    public function getSyncDate()
    {
        $date = $this->findOneBy(
            [],
            ['createdAt' => 'DESC']
        );

        if ($date) {
            return $date;
        }
    }

    /**
     * @return mixed
     *
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getMissingPropertiesRefIds()
    {
        $qb = $this->_em->createQueryBuilder();
        $refIds = $this->_em
            ->createQueryBuilder()
            ->select('p.sourceGuid')
            ->from(Property::class, 'p')
            ->getQuery()
            ->getDQL();

        return $this->_em
            ->createQueryBuilder()
            ->select('l.refId')
            ->from(ImportLedger::class, 'l')
            ->where($qb->expr()->notIn('l.refId', $refIds))
            ->andWhere('l.type = :type')->setParameter('type', 'property')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return mixed
     */
    public function getOutdatedProperties()
    {
        $qb = $this->_em->createQueryBuilder();

        $refIds = $this->_em
            ->createQueryBuilder()
            ->select('l.refId')
            ->from(ImportLedger::class, 'l')
            ->andWhere('l.type = :type')
            ->getQuery()
            ->getDQL();

        return $qb
            ->select('p.id')
            ->from(Property::class, 'p')
            ->where($qb->expr()->notIn('p.sourceGuid', $refIds))
            ->setParameter('type', 'property')
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param string $type
     *
     * @return array
     */
    public function getMissingUserRefIds(string $type)
    {
        $qb = $this->_em->createQueryBuilder();
        $refIds = $this->_em
            ->createQueryBuilder()
            ->select('l.refId')
            ->from(ImportLedger::class, 'l')
            ->andWhere('l.type = :type')
            ->getQuery()
            ->getDQL();

        $refIdsNested = $this->_em
            ->createQueryBuilder()
            ->select('u.sourceRef')
            ->from(User::class, 'u')
            ->where($qb->expr()->in('u.sourceRef', $refIds))
            ->setParameter('type', $type)
            ->getQuery()
            ->getDQL();

        return $this->_em
            ->createQueryBuilder()
            ->select('ledger.refId')
            ->from(ImportLedger::class, 'ledger')
            ->where($qb->expr()->notIn('ledger.refId', $refIdsNested))
            ->andWhere('ledger.type = :type')->setParameter('type', $type)
            ->getQuery()
            ->getResult();
    }
}
