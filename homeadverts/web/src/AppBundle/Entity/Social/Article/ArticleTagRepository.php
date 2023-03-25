<?php

namespace AppBundle\Entity\Social\Article;

use AppBundle\Entity\Social\Tag;

class ArticleTagRepository extends PageRepositoryTemplate
{
    /**
     * @var Tag
     */
    private $tag;

    /**
     * @param Tag $tag
     */
    public function setTag(Tag $tag)
    {
        $this->tag = $tag;
    }

    /**
     * @return int
     */
    public function getTotal()
    {
        $articlesWithTag = $this->subQueryTag();

        $qb = $this->em->createQueryBuilder();

        return $qb
            ->select('count(article.id)')
            ->from('AppBundle\Entity\Social\Article', 'article')
            ->where('article.publishedAt IS NOT NULL')
            ->andWhere($qb->expr()->in('article.id', $articlesWithTag))
            ->setParameter('tagName', $this->tag->getName())
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * @param array  $tagNames
     * @param string $offset
     * @param string $limit
     * @param bool   $containTags
     *
     * @return mixed
     */
    protected function doGetArticles(array $tagNames, $offset, $limit, $containTags = true)
    {
        $articlesWithTag = $this->subQueryTag();
        $inPrivate = $this->articleRepository->subQueryInPrivateTags();

        $qb = $this->em->createQueryBuilder();

        $query = $qb
            ->select('article')
            ->from('AppBundle\Entity\Social\Article', 'article')
            ->where('article.publishedAt IS NOT NULL')
            ->andWhere($qb->expr()->in('article.id', $articlesWithTag));

        if ($containTags) {
            $query->andWhere($qb->expr()->in('article.id', $inPrivate));
        } else {
            $query->andWhere($qb->expr()->notIn('article.id', $inPrivate));
        }

        return $query
            ->setParameter('tagNames', $tagNames)
            ->setParameter('tagName', $this->tag->getName())
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->addOrderBy('article.publishedAt', 'DESC')
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @return string
     */
    private function subQueryTag()
    {
        return $this
            ->em
            ->createQueryBuilder()
            ->select('a1.id')->distinct()
            ->from('AppBundle\Entity\Social\ArticleTag', 'at1')
            ->innerJoin('at1.article', 'a1')
            ->innerJoin('at1.tag', 't1')
            ->where('t1.private = 0')
            ->andWhere('t1.name = :tagName')
            ->getDQL()
            ;
    }
}
