<?php

namespace AppBundle\Service;

use AppBundle\Entity\Property\Property;
use Symfony\Component\Translation\Translator;
use AppBundle\Entity\Property\PropertyTypes;

/**
 * Class MetaManager.
 *
 * @author Ivan Proskuryakov <volgodark@gmail.com>
 */
class MetaManager
{
    /**
     * @var Translator
     */
    private $translator;

    /**
     * MetaManager constructor.
     *
     * @param Translator $translator
     */
    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }

    /**
     * Return title for META, image title & alt attributes.
     *
     * Depending template and scope $property variable
     * could be an instance of: Property object or elasticsearch
     *
     * @param Property|array $property
     *
     * @return string
     */
    public function getPropertyTitle($property)
    {
        if ($property instanceof Property) {
            $name = $property->getName();
            $bedrooms = $property->getBedrooms();
            $type = $property->getType();
            $country = $property->getAddress()->getCountryName();
        } else {
            $name = $property['_source']['name'];
            $bedrooms = $property['_source']['bedrooms'];
            $type = $property['_source']['type'];
            $country = $property['address']->getCountryName();
        }

        if ($bedrooms) {
            $title = sprintf(
                '%s %s %s %s %s',
                $bedrooms,
                $this->translator->trans('search.list.bedrooms'),
                PropertyTypes::getById($type),
                $this->translator->trans('site.in'),
                $country
            );
        } else {
            $title = sprintf(
                '%s %s %s',
                PropertyTypes::getById($type),
                $this->translator->trans('site.in'),
                $country
            );
        }

        if ($name) {
            $title = $name.' - '.$title;
        }

        return $title;
    }

    /**
     * @param array $search
     *
     * @return string
     */
    public function getPropertyListingTitle(array $search = [])
    {
        $market = isset($search['market']) ? $search['market'] : null;
        $location = isset($search['location']) ? $search['location'] : null;

        if ($location) {
            $title = sprintf(
                '%s %s %s %s - %s',
                $this->translator->trans('title.luxury-homes'),
                $this->translator->trans('title.listing.'.$market),
                $this->translator->trans('site.in'),
                $location->getName(),
                $this->translator->trans('title.suffix')
            );
        } else {
            $title = sprintf(
                '%s %s - %s',
                $this->translator->trans('title.luxury-homes'),
                $this->translator->trans('title.listing.'.$market),
                $this->translator->trans('title.suffix')
            );
        }

        return $title;
    }
}
