<?php

namespace AppBundle\Controller\IndexRouteStrategy;

use AppBundle\Entity\Social\Article\ArticleRepository;
use AppBundle\Entity\User\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Router;

class ProfileIndexRouteStrategy implements IndexRouteStrategyInterface
{
    /**
     * @var Router
     */
    private $router;
    /**
     * @var ArticleRepository
     */
    private $articleRepository;
    /**
     * @var array
     */
    private $propertyRoutes = [
        'featured_index',
        'property_details',
        'search_results',
    ];

    /**
     * @param Router            $router
     * @param ArticleRepository $articleRepository
     */
    public function __construct(Router $router, ArticleRepository $articleRepository)
    {
        $this->router = $router;
        $this->articleRepository = $articleRepository;
    }

    /**
     * @param Request $request
     * @param array   ...$args
     *
     * @return string
     */
    public function getRoute(Request $request, ...$args)
    {
        /** @var User $user */
        $user = $args[0];

        $totalArticles = $this->articleRepository->getTotalPublishedArticlesForUser($user);
        $routeFrom = $this->getRouteFromRequest($request);
        $fromProperties = in_array($routeFrom, $this->propertyRoutes);

        if (!$fromProperties) {
            if ($totalArticles) {
                return 'ha_user_articles';
            }
            if ($user->getFollowersCount()) {
                return 'ha_user_followers';
            }
            if ($user->getFollowingsCount()) {
                return 'ha_user_followings';
            }
            if ($request->getUser() == $user) {
                return 'ha_user_likes';
            }
        }

        return 'ha_user_properties';
    }

    /**
     * @param Request $request
     *
     * @return string|null
     */
    private function getRouteFromRequest(Request $request)
    {
        $match = $this->router->matchRequest($request);

        if ($match) {
            return $match['_route'];
        }
    }
}
