<?php

namespace Test\AppBundle\Geo\Geocode;

use AppBundle\Geo\Geocode\QueueIterator;
use function GuzzleHttp\Promise\promise_for;
use function GuzzleHttp\Promise\each as g_each;
use function GuzzleHttp\Promise\each_limit_all as g_each_limit_all;

class RefillableQueueIterationTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var QueueIterator
     */
    private $queue;

    protected function setUp()
    {
        $this->queue = new QueueIterator();
    }

    public function testRefillableQueue()
    {
        echo "\n\n";

        foreach ([1, 2, 3, 4, 5] as $value) {
            $promise = promise_for($value)->then(function ($rootValue) {
                echo sprintf('Root promise %s', $rootValue)."\n";

                $subPromise = promise_for($rootValue + 5);
                $subPromise->then(function ($childValue) use ($rootValue) {
                    echo sprintf('Child promise %s of the root promise %s', $childValue, $rootValue)."\n";
                });
                $this->queue->add($subPromise);

                return $rootValue;
            });
            $this->queue->add($promise);
        }

        $results = [];
        $eachPromise = g_each($this->queue, function ($value, $idx) use (&$results) {
            echo sprintf('Promise %s index %s', $value, $idx)."\n";

            $results[$idx] = $value;
        });
        $eachPromise->wait();

        $this->assertEquals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], $results);

        echo "\n\n";
    }

    public function testRefillableConcurrencyQueue()
    {
        echo "\n\n";

        foreach ([1, 2, 3, 4, 5] as $value) {
            $promise = promise_for($value)->then(function ($rootValue) {
                echo sprintf('Root promise %s', $rootValue)."\n";

                $subPromise = promise_for($rootValue + 5);
                $subPromise->then(function ($childValue) use ($rootValue) {
                    echo sprintf('Child promise %s of the root promise %s', $childValue, $rootValue)."\n";
                });
                $this->queue->add($subPromise);

                return $rootValue;
            });
            $this->queue->add($promise);
        }

        $results = [];
        $eachPromise = g_each_limit_all($this->queue, 3, function ($value, $idx) use (&$results) {
            echo sprintf('Promise %s index %s', $value, $idx)."\n";

            $results[$idx] = $value;
        });
        $eachPromise->wait();

        $this->assertEquals([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], $results);

        echo "\n\n";
    }
}
