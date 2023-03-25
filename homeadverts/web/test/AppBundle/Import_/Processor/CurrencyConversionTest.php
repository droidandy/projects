<?php

namespace HA\ImportBundle\Processor;

use HA\ImportBundle\Property;
use HA\ImportBundle\NormalisedProperty;

class CurrencyConversionTest extends \PHPUnit_Framework_TestCase
{
    public function testConvertingSalePrice()
    {
        $price = 110000;
        $rate = 1.4;
        $currency = \Mockery::mock('currency');
        $currency->shouldReceive('convert')->times(1)->andReturn($price * $rate);

        $converter = new CurrencyConversion(['currency' => $currency], [], 123);
        $property = new Property();
        $normalised = new NormalisedProperty([
            'market' => 'for-sale',
            'price' => (object) [
                'currency' => 'GBP',
                'amount' => $price,
                'period' => '',
            ],
        ]);

        $converter->process($normalised, $property);

        $this->assertSame($price, $property->price);
        $this->assertSame($price * $rate, $property->basePrice);
        $this->assertSame('GBP', $property->currency);
    }

    public function testConvertingRentalPrice()
    {
        $price = 300;
        $rate = 1.8;
        $currency = \Mockery::mock('currency');
        $currency->shouldReceive('convert')->times(1)->andReturn($price * $rate);

        $converter = new CurrencyConversion(['currency' => $currency], [], 123);
        $property = new Property();
        $normalised = new NormalisedProperty([
            'market' => 'to-rent',
            'price' => (object) [
                'currency' => 'BTC',
                'amount' => $price,
                'period' => 'week',
            ],
        ]);

        $converter->process($normalised, $property);

        $this->assertSame($price, $property->price);
        $this->assertSame($price * $rate, $property->basePrice);
        $this->assertSame('BTC', $property->currency);
        $this->assertSame('week', $property->period);
        $this->assertSame(($price * $rate * 52) / 12, $property->baseMonthlyPrice);
    }
}
