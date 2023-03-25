<?php

namespace AppBundle\Entity\Social;

use AppBundle\Elastic\Integration\Mapping\PopulateESInterface;
use AppBundle\Entity\User\User;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Internal\Hydration\IterableResult;

class TagRepository extends EntityRepository implements PopulateESInterface
{

    /**
     * @return IterableResult
     */
    public function getTags()
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('t')
            ->from('AppBundle\Entity\Social\Tag', 't')
            ->addOrderBy('t.name', 'ASC')
            ->getQuery()
            ->execute()
            ;
    }

    /**
     * @param User $user
     *
     * @return mixed
     */
    public function deleteAllFollowedTagsForUser(User $user)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->delete('AppBundle\Entity\Social\TagFollowed', 'f')
            ->where('f.user = :user')->setParameter('user', $user)
            ->getQuery()
            ->execute()
            ;
    }

    /**
     * @param int $limit
     *
     * @return array
     */
    public function getPopularTags($limit = 3)
    {
        $qb = $this
            ->getEntityManager()
            ->createQueryBuilder();

        return $qb
            ->select('t.name, t.id, t.displayName, COUNT(at.tag) as total_articles')
            ->from('AppBundle\Entity\Social\ArticleTag', 'at')
            ->innerJoin('at.tag', 't')
            ->where('t.private = 0')
            ->groupBy('total_articles')
            ->orderBy('total_articles', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->execute()
            ;
    }

    public function getEntitiesForDocTotal()
    {
        return $this
            ->_em
            ->createQuery('SELECT count(t) FROM AppBundle:Social\Tag t')
            ->getSingleScalarResult()
        ;
    }

    public function getEntities()
    {
        $usersIterable = $this
            ->_em
            ->createQuery('SELECT t FROM AppBundle:Social\Tag t')
            ->iterate()
        ;

        return $usersIterable;
    }
}
