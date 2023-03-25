<?php

namespace AppBundle\Elastic\Property\Mapping;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Mapping\AbstractDocumentParserTemplate;

class PropertyDocumentParser extends AbstractDocumentParserTemplate
{
    /**
     * @param array $document
     *
     * @return Property
     */
    protected function doParse(array $document)
    {
        $property = new Property();
        $property->setId($document['_id']);

        return $property;
    }
}
