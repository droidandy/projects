<?php

namespace AppBundle\Controller\User;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Entity\User\User;
use AppBundle\Form\DirectoryFiltersType;
use AppBundle\Entity\Location\Location;
use AppBundle\Search\UserType;

class SearchController extends Controller
{
    /**
     * @param Request  $request
     * @param Location $location
     * @param UserType $userType
     *
     * @return Response
     *
     * @throws \Exception
     */
    public function locationAction(Request $request, Location $location, UserType $userType)
    {
        $filters = $request->query->get('filters');
        $page = $request->get('p');
        $userSearchRepo = $this->get('ha.user.user_search_repo');
        $searchMethod = $userType->isAgent() ? 'findAgentsByLocation' : 'findCompaniesByLocation';

        $pagination = [];
        for ($i = 1; $i <= $page; ++$i) {
            $searchResults = $userSearchRepo->$searchMethod(
                $location,
                $filters,
                $page,
                $request->attributes->get('geo_strategy')
            );

            $pagination[] = $searchResults['agents'];
        }

        return $this->render('AppBundle:user:collection/results.html.twig', [
            'summary' => $this->get('ha.search.location_repo')->summary($location),
            'user_type' => $userType->getType(),
            'search' => $searchResults['search'],
            'form' => $this->createFilters($filters)->createView(),

            'currentPage' => $page,
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request  $request
     * @param Location $location
     * @param UserType $userType
     *
     * @return Response
     *
     * @throws \Exception
     */
    public function locationPaginationAction(Request $request, Location $location, UserType $userType)
    {
        $filters = $request->query->get('filters');
        $page = $request->get('p');
        $userSearchRepo = $this->get('ha.user.user_search_repo');
        $searchMethod = $userType->isAgent() ? 'findAgentsByLocation' : 'findCompaniesByLocation';

        $searchResults = $userSearchRepo->$searchMethod(
            $location,
            $filters,
            $page,
            $request->attributes->get('geo_strategy')
        );
        $pagination[] = $searchResults['agents'];

        return $this->render('AppBundle:user:collection/items.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request  $request
     * @param Location $location
     * @param UserType $userType
     *
     * @return JsonResponse
     *
     * @throws \Exception
     */
    public function mapAction(Request $request, Location $location, UserType $userType)
    {
        $filters = $request->query->get('filters');
        $data = [];
        $userSearchRepo = $this->get('ha.user.user_search_repo');
        $searchMethod = $userType->isAgent() ? 'findAgentsByLocation' : 'findCompaniesByLocation';

        $searchResults = $userSearchRepo->$searchMethod(
            $location,
            $filters,
            -1,
            $request->attributes->get('geo_strategy')
        );

        if (count($searchResults['agents']) > 0) {
            $data = $this->parseAgentsForJsonResponse($searchResults['agents']);
        }

        return new JsonResponse($data);
    }

    /**
     * @param string $term
     *
     * @return Response
     */
    public function termAction($term)
    {
        $term = urldecode($term);

        $location = $this->get('ha.search.location.helper')->getLocation(
            $term,
            null,
            false
        );

        if ($location instanceof Location) {
            return $this->redirectToRoute('ha_user_search', [
                'user_type' => 'agent',
                'id' => $location->getId(),
                'slug' => $location->getSlug(),
            ], 301);
        }

        return $this->redirectToRoute('search_no_location', [
            'term' => $term,
            'market' => 'for-sale',
        ]);
    }

    /**
     * @param array|null $filters
     *
     * @return \Symfony\Component\Form\Form
     */
    private function createFilters($filters)
    {

        return $this->createForm(
            new DirectoryFiltersType(),
            $filters
        );
    }

    /**
     * central point where properties can be parsed into the right format.
     *
     * Please note: Properties must have been decorated with images or errors will occur
     *
     * @param SearchResults $agents
     *
     * @return array
     */
    private function parseAgentsForJsonResponse($agents)
    {
        $router = $this->get('router');
        $imageHelper = $this->get('ha.image_helper');

        //run through the results keeping only what we really need
        $mapped = array_map(function (User $agent) use ($router, $imageHelper) {
            return [
                'id' => $agent->getId(),
                'url' => $router->generate('ha_user_profile', [
                    'id' => $agent->getId(),
                    'slug' => $agent->slug(),
                ]),
                'location' => [
                    $agent->getAddress()->getLatitude(),
                    $agent->getAddress()->getLongitude(),
                ],
                'name' => $agent->getName(),
                'company' => $agent->getCompanyName(),
                'profileImage' => $imageHelper->userProfileImage($agent),
            ];
        }, iterator_to_array($agents));

        return array_filter($mapped);
    }
}
