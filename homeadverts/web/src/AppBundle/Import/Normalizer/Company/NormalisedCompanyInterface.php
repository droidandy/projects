<?php

namespace AppBundle\Import\Normalizer\Company;

interface NormalisedCompanyInterface
{
    public function getName();

    public function getCommercialName();

    public function getHomepageUrl();

    public function getSourceRef();

    public function getSourceRefType();

    public function getSourceRefs();

    public function getMedia();

    public function getNames();

    public function getSites();

    public function getModified();
}
