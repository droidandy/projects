<?php

namespace AppBundle\Elastic\Location\View;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\View\ViewInterface;
use AppBundle\Search\Market;
use AppBundle\Search\UserType;
use Symfony\Component\Routing\RouterInterface;

class LocationAggregateView implements ViewInterface
{
    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * SearchLocationView constructor.
     *
     * @param RouterInterface $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function getName()
    {
        return 'location_aggregate';
    }

    /**
     * @param array $results
     *
     * @return array
     */
    public function __invoke($results, $runtimeOptions = [])
    {
        $locations = $runtimeOptions['locations'];
        $properties = $results['property']->getAggregations();
        $agents = $results['agent']->getAggregations();
        $businesses = $results['business']->getAggregations();

        $items = array_filter(array_map(
            function (Location $loc) use ($properties, $agents, $businesses) {
                $sale = $rent = 0;
                foreach ($properties[$loc->getId()]['rental'] as $bucket) {
                    if ('false' == $bucket->getKeyAsString()) {
                        $sale = $bucket->getDocCount();
                    } else {
                        $rent = $bucket->getDocCount();
                    }
                }
                $agentTotal = $agents[$loc->getId()]->getDocCount();
                $businessTotal = $businesses[$loc->getId()]->getDocCount();

                if (!$sale && !$rent && !$agentTotal && !$businessTotal) {
                    return null;
                }

                return [
                    'title' => $loc->getQuery(),
                    'properties' => [
                        'sale' => [
                            'total' => $sale,
                            'url' => $this->router->generate('search_results', [
                                'market' => new Market('for-sale'),
                                'id' => $loc->getId(),
                                'slug' => $loc->getSlug(),
                            ], true),
                        ],
                        'rent' => [
                            'total' => $rent,
                            'url' => $this->router->generate('search_results', [
                                'market' => new Market('to-rent'),
                                'id' => $loc->getId(),
                                'slug' => $loc->getSlug(),
                            ], true),
                        ],
                    ],
                    'agents' => [
                        'total' => $agentTotal,
                        'url' => $this->router->generate('ha_user_search', [
                            'user_type' => new UserType(UserType::AGENT),
                            'id' => $loc->getId(),
                            'slug' => $loc->getSlug(),
                        ], true),
                    ],
                    'businesses' => [
                        'total' => $businessTotal,
                        'url' => $this->router->generate('ha_user_search', [
                            'user_type' => new UserType(UserType::BROKERAGE),
                            'id' => $loc->getId(),
                            'slug' => $loc->getSlug(),
                        ], true),
                    ],
                    'url' => $this->router->generate('search_results', [
                        'market' => new Market('for-sale'),
                        'id' => $loc->getId(),
                        'slug' => $loc->getSlug(),
                    ], true),
                ];
            },
            $locations
        ));

        return [
            'items' => $items,
            'total' => count($items),
        ];
    }
}
