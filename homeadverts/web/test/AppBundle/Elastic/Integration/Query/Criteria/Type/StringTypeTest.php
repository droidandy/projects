<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\StringType;

class StringTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $stringType = new StringType();

        $defaults = $stringType([]);

        $this->assertEquals(null, $defaults['__default']);
        $this->assertEquals(false, $defaults['__required']);
        $this->assertInternalType('callable', $defaults['__normalize']);
        $this->assertEquals('0', $defaults['__normalize'](0));
        $this->assertArrayNotHasKey('__validate', $defaults);
    }
}
