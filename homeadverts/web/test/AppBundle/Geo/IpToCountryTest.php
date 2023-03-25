<?php

namespace Test\AppBundle\Geo;

use AppBundle\Geo\IpToCountry;

class IpToCountryTest extends \PHPUnit_Framework_TestCase
{
    public function testGetCountry()
    {
        $ipToCountry = new IpToCountry();
        $this->assertEquals('ES', $ipToCountry->getCountry('194.220.190.72'));
    }
}
