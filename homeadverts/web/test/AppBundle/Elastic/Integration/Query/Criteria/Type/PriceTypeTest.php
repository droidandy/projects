<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Service\CurrencyManager;
use AppBundle\Elastic\Property\Query\Criteria\Type\PriceType;

class PriceTypeTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var CurrencyManager
     */
    private $currencyManager;
    /**
     * @var PriceType
     */
    private $priceType;
    /**
     * @var array
     */
    private $defaults;

    protected function setUp()
    {
        $this->currencyManager = $currencyManager = $this->getCurrencyManager();
        $currencyManager
            ->expects($this->once())
            ->method('getDefaultCurrency')
            ->willReturn('USD')
        ;

        $this->priceType = $priceType = new PriceType($currencyManager);

        $this->defaults = $priceType([]);
    }

    public function testDefaults()
    {
        $defaults = $this->defaults;

        $this->assertTrue($defaults['__composite']);
        $this->assertInternalType('callable', $defaults['__normalize']);
        $this->assertInternalType('callable', $defaults['__validate']);

        $this->assertEquals('USD', $defaults['currency']['__default']);
        $this->assertTrue($defaults['currency']['__required']);
        $this->assertInternalType('callable', $defaults['currency']['__validate']);

        $this->assertNull($defaults['range']['__default']);
        $this->assertFalse($defaults['range']['__required']);
        $this->assertInternalType('callable', $defaults['range']['__normalize']);

        $this->assertNull($defaults['from']['__default']);
        $this->assertFalse($defaults['from']['__required']);
        $this->assertInternalType('callable', $defaults['from']['__normalize']);
        $this->assertInternalType('callable', $defaults['from']['__validate']);

        $this->assertNull($defaults['to']['__default']);
        $this->assertFalse($defaults['to']['__required']);
        $this->assertInternalType('callable', $defaults['to']['__normalize']);
        $this->assertInternalType('callable', $defaults['to']['__validate']);
    }

    public function testCurrencyCallables()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $currencyManager */
        $currencyManager = $this->currencyManager;
        $currencyManager
            ->method('getDisplayCurrencies')
            ->willReturn([
                'USD' => [
                    'id' => 'USD',
                    'name' => 'United States Dollar',
                    'display' => '1',
                ],
                'EUR' => [
                    'id' => 'EUR',
                    'name' => 'Euro',
                    'display' => '1',
                ],
                'GBP' => [
                    'id' => 'GBP',
                    'name' => 'British Pound Sterling',
                    'display' => '1',
                ],
            ])
        ;

        $defaults = $this->defaults;

        $this->assertTrue($defaults['currency']['__validate']('USD'));
        $this->assertFalse($defaults['currency']['__validate']('RUB'));
    }

    public function testRangeCallables()
    {
        $defaults = $this->defaults;

        $this->assertEquals(
            [
                'from' => '',
                'to' => '20000000',
            ],
            $defaults['range']['__normalize'](':20000000')
        );
        $this->assertEquals(
            [
                'from' => '20000000',
                'to' => '20000001',
            ],
            $defaults['range']['__normalize']('20000000:20000001')
        );
        $this->assertEquals(
            [
                'from' => '20000001',
                'to' => '',
            ],
            $defaults['range']['__normalize']('20000001:')
        );
    }

    public function testFromToCallables()
    {
        $defaults = $this->defaults;

        foreach (['from', 'to'] as $key) {
            $this->assertEquals(
                20000000,
                $defaults[$key]['__normalize']('20000000')
            );
            $this->assertTrue(
                $defaults[$key]['__validate'](20000000)
            );
            $this->assertFalse(
                $defaults[$key]['__validate'](-1)
            );
        }
    }

    public function testTopLevelNormalize()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $currencyManager */
        $currencyManager = $this->currencyManager;
        $currencyManager
            ->method('convert')
            ->withConsecutive(
                [
                    'EUR', 'USD', 1000000,
                ],
                [
                    'EUR', 'USD', 2000000,
                ],
                [
                    'GBP', 'USD', 3000000,
                ],
                [
                    'GBP', 'USD', 4000000,
                ],
                [
                    'CAD', 'USD', 2000000,
                ],
                [
                    'CAD', 'USD', 1000000,
                ]
            )
            ->willReturnArgument(2)
        ;

        $defaults = $this->defaults;

        $this->assertEquals(
            [
                'currency' => 'EUR',
                'from' => 1000000,
                'to' => 2000000,
            ],
            $defaults['__normalize']([
                'currency' => 'EUR',
                'range' => [
                    'from' => 3000000,
                    'to' => 4000000,
                ],
                'from' => 1000000,
                'to' => 2000000,
            ])
        );
        $this->assertEquals(
            [
                'currency' => 'GBP',
                'from' => 3000000,
                'to' => 4000000,
            ],
            $defaults['__normalize']([
                'currency' => 'GBP',
                'range' => [
                    'from' => 3000000,
                    'to' => 4000000,
                ],
            ])
        );
        $this->assertEquals(
            [
                'currency' => 'CAD',
                'from' => null,
                'to' => 2000000,
            ],
            $defaults['__normalize']([
                'currency' => 'CAD',
                'range' => [
                    'from' => '',
                    'to' => 2000000,
                ],
            ])
        );
        $this->assertEquals(
            [
                'currency' => 'CAD',
                'from' => 1000000,
                'to' => null,
            ],
            $defaults['__normalize']([
                'currency' => 'CAD',
                'from' => 1000000,
                'to' => null,
            ])
        );
        $this->assertEquals(
            [
                'currency' => 'USD',
                'from' => 1000000,
                'to' => 2000000,
            ],
            $defaults['__normalize']([
                'currency' => 'USD',
                'from' => 1000000,
                'to' => 2000000,
            ])
        );
        $this->assertEquals(
            [
                'currency' => 'USD',
                'from' => null,
                'to' => null,
            ],
            $defaults['__normalize']([
                'currency' => 'USD',
            ])
        );
    }

    public function testTopLevelValidate()
    {
        $defaults = $this->defaults;

        $this->assertTrue(
            $defaults['__validate']([
                'from' => 1000000,
                'to' => 2000000,
            ])
        );
        $this->assertTrue(
            $defaults['__validate']([
                'from' => null,
                'to' => 2000000,
            ])
        );
        $this->assertTrue(
            $defaults['__validate']([
                'from' => 1000000,
                'to' => null,
            ])
        );
        $this->assertFalse(
            $defaults['__validate']([
                'from' => 2000000,
                'to' => 1000000,
            ])
        );
        $this->assertFalse(
            $defaults['__validate']([
                'from' => 2000000,
                'to' => 0,
            ])
        );
    }

    private function getCurrencyManager()
    {
        return $this
            ->getMockBuilder(CurrencyManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
