<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class StringType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'string';
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
                return (string) $value;
            },
        ];
    }
}
