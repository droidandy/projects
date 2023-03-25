<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class OptionType extends TypeTemplate
{
    public function getName()
    {
        return 'option';
    }

    protected function getDefaults()
    {
        return [
            'options' => [],
            '__validate' => function ($value, $criteria) {
                if (empty($criteria['options']) || !is_array($criteria['options'])) {
                    return false;
                }

                if (!in_array($value, $criteria['options'])) {
                    return false;
                }

                return true;
            },
        ];
    }
}
