<?php

namespace Test\Utils\Traits;

use Faker;

trait RandomizeTrait
{
    /**
     * @var int
     */
    private $seed;
    /**
     * @var Faker\Generator
     */
    private $faker;

    /**
     * @return Faker\Generator
     */
    protected function getFaker()
    {
        if (!isset($this->faker)) {
            $this->faker = Faker\Factory::create();
        }

        return $this->faker;
    }

    protected function setUp()
    {
        parent::setUp();
        $this->seed = mt_rand();
        $faker = $this->getFaker();
        $faker->seed($this->seed);

        echo "\n\n";
        echo sprintf('Seed used %s', $this->seed);
        echo "\n\n";

        $this->doSetUp();
    }

    protected function tearDown()
    {
        parent::tearDown();
        $this->doTearDown();
    }

    abstract protected function doSetUp();

    abstract protected function doTearDown();
}
