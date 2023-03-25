<?php

namespace Test\Utils\Traits;

use Faker\Generator;

trait FakerAbstractTrait
{
    /**
     * @return Generator
     */
    abstract protected function getFaker();
}
