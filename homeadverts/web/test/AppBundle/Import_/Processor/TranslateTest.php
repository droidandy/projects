<?php

namespace HA\ImportBundle\Processor;

use HA\ImportBundle\Property;
use HA\ImportBundle\NormalisedProperty;

class TranslateTest extends \PHPUnit_Framework_TestCase
{
    public function testCleanup()
    {
        $trans = new Translate($GLOBALS['app'], [], 123);
        $files = glob(__DIR__.'/fixtures/descriptions/*.txt');

        foreach ($files as $file) {
            $property = new Property();
            $normalised = new NormalisedProperty([
                'description' => file_get_contents($file),
            ]);

            $trans->process($normalised, $property);
            $this->assertSame(file_get_contents($file.'.cleaned'), $property->description);
        }
    }
}
