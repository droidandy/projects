<?php

namespace Test\AppBundle\Service\Billing\Integrational;

use Test\AppBundle\AbstractWebTestCase;
use CalculateTaxOut;

class VatTest extends AbstractWebTestCase
{
    public function testGetVat()
    {
        /** @var CalculateTaxOut $tax */
        $tax = $this
            ->getContainer()
            ->get('ha_vat')
            ->getVat('FR');

        $this->assertEquals('USD', $tax->transaction->currency_code);
        $this->assertEquals('FR', $tax->transaction->tax_country_code);
        $this->assertEquals('99', $tax->transaction->amount);
        $this->assertEquals('19.8', $tax->transaction->tax_amount);
    }
}
