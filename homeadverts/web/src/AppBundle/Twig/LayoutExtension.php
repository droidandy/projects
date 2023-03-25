<?php

namespace AppBundle\Twig;

use AppBundle\Service\CurrencyManager;
use AppBundle\Helper\ResultsHelper;
use AppBundle\Search\Market;
use Twig_Extension;

class LayoutExtension extends Twig_Extension
{
    /**
     * @var CurrencyManager
     */
    protected $currencyManager;
    /**
     * @var ResultsHelper
     */
    protected $resultsHelper;

    /**
     * @param CurrencyManager $currencyManager
     */
    public function __construct(
        CurrencyManager $currencyManager,
        ResultsHelper $resultsHelper
    ) {
        $this->currencyManager = $currencyManager;
        $this->resultsHelper = $resultsHelper;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return array(
            'availableCurrencies' => new \Twig_Function_Method($this, 'availableCurrencies'),
            'availableCountries' => new \Twig_Function_Method($this, 'availableCountries'),
            'availableCategories' => new \Twig_Function_Method($this, 'availableCategories'),
            'currentCurrency' => new \Twig_Function_Method($this, 'currentCurrency'),
        );
    }

    /**
     * @return string
     */
    public function currentCurrency()
    {
        return $this->currencyManager->getCurrency();
    }

    /**
     * @return array
     */
    public function availableCurrencies()
    {
        return $this->currencyManager->getAvailableCurrencies();
    }

    /**
     * @return array
     */
    public function availableCountries()
    {
        return $this->resultsHelper->getPropertyCountries(
            new Market('for-sale')
        );
    }

    /**
     * @return array
     */
    public function availableCategories()
    {
        return $this->resultsHelper->getPropertyCountries(
            new Market('for-sale')
        );
    }

    /**
     * The extension name.
     *
     * @return string
     */
    public function getName()
    {
        return 'currency_extension';
    }
}
