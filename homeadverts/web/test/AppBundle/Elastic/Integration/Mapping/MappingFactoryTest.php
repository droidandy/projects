<?php

namespace Test\AppBundle\Elastic\Integration\Mapping;

use AppBundle\Elastic\Integration\Mapping\CompositeMapping;
use AppBundle\Elastic\Integration\Mapping\MappingFactory;
use AppBundle\Elastic\Integration\Mapping\MappingTemplate;
use AppBundle\Elastic\Integration\Mapping\PopulateESInterface;
use Doctrine\ORM\EntityManager;
use Elasticsearch\Client;
use Test\AppBundle\Elastic\Integration\fixtures\AliceMapping;
use Test\AppBundle\Elastic\Integration\fixtures\BobMapping;

class MappingFactoryTest extends \PHPUnit_Framework_TestCase
{
    public function testGetWithNoPrefix()
    {
        $client = $this->getClient();
        $em = $this->getEntityManager();
        $repo = $this->getRepository();
        $typeMappingMap = [
            AliceMapping::TYPE => [
                'class' => AliceMapping::class,
                'index' => 'alice',
                'mapping' => 'alice',
                'db_repo' => $repo,
            ],
            BobMapping::TYPE => [
                'class' => BobMapping::class,
                'index' => 'bob',
                'mapping' => 'bob',
                'db_repo' => $repo,
            ],
        ];
        $mappingFactory = $this->getMappingFactory($typeMappingMap, $client, $em);

        $bobMapping = $mappingFactory->get(BobMapping::TYPE);
        $this->assertInstanceOf(BobMapping::class, $bobMapping);

        $reflectionClass = new \ReflectionClass(MappingTemplate::class);
        $indexReflection = $reflectionClass->getProperty('index');
        $indexReflection->setAccessible(true);
        $this->assertEquals('bob', $indexReflection->getValue($bobMapping));

        $mappingReflection = $reflectionClass->getProperty('mapping');
        $mappingReflection->setAccessible(true);
        $this->assertEquals('bob', $indexReflection->getValue($bobMapping));

        $aliceMapping = $mappingFactory->get(AliceMapping::TYPE);
        $this->assertInstanceOf(AliceMapping::class, $aliceMapping);

        $reflectionClass = new \ReflectionClass(MappingTemplate::class);
        $indexReflection = $reflectionClass->getProperty('index');
        $indexReflection->setAccessible(true);
        $this->assertEquals('alice', $indexReflection->getValue($aliceMapping));

        $mappingReflection = $reflectionClass->getProperty('mapping');
        $mappingReflection->setAccessible(true);
        $this->assertEquals('alice', $mappingReflection->getValue($aliceMapping));

        $compositeMapping = $mappingFactory->get([AliceMapping::TYPE, BobMapping::TYPE]);
        $this->assertInstanceOf(CompositeMapping::class, $compositeMapping);

        $reflectionClass = new \ReflectionClass(CompositeMapping::class);
        $mappingsReflection = $reflectionClass->getProperty('mappings');
        $mappingsReflection->setAccessible(true);
        $this->assertCount(2, $mappingsReflection->getValue($compositeMapping));
        $this->assertInstanceOf(AliceMapping::class, $mappingsReflection->getValue($compositeMapping)[0]);
        $this->assertInstanceOf(BobMapping::class, $mappingsReflection->getValue($compositeMapping)[1]);
    }

    public function testGetWithPrefix()
    {
        $client = $this->getClient();
        $em = $this->getEntityManager();
        $repo = $this->getRepository();
        $typeMappingMap = [
            AliceMapping::TYPE => [
                'class' => AliceMapping::class,
                'index' => 'alice',
                'mapping' => 'alice',
                'db_repo' => $repo,
            ],
            BobMapping::TYPE => [
                'class' => BobMapping::class,
                'index' => 'bob',
                'mapping' => 'bob',
                'db_repo' => $repo,
            ],
        ];
        $mappingFactory = $this->getMappingFactory($typeMappingMap, $client, $em, 'test');

        $bobMapping = $mappingFactory->get(BobMapping::TYPE);
        $this->assertInstanceOf(BobMapping::class, $bobMapping);

        $reflectionClass = new \ReflectionClass(MappingTemplate::class);
        $indexReflection = $reflectionClass->getProperty('index');
        $indexReflection->setAccessible(true);
        $this->assertEquals('test_bob', $indexReflection->getValue($bobMapping));

        $mappingReflection = $reflectionClass->getProperty('mapping');
        $mappingReflection->setAccessible(true);
        $this->assertEquals('bob', $mappingReflection->getValue($bobMapping));

        $aliceMapping = $mappingFactory->get(AliceMapping::TYPE);
        $this->assertInstanceOf(AliceMapping::class, $aliceMapping);

        $reflectionClass = new \ReflectionClass(MappingTemplate::class);
        $indexReflection = $reflectionClass->getProperty('index');
        $indexReflection->setAccessible(true);
        $this->assertEquals('test_alice', $indexReflection->getValue($aliceMapping));

        $mappingReflection = $reflectionClass->getProperty('mapping');
        $mappingReflection->setAccessible(true);
        $this->assertEquals('alice', $mappingReflection->getValue($aliceMapping));

        $compositeMapping = $mappingFactory->get([AliceMapping::TYPE, BobMapping::TYPE]);
        $this->assertInstanceOf(CompositeMapping::class, $compositeMapping);

        $reflectionClass = new \ReflectionClass(CompositeMapping::class);
        $mappingsReflection = $reflectionClass->getProperty('mappings');
        $mappingsReflection->setAccessible(true);
        $this->assertCount(2, $mappingsReflection->getValue($compositeMapping));
        $this->assertInstanceOf(AliceMapping::class, $mappingsReflection->getValue($compositeMapping)[0]);
        $this->assertInstanceOf(BobMapping::class, $mappingsReflection->getValue($compositeMapping)[1]);
    }

    private function getMappingFactory($map, $client, $em, $prefix = null)
    {
        return new MappingFactory($map, $client, $em, $prefix);
    }

    private function getClient()
    {
        return $this->getMockBuilder(Client::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getEntityManager()
    {
        return $this->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getRepository()
    {
        return $this->getMockBuilder(PopulateESInterface::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
