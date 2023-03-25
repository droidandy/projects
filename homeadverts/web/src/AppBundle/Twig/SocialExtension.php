<?php

namespace AppBundle\Twig;

use Twig_Extension;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Article\ArticleRepository;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Service\Analysis\Popular;
use AppBundle\Entity\User\User;

class SocialExtension extends Twig_Extension
{
    /**
     * @var ArticleRepository
     */
    protected $articleRepo;
    /**
     * @var Popular
     */
    protected $popular;
    /**
     * @var UserRepository
     */
    protected $userRepo;

    /**
     * @param ArticleRepository $articleRepo
     * @param UserRepository    $userRepo
     * @param Popular   $popular
     */
    public function __construct(
        ArticleRepository $articleRepo,
        UserRepository $userRepo,
        Popular $popular
    ) {
        $this->articleRepo = $articleRepo;
        $this->userRepo = $userRepo;
        $this->popular = $popular;
    }

    /**
     * @return array
     */
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('published_article_count', array($this, 'publishedArticleCount')),
            new \Twig_SimpleFilter('unpublished_article_count', array($this, 'unPublishedArticleCount')),
            new \Twig_SimpleFilter('likes_count', array($this, 'likesCount')),
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return array(
            'popular_tags' => new \Twig_Function_Method($this, 'popularTags'),
            'popular_articles' => new \Twig_Function_Method($this, 'popularArticles'),
            'is_liked_by_user' => new \Twig_Function_Method($this, 'isLikedByUser'),
            'top_rated_tags' => new \Twig_Function_Method($this, 'topRatedTags'),
            'autocomplete_popular' => new \Twig_Function_Method($this, 'popular'),
        );
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function publishedArticleCount(User $user)
    {
        return $this->articleRepo->getTotalPublishedArticlesForUser($user);
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function unPublishedArticleCount(User $user)
    {
        return $this->articleRepo->getTotalUnPublishedArticlesForUser($user);
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function likesCount(User $user)
    {
        return $this->userRepo->getTotalLikesForUser($user);
    }

    /**
     * @param User             $user
     * @param Article|Property $instance
     *
     * @return bool
     */
    public function isLikedByUser(User $user, $instance)
    {
        return $this->userRepo->isLikedByUser($user, $instance);
    }

    /**
     * @return array
     */
    public function popular()
    {
        return $this->popular->getPopularUsingCache();
    }

    /**
     * @param int $limit
     *
     * @return array
     */
    public function popularArticles($limit)
    {
        return $this->articleRepo->getPublishedArticles(0, $limit);
    }

    /**
     * @return array
     */
    public function topRatedTags()
    {
        return $this->popular->getTopRatedTags();
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'social_extension';
    }
}
