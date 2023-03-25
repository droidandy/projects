<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class ArrayType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'array';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__default' => null,
            '__required' => false,
            '__validate' => function ($value) {
                return is_array($value);
            },
        ];
    }
}
