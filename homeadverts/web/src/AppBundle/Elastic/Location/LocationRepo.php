<?php

namespace AppBundle\Elastic\Location;

use AppBundle\Elastic\Article\Query\ArticleTermQuery;
use AppBundle\Entity\Location\Location;
use AppBundle\Entity\User\User;
use AppBundle\Elastic\Integration\Query\CompositeQuery;
use AppBundle\Elastic\Integration\SearchHandler;
use AppBundle\Elastic\Integration\View\ViewRegistry;
use AppBundle\Geo\GeometryServiceInterface;
use AppBundle\Elastic\Property\Query\PropertyLocationAggregateQuery;
use AppBundle\Elastic\Property\Query\PropertySimpleSearchQuery;
use AppBundle\Search\LocationFactory;
use AppBundle\Service\User\AdjacencyRegistry;
use AppBundle\Elastic\Tag\Query\TagAutocompleteQuery;
use AppBundle\Elastic\User\Query\UserLocationAggregateQuery;
use AppBundle\Elastic\User\Query\UserSimpleSearchQuery;

class LocationRepo
{
    const TERM_MIN_LENGTH = 3;
    /**
     * @var ViewRegistry
     */
    private $viewRegistry;
    /**
     * @var SearchHandler
     */
    private $searchHandler;
    /**
     * @var LocationFactory
     */
    private $locationFactory;
    /**
     * @var GeometryServiceInterface
     */
    private $geometryService;
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;

    /**
     * @param ViewRegistry             $viewRegistry
     * @param SearchHandler            $searchHandler
     * @param LocationFactory          $locationFactory
     * @param GeometryServiceInterface $geometryService
     * @param AdjacencyRegistry        $adjacencyRegistry
     */
    public function __construct(
        ViewRegistry $viewRegistry,
        SearchHandler $searchHandler,
        LocationFactory $locationFactory,
        GeometryServiceInterface $geometryService,
        AdjacencyRegistry $adjacencyRegistry
    ) {
        $this->viewRegistry = $viewRegistry;
        $this->searchHandler = $searchHandler;
        $this->locationFactory = $locationFactory;
        $this->geometryService = $geometryService;
        $this->adjacencyRegistry = $adjacencyRegistry;
    }

    /**
     * @param string $term
     * @param string $strategy
     *
     * @return mixed
     */
    public function findAggregationsPerLocation($term, $strategy = 'place_id')
    {
        if (strlen($term) < self::TERM_MIN_LENGTH) {
            throw new \LogicException('Search term is too small or missing');
        }

        $criteria = [
            'term' => $term,
        ];
        $queries = [
            'id' => new PropertySimpleSearchQuery('id'),
            'zip' => new PropertySimpleSearchQuery('zip'),
            'ref' => new PropertySimpleSearchQuery('sourceRef'),
            'guid' => new PropertySimpleSearchQuery('sourceGuid'),
            'agent' => new UserSimpleSearchQuery('user', 3),
            'business' => new UserSimpleSearchQuery('business', 3),
            'article' => new ArticleTermQuery($this->adjacencyRegistry, true),
            'tag' => new TagAutocompleteQuery(),
        ];

        if (is_numeric($term)) {
            $queries['mls'] = new PropertySimpleSearchQuery('mls');
            $queries['zip'] = new PropertySimpleSearchQuery('zip');
        }

        $locations = $this->locationFactory->getLocationsFromPredictions($term);

        if (!empty($locations)) {
            if ('bound' == $strategy) {
                $this->geometryService->warmupGeometries($locations);
            }
            $criteria['locations'] = $locations;
            $queries['location'] = new CompositeQuery([
                'property' => new PropertyLocationAggregateQuery($strategy),
                'business' => new UserLocationAggregateQuery($strategy, User::TYPE_COMPANY),
                'agent' => new UserLocationAggregateQuery($strategy, User::TYPE_USER),
            ]);
        }

        $query = new CompositeQuery($queries);

        $view = function ($result, $runtimeOptions) use ($locations, $term) {
            $propertySimpleSearchView = $this->viewRegistry->get('property_simple_search');
            $userSimpleSearchView = $this->viewRegistry->get('user_simple_search');
            $articleAutocompleteView = $this->viewRegistry->get('article_autocomplete');
            $tagAutocompleteView = $this->viewRegistry->get('tag_autocomplete');

            $aggregateResponse = [
                'id' => $propertySimpleSearchView($result['id'], $runtimeOptions),
                'ref' => $propertySimpleSearchView($result['ref'], $runtimeOptions),
                'guid' => $propertySimpleSearchView($result['guid'], $runtimeOptions),
                'agent' => $userSimpleSearchView($result['agent'], $runtimeOptions),
                'business' => $userSimpleSearchView($result['business'], $runtimeOptions),
                'article' => $articleAutocompleteView($result['article'], $runtimeOptions),
                'tag' => $tagAutocompleteView($result['tag'], $runtimeOptions),
                'mls' => [],
                'zip' => [],
            ];

            if (is_numeric($term)) {
                $aggregateResponse['mls'] = $propertySimpleSearchView($result['mls'], $runtimeOptions);
                $aggregateResponse['zip'] = $propertySimpleSearchView($result['zip'], $runtimeOptions);
            }

            if (!empty($locations)) {
                $locationAggregateView = $this->viewRegistry->get('location_aggregate');
                $aggregateResponse['location'] = $locationAggregateView(
                    $result['location'],
                    array_merge($runtimeOptions, [
                        'locations' => $locations,
                    ])
                );
            } else {
                $aggregateResponse['location'] = [
                    'items' => [],
                    'total' => 0,
                ];
            }

            return $aggregateResponse;
        };

        return $this->searchHandler->execute($query, $criteria, $view);
    }

    /**
     * @param Location $location
     * @param string   $strategy
     *
     * @return mixed
     */
    public function summary(Location $location, $strategy = 'place_id')
    {
        if ('bound' == $strategy) {
            $this->geometryService->warmupGeometries([$location]);
        }

        $criteria = [
            'term' => $location->getQuery(),
            'locations' => [$location],
        ];

        $query = new CompositeQuery([
            'location' => new CompositeQuery([
                'property' => new PropertyLocationAggregateQuery($strategy),
                'agent' => new UserLocationAggregateQuery($strategy, User::TYPE_USER),
                'business' => new UserLocationAggregateQuery($strategy, User::TYPE_COMPANY),
            ]),
        ]);

        $view = function ($result, $runtimeOptions = []) use ($location) {
            $locationAggregateView = $this->viewRegistry->get('location_aggregate');

            return [
                'location' => $locationAggregateView($result['location'], array_merge($runtimeOptions, [
                    'locations' => [$location],
                ])),
            ];
        };

        return $this->searchHandler->execute($query, $criteria, $view);
    }
}
