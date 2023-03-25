<?php

namespace AppBundle\Elastic\Integration\Collection;

use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;
use AppBundle\Elastic\Integration\Query\Criteria\Type\PaginationType;

class SearchResults implements \Iterator, \Countable
{
    /**
     * @var int
     */
    private $i;
    /**
     * @var array
     */
    private $coll;
    /**
     * @var array
     */
    private $objectColl;
    /**
     * @var null|AggregationResults
     */
    private $aggregations;
    /**
     * @var null|SuggestionResults
     */
    private $suggestions;
    /**
     * @var int
     */
    private $total;
    /**
     * @var int
     */
    private $count;
    /**
     * @var array
     */
    private $error = [];
    /**
     * @var callable
     */
    private $objectParser;

    /**
     * @param array                   $searchResult
     * @param DocumentParserInterface $objectParser
     */
    public function __construct(array $searchResult, DocumentParserInterface $objectParser)
    {
        $this->i = 0;
        $this->total = (int) $searchResult['hits']['total'];
        $this->count = count($searchResult['hits']['hits']);
        $this->coll = $searchResult['hits']['hits'];
        $this->objectParser = $objectParser;
        if (!empty($searchResult['error'])) {
            $this->error = [
                'status' => $searchResult['status'],
                'error' => $searchResult['error'],
            ];
        }
        if (isset($searchResult['aggregations'])) {
            $this->aggregations = new AggregationResults($searchResult['aggregations']);
        }
        if (isset($searchResult['suggest'])) {
            $this->suggestions = new SuggestionResults($searchResult['suggest'], $this->objectParser);
        }
    }

    /**
     * @return bool
     */
    public function hasError()
    {
        return !empty($this->error);
    }

    /**
     * @return array
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @return mixed
     */
    public function current()
    {
        if (!isset($this->objectColl[$this->i])) {
            $el = $this->coll[$this->i];
            $object = $this->objectParser->parse($el);

            return $this->objectColl[$this->i] = $object;
        }

        return $this->objectColl[$this->i];
    }

    public function next()
    {
        ++$this->i;
    }

    /**
     * @return int
     */
    public function key()
    {
        return $this->i;
    }

    /**
     * @return bool
     */
    public function valid()
    {
        return $this->count && $this->i < $this->count;
    }

    public function rewind()
    {
        $this->i = 0;
    }

    /**
     * @return int
     */
    public function count()
    {
        return $this->count;
    }

    /**
     * @return int
     */
    public function getTotal()
    {
        return $this->total;
    }

    /**
     * @param int $perPage
     *
     * @return float
     */
    public function getTotalPages($perPage = PaginationType::PER_PAGE)
    {
        return ceil($this->total / $perPage);
    }

    /**
     * @return null|AggregationResults
     */
    public function getAggregations()
    {
        return $this->aggregations;
    }

    /**
     * @return null|SuggestionResults
     */
    public function getSuggestions()
    {
        return $this->suggestions;
    }
}
