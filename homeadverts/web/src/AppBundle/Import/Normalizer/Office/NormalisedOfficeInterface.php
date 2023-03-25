<?php

namespace AppBundle\Import\Normalizer\Office;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;

interface NormalisedOfficeInterface
{
    public function getName();

    public function getSourceRef();

    public function getSourceRefType();

    public function getSourceRefs();

    public function getCompanySourceRef();

    public function getCompanySourceRefType();

    public function getCompanyName();

    public function getType();

    public function getEmail();

    public function getLeadEmail();

    public function getPhone();

    public function getPhones();

    public function getHomePageUrl();

    public function getAvatarUrl();

    public function getModified();

    public function getDescriptions();

    public function getLangs();

    public function getMedia();

    public function getSites();

    public function getStreet();

    public function getAptBldg();

    public function getTownCity();

    public function getStateCounty();

    public function getCountry();

    public function getZip();

    public function getLat();

    public function getLng();

    /**
     * @return Address
     */
    public function getAddress();

    /**
     * @return Coords
     */
    public function getCoords();
}
