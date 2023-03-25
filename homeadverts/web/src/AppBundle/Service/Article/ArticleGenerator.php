<?php

namespace AppBundle\Service\Article;

use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Entity\Social\Article\ArticleRepository;

class ArticleGenerator
{
    /**
     * @var ArticleService
     */
    private $articleService;
    /**
     * @var PropertyRepository
     */
    private $propertyRepo;
    /**
     * @var ArticleRepository
     */
    private $articleRepo;

    /**
     * @param ArticleService     $articleService
     * @param PropertyRepository $propertyRepo
     * @param ArticleRepository  $articleRepository
     */
    public function __construct(
        ArticleService $articleService,
        PropertyRepository $propertyRepository,
        ArticleRepository $articleRepository
    ) {
        $this->articleService = $articleService;
        $this->propertyRepo = $propertyRepository;
        $this->articleRepo = $articleRepository;
    }

    public function generate()
    {
        //todo: To be updated..
    }
}
