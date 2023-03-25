<?php

namespace AppBundle\Form\Type;

use AppBundle\Entity\Property\Property;
use AppBundle\Service\Geo\LocaleHelper;
use Symfony\Component\Form\DataTransformerInterface;

class ImperialToMetricTransform implements DataTransformerInterface
{
    protected $lph;
    protected $columns = [
        'plotAreaUnit' => 'plotArea',
        'grossLivingAreaUnit' => 'grossLivingArea',
    ];

    public function __construct(LocaleHelper $lh)
    {
        $this->lh = $lh;
    }

    /**
     * We take the value from the database and turn it into a type that can be used within
     * our form elements - both of them.
     *
     * @param  mixed Property|empty
     *
     * @return array
     */
    public function transform($property)
    {
        if (is_null($property) or !$property instanceof Property) {
            return;
        }

        foreach ($this->columns as $unit => $value) {
            switch ($property->{$unit}) {
                case Property::AREA_METRE_SQ:
                    continue;
                    break;

                case Property::AREA_ACRE_SQ:
                    $property->{$value} = $this->lh->squareMetresToAcres($property->{$value});
                    break;

                case Property::AREA_FEET_SQ:
                    $property->{$value} = $this->lh->squareMetresToSquareFeet($property->{$value});
                    break;
            }
        }

        return $property;
    }

    /**
     * We are taking the element from the form and turning it into an element that
     * can be dealt with within the database entity - a single column index.
     *
     * @param Property $data The pre-transformed object passed from the form post data
     *
     * @return Property The transformed Property object
     */
    public function reverseTransform($property)
    {
        foreach ($this->columns as $unit => $value) {
            switch ($property->{$unit}) {
                case Property::AREA_METRE_SQ:
                    continue;
                    break;

                case Property::AREA_ACRE_SQ:
                    $property->{$value} = $this->lh->acresToSquareMetres($property->{$value});
                    break;

                case Property::AREA_FEET_SQ:
                    $property->{$value} = $this->lh->squareFeetToSquareMetres($property->{$value});
                    break;
            }
        }

        return $property;
    }
}
