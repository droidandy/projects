<?php

namespace AppBundle\Elastic\Location\Query\Criteria\Type;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;

class LocationsSimpleType extends TypeTemplate
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'locations_simple';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__validate' => function ($value) {
                return is_array($value) && array_reduce(
                        $value,
                        function ($carry, $item) {
                            return $carry && $item instanceof Location;
                        },
                        true
                )
                    ;
            },
        ];
    }
}
