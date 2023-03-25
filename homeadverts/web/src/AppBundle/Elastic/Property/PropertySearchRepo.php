<?php

namespace AppBundle\Elastic\Property;

use AppBundle\Entity\Location\Location;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Integration\Query\Criteria\Type\PaginationType;
use AppBundle\Elastic\Integration\SearchHandler;
use AppBundle\Elastic\Property\Query\PropertyByCountryCountQuery;
use AppBundle\Elastic\Property\Query\PropertyLocationQuery;
use AppBundle\Elastic\Property\Query\PropertyRelatedQuery;
use AppBundle\Search\FilterFactory;
use AppBundle\Search\Market;
use AppBundle\Search\NullLocation;
use AppBundle\Service\User\AdjacencyRegistry;
use Doctrine\Common\Cache\Cache;
use AppBundle\Entity\User\User;

class PropertySearchRepo
{
    const PRICE_STATS_PREFIX = 'price_stats';
    const TTL = 86400;
    /**
     * @var SearchHandler
     */
    private $searchHandler;
    /**
     * @var FilterFactory
     */
    private $filterFactory;
    /**
     * @var Cache
     */
    private $cache;
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;
    /**
     * @var PropertyRepository
     */
    private $propertyRepo;

    /**
     * PropertySearchRepo constructor.
     *
     * @param PropertyRepository $propertyRepo
     * @param SearchHandler      $searchHandler
     * @param FilterFactory      $filterFactory
     * @param Cache              $cache
     */
    public function __construct(
        PropertyRepository $propertyRepo,
        SearchHandler $searchHandler,
        FilterFactory $filterFactory,
        Cache $cache,
        AdjacencyRegistry $adjacencyRegistry
    ) {
        $this->propertyRepo = $propertyRepo;
        $this->searchHandler = $searchHandler;
        $this->filterFactory = $filterFactory;
        $this->cache = $cache;
        $this->adjacencyRegistry = $adjacencyRegistry;
    }

    /**
     * @param Location  $location
     * @param Market    $market
     * @param array     $criteria
     * @param array|int $page
     * @param string    $strategy
     *
     * @return mixed
     */
    public function findPropertiesByLocation(
        Location $location = null,
        Market $market,
        array $criteria = [],
        $page = 1,
        $strategy = 'place_id'
    ) {
        $location = $location ?: new NullLocation();
        $criteria = array_merge($criteria, [
            'location' => $location,
            'market' => $market,
            'limit' => $page,
        ]);

        return $this->buildSearchResultsForLocation($location, $market, $criteria, $page, $strategy);
    }

    /**
     * @param Market    $market
     * @param array     $criteria
     * @param array|int $page
     *
     * @return mixed
     */
    public function findFeaturedProperties(
        Market $market,
        array $criteria = [],
        $page = 1,
        $strategy = 'place_id'
    ) {
        $location = new NullLocation();

        $criteria = array_merge($criteria, [
            'location' => $location,
            'featured' => true,
            'market' => $market,
            'limit' => $page,
        ]);

        if (!isset($criteria['sort'])) {
            $criteria['sort'] = 'featuredAt:desc';
        }

        return $this->buildSearchResultsForLocation($location, $market, $criteria, $page, $strategy);
    }

    /**
     * @param User      $user
     * @param Market    $market
     * @param array     $criteria
     * @param array|int $page
     * @param string    $strategy
     *
     * @return mixed
     */
    public function findPropertiesByUser(
        User $user,
        Market $market,
        array $criteria = [],
        $page = 1,
        $strategy = 'place_id'
    ) {
        $criteria = array_merge($criteria, [
            'user' => $user->getId(),
            'market' => $market,
            'limit' => $page,
        ]);

        $query = new PropertyLocationQuery($this->adjacencyRegistry, $strategy);

        $view = function (SearchResults $results, $options) use ($user, $market, $page, $criteria) {
            $priceStat = $this->findPriceStats($criteria);

            return [
                'search' => [
                    'user' => $user,
                    'market' => $market,
                    'pages' => [
                        'total' => ceil($results->getTotal() / PaginationType::PER_PAGE),
                        'current' => $page,
                    ],
                    'currency' => $options['resolved_criteria']['price']['currency'],
                    'form' => $this->filterFactory->getFormQuery($criteria, $results, $priceStat),
                ],
                'properties' => $results,
            ];
        };

        $data = $this->searchHandler->execute($query, $criteria, $view);

        return $this->transformToPropertyEntities($data);
    }

    /**
     * @param Property $property
     * @param int      $limit
     *
     * @return SearchResults
     */
    public function findRelated(Property $property, $limit = 6)
    {
        $query = new PropertyRelatedQuery();
        $view = function (SearchResults $results) {
            return [
                'properties' => $results,
            ];
        };

        $data = $this->searchHandler->execute(
            $query,
            [
                'property' => $property,
                'limit' => [
                    'from' => 0,
                    'to' => $limit,
                ],
            ],
            $view
        );

        return $this->transformToPropertyEntities($data)['properties'];
    }

    /**
     * @param string $market
     *
     * @return array
     */
    public function findPropertyCountByCountries($market = Property::MARKET_ALL)
    {
        $query = new PropertyByCountryCountQuery();
        $view = function (SearchResults $results) {
            $aggregations = $results->getAggregations();

            $output = [];
            foreach ($aggregations['by_country'] as $aggregation) {
                $output[$aggregation->getKey()] = $aggregation->getDocCount();
            }

            return $output;
        };

        $data = $this->searchHandler->execute($query, ['market' => $market], $view);

        return $this->transformToPropertyEntities($data);
    }

    /**
     * @param Location $location
     * @param Market   $market
     * @param array    $criteria
     * @param int      $page
     * @param string   $strategy
     *
     * @return mixed
     */
    private function buildSearchResultsForLocation(
        $location,
        Market $market,
        array $criteria,
        $page,
        $strategy = 'place_id'
    ) {
        $currentPage = is_array($page) ? $page['page'] : $page;
        $query = new PropertyLocationQuery($this->adjacencyRegistry, $strategy);

        $view = function (SearchResults $results, $options) use ($location, $market, $currentPage, $criteria) {
            $priceStat = $this->findPriceStats($criteria);

            return [
                'search' => [
                    'location' => $location,
                    'market' => $market,
                    'pages' => [
                        'total' => ceil($results->getTotal() / PaginationType::PER_PAGE),
                        'current' => $currentPage,
                    ],
                    'hits' => $results->getTotal(),
                    'error' => $results->getError(),
                    'currency' => $options['resolved_criteria']['price']['currency'],
                    'form' => $this->filterFactory->getFormQuery($criteria, $results, $priceStat),
                ],
                'properties' => $results,
            ];
        };

        $data = $this->searchHandler->execute($query, $criteria, $view);

        return $this->transformToPropertyEntities($data);
    }

    public function findPriceStats(array $criteria = [])
    {
        $criteria = array_intersect_key($criteria, array_flip([
            'user',
            'market',
            'location',
            'featured',
        ]));
        $cacheKey = $this->calculatePriceStatCacheKey($criteria);

        $priceStats = $this->cache->fetch($cacheKey);
        if (!$priceStats) {
            $criteria['limit'] = [
                'page' => 1,
                'per_page' => 0,
            ];
            $query = new PropertyLocationQuery($this->adjacencyRegistry, 'place_id');

            $view = function (SearchResults $results) {
                $aggs = $results->getAggregations();

                return [
                    'min_price' => isset($aggs['min_price']) ? $aggs['min_price']->getValue() : false,
                    'max_price' => isset($aggs['max_price']) ? $aggs['max_price']->getValue() : false,
                    'avg_price' => isset($aggs['avg_price']) ? $aggs['avg_price']->getValue() : false,
                ];
            };

            $priceStats = $this->searchHandler->execute($query, $criteria, $view);

            $this->cache->save($cacheKey, $priceStats, self::TTL);
        }

        return $priceStats;
    }

    /**
     * @param $criteria
     *
     * @return string
     */
    private function calculatePriceStatCacheKey($criteria)
    {
        $values = [];
        foreach ($criteria as $key => $value) {
            switch ($key) {
                case 'user':
                    $values[] = $value; break;
                case 'market':
                    $values[] = $value->getType(); break;
                case 'location':
                    $values[] = $value->getId(); break;
                case 'featured':
                    $values[] = $value ? '1' : '0'; break;
            }
        }

        return self::PRICE_STATS_PREFIX.implode('|', $values);
    }

    /**
     * @param $data
     *
     * @return mixed
     */
    private function transformToPropertyEntities($data)
    {
        $ids = [];

        foreach ($data['properties'] as $rawProperty) {
            $ids[] = $rawProperty->id;
        }

        $properties = $this->propertyRepo->findBy([
            'id' => $ids,
        ]);
        $data['properties'] = $properties;

        return $data;
    }
}
