<?php

namespace AppBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use AppBundle\Search\Market;

/**
 * Transforms Market object into it's string representation and back.
 */
class MarketTransformer implements DataTransformerInterface
{
    /**
     * Converts a Market object into a string.
     *
     * @param Market $market
     *
     * @return string
     */
    public function transform($market)
    {
        if (!$market instanceof Market) {
            return $market;
        }

        return (string) $market;
    }

    /**
     * Convert a string into a market object.
     *
     * @param string $market
     *
     * @return Market
     */
    public function reverseTransform($market)
    {
        return new Market($market);
    }
}
