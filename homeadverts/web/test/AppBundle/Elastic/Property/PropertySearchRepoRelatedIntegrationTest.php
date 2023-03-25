<?php

namespace AppBundle\Elastic\Property;

use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class PropertySearchRepoRelatedIntegrationTest extends AbstractTestCase
{
    use PropertyTrait, UserTrait, AddressTrait, LocationTrait;

    /**
     * @var MappingInterface[]
     */
    private $mappings = [];
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var PropertySearchRepo
     */
    private $propertySearchRepo;

    protected function setUp()
    {
        parent::setUp();

        $this->flush = false;

        $container = static::$kernel->getContainer();

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'category', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

        $this->esClient = $container->get('es_client');
        $this->propertySearchRepo = $container->get('ha.property.property_search_repo');
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }
    }

    public function testFindRelated()
    {
        $this->createLocationsPersistent('Manhattan');
        $manhattan = $this->getLocation('Manhattan')->getCoords();

        $properties = $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $deviations = [0, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        $i = 0;
        /** @var Property $property */
        foreach ($properties as $property) {
            if (0 == $i % 2) {
                $coords = new Coords(
                    $manhattan->getLatitude() - (0.000001 * $deviations[$i]),
                    $manhattan->getLongitude() - (0.000001 * $deviations[$i])
                );
            } else {
                $coords = new Coords(
                    $manhattan->getLatitude() + (0.000001 * $deviations[$i]),
                    $manhattan->getLongitude() + (0.000001 * $deviations[$i])
                );
            }

            $property->address->setCoords($coords);
            ++$i;
        }

        $this->createPropertiesForSalePersistent([
            'California' => 30,
        ]);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $needleProperty = $properties[0];
        $relatedProperties = array_reverse(array_slice($properties, -6));

        $results = $this->propertySearchRepo->findRelated($needleProperty);

        $this->assertEquals(14, $results->getTotal());
        $this->assertEquals(6, count($results));

        $i = 0;
        foreach ($results as $property) {
            $this->assertEquals($relatedProperties[$i++]->getId(), $property->getId());
        }
    }
}
