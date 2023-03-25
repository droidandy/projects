<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class DateType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'date';
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
                return new \DateTime($value);
            },
        ];
    }
}
