<?php

namespace AppBundle\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AutocompleteController extends Controller
{
    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function indexAction(Request $request)
    {
        $term = json_decode($request->getContent(), true)['term'];

        $search = $this
            ->get('ha.search.location_repo')
            ->findAggregationsPerLocation(
                $term,
                'place_id'
            );

        return new JsonResponse($search);
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function userAction(Request $request)
    {
        $term = $request->query->get('term');

        $result = $this->get('ha.user.user_search_repo')->findByName($term);

        return new JsonResponse($result);
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function tagAction(Request $request)
    {
        $term = $request->query->get('term');

        $result = $this->get('ha.tag.search_repo')->findByName($term);

        return new JsonResponse($result);
    }
}
