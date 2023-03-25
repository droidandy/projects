<?php

namespace AppBundle\Elastic\Property\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;

class DistanceType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'distance';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__default' => null,
            '__required' => false,
            '__normalize' => function ($value) {
                // Split the amount and the unit
                preg_match('/^([0-9.]+)([A-Za-z]+)$/', $value, $matches);
                $amount = (float) $matches[1];
                $unit = $matches[2];

                $unit = rtrim($unit, 's '); // No plurals

                if ('km' === $unit) {
                    $amount = $amount * 1000; // km to metres
                } elseif ('mile' === $unit) {
                    $amount = $amount * 1609.344; // miles to metres
                }

                return $amount;
            },
        ];
    }
}
