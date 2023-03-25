<?php

namespace AppBundle\Event\Listener;

use AppBundle\Entity\Social\Article;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Service\Article\ArticleMedia;
use JMS\Serializer\EventDispatcher\ObjectEvent;
use JMS\Serializer\JsonSerializationVisitor;
use Symfony\Component\Routing\Router;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ArticleSerializationListener extends AbstractSerializationListener
{
    /**
     * @var Router
     */
    protected $router;
    /**
     * @var ArticleMedia
     */
    protected $articleMedia;
    /**
     * @var TokenStorageInterface
     */
    protected $tokenStorage;
    /**
     * @var UserRepository
     */
    protected $userRepository;
    /**
     * @var bool
     */
    protected $test = false;

    /**
     * @param ArticleMedia          $articleMedia
     * @param Router                $router
     * @param UserRepository        $userRepository
     * @param TokenStorageInterface $tokenStorage
     * @param bool                  $test
     */
    public function __construct(
        ArticleMedia $articleMedia,
        Router $router,
        UserRepository $userRepository,
        TokenStorageInterface $tokenStorage,
        bool $test = false
    ) {
        $this->articleMedia = $articleMedia;
        $this->router = $router;
        $this->tokenStorage = $tokenStorage;
        $this->userRepository = $userRepository;
        $this->test = $test;
    }

    /**
     * @param ObjectEvent $event
     *
     * @return bool|void
     */
    public function onPostSerialize(ObjectEvent $event)
    {
        if ($this->test) {
            return;
        }

        $article = $event->getObject();

        if ($article instanceof Article) {
            /** @var JsonSerializationVisitor $visitor */
            /** @var User $me */
            $visitor = $event->getContext()->getVisitor();

            if ($this->doInjectionsFull($event)) {
                $this->injectFull($visitor, $article);
            }

            $thumbnails = [
                'xs' => $this->articleMedia->getArticlePrimaryImage(
                    $article,
                    Article::FILTER_THUMBNAIL_SMALL_EXTRA
                ),
                's' => $this->articleMedia->getArticlePrimaryImage(
                    $article,
                    Article::FILTER_THUMBNAIL_SMALL
                ),
                'm' => $this->articleMedia->getArticlePrimaryImage(
                    $article,
                    Article::FILTER_THUMBNAIL_MEDIUM
                ),
                'l' => $this->articleMedia->getArticlePrimaryImage(
                    $article,
                    Article::FILTER_THUMBNAIL_LARGE
                ),
            ];

            $visitor->addData('thumbnail', $thumbnails);
        }
    }


    public function injectFull(JsonSerializationVisitor $visitor, Article $article)
    {
        $me = $this->tokenStorage->getToken()->getUser();

        $urls = [
            'details' => $this->router->generate('ha_article_details', [
                'token' => $article->getToken(),
                'slug' => $article->getSlug(),
            ], Router::ABSOLUTE_URL),
            'like' => $this->router->generate('ha_article_like_add', [
                'id' => $article->getToken(),
            ], Router::ABSOLUTE_URL),
        ];

        $visitor->addData('url', $urls);

        if ($me instanceof User) {
            $visitor->addData('isLiked', $this->userRepository->isLikedByUser($me, $article));
        } else {
            $visitor->addData('isLiked', false);
        }
    }
}
