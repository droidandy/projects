<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;

abstract class AbstractLocationAggregateQueryTemplate implements QueryInterface
{
    const SEARCH_LIMIT = 0;

    /**
     * @var string
     */
    private $field;

    /**
     * @var LocationQueryStrategyInterface
     */
    private $strategy;

    /**
     * @param $strategy
     */
    public function __construct($strategy = 'place_id')
    {
        switch ($strategy) {
            case 'bound':
                $this->field = 'location';
                $this->strategy = new BoundLocationQueryStrategy(); break;
            case 'place_id':
                $this->field = 'googleLocations.placeId';
                $this->strategy = new PlaceIdLocationQueryStrategy(); break;
        }
    }

    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $this->strategy->configureCriteria($criteriaBuilder);
    }

    /**
     * @param array                   $criteria
     * @param RequestFactoryInterface $requestFactory
     *
     * @return RequestInterface
     */
    public function build(array $criteria, RequestFactoryInterface $requestFactory)
    {
        $query = [
            'from' => 0,
            'size' => self::SEARCH_LIMIT,
        ];

        $aggregations = [];
        foreach ($criteria['locations'] as $k => $loc) {
            $aggregation = [
                'filter' => $this->strategy->locationQuery($this->field, $loc),
            ];
            if ($aggregationsPerLocation = $this->getPerLocationAggregations()) {
                $aggregation['aggregations'] = $aggregationsPerLocation;
            }

            $aggregations[$loc->getId()] = $aggregation;
        }
        $query['aggregations'] = $aggregations;

        if ($this->getFilters() || $this->getMustNot()) {
            $query['query'] = [];
            if ($filters = $this->getFilters()) {
                $query['query']['bool']['filter'] = $filters;
            }
            if ($mustNot = $this->getMustNot()) {
                $query['query']['bool']['must_not'] = $mustNot;
            }
        }

        return $requestFactory->createRequest($query, $this->getTypes());
    }

    /**
     * @return array|null
     */
    abstract protected function getPerLocationAggregations();

    /**
     * @return array|null
     */
    abstract protected function getFilters();

    /**
     * @return array|null
     */
    protected function getMustNot()
    {
        return null;
    }
}
