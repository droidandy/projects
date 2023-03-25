<?php

namespace Test\AppBundle\Elastic\Integration\fixtures;

use AppBundle\Elastic\Integration\Mapping\MappingTemplate;

class BobMapping extends MappingTemplate
{
    const TYPE = 'bob';

    public function support($entity)
    {
        return true;
    }

    public function getDocumentParser()
    {
        return null;
    }

    protected function getProperties()
    {
        return [];
    }

    protected function doGetDocument($entity)
    {
        return [];
    }
}
