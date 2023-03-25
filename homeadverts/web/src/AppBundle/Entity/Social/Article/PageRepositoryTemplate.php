<?php

namespace AppBundle\Entity\Social\Article;

use AppBundle\Entity\Social\Article;
use Doctrine\ORM\EntityManager;

abstract class PageRepositoryTemplate
{
    /**
     * @var ArticleRepository
     */
    protected $articleRepository;

    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @param EntityManager     $entityManager
     * @param ArticleRepository $articleRepository
     */
    public function __construct(EntityManager $entityManager, ArticleRepository $articleRepository)
    {
        $this->em = $entityManager;
        $this->articleRepository = $articleRepository;
    }

    /**
     * @param array  $tagNames
     * @param string $offset
     * @param string $limit
     * @param bool   $containTags
     *
     * @return mixed
     */
    abstract protected function doGetArticles(array $tagNames, $offset, $limit, $containTags = true);

    /**
     * @param int $limit
     *
     * @return mixed
     */
    final public function getCover($limit)
    {
        return $this->doGetArticles(
            [Article::SLOT_COVER],
            0,
            $limit
        );
    }

    /**
     * @param int $offset
     * @param int $limit
     *
     * @return mixed
     */
    final public function getJumbo($offset, $limit = 3)
    {
        return $this->doGetArticles(
            [Article::SLOT_COLLECTION],
            $offset,
            $limit
        );
    }

    /**
     * @param int $offset
     *
     * @return mixed
     */
    final public function getFeatured($offset)
    {
        return $this->doGetArticles(
            [Article::SLOT_FEATURED],
            $offset,
            1
        );
    }

    /**
     * @param $offset
     * @param $limit
     *
     * @return mixed
     */
    final public function getTeasers($offset, $limit)
    {
        return $this->doGetArticles(
            [Article::SLOT_FEATURED, Article::SLOT_COLLECTION, Article::SLOT_COVER],
            $offset,
            $limit,
            false
        );
    }
}
