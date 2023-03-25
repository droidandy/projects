<?php

namespace AppBundle\Elastic\Integration\Collection\Aggregation;

use AppBundle\Elastic\Integration\Collection\AggregationResults;

class Filter implements \ArrayAccess
{
    /**
     * @var string
     */
    private $name;
    /**
     * @var int
     */
    private $docCount;
    /**
     * @var AggregationResults
     */
    private $aggregations;

    /**
     * @param string $name
     * @param array  $aggregation
     */
    public function __construct($name, $aggregation)
    {
        $this->name = $name;
        $this->docCount = (int) $aggregation['doc_count'];
        $subAggregations = array_diff_key($aggregation, array_flip(['doc_count']));
        if (!empty($subAggregations)) {
            $this->aggregations = new AggregationResults($subAggregations);
        }
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return int
     */
    public function getDocCount()
    {
        return $this->docCount;
    }

    /**
     * @return AggregationResults
     */
    public function getAggregations()
    {
        return $this->aggregations;
    }

    /**
     * @param mixed $offset
     *
     * @return bool
     */
    public function offsetExists($offset)
    {
        return isset($this->aggregations[$offset]);
    }

    /**
     * @param mixed $offset
     *
     * @return AggregationResults
     */
    public function offsetGet($offset)
    {
        return $this->aggregations[$offset];
    }

    /**
     * @param mixed $offset
     * @param mixed $value
     */
    public function offsetSet($offset, $value)
    {
        throw new \RuntimeException();
    }

    /**
     * @param mixed $offset
     */
    public function offsetUnset($offset)
    {
        throw new \RuntimeException();
    }
}
