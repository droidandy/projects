<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\SortType;
use AppBundle\Elastic\Integration\SeedGeneratorInterface;

class SortTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $seedGenerator = $this->getSeedGenerator();
        $seedGenerator
            ->expects($this->any())
            ->method('getSeed')
            ->willReturn(1)
        ;

        $sortType = new SortType($seedGenerator);
        $defaults = $sortType([]);

        $this->assertEquals(null, $defaults['__default']);
        $this->assertEquals(false, $defaults['__required']);
        $this->assertInternalType('callable', $defaults['__normalize']);
        $this->assertEquals(
            [
                'field1' => 'asc',
                'field2' => 'desc',
            ],
            $defaults['__normalize']([
                'field1' => 'asc',
                'field2' => 'DESC',
            ])
        );
        $this->assertEquals(
            [
                'random' => true,
                'seed' => 1,
            ],
            $defaults['__normalize']([
                'rand' => true,
            ])
        );
        $this->assertInternalType('callable', $defaults['__validate']);
        $this->assertTrue(
            $defaults['__validate']([
                'field1' => 'asc',
                'field2' => 'desc',
            ])
        );
        $this->assertTrue(
            $defaults['__validate']([
                'random' => true,
                'seed' => 1,
            ])
        );
        $this->assertFalse(
            $defaults['__validate']([
                'field1' => 'asc',
                'field2' => 'maldesc',
            ])
        );
    }

    private function getSeedGenerator()
    {
        return $this->getMockBuilder(SeedGeneratorInterface::class)
            ->getMock()
        ;
    }
}
