<?php

namespace AppBundle\Elastic\Integration\Collection\Aggregation;

class Terms implements \Iterator
{
    /**
     * @var string
     */
    private $name;
    /**
     * @var array
     */
    private $buckets;
    /**
     * @var int
     */
    private $count;
    /**
     * @var Bucket
     */
    private $wrappedBuckets;
    /**
     * @var int
     */
    private $i;

    /**
     * @param string $name
     * @param array  $aggregation
     */
    public function __construct($name, $aggregation)
    {
        $this->i = 0;
        $this->name = $name;
        $this->buckets = $aggregation['buckets'];
        $this->count = count($aggregation['buckets']);
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return Bucket
     */
    public function current()
    {
        if (!isset($this->wrappedBuckets[$this->i])) {
            $this->wrappedBuckets[$this->i] = $this->wrapBucket($this->buckets[$this->i]);
        }

        return $this->wrappedBuckets[$this->i];
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
     * @param $bucket
     *
     * @return Bucket
     */
    private function wrapBucket($bucket)
    {
        return new Bucket($bucket);
    }
}
