<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Import\Adapter\Sothebys\DataSync\HandlerStack;

class HandlerStackTest extends \PHPUnit_Framework_TestCase
{
    public function testResolve()
    {
        $innermostHandler = function ($data) {
            return $data * 3;
        };
        $middleHandler = function ($nextHandler) {
            return function ($data) use ($nextHandler) {
                return $nextHandler($data + 10);
            };
        };
        $outmostHandler = function ($nextHandler) {
            return function ($data) use ($nextHandler) {
                return $nextHandler($data / 2);
            };
        };

        $handlerStack = new HandlerStack($innermostHandler);
        $handlerStack->push($middleHandler);
        $handlerStack->push($outmostHandler);

        $resolvedHandler = $handlerStack->resolve();

        $this->assertInternalType('callable', $resolvedHandler);
        $this->assertEquals(45, $resolvedHandler(10));
        $this->assertEquals(33, $resolvedHandler(2));
        $this->assertEquals(105, $resolvedHandler(50));
    }
}
