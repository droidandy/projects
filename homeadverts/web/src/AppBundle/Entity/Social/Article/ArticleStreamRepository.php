<?php

declare(strict_types=1);

namespace AppBundle\Entity\Social\Article;

use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Tag;
use AppBundle\Entity\User\User;

class ArticleStreamRepository extends PageRepositoryTemplate
{
    /**
     * @var array
     */
    private $userIds = [];
    /**
     * @var array
     */
    private $tags = [];

    /**
     * @param User $user
     */
    public function setFollowingIds(User $user)
    {
        $this->userIds = $user->getFollowingIds();
    }

    /**
     * @param array $tags
     */
    public function setTags(array $tags)
    {
        $this->tags = $tags;
    }

    /**
     * @return int
     */
    public function getTotal()
    {
        $tags = [
            Article::SLOT_FEATURED,
            Article::SLOT_COLLECTION,
            Article::SLOT_COVER,
        ];
        $qb = $this->em->createQueryBuilder();

        $followedUsersArticleIds = $this->getFollowedUsersArticleIds();
        $followedTagsArticleIds = $this->getFollowedTagsArticleIds();
        $inPrivate = $this->articleRepository->subQueryInPrivateTags();
        $tagIds = $this->getTagIds();

        return $this
            ->em
            ->createQueryBuilder()
            ->select('count(article.id)')
            ->from('AppBundle\Entity\Social\Article', 'article')
            ->where($qb->expr()->in('article.id', $followedUsersArticleIds))
            ->orWhere($qb->expr()->in('article.id', $followedTagsArticleIds))
            ->andWhere($qb->expr()->notIn('article.id', $inPrivate))

            ->setParameter('userIds', $this->userIds)
            ->setParameter('tagNames', $tags)
            ->setParameter('tagIds', $tagIds)

            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param array $tags
     * @param int   $offset
     * @param int   $limit
     * @param bool  $containTags
     *
     * @return mixed
     */
    protected function doGetArticles(array $tags, $offset, $limit, $containTags = true)
    {
        $qb = $this->em->createQueryBuilder();

        $followedUsersArticleIds = $this->getFollowedUsersArticleIds();
        $followedTagsArticleIds = $this->getFollowedTagsArticleIds();
        $tagIds = $this->getTagIds();
        $inPrivate = $this->articleRepository->subQueryInPrivateTags();

        $query = $qb
            ->select('article')
            ->from('AppBundle\Entity\Social\Article', 'article')
            ->where($qb->expr()->in('article.id', $followedUsersArticleIds))
            ->orWhere($qb->expr()->in('article.id', $followedTagsArticleIds));

        if ($containTags) {
            $query->andWhere($qb->expr()->in('article.id', $inPrivate));
        } else {
            $query->andWhere($qb->expr()->notIn('article.id', $inPrivate));
        }

        return $query
            ->setMaxResults($limit)
            ->setFirstResult($offset)

            ->setParameter('userIds', $this->userIds)
            ->setParameter('tagNames', $tags)
            ->setParameter('tagIds', $tagIds)
            ->addOrderBy('article.publishedAt', 'DESC')
            ->getQuery()
            ->execute();
    }

    /**
     * @return string
     */
    private function getFollowedUsersArticleIds()
    {
        return $this
            ->em
            ->createQueryBuilder()
            ->select('articleUsers.id')
            ->from('AppBundle\Entity\Social\Article', 'articleUsers')
            ->innerJoin('articleUsers.author', 'aa')
            ->where('articleUsers.publishedAt IS NOT NULL')
            ->andWhere('aa.id IN (:userIds)')
            ->getDQL();
    }

    /**
     * @return string
     */
    private function getFollowedTagsArticleIds()
    {
        return $this
            ->em
            ->createQueryBuilder()
            ->select('articleTags.id')
            ->from(Article::class, 'articleTags')
            ->andWhere('articleTags.id IN (:tagIds)')
            ->getDQL();
    }

    /**
     * @return array
     */
    private function getTagIds()
    {
        $ids = [];
        /** @var Tag $tag */
        foreach ($this->tags as $tag) {
            $ids[] = $tag->getId();
        }

        return $ids;
    }
}
