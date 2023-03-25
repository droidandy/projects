<?php

namespace AppBundle\Elastic\User;

use AppBundle\Elastic\Article\Query\ArticleTermQuery;
use AppBundle\Elastic\User\View\MessengerSearchView;
use AppBundle\Entity\Location\Location;
use AppBundle\Entity\User\User;
use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Integration\Query\CompositeQuery;
use AppBundle\Elastic\Integration\Query\Criteria\Type\PaginationType;
use AppBundle\Elastic\Integration\SearchHandler;
use AppBundle\Elastic\Property\Query\PropertyLocationQuery;
use AppBundle\Search\NullLocation;
use AppBundle\Service\User\AdjacencyRegistry;
use AppBundle\Elastic\User\Query\UserLocationQuery;
use AppBundle\Elastic\User\Query\UserSimpleSearchQuery;

class UserSearchRepo
{
    /**
     * @var SearchHandler
     */
    private $searchHandler;
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;

    /**
     * @param SearchHandler $searchHandler
     */
    public function __construct(SearchHandler $searchHandler, AdjacencyRegistry $adjacencyRegistry)
    {
        $this->searchHandler = $searchHandler;
        $this->adjacencyRegistry = $adjacencyRegistry;
    }

    /**
     * @param Location|null $location
     * @param array         $criteria
     * @param int|array     $page
     * @param string        $strategy
     *
     * @return mixed
     */
    public function findAgentsByLocation(
        Location $location = null,
        $criteria = [],
        $page = 1,
        $strategy = 'place_id'
    ) {
        return $this->findByLocation($location, $criteria, $page, $strategy, 'user');
    }

    /**
     * @param Location|null $location
     * @param array         $criteria
     * @param int|array     $page
     * @param string        $strategy
     *
     * @return mixed
     */
    public function findCompaniesByLocation(
        Location $location = null,
        $criteria = [],
        $page = 1,
        $strategy = 'place_id'
    ) {
        return $this->findByLocation($location, $criteria, $page, $strategy, 'company');
    }

    /**
     * @param Location|null $location
     * @param array         $criteria
     * @param int|array     $page
     * @param string        $strategy
     * @param string        $userType
     *
     * @return mixed
     */
    public function findByLocation(
        Location $location = null,
        $criteria = [],
        $page = 1,
        $strategy = 'place_id',
        $userType
    ) {
        $location = $location ?: new NullLocation();
        $criteria = array_merge((array) $criteria, [
            'location' => $location,
            'limit' => $page,
        ]);
        $currentPage = is_array($page) ? $page['page'] : $page;

        $query = new UserLocationQuery($this->adjacencyRegistry, $strategy, $userType);

        $view = function (SearchResults $results) use ($location, $currentPage, $criteria) {
            return [
                'search' => [
                    'location' => $location,
                    'total' => $results->getTotal(),
                    'pages' => [
                        'total' => ceil($results->getTotal() / PaginationType::PER_PAGE),
                        'current' => $currentPage,
                    ],
                ],
                'agents' => $results,
            ];
        };

        return $this->searchHandler->execute($query, $criteria, $view);
    }

    /**
     * @param User $user
     */
    public function summaryForUser(User $user)
    {
        $criteria = [
            'limit' => [
                'from' => 0,
                'size' => 0,
            ],
            'user' => $user->getId(),
            'aggregations' => [
                'rental' => [
                    'terms' => [
                        'field' => 'rental',
                    ],
                ],
            ],
        ];

        $query = new CompositeQuery([
            'agent' => new UserLocationQuery($this->adjacencyRegistry, 'place_id', 'user'),
            'affiliate' => new UserLocationQuery($this->adjacencyRegistry, 'place_id', 'company'),
            'article' => new ArticleTermQuery($this->adjacencyRegistry, true),
            'property' => new PropertyLocationQuery($this->adjacencyRegistry, 'place_id'),
        ]);

        $view = function ($result, $runtimeOptions = []) {
            $properties = [
                'for_sale' => [
                    'total' => 0,
                ],
                'to_rent' => [
                    'total' => 0,
                ],
            ];

            foreach ($result['property']->getAggregations()['rental'] as $bucket) {
                if ('false' == $bucket->getKeyAsString()) {
                    $properties['for_sale'] = [
                        'total' => $bucket->getDocCount(),
                    ];
                } else {
                    $properties['to_rent'] = [
                        'total' => $bucket->getDocCount(),
                    ];
                }
            }

            return [
                'agent' => [
                    'total' => $result['agent']->getTotal(),
                ],
                'affiliate' => [
                    'total' => $result['affiliate']->getTotal(),
                ],
                'article' => [
                    'total' => $result['article']->getTotal(),
                ],
                'property' => $properties,
            ];
        };

        return $this->searchHandler->execute($query, $criteria, $view);
    }

    /**
     * @param string $name
     *
     * @return array
     */
    public function findByName(string $name): array
    {
        $criteria = [
            'term' => $name,
        ];

        $query = new CompositeQuery([
            'user' => new UserSimpleSearchQuery('user', 10),
            'business' => new UserSimpleSearchQuery('business', 10),
        ]);

        $viewClosure = function ($result) {
            $view = new MessengerSearchView();

            return [
                'user' => $view($result['user']),
                'business' => $view($result['business']),
            ];
        };

        return $this->searchHandler->execute($query, $criteria, $viewClosure);
    }
}
