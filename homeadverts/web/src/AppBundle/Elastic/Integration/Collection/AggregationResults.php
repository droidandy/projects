<?php

namespace AppBundle\Elastic\Integration\Collection;

use AppBundle\Elastic\Integration\Collection\Aggregation\Filter;
use AppBundle\Elastic\Integration\Collection\Aggregation\SingleValue;
use AppBundle\Elastic\Integration\Collection\Aggregation\Terms;

class AggregationResults implements \Iterator, \ArrayAccess
{
    /**
     * @var array
     */
    private $aggregations;
    /**
     * @var array
     */
    private $wrappedAggregations;

    /**
     * @param array $aggregations
     */
    public function __construct($aggregations)
    {
        $this->aggregations = $aggregations;
    }

    /**
     * @return mixed
     */
    public function current()
    {
        return $this->wrapAggregation(key($this->aggregations), current($this->aggregations));
    }

    public function next()
    {
        next($this->aggregations);
    }

    /**
     * @return string
     */
    public function key()
    {
        return $this->getKey(key($this->aggregations));
    }

    /**
     * @return bool
     */
    public function valid()
    {
        return (bool) current($this->aggregations);
    }

    public function rewind()
    {
        reset($this->aggregations);
    }

    /**
     * @param mixed $offset
     *
     * @return bool
     */
    public function offsetExists($offset)
    {
        foreach (array_keys($this->aggregations) as $key) {
            if ($this->getKey($key) == $offset) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param mixed $offset
     *
     * @return mixed
     */
    public function offsetGet($offset)
    {
        foreach (array_keys($this->aggregations) as $key) {
            if ($this->getKey($key) == $offset) {
                return $this->wrapAggregation($key, $this->aggregations[$key]);
            }
        }

        throw new \OutOfRangeException();
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

    /**
     * @param mixed $key
     * @param array $aggregation
     *
     * @return mixed
     */
    private function wrapAggregation($key, $aggregation)
    {
        if (!isset($this->wrappedAggregations[$key])) {
            switch (true) {
                case '_filter' == substr($key, -strlen('_filter')):
                    $this->wrappedAggregations[$key] = new Filter($this->getKey($key), $aggregation);
                    break;
                case '_terms' == substr($key, -strlen('_terms')):
                    $this->wrappedAggregations[$key] = new Terms($this->getKey($key), $aggregation);
                    break;
                case '_avg' == substr($key, -strlen('_avg')):
                case '_min' == substr($key, -strlen('_min')):
                case '_max' == substr($key, -strlen('_max')):
                    $this->wrappedAggregations[$key] = new SingleValue($this->getKey($key), $aggregation);
                    break;
                default:
                    throw new \InvalidArgumentException('An aggregation name should end with a suffix of an aggregation type');
            }
        }

        return $this->wrappedAggregations[$key];
    }

    /**
     * @param $key
     *
     * @return string
     */
    private function getKey($key)
    {
        foreach (['filter', 'terms', 'avg', 'min', 'max'] as $suffix) {
            $len = strlen('_'.$suffix);
            if (substr($key, -$len) == '_'.$suffix) {
                return substr($key, 0, -$len);
            }
        }

        throw new \InvalidArgumentException('An aggregation name should end with a suffix of an aggregation type');
    }
}
