<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\FromtoType;

class FromtoTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $fromtoType = new FromtoType();

        $defaults = $fromtoType([]);

        $this->assertEquals(0, $defaults['__default']['from']);
        $this->assertEquals(false, $defaults['from']['__required']);
        $this->assertInternalType('callable', $defaults['from']['__normalize']);
        $this->assertEquals(0, $defaults['from']['__normalize']('0'));
        $this->assertInternalType('callable', $defaults['from']['__validate']);
        $this->assertTrue($defaults['from']['__validate'](1));
        $this->assertFalse($defaults['from']['__validate'](-1));

        $this->assertEquals(10, $defaults['__default']['to']);
        $this->assertEquals(false, $defaults['to']['__required']);
        $this->assertInternalType('callable', $defaults['to']['__normalize']);
        $this->assertEquals(0, $defaults['to']['__normalize']('0'));
        $this->assertInternalType('callable', $defaults['to']['__validate']);
        $this->assertTrue($defaults['to']['__validate'](1));
        $this->assertFalse($defaults['to']['__validate'](-1));

        $this->assertInternalType('callable', $defaults['__validate']);
        $this->assertTrue($defaults['__validate']([
            'from' => 0,
            'to' => 10,
        ]));
        $this->assertFalse($defaults['__validate']([
            'from' => 10,
            'to' => 0,
        ]));
    }
}
