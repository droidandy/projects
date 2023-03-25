<?php

namespace AppBundle\Elastic\Property\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;
use AppBundle\Entity\Property\Property;

class StatusType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'property_status';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__default' => Property::STATUS_ACTIVE,
            '__required' => false,
            '__normalize' => function ($value) {
                return (int) $value;
            },
            '__validate' => function ($value) {
                return in_array(
                    $value,
                    [
                        Property::STATUS_DELETED,
                        Property::STATUS_INVALID,
                        Property::STATUS_INCOMPLETE,
                        Property::STATUS_INACTIVE,
                        Property::STATUS_ACTIVE,
                    ]
                );
            },
        ];
    }
}
