<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Mapping\MappingFactoryInterface;
use GuzzleHttp\Ring\Future\FutureArray;
use Symfony\Component\Stopwatch\Stopwatch;

class Request implements RequestInterface
{
    /**
     * @var array
     */
    private $body;
    /**
     * @var array|string
     */
    private $type;
    /**
     * @var callable
     */
    private $collection;
    /**
     * @var Stopwatch
     */
    private $stopwatch;

    /**
     * Request constructor.
     *
     * @param array        $body
     * @param array|string $type
     * @param callable     $collection
     * @param Stopwatch    $stopwatch
     */
    public function __construct($body, $type, callable $collection, Stopwatch $stopwatch = null)
    {
        $this->body = $body;
        $this->type = $type;
        $this->collection = $collection;
        $this->stopwatch = $stopwatch;
    }

    /**
     * @param MappingFactoryInterface $mappingFactory
     *
     * @return FutureArray
     */
    public function execute(MappingFactoryInterface $mappingFactory)
    {
        $mapping = $mappingFactory->get($this->type);

        $future = $mapping->execute($this);

        return new FutureArray(
                $future->then(function ($result) {
                    $coll = $this->collection;

                    return $coll($result);
                }),
                function () use ($future) {
                    if ($this->stopwatch) {
                        $eventName = 'request_'.$this->type.'_'.spl_object_hash($this);
                        $this->stopwatch->start($eventName, 'search');
                    }
                    $future->wait();
                    if ($this->stopwatch) {
                        $this->stopwatch->stop($eventName);
                    }
                }
        )
        ;
    }

    /**
     * @return array
     */
    public function getBody()
    {
        return $this->body;
    }
}
