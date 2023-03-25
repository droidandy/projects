<?php

namespace AppBundle\Validation;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;

class PropertyValidator
{
    protected $errors;

    public function validate(Property $property)
    {
        $errors = [];

        $propFeatures = $property->getMisc()['prop_features'];
        $show = false;

        foreach ($propFeatures as $propFeature) {
            if (
                (isset($propFeature['key']) && '1046' == $propFeature['key'])
                || (isset($propFeature['desc']) && 'QC Approved Listing' == $propFeature['desc'])
            ) {
                $show = true;
            }
        }

        if (!$show) {
            $errors[] = 'Property quality is not enough to be displayed';
        }

        $this->errors = $errors;

        return empty($errors);
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
