<?php

namespace Test\AppBundle;

use AppBundle\Elastic\Integration\Mapping\MappingInterface;

abstract class AbstractElasticWebTestCase extends AbstractWebTestCase
{

    /**
     * @var MappingInterface[]
     */
    private $mappings;

    protected function setUp()
    {
        parent::setUp();

        $mappingFactory = $this->getContainer()->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

    }

    protected function tearDown()
    {
        parent::tearDown();

        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }
    }

}
