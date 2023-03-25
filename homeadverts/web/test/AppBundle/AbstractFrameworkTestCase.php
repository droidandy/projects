<?php

namespace Test\AppBundle;

use Faker;

abstract class AbstractFrameworkTestCase extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \Faker\Generator
     */
    protected $faker;

    protected function setUp()
    {
        $this->faker = Faker\Factory::create();

        parent::setUp();
    }

    /**
     * @return bool|string
     */
    protected function getFixturesDirectory()
    {
        return realpath(__DIR__.'/../fixtures/');
    }

    /**
     * @param string $filename
     *
     * @return string
     */
    protected function getFixture($filename)
    {
        return $this->getFixturesDirectory().'/'.$filename;
    }
}
