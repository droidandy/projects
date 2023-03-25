<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\ArrayType;

class ArrayTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $arrayType = new ArrayType();

        $defaults = $arrayType([]);

        $this->assertEquals(null, $defaults['__default']);
        $this->assertEquals(false, $defaults['__required']);
        $this->assertInternalType('callable', $defaults['__validate']);
        $this->assertTrue($defaults['__validate']([1, 2, 3]));
        $this->assertFalse($defaults['__validate']('123'));
        $this->assertArrayNotHasKey('__normalize', $defaults);
    }
}
