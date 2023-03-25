<?php

namespace AppBundle\Import\Normalizer\Company;

class NormalisedCompany implements NormalisedCompanyInterface
{
    public $name;
    public $commercialName;
    public $homepageUrl;
    public $sourceRef;
    public $sourceRefType;
    public $sourceRefs;
    public $media;
    public $names;
    public $sites;
    public $modified;

    public function getValueToHash()
    {
        $propertyList = [
            'sourceRef',
            'sourceRefType',
            'sourceRefs',
            'name',
            'commercialName',
            'homepageUrl',
            'media',
            'names',
            'sites',
            'modified',
        ];

        $extraFieldList = array_diff(
            array_keys(get_object_vars($this)),
            array_merge($propertyList, [])
        );
        if (!empty($extraFieldList)) {
            throw new \LogicException(
                'Not expected fields detected in the object NormalisedCompany: '.implode(', ', $extraFieldList)
            );
        }

        $arrayToSerialize = [];
        foreach ($propertyList as $property) {
            $arrayToSerialize[$property] = $this->{$property};
        }

        return serialize($arrayToSerialize);
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getCommercialName()
    {
        return $this->commercialName;
    }

    /**
     * @return mixed
     */
    public function getHomepageUrl()
    {
        return $this->homepageUrl;
    }

    /**
     * @return mixed
     */
    public function getSourceRef()
    {
        return $this->sourceRef;
    }

    /**
     * @return mixed
     */
    public function getSourceRefType()
    {
        return $this->sourceRefType;
    }

    /**
     * @return mixed
     */
    public function getSourceRefs()
    {
        return $this->sourceRefs;
    }

    /**
     * @return mixed
     */
    public function getMedia()
    {
        return $this->media;
    }

    /**
     * @return mixed
     */
    public function getNames()
    {
        return $this->names;
    }

    /**
     * @return mixed
     */
    public function getSites()
    {
        return $this->sites;
    }

    /**
     * @return mixed
     */
    public function getModified()
    {
        return $this->modified;
    }
}
