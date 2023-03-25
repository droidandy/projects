<?php

namespace AppBundle\Service\Billing;

use Taxamo;
use APIClient;
use CalculateTaxOut;
use Input_transaction;
use Input_transaction_line;

class Vat
{
    /**
     * @var string
     */
    const TAXAMO_API_URL = 'https://api.taxamo.com';
    /**
     * @var Taxamo
     */
    protected $taxamo;
    /**
     * @var array
     */
    protected $billingParams;

    /**
     * @param string $taxamoPrivateKey
     * @param array  $billingParams
     */
    public function __construct($taxamoPrivateKey, array $billingParams)
    {
        $this->taxamo = new Taxamo(
            new APIClient($taxamoPrivateKey, self::TAXAMO_API_URL)
        );
        $this->billingParams = $billingParams;
    }

    /**
     * @param $amount
     *
     * @return CalculateTaxOut
     */
    public function getVat($countryIso2)
    {
        $item = new Input_transaction_line();
        $item->amount = $this->billingParams['base_price'];
        $item->custom_id = 'subscription';

        $transaction = new Input_transaction();
        $transaction->currency_code = $this->billingParams['base_currency'];
        $transaction->billing_country_code = $this->billingParams['country'];

        $transaction->force_country_code = $countryIso2;
        $transaction->transaction_lines = [$item];

        return $this->taxamo->calculateTax([
            'transaction' => $transaction,
        ]);
    }
}
