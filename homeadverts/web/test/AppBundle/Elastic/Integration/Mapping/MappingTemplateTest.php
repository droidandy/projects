<?php

namespace Test\AppBundle\Elastic\Integration\Mapping;

use AppBundle\Elastic\Integration\Mapping\MappingTemplate;

class MappingTemplateTest extends AbstractMappingTemplateTest
{
    /**
     * Override default test, no parser for template exist.
     */
    public function testGetDocumentParser()
    {
    }

    protected function getDocumentParserClass()
    {
        return 'test_document_parser_class';
    }

    protected function getIndex()
    {
        return 'test_index';
    }

    protected function getMapping()
    {
        return 'test_mapping';
    }

    protected function getMappingTemplate($index, $mapping, $client, $populateESRepo, $em, $logger)
    {
        $mock = $this
            ->getMockBuilder(MappingTemplate::class)
            ->setConstructorArgs([
                $index, $mapping, $client, $populateESRepo, $em, $logger,
            ])
            ->getMockForAbstractClass()
        ;

        return $mock;
    }

    protected function getPropertyDefinition()
    {
        return [
            'prop1' => 'def1',
            'prop2' => 'def2',
        ];
    }

    protected function getPropertyDefinitionToUpdate()
    {
        return [
            'prop2' => 'def2',
        ];
    }

    protected function getIdValue()
    {
        return 1;
    }

    protected function getPropertyValues()
    {
        return [
            'prop1' => 'val1',
            'prop2' => 'val2',
        ];
    }

    protected function getPropertyValuesToUpdate()
    {
        return ['prop2'];
    }

    protected function getPropertyValuesToUpdateNonexisting()
    {
        return ['prop3', 'prop4'];
    }

    protected function getEntity()
    {
        $entity = new \stdClass();
        $entity->prop1 = 'val1';
        $entity->prop2 = 'val2';

        return $entity;
    }
}
