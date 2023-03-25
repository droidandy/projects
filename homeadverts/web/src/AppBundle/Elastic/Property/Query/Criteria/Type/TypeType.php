<?php

namespace AppBundle\Elastic\Property\Query\Criteria\Type;

use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;
use AppBundle\Entity\Property\PropertyTypes;

class TypeType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'property_type';
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
                if (!is_array($value)) {
                    $types = [
                        PropertyTypes::DETACHED_SLUG => PropertyTypes::DETACHED,
                        PropertyTypes::SEMI_DETACHED_SLUG => PropertyTypes::SEMI_DETACHED,
                        PropertyTypes::APARTMENT_SLUG => PropertyTypes::APARTMENT,
                        PropertyTypes::TOWNHOUSE_SLUG => PropertyTypes::TOWNHOUSE,
                        PropertyTypes::MOVABLE_SLUG => PropertyTypes::MOVABLE,
                        PropertyTypes::CHARACTER_SLUG => PropertyTypes::CHARACTER,
                        PropertyTypes::COMMERCIAL_SLUG => PropertyTypes::COMMERCIAL,
                        PropertyTypes::FARM_SLUG => PropertyTypes::FARM,
                        PropertyTypes::LAND_SLUG => PropertyTypes::LAND,
                        PropertyTypes::ISLAND_SLUG => PropertyTypes::ISLAND,
                        PropertyTypes::OTHER_SLUG => PropertyTypes::OTHER,
                    ];

                    if (in_array($value, $types)) {
                        $type = $value;
                    } elseif (isset($types[$value])) {
                        $type = $types[$value];
                    } else {
                        $type = PropertyTypes::OTHER;
                    }
                } else {
                    $type = $value;
                }

                return $type;
            },
        ];
    }
}
