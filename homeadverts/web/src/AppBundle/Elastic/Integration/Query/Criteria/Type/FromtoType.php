<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class FromtoType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'fromto';
    }

    /**
     * @return array
     */
    public function getDefaults()
    {
        return [
                'from' => [
                    '__required' => false,
                    '__normalize' => function ($value) {
                        return (int) $value;
                    },
                    '__validate' => function ($value) {
                        return $value >= 0;
                    },
                ],
                'to' => [
                    '__required' => false,
                    '__normalize' => function ($value) {
                        return (int) $value;
                    },
                    '__validate' => function ($value) {
                        return $value >= 0;
                    },
                ],
                '__default' => [
                    'from' => 0,
                    'to' => 10,
                ],
                '__validate' => function ($value) {
                    return $value['from'] <= $value['to'];
                },
                '__composite' => true,
            ]
        ;
    }
}
