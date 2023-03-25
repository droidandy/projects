<?php

namespace AppBundle\Entity\User;

use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Elastic\Integration\Mapping\PopulateESInterface;
use AppBundle\Entity\Property\PropertyLike;
use AppBundle\Entity\Social\ArticleLike;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Property\Property;
use AppBundle\Import\User\CountResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\UnitOfWork;

class UserRepository extends EntityRepository implements PopulateESInterface
{

    /**
     * @param User $user
     * @param int $offset
     * @param int $limit
     *
     * @return ArrayCollection
     */
    public function getUserFeed(User $user, int $offset, int $limit = 5)
    {
        $articles = $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('a')
            ->from('AppBundle:Social\Article', 'a')
            ->where('a.author = :user')->setParameter('user', $user)
            ->andWhere('a.publishedAt IS NOT NULL')
            ->getQuery()
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->execute()
        ;
        $properties = $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('p')
            ->from('AppBundle:Property\Property', 'p')
            ->where('p.user = :user')->setParameter('user', $user)
            ->andWhere('p.status = :status')->setParameter('status', Property::STATUS_ACTIVE)
            ->getQuery()
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->execute()
        ;

        return array_merge($articles, $properties);
    }

    /**
     * @param int $limit
     *
     * @return array
     */
    public function getPopularUsers($limit = 3)
    {
        $qb = $this
            ->getEntityManager()
            ->createQueryBuilder();

        return $qb
            ->select('u.id, u.name, u.companyName, COUNT(u.id) as total_articles')
            ->from(Article::class, 'a')
            ->innerJoin('a.author', 'u')

            ->where('a.publishedAt IS NOT NULL')

            ->groupBy('total_articles')
            ->orderBy('total_articles', 'DESC')

            ->setMaxResults($limit)
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param $sourceRef
     * @param $sourceRefType
     *
     * @return null|object
     */
    public function getUserBySourceRef($sourceRef, $sourceRefType)
    {
        return $this
            ->getUsersBySourceRefQuery($sourceRef, $sourceRefType)
            ->getOneOrNullResult()
        ;
    }

    /**
     * @param $sourceRef
     * @param $sourceRefType
     *
     * @return User[]
     */
    public function getUsersBySourceRef($sourceRef, $sourceRefType)
    {
        return $this
            ->getUsersBySourceRefQuery($sourceRef, $sourceRefType)
            ->getResult()
        ;
    }

    /**
     * @param $sourceRef
     * @param $sourceRefType
     *
     * @return Query
     */
    private function getUsersBySourceRefQuery($sourceRef, $sourceRefType)
    {
        $query = $this
            ->_em
            ->createQuery(
                'SELECT u FROM AppBundle:User\User u 
                    LEFT JOIN u.sourceRefs sr
                    WHERE
                        (u.sourceRef = ?1 AND u.sourceRefType = ?2) OR (sr.ref = ?1 AND sr.type = ?2)'
            )
            ->setParameters([
                1 => $sourceRef,
                2 => $sourceRefType,
            ])
        ;

        return $query;
    }

    /**
     * @param string $sourceRef
     *
     * @return mixed
     */
    public function getUserIdBySourceRef($sourceRef)
    {
        $userId = $this
            ->_em
            ->createQuery('SELECT u.id FROM AppBundle:User\User u WHERE u.sourceRef = ?1')
            ->setParameters([1 => $sourceRef])
            ->getSingleScalarResult()
        ;

        return $userId;
    }

    public function emailExists($email)
    {
        try {
            $userId = $this
                ->_em
                ->createQuery('SELECT u.id FROM AppBundle:User\User u WHERE u.emailCanonical = ?1')
                ->setParameters([1 => strtolower($email)])
                ->getSingleScalarResult()
            ;
        } catch (\Doctrine\ORM\NoResultException $e) {
            return false;
        }

        return $userId;
    }

    public function getUnusedEmail($emails)
    {
        $emails = array_map(function ($email) {
            return mb_convert_case($email, MB_CASE_LOWER, mb_detect_encoding($email));
        }, $emails);

        $dbEmails = $this
            ->_em
            ->createQuery('SELECT u.email_canonical FROM AppBundle:User\User u WHERE u.email_canonical IN (?1)')
            ->setParameters([1 => $emails])
            ->getScalarResult()
        ;

        $unusedEmails = array_diff($emails, $dbEmails);

        return !empty($unusedEmails) ? array_shift($unusedEmails) : false;
    }

    /**
     * @param string $sourceRef
     * @param string $type
     *
     * @return mixed
     */
    public function getUserBySourceRefs($sourceRef, $type)
    {
        $user = $this
            ->_em
            ->createQuery('SELECT u, sr FROM AppBundle:User\User u JOIN u.sourceRefs sr  WHERE sr.ref = ?1 AND sr.type = ?2')
            ->setParameters([1 => $sourceRef, 2 => $type])
            ->getOneOrNullResult()
        ;

        return $user;
    }

    public function getUserByFingerprint(NormalisedUserInterface $user)
    {
        $user = $this
            ->_em
            ->createQuery('SELECT u FROM AppBundle:User\User u WHERE u.email = ?1 AND u.name = ?2')
            ->setParameters([1 => $user->getEmail(), 2 => $user->getName()])
            ->getOneOrNullResult()
        ;

        return $user;
    }

    public function getUserByNameAndAnyEmail($name, $emails)
    {
        $user = $this
            ->_em
            ->createQuery('SELECT u FROM AppBundle:User\User u WHERE u.email IN (?1) AND u.name = ?2')
            ->setParameters([
                1 => $emails,
                2 => $name,
            ])
            ->getOneOrNullResult()
        ;

        return $user;
    }

    public function getUserByEmail($email)
    {
        $user = $this
            ->_em
            ->createQuery('SELECT u FROM AppBundle:User\User u WHERE u.email = ?1')
            ->setParameters([1 => $email])
            ->getOneOrNullResult()
        ;

        return $user;
    }

    public function getEntitiesForDocTotal()
    {
        return $this
            ->_em
            ->createQuery('SELECT count(u) FROM AppBundle:User\User u')
            ->getSingleScalarResult()
        ;
    }

    public function getEntities()
    {
        $usersIterable = $this
            ->_em
            ->createQuery('SELECT u FROM AppBundle:User\User u')
            ->iterate()
        ;

        return $usersIterable;
    }

    public function getTotal()
    {
        return $this
            ->_em
            ->createQuery('SELECT count(u) FROM AppBundle:User\User u WHERE u.deletedAt IS NULL')
            ->getSingleScalarResult()
        ;
    }

    public function getIterable($from = null, $step = null)
    {
        $query = $this
            ->_em
            ->createQuery('SELECT u FROM AppBundle:User\User u WHERE u.deletedAt IS NULL')
        ;
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
            ->createQuery('SELECT count(u) FROM AppBundle:User\User u WHERE u.deletedAt IS NULL AND u.googleLocationsStatus = :status')
            ->setParameter('status', GoogleLocation::STATUS_UNPROCESSED)
            ->getSingleScalarResult()
        ;
    }

    public function getIterableToProcess()
    {
        $query = $this
            ->_em
            ->createQuery('SELECT u FROM AppBundle:User\User u WHERE u.deletedAt IS NULL AND u.googleLocationsStatus = :status')
            ->setParameter('status', GoogleLocation::STATUS_UNPROCESSED)
        ;

        return $query->iterate();
    }

    public function isHashLatest(User $user, $userHash, $normalisedDoc)
    {
        if (!$user->getId()) {
            return false;
        }

        if ($normalisedDoc instanceof NormalisedUserInterface) {
            $tableName = 'import_user';
        } elseif ($normalisedDoc instanceof NormalisedCompanyInterface) {
            $tableName = 'import_company';
        } elseif ($normalisedDoc instanceof NormalisedOfficeInterface) {
            $tableName = 'import_office';
        }

        $conn = $this->_em->getConnection();
        $dbHash = $conn
            ->fetchColumn(
                'SELECT iu.hash FROM '.$tableName.' iu WHERE iu.user_id = :user_id ORDER BY iu.id DESC LIMIT 1',
                [
                    'user_id' => $user->getId(),
                ]
            )
        ;

        return $userHash == $dbHash;
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function getTotalUserFollowers(User $user)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(u)')
            ->from('AppBundle:User\User', 'u')
            ->innerJoin('u.followings', 'f')
            ->where('f.id = :user')->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param User $user
     * @param int  $offset
     * @param int  $limit
     *
     * @return ArrayCollection
     */
    public function getUserFollowers(User $user, $offset, $limit)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('u')
            ->from('AppBundle:User\User', 'u')
            ->innerJoin('u.followings', 'f')
            ->where('f.id = :user')->setParameter('user', $user)
            ->addOrderBy('f.name', 'ASC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function getTotalUserFollowings(User $user)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(u)')
            ->from('AppBundle:User\User', 'u')
            ->innerJoin('u.followers', 'f')
            ->where('f.id = :user')->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param User $user
     * @param int  $offset
     * @param int  $limit
     *
     * @return ArrayCollection
     */
    public function getUserFollowings(User $user, $offset, $limit)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('u')
            ->from('AppBundle:User\User', 'u')
            ->innerJoin('u.followers', 'f')
            ->where('f.id = :user')->setParameter('user', $user)
            ->addOrderBy('u.name', 'ASC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function getTotalLikesForUser(User $user)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(l.id)')
            ->from('AppBundle\Entity\Social\ArticleLike', 'l')
            ->andWhere('l.user = :user')->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param User $user
     * @param int  $offset
     * @param int  $limit
     *
     * @return ArrayCollection
     */
    public function getArticlesLikedByUser(User $user, $offset, $limit)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('a')
            ->from('AppBundle\Entity\Social\Article', 'a')
            ->innerJoin('a.likes', 'l')
            ->andWhere('l.user = :user')->setParameter('user', $user)
            ->addOrderBy('l.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param User             $user
     * @param Article|Property $instance
     *
     * @return bool
     */
    public function isLikedByUser(User $user, $instance)
    {
        $className = get_class($instance).'Like';

        return (bool) $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(l.id)')
            ->from($className, 'l')
            ->where('l.liked = :liked')->setParameter('liked', $instance)
            ->andWhere('l.user = :user')->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param User             $user
     * @param Article|Property $instance
     *
     * @return ArticleLike|PropertyLike
     */
    public function getLikeByUser(User $user, $instance)
    {
        $className = get_class($instance).'Like';

        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('l')
            ->from($className, 'l')
            ->where('l.liked = :liked')->setParameter('liked', $instance)
            ->andWhere('l.user = :user')->setParameter('user', $user)
            ->getQuery()
            ->getSingleResult()
        ;
    }

    public function tryFindOrCreate(NormalisedUserInterface $user)
    {
        $userObj = $this->getUserBySourceRef($user->getSourceRef(), $user->getSourceRefType());
        if ($userObj) {
            return $userObj;
        }

        $sourceRefs = $user->getSourceRefs();
        foreach ($sourceRefs as $sourceRef) {
            $userObj = $this->getUserBySourceRefs(
                $sourceRef->ref,
                $sourceRef->type
            );
            if ($userObj) {
                return $userObj;
            }
        }

        $userObj = $this->getUserByFingerprint($user);
        if ($userObj) {
            return $userObj;
        }

        return new User();
    }

    public function getAllSignupEmails()
    {
        return $this
            ->_em
            ->getConnection()
            ->executeQuery('SELECT email_canonical FROM user')
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;
    }

    public function getCompanySummary()
    {
        return $this->getSummary('ROLE_COMPANY');
    }

    public function getOfficeSummary()
    {
        return $this->getSummary('ROLE_OFFICE');
    }

    public function getAgentSummary()
    {
        return $this->getSummary('ROLE_AGENT');
    }

    private function getSummary($role)
    {
        return $this
            ->_em
            ->getConnection()
            ->executeQuery(
                <<<SQL
                SELECT
                    (deletedAt IS NOT NULL) AS deleted, count(*)
                    FROM user
                    WHERE roles LIKE '%${role}%'
                    GROUP BY deleted
SQL
            )
            ->fetchAll(\PDO::FETCH_KEY_PAIR)
        ;
    }

    public function isUserNew(User $user)
    {
        return UnitOfWork::STATE_NEW === $this->_em->getUnitOfWork()->getEntityState($user);
    }

    public function iterateDeletedUsers()
    {
        return $this
            ->_em
            ->createQuery('SELECT u.id AS id FROM AppBundle:User\User u WHERE u.deletedAt IS NOT NULL')
            ->iterate(null, Query::HYDRATE_ARRAY)
        ;
    }

    public function getAllCompanyGuids()
    {
        $ids = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                'SELECT DISTINCT child_id FROM user_relation WHERE type = :type AND division = :division',
                [
                    'type' => Relation::TYPE_DIVISION,
                    'division' => User::TYPE_SUBDIVISION,
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;

        return $this->getAllGuids(User::TYPE_COMPANY, $ids);
    }

    public function getAllOfficeGuids()
    {
        $ids = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                'SELECT DISTINCT child_id FROM user_relation WHERE type = :type AND division IN (:division)',
                [
                    'type' => Relation::TYPE_DIVISION,
                    'division' => [User::TYPE_MAIN_OFFICE, User::TYPE_BRANCH_OFFICE],
                ],
                [
                    'type' => \PDO::PARAM_STR,
                    'division' => Connection::PARAM_STR_ARRAY,
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;

        return $this->getAllGuids(User::TYPE_COMPANY, $ids);
    }

    public function getAllGuids($type = User::TYPE_USER, $onlyIds = [])
    {
        $args = [
            'params' => [
                'type' => $type,
            ],
            'types' => [
                'type' => \PDO::PARAM_STR,
            ],
        ];

        $primaryQuery = <<<SQL
                SELECT u.sourceRef, u.id 
                    FROM user u
                    WHERE u.type = :type AND u.sourceRefType='guid' AND u.deletedAt IS NULL
SQL;
        $secondaryQuery = <<<SQL
                SELECT usr.ref, u.id 
                    FROM user u 
                    INNER JOIN user_source_ref usr 
                        ON u.id = usr.user_id AND usr.type='guid'
                    WHERE u.type = :type AND u.deletedAt IS NULL
SQL;

        if (!empty($onlyIds)) {
            $args['params']['ids'] = $onlyIds;
            $args['types']['ids'] = Connection::PARAM_INT_ARRAY;

            $primaryQuery .= ' AND u.id IN (:ids)';
            $secondaryQuery .= ' AND u.id IN (:ids)';
        }

        $refToIdMap = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                $primaryQuery,
                $args['params'],
                $args['types']
            )
            ->fetchAll(\PDO::FETCH_KEY_PAIR)
        ;
        $idToRefMap = array_flip($refToIdMap);

        $refToIdMapAdditional = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                $secondaryQuery,
                $args['params'],
                $args['types']
            )
            ->fetchAll(\PDO::FETCH_KEY_PAIR)
        ;
        $idToRefMapAdditional = [];
        foreach ($refToIdMapAdditional as $ref => $id) {
            if (!isset($idToRefMapAdditional[$id])) {
                $idToRefMapAdditional[$id] = [$ref];
            } else {
                $idToRefMapAdditional[$id][] = $ref;
            }
        }

        $mergedIdToRefMap = [];
        foreach ($idToRefMap as $key => $value) {
            if (isset($idToRefMapAdditional[$key])) {
                $mergedIdToRefMap[$key] = array_merge([$value], $idToRefMapAdditional[$key]);
                unset($idToRefMapAdditional[$key]);
                unset($idToRefMap[$key]);
            }
        }
        $mergedIdToRefMap += $idToRefMap + $idToRefMapAdditional;

        return [$refToIdMap + $refToIdMapAdditional, $mergedIdToRefMap];
    }

    public function findBySourceRef($sourceRef)
    {
        return $this
            ->_em
            ->getConnection()
            ->executeQuery(<<<SQL
                SELECT u.id 
                    FROM user u 
                    LEFT JOIN user_source_ref usr 
                        ON u.id = usr.user_id
                    WHERE 
                        (u.sourceRef = :source_ref OR usr.ref = :source_ref)
SQL
            , [
                'source_ref' => $sourceRef,
            ])
            ->fetchColumn(0)
        ;
    }

    public function getUnresolvedOfficesForCompany(User $company)
    {
        $linkedIds = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                'SELECT u.id FROM user u WHERE  u.company_source_ref = :ref AND u.company_source_ref_type = :type',
                [
                    'ref' => $company->sourceRef,
                    'type' => $company->sourceRefType,
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;

        $resolvedIds = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                '
                SELECT u.id 
                    FROM user u 
                    WHERE u.id IN (
                        SELECT DISTINCT ur.child_id 
                            FROM user_relation ur 
                            WHERE ur.child_id IN (:linked_ids) AND ur.parent_id = :company_id AND ur.type = \'division\'
                    )
            ',
                [
                    'linked_ids' => $linkedIds,
                    'company_id' => $company->getId(),
                ],
                [
                    'linked_ids' => Connection::PARAM_INT_ARRAY,
                    'company_id' => \PDO::PARAM_INT,
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;

        return $this
            ->findBy([
                'id' => array_diff($linkedIds, $resolvedIds),
            ])
        ;
    }

    public function getUnresolvedAgentsForOffice(User $office)
    {
        $linkedIds = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                'SELECT u.id FROM user u WHERE u.office_source_ref = :ref AND u.office_source_ref_type = :type',
                [
                    'ref' => $office->sourceRef,
                    'type' => $office->sourceRefType,
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;

        $resolvedIds = $this
            ->_em
            ->getConnection()
            ->executeQuery(
                '
                SELECT u.id 
                    FROM user u 
                    WHERE u.id IN (
                        SELECT DISTINCT ur.child_id 
                            FROM user_relation ur 
                            WHERE ur.child_id IN (:linked_ids) AND ur.parent_id = :company_id AND ur.type = \'role\'
                    )
            ',
                [
                    'linked_ids' => $linkedIds,
                    'company_id' => $office->getId(),
                ],
                [
                    'linked_ids' => Connection::PARAM_INT_ARRAY,
                    'company_id' => \PDO::PARAM_INT,
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;

        return $this
            ->findBy([
                'id' => array_diff($linkedIds, $resolvedIds),
            ])
        ;
    }

    public function getDirectParentIds($userId)
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        return $this
            ->_em
            ->getConnection()
            ->executeQuery(
                '
                    SELECT parent_id FROM user_relation WHERE child_id = :child_id
                ',
                [
                    'child_id' => $userId,
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;
    }

    public function getParentIds($userId)
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        return $this
            ->_em
            ->getConnection()
            ->executeQuery(
                '
                    WITH RECURSIVE cte(child_id, parent_id) AS (
                        SELECT ur.child_id, ur.parent_id 
                            FROM user_relation ur 
                            WHERE ur.child_id = :child_id
                        UNION ALL
                        SELECT ur.child_id, ur.parent_id 
                            FROM user_relation ur 
                            INNER JOIN cte ON cte.parent_id = ur.child_id 
                    )
                    SELECT parent_id FROM cte
                ',
                [
                    'child_id' => $userId,
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;
    }

    public function updateChainCounts(
        $userId,
        $agentDelta,
        $affiliateDelta,
        $propertyForSaleDelta,
        $propertyToRentDelta,
        $articleDelta,
        $mode
    ) {
        if (CountResolver::CHAIN_MODE_ADD === $mode) {
            $modifier = ' + IF(u.id = :child_id, 0, 1)';
        } elseif (CountResolver::CHAIN_MODE_UPDATE === $mode) {
            $modifier = '';
        } else {
            throw new \InvalidArgumentException('only add and update modes are supported');
        }

        return $this
            ->_em
            ->getConnection()
            ->executeUpdate(
                sprintf(
                    '
                        WITH RECURSIVE cte(child_id, parent_id) AS (
                            SELECT u.id, ur.parent_id 
                                FROM user u 
                                LEFT JOIN user_relation ur
                                ON u.id = ur.child_id 
                                WHERE u.id = :child_id
                            UNION ALL
                            SELECT cte.parent_id, ur.parent_id 
                                FROM cte 
                                LEFT JOIN user_relation ur ON cte.parent_id = ur.child_id
                                WHERE cte.parent_id IS NOT NULL 
                        )
                        UPDATE user u
                            SET u.agentCount = IFNULL(u.agentCount, 0) + :agent_delta,
                                u.affiliateCount = IFNULL(u.affiliateCount, 0) + :affiliate_delta %s,
                                u.propertyCount = IFNULL(u.propertyCount, 0) + :property_delta,
                                u.propertyForSaleCount = IFNULL(u.propertyForSaleCount, 0) + :property_for_sale_delta,
                                u.propertyToRentCount = IFNULL(u.propertyToRentCount, 0) + :property_to_rent_delta,
                                u.articleCount = IFNULL(u.articleCount, 0) + :article_delta
                            WHERE u.id IN (SELECT cte.child_id FROM cte)
                    ',
                    $modifier
                ),
                [
                    'child_id' => $userId,
                    'agent_delta' => $agentDelta,
                    'affiliate_delta' => $affiliateDelta,
                    'property_delta' => $propertyForSaleDelta + $propertyToRentDelta,
                    'property_for_sale_delta' => $propertyForSaleDelta,
                    'property_to_rent_delta' => $propertyToRentDelta,
                    'article_delta' => $articleDelta,
                ]
            )
        ;
    }

    public function deltaUserCount(
        $userId,
        $agentCount,
        $affiliateCount,
        $propertyForSaleCount,
        $propertyToRentCount,
        $articleCount
    ) {
        return $this
            ->_em
            ->getConnection()
            ->executeUpdate(
                'UPDATE user 
                    SET agentCount = IF(:agent_count IS NULL, NULL, agentCount + :agent_count),
                        affiliateCount = IF(:affiliate_count IS NULL, NULL, affiliateCount + :affiliate_count),
                        propertyCount = IFNULL(propertyCount, 0) + :property_count,
                        propertyForSaleCount = IFNULL(propertyForSaleCount, 0) + :property_for_sale_count,
                        propertyToRentCount = IFNULL(propertyToRentCount, 0) + :property_to_rent_count,
                        articleCount = IFNULL(articleCount, 0) + :article_count
                    WHERE id = :id',
                [
                    'agent_count' => $agentCount,
                    'affiliate_count' => $affiliateCount,
                    'property_count' => $propertyForSaleCount + $propertyToRentCount,
                    'property_for_sale_count' => $propertyForSaleCount,
                    'property_to_rent_count' => $propertyToRentCount,
                    'article_count' => $articleCount,
                    'id' => $userId,
                ]
            )
        ;
    }

    /**
     * @param User|int $userId
     *
     * @return int
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getDirectAgentChildCount($userId): int
    {
        return $this->getDirectChildCount(
            $userId,
            Relation::TYPE_ROLE,
            'AND role = :role',
            [
                'role' => User::ROLE_AGENT,
            ]
        );
    }

    /**
     * @param User|int $userId
     *
     * @return int
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getDirectAffiliateChildCount($userId): int
    {
        return $this->getDirectChildCount($userId, Relation::TYPE_DIVISION);
    }

    private function getDirectChildCount($userId, $type, $specifier = '', $specifierParams = [])
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        return $this
            ->_em
            ->getConnection()
            ->executeQuery(
                sprintf(
                    'SELECT COUNT(child_id) FROM user_relation WHERE parent_id = :parent_id AND type = :type %s',
                    $specifier
                ),
                array_merge(
                    [
                        'parent_id' => $userId,
                        'type' => $type,
                    ],
                    $specifierParams
                )
            )
            ->fetchColumn()
        ;
    }

    public function getAssetCounts($userId): array
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        return $this
            ->_em
            ->getConnection()
            ->executeQuery(
                'SELECT
                    agentCount, 
                    affiliateCount, 
                    propertyForSaleCount,
                    propertyToRentCount,
                    articleCount
                 FROM user WHERE id = :id
                ',
                [
                    'id' => $userId,
                ]
            )
            ->fetch()
        ;
    }

    /**
     * @param User|int $userId
     *
     * @return array
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getDirectChildAssetCounts($userId): array
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        return $this
            ->_em
            ->getConnection()
            ->executeQuery(
                'SELECT 
                        SUM(u.agentCount) agent_count, 
                        SUM(u.affiliateCount) affiliate_count, 
                        SUM(u.propertyForSaleCount) property_for_sale_count, 
                        SUM(u.propertyToRentCount) property_to_rent_count, 
                        SUM(u.articleCount) article_count
                    FROM user_relation ur  
                    INNER JOIN user u ON ur.child_id = u.id
                    WHERE ur.parent_id = :parent_id',
                [
                    'parent_id' => $userId,
                ]
            )
            ->fetch()
        ;
    }

    public function updateAgentAssetCounts(
        $propertyForSaleCount,
        $propertyToRentCount,
        $articleCount,
        $userId
    ) {
        return $this->updateUserAssetCounts(
            null,
            null,
            $propertyForSaleCount,
            $propertyToRentCount,
            $articleCount,
            $userId
        );
    }

    public function updateOfficeAssetCounts(
        $agentCount,
        $affiliateCount,
        $propertyForSaleCount,
        $propertyToRentCount,
        $articleCount,
        $userId
    ) {
        return $this->updateUserAssetCounts(
            $agentCount,
            $affiliateCount,
            $propertyForSaleCount,
            $propertyToRentCount,
            $articleCount,
            $userId
        );
    }

    public function updateCompanyAssetCounts(
        $agentCount,
        $affiliateCount,
        $propertyForSaleCount,
        $propertyToRentCount,
        $articleCount,
        $userId
    ) {
        return $this->updateUserAssetCounts(
            $agentCount,
            $affiliateCount,
            $propertyForSaleCount,
            $propertyToRentCount,
            $articleCount,
            $userId
        );
    }

    private function updateUserAssetCounts(
        $agentCount,
        $affiliateCount,
        $propertyForSaleCount,
        $propertyToRentCount,
        $articleCount,
        $userId
    ) {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        return $this
            ->_em
            ->getConnection()
            ->executeUpdate(
                'UPDATE user 
                    SET agentCount = :agent_count,
                        affiliateCount = :affiliate_count,
                        propertyCount = :property_count,
                        propertyForSaleCount = :property_for_sale_count,
                        propertyToRentCount = :property_to_rent_count,
                        articleCount = :article_count
                    WHERE id = :id',
                [
                    'agent_count' => $agentCount,
                    'affiliate_count' => $affiliateCount,
                    'property_count' => $propertyForSaleCount + $propertyToRentCount,
                    'property_for_sale_count' => $propertyForSaleCount,
                    'property_to_rent_count' => $propertyToRentCount,
                    'article_count' => $articleCount,
                    'id' => $userId,
                ]
            )
        ;
    }
}
