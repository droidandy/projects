<?php

namespace AppBundle\Entity\Social\Article;

use AppBundle\Entity\Social\Article;

class ArticleRecommendedRepository extends PageRepositoryTemplate
{
    /**
     * @return int
     */
    public function getTotal()
    {
        $tagNames = [Article::SLOT_FEATURED, Article::SLOT_COLLECTION, Article::SLOT_COVER];

        $recommended = $this->subQueryRecommended();
        $inPrivate = $this->articleRepository->subQueryInPrivateTags();

        $qb = $this->em->createQueryBuilder();

        return $qb
            ->select('count(article.id)')
            ->from('AppBundle\Entity\Social\Article', 'article')
            ->where('article.publishedAt IS NOT NULL')
            ->andWhere($qb->expr()->in('article.id', $recommended))
            ->andWhere($qb->expr()->notIn('article.id', $inPrivate))->setParameter('tagNames', $tagNames)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param array $tagNames
     * @param int   $offset
     * @param int   $limit
     * @param bool  $containTags
     *
     * @return mixed
     */
    protected function doGetArticles(array $tagNames, $offset, $limit, $containTags = true)
    {
        $inPrivate = $this->articleRepository->subQueryInPrivateTags(); // Get Article Ids with $tagNames only
        $qb = $this->em->createQueryBuilder();

        $query = $qb
            ->select('article')

            ->from('AppBundle\Entity\Social\Article', 'article')
            ->innerJoin('article.tags', 'articleTag')
            ->innerJoin('articleTag.tag', 'tag')

            ->where('article.publishedAt IS NOT NULL')
            // Single "recommended" needed for ordering by this field only
            // We are find since all article presented on homage should have this tag.
            ->andWhere('tag.name = \'recommended\'')
            ->andWhere('tag.private = 1')
        ;

        if ($containTags) {
            // Array intersect between $recommended and $inPrivate tag ids
            // final result will contain articles from both arrays
            // see PageRepositoryTemplate-> getJumbo(getFeatured,doGetArticles)
            $query->andWhere($qb->expr()->in('article.id', $inPrivate));
        } else {
            // Final result will contain articles from $recommended array only, without $tagNames
            // see PageRepositoryTemplate->getTeasers
            $query->andWhere($qb->expr()->notIn('article.id', $inPrivate));
        }

        return $query
            ->setParameter('tagNames', $tagNames)
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->addOrderBy('articleTag.createdAt', 'DESC')
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @return string
     */
    private function subQueryRecommended()
    {
        return $this->em
            ->createQueryBuilder()
            ->select('a1.id')->distinct()
            ->from('AppBundle\Entity\Social\ArticleTag', 'at1')
            ->innerJoin('at1.article', 'a1')
            ->innerJoin('at1.tag', 't1')
            ->where('t1.private = 1')
            ->andWhere('t1.name = \'recommended\'')
            ->getDQL()
        ;
    }
}
