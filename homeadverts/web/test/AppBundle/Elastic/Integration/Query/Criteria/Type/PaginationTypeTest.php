<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\PaginationType;

class PaginationTypeTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaults()
    {
        $paginationType = new PaginationType();

        $defaults = $paginationType([]);

        $this->assertEquals([
            'from' => 0,
            'size' => PaginationType::PER_PAGE,
        ], $defaults['__default']);
        $this->assertEquals(false, $defaults['__required']);
        $this->assertInternalType('callable', $defaults['__normalize']);
        $this->assertEquals(
            [
                'from' => 0,
                'size' => PaginationType::PER_PAGE,
            ],
            $defaults['__normalize'](1)
        );
        $this->assertEquals(
            [
                'from' => 30,
                'size' => PaginationType::PER_PAGE,
            ],
            $defaults['__normalize'](3)
        );
        $this->assertEquals(
            [
                'from' => 40,
                'size' => 10,
            ],
            $defaults['__normalize']([
                'page' => 5,
                'per_page' => 10,
            ])
        );
        $this->assertEquals(
            [
                'from' => 0,
                'size' => PaginationType::PER_MAP,
            ],
            $defaults['__normalize'](-1)
        );
        $this->assertArrayNotHasKey('__validate', $defaults);
    }
}
