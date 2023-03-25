<?php

namespace AppBundle\Geo\Geocode;

class QueueIterator implements \Iterator
{
    /**
     * @var array
     */
    private $queue;
    /**
     * @var int
     */
    private $i = 0;
    /**
     * @var bool
     */
    private $valid = false;

    /**
     * @param mixed $task
     */
    public function add($task)
    {
        $this->valid = true;
        $this->queue[] = $task;
    }

    /**
     * @return mixed
     */
    public function current()
    {
        return $this->queue[$this->i];
    }

    public function next()
    {
        // Do not iterate counter if no more elements in queue
        // otherwise Guzzle Promises would skip some elements in queue
        if ($this->i < count($this->queue) - 1) {
            ++$this->i;
        } else {
            $this->valid = false;
        }
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
        return $this->valid;
    }

    public function rewind()
    {
        $this->i = 0;
    }
}
