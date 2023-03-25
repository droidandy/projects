<?php

namespace AppBundle\Twig;

use Twig_Extension;
use AppBundle\Service\MetaManager;
use AppBundle\Entity\Property\Property;

/**
 * Class MetaExtension.
 *
 * @author Ivan Proskuryakov <volgodark@gmail.com>
 */
class MetaExtension extends Twig_Extension
{
    /**
     * @var MetaManager
     */
    protected $metaManager;

    /**
     * @param MetaManager $metaManager
     */
    public function __construct(MetaManager $metaManager)
    {
        $this->metaManager = $metaManager;
    }

    /**
     * @return array
     */
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('property_title', array($this, 'propertyTitle')),
            new \Twig_SimpleFilter('property_listing_title', array($this, 'propertyListingTitle')),
        );
    }

    /**
     * @param Property|array $property
     *
     * @return string
     */
    public function propertyTitle($property)
    {
        return $this->metaManager->getPropertyTitle($property);
    }

    /**
     * @param array $search
     *
     * @return string
     */
    public function propertyListingTitle(array $search = [])
    {
        return $this->metaManager->getPropertyListingTitle($search);
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'meta_extension';
    }
}
