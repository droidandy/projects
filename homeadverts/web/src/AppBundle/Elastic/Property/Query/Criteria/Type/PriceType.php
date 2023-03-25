<?php

namespace AppBundle\Elastic\Property\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;
use AppBundle\Service\CurrencyManager;

class PriceType extends TypeTemplate
{
    /**
     * @var CurrencyManager
     */
    private $currencyManager;

    public function __construct(CurrencyManager $currencyManager)
    {
        $this->currencyManager = $currencyManager;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'price';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__composite' => true,
            '__default' => [
                'currency' => $this->currencyManager->getDefaultCurrency(),
                'from' => null,
                'to' => null,
            ],
            'currency' => [
                '__default' => $this->currencyManager->getDefaultCurrency(),
                '__required' => true,
                '__validate' => function ($value) {
                    return array_key_exists($value, $this->currencyManager->getDisplayCurrencies());
                },
            ],
            'range' => [
                '__default' => null,
                '__required' => false,
                '__normalize' => function ($value) {
                    if (empty($value)) {
                        return null;
                    }

                    list($priceFrom, $priceTo) = explode(':', $value);

                    return [
                        'from' => $priceFrom ? (int) $priceFrom : null,
                        'to' => $priceTo ? (int) $priceTo : null,
                    ];
                },
            ],
            'from' => [
                '__default' => null,
                '__required' => false,
                '__normalize' => function ($value) {
                    if (empty($value) && '0' !== $value) {
                        return null;
                    }

                    $value = (int) $value;

                    return $value;
                },
                '__validate' => function ($value) {
                    if (null === $value) {
                        return true;
                    }

                    return $value > 0;
                },
            ],
            'to' => [
                '__default' => null,
                '__required' => false,
                '__normalize' => function ($value) {
                    if (empty($value) && '0' !== $value) {
                        return null;
                    }

                    $value = (int) $value;

                    return $value;
                },
                '__validate' => function ($value) {
                    if (null === $value) {
                        return true;
                    }

                    return $value > 0;
                },
            ],
            '__normalize' => function ($value) {
                $fromPrice = $toPrice = null;
                if (!empty($value['from']) || !empty($value['to'])) {
                    $fromPrice = $value['from'];
                    $toPrice = $value['to'];
                } elseif (!empty($value['range'])) {
                    $fromPrice = $value['range']['from'];
                    $toPrice = $value['range']['to'];
                }

                $currency = $value['currency'];
                if ('USD' !== $currency) {
                    if (!empty($fromPrice)) {
                        $fromPrice = (int) $this->currencyManager->convert($currency, 'USD', $fromPrice);
                    }
                    if (!empty($toPrice)) {
                        $toPrice = (int) $this->currencyManager->convert($currency, 'USD', $toPrice);
                    }
                }

                return [
                    'currency' => $currency,
                    'from' => $fromPrice,
                    'to' => $toPrice,
                ];
            },
            '__validate' => function ($value) {
                if (null !== $value['from'] && !is_numeric($value['from'])) {
                    return false;
                }
                if (null !== $value['to'] && !is_numeric($value['to'])) {
                    return false;
                }

                if (null !== $value['from'] && null !== $value['to']) {
                    return $value['from'] <= $value['to'];
                }

                return true;
            },
        ];
    }
}
