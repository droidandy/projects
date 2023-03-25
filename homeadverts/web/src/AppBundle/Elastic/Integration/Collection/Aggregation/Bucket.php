<?php

namespace AppBundle\Elastic\Integration\Collection\Aggregation;

use AppBundle\Elastic\Integration\Collection\AggregationResults;

class Bucket
{
    /**
     * @var string
     */
    private $key;
    /**
     * @var string
     */
    private $keyAsString;
    /**
     * @var int
     */
    private $docCount;
    /**
     * @var AggregationResults
     */
    private $aggregations;

    /**
     * Bucket constructor.
     */
    public function __construct($bucket)
    {
        $this->key = $bucket['key'];
        $this->keyAsString = isset($bucket['key_as_string']) ? $bucket['key_as_string'] : null;
        $this->docCount = (int) $bucket['doc_count'];
        $subAggregations = array_diff_key($bucket, array_flip(['key', 'key_as_string', 'doc_count']));
        if (!empty($subAggregations)) {
            $this->aggregations = new AggregationResults($subAggregations);
        }
    }

    /**
     * @return mixed
     */
    public function getKey()
    {
        return $this->key;
    }

    public function getKeyAsString()
    {
        return $this->keyAsString;
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
}
