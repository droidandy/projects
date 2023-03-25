<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\DateType;

class DateTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $dateType = new DateType();

        $defaults = $dateType([]);

        $this->assertEquals(null, $defaults['__default']);
        $this->assertEquals(false, $defaults['__required']);
        $this->assertInternalType('callable', $defaults['__normalize']);
        $this->assertEquals(new \DateTime('2017-05-31T00:00:00+00:00'), $defaults['__normalize']('2017-05-31T00:00:00+00:00'));
        $this->assertArrayNotHasKey('__validate', $defaults);
    }
}
