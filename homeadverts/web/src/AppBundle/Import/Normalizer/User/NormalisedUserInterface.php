<?php

namespace AppBundle\Import\Normalizer\User;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;

interface NormalisedUserInterface
{
    /**
     * @return mixed
     */
    public function getSourceRef();

    /**
     * @return mixed
     */
    public function getSourceRefType();

    /**
     * @return mixed
     */
    public function getSourceRefs();

    /**
     * @return mixed
     */
    public function getVirtualSourceRefs();

    /**
     * @return mixed
     */
    public function getOfficeSourceRef();

    /**
     * @return mixed
     */
    public function getOfficeSourceRefType();

    /**
     * @return mixed
     */
    public function getName();

    /**
     * @return mixed
     */
    public function getPhone();

    /**
     * @return mixed
     */
    public function getEmail();

    /**
     * @return mixed
     */
    public function getAllEmails();

    /**
     * @return mixed
     */
    public function getHomePageUrl();

    /**
     * @return mixed
     */
    public function getAvatarUrl();

    /**
     * @return mixed
     */
    public function getDescriptions();

    /**
     * @return mixed
     */
    public function getFallbackLatitude();

    /**
     * @return mixed
     */
    public function getFallbackLongitude();

    /**
     * @return mixed
     */
    public function getCompanyName();

    /**
     * @return mixed
     */
    public function getCompanyPhone();

    /**
     * @return Address
     */
    public function getAddress();

    /**
     * @return mixed
     */
    public function getStreet();

    /**
     * @return mixed
     */
    public function getAptBldg();

    /**
     * @return mixed
     */
    public function getTownCity();

    /**
     * @return mixed
     */
    public function getStateCounty();

    /**
     * @return mixed
     */
    public function getCountry();

    /**
     * @return mixed
     */
    public function getZip();

    /**
     * @return Coords
     */
    public function getFallbackCoords();
}
