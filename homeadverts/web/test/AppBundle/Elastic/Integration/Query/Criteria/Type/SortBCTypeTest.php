<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\SortBCType;
use AppBundle\Elastic\Integration\SeedGeneratorInterface;

class SortBCTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $seedGenerator = $this->getSeedGenerator();
        $seedGenerator
            ->expects($this->any())
            ->method('getSeed')
            ->willReturn(1)
        ;

        $sortBCType = new SortBCType($seedGenerator);

        $defaults = $sortBCType([]);

        $this->assertEquals(null, $defaults['__default']);
        $this->assertEquals(false, $defaults['__required']);
        $this->assertInternalType('callable', $defaults['__normalize']);
        $this->assertEquals([
            'field1' => 'asc',
        ], $defaults['__normalize']('field1:asc'));
        $this->assertEquals([
            'field1' => 'DESC',
        ], $defaults['__normalize']('field1:DESC'));
        $this->assertEquals([
            'random' => true,
            'seed' => 1,
        ], $defaults['__normalize']('rand:rand'));
        $this->assertInternalType('callable', $defaults['__validate']);
        $this->assertTrue($defaults['__validate']([
            'field1' => 'asc',
        ]));
        $this->assertTrue($defaults['__validate']([
            'random' => true,
            'seed' => 1,
        ]));
        $this->assertFalse($defaults['__validate']([
            'field1' => 'non-asc',
        ]));
    }

    private function getSeedGenerator()
    {
        return $this->getMockBuilder(SeedGeneratorInterface::class)
            ->getMock()
        ;
    }
}
