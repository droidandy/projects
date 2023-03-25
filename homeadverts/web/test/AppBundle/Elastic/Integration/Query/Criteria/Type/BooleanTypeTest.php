<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\BooleanType;

class BooleanTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $booleanType = new BooleanType();

        $defaults = $booleanType([]);

        $this->assertEquals(null, $defaults['__default']);
        $this->assertEquals(false, $defaults['__required']);
        $this->assertInternalType('callable', $defaults['__normalize']);
        $this->assertTrue($defaults['__normalize']('1'));
        $this->assertFalse($defaults['__normalize']('0'));
        $this->assertArrayNotHasKey('__validate', $defaults);
    }
}
