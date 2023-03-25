<?php

namespace AppBundle\Controller;

use AppBundle\Elastic\Property\PropertySearchRepo;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Location\Location;
use AppBundle\Search\Market;

class PropertySearchController extends Controller
{
    /**
     * @param Request $request
     * @param Market  $market
     *
     * @return Response
     */
    public function featuredAction(Request $request, Market $market)
    {
        $page = $request->get('p');
        $propertySearchRepo = $this->get('ha.property.property_search_repo');
        $resultsHelper = $this->get('ha.results.helper');
        $summary = [
            'sale' => $resultsHelper->getTotalFeaturedProperties(new Market('for-sale')),
            'rent' => $resultsHelper->getTotalFeaturedProperties(new Market('to-rent')),
        ];

        $pagination = [];
        $query = $request->query->all();
        for ($i = 1; $i <= $page; ++$i) {
            $searchResults = $propertySearchRepo->findFeaturedProperties(
                $market,
                $query,
                $i,
                $request->attributes->get('geo_strategy')
            );
            $pagination[] = $searchResults['properties'];
        }

        return $this->render('AppBundle:property/collection:results.html.twig', [
            'summary' => $summary,
            'user' => $this->getUser(),

            'article' => false,
            'search' => $searchResults['search'],

            'pagination' => $pagination,
            'requestedPage' => $page,

            'json_url' => '',
            'action' => $this->generateUrl('market_refine', [
                'market' => $market,
            ]),
        ]);
    }

    /**
     * @param Request $request
     * @param Market  $market
     *
     * @return Response
     */
    public function featuredPaginationAction(Request $request, Market $market)
    {
        $page = $request->get('p');
        $propertySearchRepo = $this->get('ha.property.property_search_repo');

        $pagination = [];
        $pagination[] = $propertySearchRepo->findFeaturedProperties(
            $market,
            $request->query->all(),
            $page,
            $request->attributes->get('geo_strategy')
        )['properties'];

        return $this->render('AppBundle:property/collection:items.html.twig', [
            'article' => false,
            'pagination' => $pagination,
            'requestedPage' => $page,
        ]);
    }

    /**
     * @param Request  $request
     * @param Location $location
     * @param Market   $market
     *
     * @return Response
     */
    public function resultsAction(Request $request, Location $location, Market $market)
    {
        $page = $request->get('p');
        $pagination = [];

        /** @var PropertySearchRepo $propertySearchRepo */
        $propertySearchRepo = $this->get('ha.property.property_search_repo');
        $query = $request->query->all();

        for ($i = 1; $i <= $page; ++$i) {
            $searchResults = $propertySearchRepo->findPropertiesByLocation(
                $location,
                $market,
                $query,
                $i,
                $request->attributes->get('geo_strategy')
            );
            $pagination[] = $searchResults['properties'];
        }

        return $this->render('AppBundle:property/collection:results.html.twig', [
            'summary' => $this->get('ha.search.location_repo')->summary($location),
            'user' => $this->getUser(),

            'article' => false,
            'search' => $searchResults['search'],

            'requestedPage' => $page,
            'pagination' => $pagination,

            'action' => $this->generateMarketUrl('search_refine', $market, $location),
            'json_url' => $this->generateMarketUrl(
                'search_results_json',
                $market,
                $location
            ),
        ]);
    }

    /**
     * @param Request  $request
     * @param Location $location
     * @param Market   $market
     *
     * @return Response
     */
    public function resultsPaginationAction(Request $request, Location $location, Market $market)
    {
        $page = $request->get('p');

        $pagination = [];
        $propertySearchRepo = $this->get('ha.property.property_search_repo');
        $searchResults = $propertySearchRepo->findPropertiesByLocation(
            $location,
            $market,
            $request->query->all(),
            $page,
            $request->attributes->get('geo_strategy')
        );
        $pagination[] = $searchResults['properties'];

        return $this->render('AppBundle:property/collection:items.html.twig', [
            'article' => false,
            'search' => $searchResults['search'],

            'requestedPage' => $page,
            'pagination' => $pagination,
        ]);
    }

    /**
     * Process the users request, get the location from DB to avoid Google API
     * calls and redirect to the results page.
     *
     * @param Request     $request
     * @param Market      $market
     * @param string      $term
     * @param string|null $reference
     *
     * @return Response
     */
    public function termAction(Request $request, Market $market, $term, $reference = null)
    {
        $term = urldecode($term);

        $helper = $this->get('ha.search.location.helper');
        $location = $helper->getLocation(
            $term,
            $reference,
            $request->query->get('isCountry', false)
        );

        if ($location instanceof Location) {
            return $this->redirectToRoute('search_results', [
                'market' => $market,
                'id' => $location->getId(),
                'slug' => $location->getSlug(),
            ], 301);
        }

        return $this->redirectToRoute('search_no_location', [
            'term' => $term,
            'market' => $market,
        ]);
    }

    /**
     * @param Request  $request
     * @param Property $property
     *
     * @return JsonResponse
     */
    public function getImagesAction(Request $request, Property $property)
    {
        $offset = $request->get('offset', 0);
        $length = $request->get('length', 10);
        $filter = $request->get('filter', 'property_medium');
        $cacheManager = $this->get('liip_imagine.cache.manager');

        foreach ($property->getPhotos()->slice($offset, $length) as $i => $photo) {
            $images[] = [
                'index' => $i,
                'url' => $cacheManager->getBrowserPath(parse_url($photo->getUrl())['path'], $filter),
            ];
        }

        return new JsonResponse([
            'images' => $images,
            'offset' => $offset,
            'length' => $length,
        ]);
    }

    /**
     * Handles refining filters on market page.
     *
     * @param Request $request
     * @param Market  $market
     *
     * @return Response
     */
    public function refineMarketAction(Request $request, Market $market)
    {
        $filters = $this->get('filter_factory')->create($request, array_merge(
            $request->query->all() ?: [],
            $request->request->get('filters', [])
        ));

        return $this->redirectToRoute('featured_index', array_merge($filters->changed(), [
            'market' => $market,
        ]), 301);
    }

    /**
     * A route for when no results are found from a site property search.
     *
     * @param Request $request
     * @param Market  $market
     * @param string  $term
     *
     * @return Response
     */
    public function noLocationAction(Request $request, Market $market, $term)
    {
        return $this->render('AppBundle::noresult.html.twig', [
            'market' => $market,
            'term' => $term,
        ]);
    }

    /**
     * used to get the properties json for mapping etc.
     *
     * @param Request  $request
     * @param Market   $market
     * @param Location $location
     *
     * @return Response
     */
    public function resultsJsonAction(Request $request, Market $market, Location $location)
    {
        $propertySearchRepo = $this->get('ha.property.property_search_repo');
        $searchResults = $propertySearchRepo->findPropertiesByLocation(
            $location,
            $market,
            $request->query->all(),
            -1,
            $request->attributes->get('geo_strategy')
        );
        $resultsHelper = $this->get('ha.results.helper');
        $collection = [];

        if (count($searchResults) > 0) {
            $collection = $resultsHelper->parsePropertiesForJsonResponse($searchResults);
        }

        return new JsonResponse($collection);
    }

    /**
     * Process the filters and generate a url to redirect to.
     *
     * This method is called as part of an ajax request.
     *
     * @param Request $request
     * @param Market  $market
     * @param int     $id
     * @param string  $slug
     *
     * @return Response
     */
    public function refineAction(Request $request, Market $market, $id, $slug)
    {
        $filters = $this->get('filter_factory')->createFromPostData($request);

        return $this->redirectToRoute('search_results', array_merge($filters->changed(), [
            'market' => $market,
            'id' => $id,
            'slug' => $slug,
        ]), 301);
    }

    /**
     * Generates a URL for a route that uses a location object and market name.
     *
     * @param string   $name
     * @param Market   $market
     * @param Location $location
     * @param array    $params
     *
     * @return string
     */
    private function generateMarketUrl($name, Market $market, Location $location, array $params = [])
    {
        return $this->generateUrl($name, array_merge([
            'market' => $market,
            'id' => $location->getId(),
            'slug' => $location->getSlug(),
        ], $params));
    }
}
