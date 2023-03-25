<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Validation\PropertyValidator;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Entity\Import\ImportProperty;
use AppBundle\Entity\Property\PropertyTypes as Type;
use AppBundle\Entity\Property\Property;

class Validator extends Processor
{
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        $this->validateMetadata($propertyObj);
        $this->validateAddress($propertyObj);
        $this->validatePhotos($propertyObj);
        $this->validateProviderBusinessRules($propertyObj);
    }

    protected function validateMetadata($property)
    {
        if (empty($property->sourceRef)) {
            $this->addError(
                ImportProperty::ERROR_METADATA,
                'No unique key was found.'
            );
        }

        if (Type::UNKNOWN === $property->type) {
            $this->addError(
                ImportProperty::ERROR_METADATA,
                'Invalid or missing property type.'
            );
        }
    }

    protected function validateAddress($property)
    {
        /** @var Address $address */
        $address = $property->getAddress();

        if (!$address->getStreet()) {
            $address->setHidden(true);
        }

        if (empty($address->getCountry())) {
            $this->addError(
                ImportProperty::ERROR_ADDRESS,
                'Country must be provided.'
            );
        }

        // Some properties come without Lat,Lng.

        //if (!$address->hasCoords()) {
        //    $this->addError(
        //        ImportProperty::ERROR_ADDRESS,
        //        'Latitude and longitude must be provided.'
        //    );
        //}
    }

    protected function validatePhotos($property)
    {
        if (0 === count($property->getPhotos())) {
            $this->addError(
                ImportProperty::ERROR_PHOTOS,
                'At least one photo must be provided.'
            );
        }
    }

//    protected function validatePrice($property)
//    {
//        if (0 == $property->price && Property::PRICE_QUALIFIER_NONE === $property->priceQualifier) {
//            $this->addError(
//                ImportProperty::ERROR_PRICE,
//                'Price cannot be zero and not POA.'
//            );
//        }
//
//        if ('' == $property->currency) {
//            $this->addError(
//                ImportProperty::ERROR_PRICE,
//                'Unknown currency code.'
//            );
//        }
//    }

    protected function validateProviderBusinessRules($property)
    {
        if ('sothebys' === $property->source) {
            $businessRuleValidator = new PropertyValidator();
            if (!$businessRuleValidator->validate($property)) {
                foreach ($businessRuleValidator->getErrors() as $error) {
                    $this->addError(
                        ImportProperty::ERROR_BUSINESS_RULES,
                        $error
                    );
                }
            }
        }
    }
}
