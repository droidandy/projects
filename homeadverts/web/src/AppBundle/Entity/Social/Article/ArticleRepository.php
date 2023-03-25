<?php

namespace AppBundle\Entity\Social\Article;

use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Integration\Mapping\PopulateESInterface;
use AppBundle\Service\Article\ArticleService;
use AppBundle\Service\User\AdjacencyRegistry;
use AppBundle\Entity\User\User;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

class ArticleRepository extends EntityRepository implements PopulateESInterface
{
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;

    /**
     * @param AdjacencyRegistry $adjacencyRegistry
     */
    public function setAdjacencyRegistry(AdjacencyRegistry $adjacencyRegistry)
    {
        $this->adjacencyRegistry = $adjacencyRegistry;
    }

    /**
     * @return int
     */
    public function removeArticlesWithPropertyPrivateTag()
    {
        $articleIds = $this
            ->_em
            ->createQueryBuilder()
            ->select('a.id')->distinct()
            ->from('AppBundle\Entity\Social\ArticleTag', 'at')
            ->innerJoin('at.article', 'a')
            ->innerJoin('at.tag', 't')
            ->where('t.private = 1')
            ->andWhere('t.name IN (:tagNames)')
            ->setParameter('tagNames', [ArticleService::TAG_PROPERTY_PRIVATE])
            ->getQuery()
            ->execute()
        ;

        $this->
            _em
            ->createQueryBuilder()
            ->delete('AppBundle\Entity\Social\Article', 'article')
            // ->where('article.publishedAt IS NULL')
            ->andWhere('article.id IN (:articleIds)')->setParameter('articleIds', $articleIds)
            ->getQuery()
            ->execute()
        ;

        return count($articleIds);
    }


    /**
     * @param int|null $offset
     * @param int|null $limit
     * @param array    $tagIds
     * @param array    $excludedArticleIds
     *
     * @return array
     */
    public function getPublishedArticlesByPublicTags(
        $offset,
        $limit,
         array $tagIds = [],
        array $excludedArticleIds = []
    ) {
        $inPublic = $this->subQueryInPublicTags();
        $qb = $this
            ->getEntityManager()
            ->createQueryBuilder();

        return $qb
            ->select('article')
            ->from('AppBundle\Entity\Social\Article', 'article')
            ->where($qb->expr()->in('article.id', $inPublic))->setParameter('tagIds', $tagIds)
            ->andWhere('article.publishedAt IS NOT NULL')
            ->addOrderBy('article.publishedAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param int   $offset
     * @param int   $limit
     * @param array $tagIds
     * @param array $excludedArticleIds
     *
     * @return mixed
     */
    public function getPublishedArticles(
        $offset,
        $limit,
        array $tagIds = [],
        array $excludedArticleIds = []
    ) {
        $qb = $this
            ->getEntityManager()
            ->createQueryBuilder()
        ;

        $query = $qb
            ->select('a')
            ->from('AppBundle\Entity\Social\Article', 'a')
        ;

        if ($excludedArticleIds) {
            $query->andWhere('a.id NOT IN (:articleIds)')
                ->setParameter('articleIds', $excludedArticleIds);
        }
        if ($tagIds) {
            $inPublic = $this->subQueryInPublicTags();
            $query
                ->where($qb->expr()->in('a.id', $inPublic))
                ->setParameter('tagIds', $tagIds)
            ;
        }

        return $query
            ->andWhere('a.publishedAt IS NOT NULL')
            ->addOrderBy('a.publishedAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @return mixed
     */
    public function getTotalPublishedArticles()
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(a.id)')
            ->from('AppBundle\Entity\Social\Article', 'a')
            ->where('a.publishedAt IS NOT NULL')
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param User $user
     * @param int  $offset
     * @param int  $limit
     *
     * @return mixed
     */
    public function getPublishedUserArticles(User $user, $offset, $limit)
    {
        $userIds = $this->getPrecinctUserIds($user);

        return $this
            ->getUserArticlesQB($userIds, $offset, $limit)
            ->andWhere('a.publishedAt IS NOT NULL')
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param User $user
     * @param int  $offset
     * @param int  $limit
     *
     * @return mixed
     */
    public function getUnpublishedUserArticles(User $user, $offset, $limit)
    {
        $userIds = [$user->getId()];

        return $this
            ->getUserArticlesQB($userIds, $offset, $limit)
            ->andWhere('a.publishedAt IS NULL')
            ->getQuery()
            ->execute()
        ;
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
            ->select('a')
            ->from('AppBundle\Entity\Social\Article', 'a')
            ->where('a.publishedAt IS NOT NULL')
            ->andWhere('a.author IN (:userIds)')->setParameter('userIds', $userIds)
            ->orderBy('a.publishedAt', 'DESC')
            ->setMaxResults(1000)
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function getTotalPublishedArticlesForUser(User $user)
    {
        $userIds = $this->getPrecinctUserIds($user);

        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(a.id)')
            ->from('AppBundle\Entity\Social\Article', 'a')

            ->where('a.publishedAt IS NOT NULL')
            ->andWhere('a.author IN (:user) OR a.assignee IN (:user)')
            ->setParameter('user', $userIds)

            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function getTotalUnPublishedArticlesForUser(User $user)
    {
        $userIds = [$user->getId()];

        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(a.id)')
            ->from('AppBundle\Entity\Social\Article', 'a')

            ->where('a.publishedAt IS NULL')
            ->andWhere('a.author IN (:user) OR a.assignee IN (:user)')
            ->setParameter('user', $userIds)

            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @return string
     */
    public function subQueryInPublicTags()
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('aPublic.id')->distinct()
            ->from('AppBundle\Entity\Social\ArticleTag', 'atPublic')
            ->innerJoin('atPublic.article', 'aPublic')
            ->innerJoin('atPublic.tag', 'tPublic')
            ->where('tPublic.private = 0')
            ->andWhere('tPublic.id IN (:tagIds)')
            ->getDQL()
        ;
    }

    /**
     * @return string
     */
    public function subQueryInPrivateTags()
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('a.id')->distinct()
            ->from('AppBundle\Entity\Social\ArticleTag', 'at')
            ->innerJoin('at.article', 'a')
            ->innerJoin('at.tag', 't')
            ->where('t.private = 1')
            ->andWhere('t.name IN (:tagNames)')
            ->getDQL()
        ;
    }

    public function getEntitiesForDocTotal()
    {
        return $this
            ->_em
            ->createQuery('SELECT count(a) FROM AppBundle:Social\Article a')
            ->getSingleScalarResult()
        ;
    }

    public function getEntities()
    {
        $articleIterable = $this
            ->_em
            ->createQuery('SELECT a FROM AppBundle:Social\Article a')
            ->iterate()
        ;

        return $articleIterable;
    }

    /**
     * @param User|int $userId
     */
    public function getArticleCountForUser($userId)
    {
        if ($userId instanceof User) {
            $userId = $userId->getId();
        }

        return $this
            ->_em
            ->getConnection()
            ->executeQuery(
                'SELECT COUNT(*) 
                FROM ha_article 
                WHERE 
                      publishedAt IS NOT NULL
                      AND (assignee_id = :assignee_id OR author_id = :author_id)',
                [
                    'assignee_id' => $userId,
                    'author_id' => $userId,
                ]
            )
            ->fetchColumn()
        ;
    }

    /**
     * @param array $userIds
     * @param $offset
     * @param $limit
     *
     * @return QueryBuilder
     */
    private function getUserArticlesQB(array $userIds, $offset, $limit)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('a')
            ->from('AppBundle\Entity\Social\Article', 'a')

            ->andWhere('a.author IN (:user) OR a.assignee IN (:user)')
            ->setParameter('user', $userIds)

            ->addOrderBy('a.id', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
        ;
    }

    /**
     * @param User $user
     *
     * @return User[]
     */
    private function getPrecinctUserIds(User $user)
    {
        return array_merge(
            [$user->getId()],
            $this->adjacencyRegistry->getUnsharedChildIds($user->getId())
        );
    }
}
