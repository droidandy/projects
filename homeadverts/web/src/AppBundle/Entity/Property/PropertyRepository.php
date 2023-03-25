<?php

namespace AppBundle\Entity\Property;

use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Elastic\Integration\Mapping\PopulateESInterface;
use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\User\User;

class PropertyRepository extends EntityRepository implements PopulateESInterface
{
    /**
     * @return Property[]
     */
    public function getSinglePropertyPerUser()
    {
        $propertyIds = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                <<<SQL
                SELECT p.id
                FROM user u
                INNER JOIN property p ON p.id = (
                         SELECT  property.id 
                         FROM    property
                         WHERE   property.user = u.id
                         AND property.status = 100
                         LIMIT 1
                )
SQL
            )
            ->fetchAll(\PDO::FETCH_ASSOC);

        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('p')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->where('p.id IN (:ids)')->setParameter('ids', $propertyIds)
            ->andWhere('p.primaryPhoto IS NOT NULL')
            ->getQuery()
            ->execute();
    }

    /**
     * @param User $user
     * @param int $availability
     * @param int $offset
     * @param int $limit
     * @return mixed
     */
    public function getPropertiesForUser(User $user, int $availability, int $offset, int $limit)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('p')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->where('p.user = :user')->setParameter('user', $user)
            ->andWhere('p.status = :status')->setParameter('status', $availability)
            ->orderBy('p.dateAdded', 'DESC')
            ->getQuery()
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->execute();
    }

    /**
     * @param array $propertyIds
     *
     * @return array
     */
    public function getPropertiesWithLikesQty(array $propertyIds)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('p as property, COUNT(l.id) as likesCount')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->leftJoin('p.likes', 'l')
            ->where('p.id IN (:ids)')->setParameter('ids', $propertyIds)
            ->andWhere('p.primaryPhoto IS NOT NULL')
            ->groupBy('p.id')
            ->getQuery()
            ->execute();
    }

    /**
     * @return array
     */
    public function getIncompleteAndInactive()
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('p.sourceGuid, p.dateUpdated')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->where('p.status = 0')
            ->orWhere('p.status = -10')
            ->getQuery()
            ->execute();
    }

    /**
     * @param array $userIds
     *
     * @return mixed
     */
    public function getPublishedForUsers(array $userIds)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('p')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->where('p.status = :status')->setParameter('status', Property::STATUS_ACTIVE)
            ->andWhere('p.user IN (:userIds)')->setParameter('userIds', $userIds)
            ->andWhere('p.primaryPhoto IS NOT NULL')
            ->orderBy('p.dateAdded', 'DESC')
            ->setMaxResults(1000)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param int $offset
     * @param int $limit
     *
     * @return mixed
     */
    public function getTotalPublished()
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(p)')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->where('p.status = :status')->setParameter('status', Property::STATUS_ACTIVE)
            ->andWhere('p.primaryPhoto IS NOT NULL')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * @param int $offset
     * @param int $limit
     *
     * @return mixed
     */
    public function getFeatured($offset, $limit)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('p')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->where('p.featured IS NOT NULL')
            ->andWhere('p.primaryPhoto IS NOT NULL')
            ->orderBy('p.featured', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->execute();
    }

    public function getEntitiesForDocTotal()
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(p.id)')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->where('p.user IS NOT NULL')
            ->andWhere('p.primaryPhoto IS NOT NULL')
            ->andWhere('p.status = 100')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getEntities()
    {
        $propertyIterable = $this
            ->_em
            ->createQueryBuilder()
            ->select('p')
            ->from('AppBundle\Entity\Property\Property', 'p')
            ->where('p.user IS NOT NULL')
            ->andWhere('p.primaryPhoto IS NOT NULL')
            ->andWhere('p.status = 100')
            ->getQuery()
            ->iterate();

        return $propertyIterable;
    }

    public function getTotal()
    {
        return $this
            ->_em
            ->createQuery('SELECT count(p) FROM AppBundle:Property\Property p')
            ->getSingleScalarResult();
    }

    public function getIterable($from = null, $step = null)
    {
        $query = $this
            ->_em
            ->createQuery('SELECT p FROM AppBundle:Property\Property p');
        if ($from) {
            $query->setFirstResult($from);
        }
        if ($step) {
            $query->setMaxResults($step);
        }

        return $query->iterate();
    }

    public function getTotalToProcess()
    {
        return $this
            ->_em
            ->createQuery('SELECT count(p) FROM AppBundle:Property\Property p WHERE p.googleLocationsStatus = :status')
            ->setParameter('status', GoogleLocation::STATUS_UNPROCESSED)
            ->getSingleScalarResult();
    }

    public function getIterableToProcess()
    {
        $query = $this
            ->_em
            ->createQuery('SELECT p FROM AppBundle:Property\Property p WHERE p.googleLocationsStatus = :status')
            ->setParameter('status', GoogleLocation::STATUS_UNPROCESSED);

        return $query->iterate();
    }

    public function getAvailabilitySummary()
    {
        $counts = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                <<<SQL
                SELECT
                    availability, COUNT(*)
                FROM
                    property 
                WHERE 
                    status = 100
                GROUP BY
                    availability
SQL
            )
            ->fetchAll(\PDO::FETCH_KEY_PAIR);

        $counts = [
            Property::AVAILABILITY_FOR_SALE => isset($counts[Property::AVAILABILITY_FOR_SALE]) ? $counts[Property::AVAILABILITY_FOR_SALE] : 0,
            Property::AVAILABILITY_TO_RENT => isset($counts[Property::AVAILABILITY_TO_RENT]) ? $counts[Property::AVAILABILITY_TO_RENT] : 0,
        ];

        return $counts;
    }

    public function getSummary()
    {
        $counts = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                <<<SQL
                SELECT
                    status, COUNT(*)
                FROM
                    property
                GROUP BY
                    status
SQL
            )
            ->fetchAll(\PDO::FETCH_KEY_PAIR);

        $counts = [
            Property::STATUS_ACTIVE => isset($counts[Property::STATUS_ACTIVE]) ? $counts[Property::STATUS_ACTIVE] : 0,
            Property::STATUS_INACTIVE => isset($counts[Property::STATUS_INACTIVE]) ? $counts[Property::STATUS_INACTIVE] : 0,
            Property::STATUS_INCOMPLETE => isset($counts[Property::STATUS_INCOMPLETE]) ? $counts[Property::STATUS_INCOMPLETE] : 0,
            Property::STATUS_INVALID => isset($counts[Property::STATUS_INVALID]) ? $counts[Property::STATUS_INVALID] : 0,
            Property::STATUS_DELETED => isset($counts[Property::STATUS_DELETED]) ? $counts[Property::STATUS_DELETED] : 0,
        ];

        return $counts;
    }

    public function getAllGuids()
    {
        $refToIdMap = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                <<<SQL
                SELECT p.sourceGuid, p.id 
                    FROM property p
                    WHERE p.source = 'sothebys'
SQL
            )
            ->fetchAll(\PDO::FETCH_KEY_PAIR);

        return [$refToIdMap, array_flip($refToIdMap)];
    }

    /**
     * @param User $user
     *
     * @return Property[]
     */
    public function getUnresolvedPropertiesForUser(User $user)
    {
        return $this
            ->_em
            ->createQuery(
                'SELECT p 
                    FROM AppBundle:Property\Property p 
                    WHERE p.user IS NULL AND p.userSourceRef = :ref AND p.userSourceRefType = :ref_type'
            )
            ->setParameters([
                'ref' => $user->sourceRef,
                'ref_type' => $user->sourceRefType,
            ])
            ->getResult();
    }

    /**
     * @param User $user
     *
     * @return Property[]
     */
    public function getUnresolvedPropertiesForCompany(User $company)
    {
        return $this
            ->_em
            ->createQuery(
                'SELECT p 
                    FROM AppBundle:Property\Property p 
                    WHERE p.company IS NULL AND p.companySourceRef = :ref AND p.companySourceRefType = :ref_type'
            )
            ->setParameters([
                'ref' => $company->sourceRef,
                'ref_type' => $company->sourceRefType,
            ])
            ->getResult();
    }

    /**
     * @param User|int $userId
     *
     * @return array
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getCountsForAgent($userId): array
    {
        return $this->getCountForUser($userId, 'user');
    }

    /**
     * @param User|int $userId
     *
     * @return array
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getCountsForOffice($userId): array
    {
        return $this->getCountForUser($userId, 'company_id');
    }

    /**
     * @param User|int $userId
     * @param $target
     *
     * @return array
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    private function getCountForUser($userId, $target)
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        $counts = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                sprintf(
                    'SELECT SUM(IF(rental = 0, 1, 0)) for_sale, SUM(IF(rental = 0, 0, 1)) to_rent
                    FROM property 
                    WHERE %s = :user_id AND status = :status',
                    $target
                ),
                [
                    'user_id' => $userId,
                    'status' => Property::STATUS_ACTIVE,
                ]
            )
            ->fetch();

        return $counts
            ? [
                (int)$counts['for_sale'],
                (int)$counts['to_rent'],
            ]
            : [0, 0];
    }
}
