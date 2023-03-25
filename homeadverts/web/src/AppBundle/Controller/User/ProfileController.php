<?php

namespace AppBundle\Controller\User;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyRepository;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use AppBundle\Search\Market;
use AppBundle\Search\UserType;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Social\Article\ArticleRepository;
use AppBundle\Entity\User\UserRepository;

class ProfileController extends Controller
{
    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return RedirectResponse
     */
    public function redirectAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        $routeTo = $this->get('ha.profile_index_route_strategy')->getRoute(
            $request,
            $user
        );

        return $this->redirectToRoute($routeTo, [
            'id' => $user->getId(),
            'slug' => $user->slug(),
        ], 301);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function usersAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        $paginator = $this->get('ha.paginator');
        $userSearchRepo = $this->get('ha.user.user_search_repo');
        $page = $request->get('p');
        $pagination = [];
        $query = $request->query->all();
        $userType = new UserType($request->attributes->get('user_type'));
        $searchMethod = $this->getSearchMethod($request);

        for ($i = 1; $i <= $page; ++$i) {
            $searchResults = $userSearchRepo->$searchMethod(
                null,
                array_merge(
                    $query,
                    [
                        'user' => $user->getId(),
                    ]
                ),
                $page
            );
            $pagination[] = $searchResults['agents'];
        }

        return $this->render('AppBundle:user/profile/section:users.html.twig', [
            'form_profile_image' => $this->createForm('profile_image', $this->getUser())->createView(),
            'form_background_image' => $this->createForm('background_image', $this->getUser())->createView(),
            'search' => $searchResults['search'],

            'pageTotal' => $searchResults['search']['pages']['total'],
            'page' => $page,
            'requestedPage' => $page,
            'pagination' => $pagination,

            'is_directory' => true,
            'user' => $user,
            'user_type' => $userType,
            'actions' => $this->get('ha.user_profile')->getUserActions($user),
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function usersPaginationAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        $page = $request->get('p');
        $userType = new UserType($request->attributes->get('user_type'));
        $searchMethod = $userType->isAgent() ? 'findAgentsByLocation' : 'findCompaniesByLocation';
        $query = $request->query->all();

        $searchResults = $this->get('ha.user.user_search_repo')->$searchMethod(
            null,
            array_merge(
                $query,
                [
                    'user' => $user->getId(),
                ]
            ),
            $page
        );

        $pagination = [$searchResults['agents']];

        return $this->render('AppBundle:user/profile/section:user_collection.html.twig', [
            'pagination' => $pagination,
            'pageTotal' => $searchResults['search']['pages']['total'],
            'page' => $page,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function articlesAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        /** @var ArticleRepository $repo */
        $paginator = $this->get('ha.paginator');
        $repo = $this->get('article_repo');
        $isPublished = 'draft' != $request->get('status');
        $page = $request->get('p');
        $pagination = [];

        if ($isPublished) {
            $pageTotal = $paginator->getPageTotal(
                $repo->getTotalPublishedArticlesForUser($user)
            );

            for ($i = 1; $i <= $page; ++$i) {
                $articles = $repo->getPublishedUserArticles(
                    $user,
                    $paginator->getOffset($i),
                    $paginator->getPageLimit()
                );
                $pagination[] = $articles;
            }
        } else {
            $pageTotal = $paginator->getPageTotal(
                $repo->getTotalUnPublishedArticlesForUser($user)
            );

            for ($i = 1; $i <= $page; ++$i) {
                $articles = $repo->getUnpublishedUserArticles(
                    $user,
                    $paginator->getOffset($i),
                    $paginator->getPageLimit()
                );
                $pagination[] = $articles;
            }
        }

        return $this->render('AppBundle:user/profile/section:articles.html.twig', [
            'form_profile_image' => $this->createForm('profile_image', $this->getUser())->createView(),
            'form_background_image' => $this->createForm('background_image', $this->getUser())->createView(),
            'user' => $user,
            'actions' => $this->get('ha.user_profile')->getUserActions($user),
            'is_published' => $isPublished,

            'pagination' => $pagination,
            'pageTotal' => $pageTotal,
            'page' => $page,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function articlesPaginationAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);
        /** @var ArticleRepository $repo */
        $paginator = $this->get('ha.paginator');
        $repo = $this->get('article_repo');
        $isPublished = 'draft' != $request->get('status');
        $page = $request->get('p');
        $pagination = [];

        if ($isPublished) {
            $articles = $repo->getPublishedUserArticles(
                $user,
                $paginator->getOffset($page),
                $paginator->getPageLimit()
            );
            $pagination[] = $articles;
        } else {
            $articles = $repo->getUnpublishedUserArticles(
                $user,
                $paginator->getOffset($page),
                $paginator->getPageLimit()
            );
            $pagination[] = $articles;
        }

        return $this->render('AppBundle:user/profile/section:articles_collection.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @param $market
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return RedirectResponse|Response
     */
    public function propertiesAction(Request $request, User $user, $market)
    {
        /**
         * @var PropertyRepository $propertyRepo
         */
        $this->assertUserAccessible($user);

        $paginator = $this->get('ha.paginator');
        $propertyRepo = $this->get('property_repo');
        $page = $request->get('p');
        $pagination = [];

        $pageTotal = $paginator->getPageTotal($user->propertyForSaleCount);

        if ('to-rent' == $market) {
            $pageTotal = $paginator->getPageTotal($user->propertyToRentCount);
        }

        for ($i = 1; $i <= $page; ++$i) {
            $pagination[] = $propertyRepo->getPropertiesForUser(
                $user,
                Property::marketToAvailability($market),
                $paginator->getOffset($i),
                $paginator->getPageLimit()
            );
        }

        return $this->render('AppBundle:user/profile/section:properties.html.twig', [
            'form_profile_image' => $this->createForm('profile_image', $this->getUser())->createView(),
            'form_background_image' => $this->createForm('background_image', $this->getUser())->createView(),
            'market' => $market,

            'pageTotal' => $pageTotal,
            'requestedPage' => $page,
            'pagination' => $pagination,

            'is_directory' => true,
            'user' => $user,
            'actions' => $this->get('ha.user_profile')->getUserActions($user),
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @param $market
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return RedirectResponse|Response
     */
    public function propertiesPaginationAction(Request $request, User $user, $market)
    {
        $this->assertUserAccessible($user);
        $page = $request->get('p');
        $paginator = $this->get('ha.paginator');

        $pagination = [];

        $pagination[] = $this->get('property_repo')->getPropertiesForUser(
            $user,
            Property::marketToAvailability($market),
            $paginator->getOffset($page),
            $paginator->getPageLimit()
        );

        return $this->render('AppBundle:property/collection:items.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function followersAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        /** @var UserRepository $repo */
        $paginator = $this->get('ha.paginator');
        $page = $request->get('p');
        $repo = $this->get('user_repo');

        $pagination = [];
        $pageTotal = $paginator->getPageTotal(
            $repo->getTotalUserFollowers($user)
        );

        for ($i = 1; $i <= $page; ++$i) {
            $followers = $repo->getUserFollowers(
                $user,
                $paginator->getOffset($i),
                $paginator->getPageLimit()
            );
            $pagination[] = $followers;
        }

        return $this->render('AppBundle:user/profile/section:followers.html.twig', [
            'form_profile_image' => $this->createForm('profile_image', $this->getUser())->createView(),
            'form_background_image' => $this->createForm('background_image', $this->getUser())->createView(),
            'user' => $user,
            'actions' => $this->get('ha.user_profile')->getUserActions($user),

            'pagination' => $pagination,
            'pageTotal' => $pageTotal,
            'page' => $page,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function followersPaginationAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        /** @var UserRepository $repo */
        $paginator = $this->get('ha.paginator');
        $page = $request->get('p');

        $pagination = [];
        $pagination[] = $this->get('user_repo')->getUserFollowers(
            $user,
            $paginator->getOffset($page),
            $paginator->getPageLimit()
        );

        return $this->render('AppBundle:user/profile/section:user_collection.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function followingsAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        /** @var UserRepository $repo */
        $paginator = $this->get('ha.paginator');
        $page = $request->get('p');
        $repo = $this->get('user_repo');

        $pagination = [];
        $pageTotal = $paginator->getPageTotal(
            $repo->getTotalUserFollowings($user)
        );

        for ($i = 1; $i <= $page; ++$i) {
            $followings = $repo->getUserFollowings(
                $user,
                $paginator->getOffset($i),
                $paginator->getPageLimit()
            );
            $pagination[] = $followings;
        }

        return $this->render('AppBundle:user/profile/section:followings.html.twig', [
            'form_profile_image' => $this->createForm('profile_image', $this->getUser())->createView(),
            'form_background_image' => $this->createForm('background_image', $this->getUser())->createView(),
            'user' => $user,
            'actions' => $this->get('ha.user_profile')->getUserActions($user),

            'pagination' => $pagination,
            'pageTotal' => $pageTotal,
            'page' => $page,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function followingsPaginationAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        /** @var UserRepository $repo */
        $paginator = $this->get('ha.paginator');
        $page = $request->get('p');

        $pagination[] = [];
        $pagination[] = $this->get('user_repo')->getUserFollowings(
            $user,
            $paginator->getOffset($page),
            $paginator->getPageLimit()
        );

        return $this->render('AppBundle:user/profile/section:user_collection.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function likesAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        /** @var UserRepository $repo */
        $paginator = $this->get('ha.paginator');
        $page = $request->get('p');
        $repo = $this->get('user_repo');

        $pagination = [];
        $pageTotal = $paginator->getPageTotal(
            $repo->getTotalLikesForUser($user)
        );

        for ($i = 1; $i <= $page; ++$i) {
            $articles = $repo->getArticlesLikedByUser(
                $user,
                $paginator->getOffset($i),
                $paginator->getPageLimit()
            );
            $pagination[] = $articles;
        }

        return $this->render('AppBundle:user/profile/section:likes.html.twig', [
            'form_profile_image' => $this->createForm('profile_image', $this->getUser())->createView(),
            'form_background_image' => $this->createForm('background_image', $this->getUser())->createView(),
            'user' => $user,
            'actions' => $this->get('ha.user_profile')->getUserActions($user),

            'pagination' => $pagination,
            'pageTotal' => $pageTotal,
            'page' => $page,
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function likesPaginationAction(Request $request, User $user)
    {
        $this->assertUserAccessible($user);

        /** @var UserRepository $repo */
        $paginator = $this->get('ha.paginator');
        $page = $request->get('p');

        $pagination = [];
        $pagination[] = $this->get('user_repo')->getArticlesLikedByUser(
            $user,
            $paginator->getOffset($page),
            $paginator->getPageLimit()
        );

        return $this->render('AppBundle:user/profile/section:articles_collection.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param User $user
     * @param string $networkName
     * @ParamConverter("user", class="AppBundle:User\User")
     *
     * @return Response
     */
    public function socialProfileRedirectAction(User $user, $networkName)
    {
        return new RedirectResponse(
            $this->get('ha.user_profile')->getSocialProfileLink($user, $networkName)
        );
    }

    /**
     * @param User $user
     */
    private function assertUserAccessible(User $user)
    {
        if ($user->isDeleted() && !$this->getUser()->hasRole(User::ROLE_ADMIN)) {
            throw new NotFoundHttpException('User not found');
        }
    }

    /**
     * @param Request $request
     *
     * @return string
     */
    private function getSearchMethod(Request $request)
    {
        $userType = new UserType($request->attributes->get('user_type'));
        $searchMethod = $userType->isAgent() ? 'findAgentsByLocation' : 'findCompaniesByLocation';

        return $searchMethod;
    }
}
