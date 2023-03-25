<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Mapping\MappingFactoryInterface;
use GuzzleHttp\Promise;
use Symfony\Component\Stopwatch\Stopwatch;

class CompositeRequest implements RequestInterface
{
    /**
     * @var RequestInterface[]
     */
    private $requests = [];
    /**
     * @var Stopwatch
     */
    private $stopwatch;

    /**
     * CompositeRequest constructor.
     *
     * @param array          $requests
     * @param Stopwatch|null $stopwatch
     */
    public function __construct(array $requests, Stopwatch $stopwatch = null)
    {
        $this->requests = $requests;
        $this->stopwatch = $stopwatch;
    }

    /**
     * @param MappingFactoryInterface $mappingFactory
     *
     * @return Promise\PromiseInterface
     */
    public function execute(MappingFactoryInterface $mappingFactory)
    {
        $futures = [];
        foreach ($this->requests as $name => $request) {
            $futures[$name] = $request->execute($mappingFactory);
        }

        $all = Promise\all($futures);
        $wrapperPromise = new Promise\Promise(function () use (&$wrapperPromise, $all) {
            if ($this->stopwatch) {
                $eventKey = 'composite_requests_'.implode(',', array_keys($this->requests));
                $this->stopwatch->start(
                    $eventKey,
                    'search'
                );
            }
            $responses = $all->wait(true);
            if ($this->stopwatch) {
                $this->stopwatch->stop($eventKey);
            }

            $wrapperPromise->resolve($responses);
        });

        return $wrapperPromise;
    }

    public function getBody()
    {
        throw new \LogicException('Composite is not allowed to return body');
    }
}
