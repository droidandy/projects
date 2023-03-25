<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class BooleanType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'boolean';
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
                return (bool) $value;
            },
        ];
    }
}
