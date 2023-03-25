<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class IntegerType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'integer';
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
                return (int) $value;
            },
        ];
    }
}
