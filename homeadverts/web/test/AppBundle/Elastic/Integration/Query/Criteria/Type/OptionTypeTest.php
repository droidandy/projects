<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\OptionType;

class OptionTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $optionType = new OptionType();

        $defaults = $optionType();

        $this->assertArrayNotHasKey('__default', $defaults);
        $this->assertArrayNotHasKey('__required', $defaults);
        $this->assertArrayNotHasKey('__normalize', $defaults);
        $this->assertInternalType('callable', $defaults['__validate']);
    }

    public function testValidate()
    {
        $optionType = new OptionType();

        $defaults = $optionType([
            'options' => ['a', 'b', 'c'],
        ]);

        $this->assertTrue($defaults['__validate']('a', $defaults));
        $this->assertTrue($defaults['__validate']('b', $defaults));
        $this->assertTrue($defaults['__validate']('c', $defaults));

        $this->assertFalse($defaults['__validate']('d', $defaults));
    }

    public function testValidateWithEmptyOptions()
    {
        $optionType = new OptionType();

        $defaults = $optionType();

        $this->assertFalse($defaults['__validate']('any', $defaults));
    }
}
