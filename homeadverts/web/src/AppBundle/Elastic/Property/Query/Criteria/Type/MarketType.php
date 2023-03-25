<?php

namespace AppBundle\Elastic\Property\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;
use AppBundle\Entity\Property\Property;
use AppBundle\Search\Market;

class MarketType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'market';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__default' => Property::MARKET_ALL,
            '__required' => false,
            '__normalize' => function ($value) {
                if ($value instanceof Market) {
                    return (string) $value;
                }

                return $value;
            },
            '__validate' => function ($value) {
                return in_array($value, [Property::MARKET_ALL, Property::MARKET_SALE, Property::MARKET_RENTAL]);
            },
        ];
    }
}
