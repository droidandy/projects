<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\IntegerType;

class IntegerTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $integerType = new IntegerType();

        $defaults = $integerType([]);

        $this->assertEquals(null, $defaults['__default']);
        $this->assertEquals(false, $defaults['__required']);
        $this->assertInternalType('callable', $defaults['__normalize']);
        $this->assertSame(1, $defaults['__normalize']('1'));
        $this->assertArrayNotHasKey('__validate', $defaults);
    }
}
