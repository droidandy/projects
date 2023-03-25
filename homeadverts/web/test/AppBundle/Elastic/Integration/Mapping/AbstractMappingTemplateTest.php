<?php

namespace Test\AppBundle\Elastic\Integration\Mapping;

use AppBundle\Elastic\Integration\Mapping\MappingTemplate;
use AppBundle\Elastic\Integration\Mapping\PopulateESInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use Doctrine\ORM\EntityManager;
use Elasticsearch\Client;
use Elasticsearch\Common\Exceptions\Missing404Exception;
use Elasticsearch\Namespaces\IndicesNamespace;
use GuzzleHttp\Ring\Future\FutureArrayInterface;
use Psr\Log\LoggerInterface;

abstract class AbstractMappingTemplateTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var Client
     */
    protected $client;
    /**
     * @var PopulateESInterface
     */
    protected $populateESRepo;
    /**
     * @var EntityManager
     */
    protected $em;
    /**
     * @var LoggerInterface
     */
    protected $logger;
    /**
     * @var IndicesNamespace
     */
    protected $namespace;
    /**
     * @var MappingTemplate
     */
    protected $mappingTemplate;

    protected function setUp()
    {
        $this->client = $this->getClient();
        $this->populateESRepo = $this->getPopulateESRepo();
        $this->em = $this->getEntityManager();
        $this->logger = $this->getLogger();
        $this->namespace = $this->getIndicesNamespace();
        $this->mappingTemplate = $this->getMappingTemplate(
            $this->getIndex(),
            $this->getMapping(),
            $this->client,
            $this->populateESRepo,
            $this->em,
            $this->logger
        );
    }

    public function testGetDocumentParser()
    {
        $mapping = $this->mappingTemplate;

        $parser = $mapping->getDocumentParser();
        $this->assertInstanceOf($this->getDocumentParserClass(), $parser);

        $refl = new \ReflectionClass($parser);
        $refl = $refl->getParentClass();
        $index = $refl->getProperty('index');
        $index->setAccessible(true);
        $this->assertEquals($this->getIndex(), $index->getValue($parser));

        $mapping = $refl->getProperty('mapping');
        $mapping->setAccessible(true);
        $this->assertEquals($this->getMapping(), $mapping->getValue($parser));
    }

    public function testApplyIndexDoesntExist()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $namespace */
        $namespace = $this->namespace;
        $mappingTemplate = $this->mappingTemplate;

        if ($mappingTemplate instanceof \PHPUnit_Framework_MockObject_MockObject) {
            $mappingTemplate
                ->expects($this->once())
                ->method('getProperties')
                ->willReturn(
                    $this->getPropertyDefinition()
                )
            ;
        }

        $client
            ->expects($this->exactly(2))
            ->method('indices')
            ->willReturn($namespace)
        ;

        $indexDefinition = [
            'index' => $this->getIndex(),
            'body' => [
                'mappings' => [
                    $this->getMapping() => [
                        'properties' => $this->getPropertyDefinition(),
                    ],
                ],
            ],
        ];
        if ($this->getSettings()) {
            $indexDefinition['body']['settings'] = $this->getSettings();
        }

        $namespace
            ->expects($this->once())
            ->method('exists')
            ->with(['index' => $this->getIndex()])
            ->willReturn(false)
        ;
        $namespace
            ->expects($this->never())
            ->method('putMapping')
        ;
        $namespace
            ->expects($this->once())
            ->method('create')
            ->with($indexDefinition)
            ->willReturn([
                'acknowledged' => true,
            ])
        ;

        $mappingTemplate->apply();
    }

    public function testApplyIndexExists()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $namespace */
        $namespace = $this->namespace;
        $mappingTemplate = $this->mappingTemplate;

        if ($mappingTemplate instanceof \PHPUnit_Framework_MockObject_MockObject) {
            $mappingTemplate
                ->expects($this->once())
                ->method('getProperties')
                ->willReturn(
                    $this->getPropertyDefinition()
                )
            ;
        }

        $client
            ->expects($this->exactly(2))
            ->method('indices')
            ->willReturn($namespace)
        ;

        $namespace
            ->expects($this->once())
            ->method('exists')
            ->with(['index' => $this->getIndex()])
            ->willReturn(true)
        ;
        $namespace
            ->expects($this->never())
            ->method('create')
        ;
        $namespace
            ->expects($this->once())
            ->method('putMapping')
            ->with(
                [
                    'index' => $this->getIndex(),
                    'type' => $this->getMapping(),
                    'body' => [
                        'properties' => $this->getPropertyDefinition(),
                    ],
                ]
            )
            ->willReturn([
                'acknowledged' => true,
            ])
        ;

        $mappingTemplate->apply();
    }

    public function testUpdateMappingSuccessful()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $namespace */
        $namespace = $this->namespace;
        $mappingTemplate = $this->mappingTemplate;

        if ($mappingTemplate instanceof \PHPUnit_Framework_MockObject_MockObject) {
            $mappingTemplate
                ->expects($this->once())
                ->method('getProperties')
                ->willReturn(
                    $this->getPropertyDefinition()
                )
            ;
        }

        $client
            ->expects($this->exactly(2))
            ->method('indices')
            ->willReturn($namespace)
        ;

        $namespace
            ->expects($this->once())
            ->method('existsType')
            ->with(
                [
                    'index' => $this->getIndex(),
                    'type' => $this->getMapping(),
                ]
            )
            ->willReturn(true)
        ;
        $namespace
            ->expects($this->never())
            ->method('create')
        ;
        $namespace
            ->expects($this->once())
            ->method('putMapping')
            ->with(
                [
                    'index' => $this->getIndex(),
                    'type' => $this->getMapping(),
                    'body' => [
                        'properties' => $this->getPropertyDefinitionToUpdate(),
                    ],
                ]
            )
            ->willReturn([
                'acknowledged' => true,
            ])
        ;

        $mappingTemplate->update(...$this->getPropertyValuesToUpdate());
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessageRegExp /No mapping defined for the fields .+/
     */
    public function testUpdateMappingFailureByFields()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $namespace */
        $namespace = $this->namespace;
        $mappingTemplate = $this->mappingTemplate;

        if ($mappingTemplate instanceof \PHPUnit_Framework_MockObject_MockObject) {
            $mappingTemplate
                ->expects($this->once())
                ->method('getProperties')
                ->willReturn(
                    $this->getPropertyDefinition()
                )
            ;
        }

        $client
            ->expects($this->exactly(1))
            ->method('indices')
            ->willReturn($namespace)
        ;

        $namespace
            ->expects($this->once())
            ->method('existsType')
            ->with(
                [
                    'index' => $this->getIndex(),
                    'type' => $this->getMapping(),
                ]
            )
            ->willReturn(true)
        ;
        $namespace
            ->expects($this->never())
            ->method('create')
        ;
        $namespace
            ->expects($this->never())
            ->method('putMapping')
        ;

        $mappingTemplate->update(...$this->getPropertyValuesToUpdateNonexisting());
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessageRegExp /Mapping .+ doesn't exist/
     */
    public function testUpdateMappingFailureByMapping()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $namespace */
        $namespace = $this->namespace;
        $mappingTemplate = $this->mappingTemplate;

        if ($mappingTemplate instanceof \PHPUnit_Framework_MockObject_MockObject) {
            $mappingTemplate
                ->expects($this->never())
                ->method('getProperties')
                ->willReturn(
                    $this->getPropertyDefinition()
                )
            ;
        }

        $client
            ->expects($this->exactly(1))
            ->method('indices')
            ->willReturn($namespace)
        ;

        $namespace
            ->expects($this->once())
            ->method('existsType')
            ->with(
                [
                    'index' => $this->getIndex(),
                    'type' => $this->getMapping(),
                ]
            )
            ->willReturn(false)
        ;
        $namespace
            ->expects($this->never())
            ->method('create')
        ;
        $namespace
            ->expects($this->never())
            ->method('putMapping')
        ;

        $mappingTemplate->update(...$this->getPropertyValuesToUpdate());
    }

    public function testRemoveSuccessful()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $namespace */
        $namespace = $this->namespace;
        $mappingTemplate = $this->mappingTemplate;

        $client
            ->expects($this->exactly(2))
            ->method('indices')
            ->willReturn($namespace)
        ;

        $namespace
            ->expects($this->once())
            ->method('exists')
            ->with(['index' => $this->getIndex()])
            ->willReturn(true)
        ;

        $namespace
            ->expects($this->once())
            ->method('delete')
            ->with(['index' => $this->getIndex()])
            ->willReturn([
                'acknowledged' => true,
            ])
        ;

        $mappingTemplate->remove();
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Failed for testability
     */
    public function testRemoveFailure()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $namespace */
        $namespace = $this->namespace;
        $mappingTemplate = $this->mappingTemplate;

        $client
            ->expects($this->exactly(2))
            ->method('indices')
            ->willReturn($namespace)
        ;

        $namespace
            ->expects($this->once())
            ->method('exists')
            ->with(['index' => $this->getIndex()])
            ->willReturn(true)
        ;

        $namespace
            ->expects($this->once())
            ->method('delete')
            ->with(['index' => $this->getIndex()])
            ->willReturn([
                'error' => [
                    'reason' => 'Failed for testability',
                ],
            ])
        ;

        $mappingTemplate->remove();
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessageRegExp /Index [\d\w_]+ doesn't exist/
     */
    public function testRemoveIndexDoesntExist()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $namespace */
        $namespace = $this->namespace;
        $mappingTemplate = $this->mappingTemplate;

        $client
            ->expects($this->once())
            ->method('indices')
            ->willReturn($namespace)
        ;

        $namespace
            ->expects($this->once())
            ->method('exists')
            ->with(['index' => $this->getIndex()])
            ->willReturn(false)
        ;

        $namespace
            ->expects($this->never())
            ->method('delete')
        ;

        $mappingTemplate->remove();
    }

    public function testAddDocumentSuccessful()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $mappingTemplate = $this->mappingTemplate;

        $entity = $this->getEntity();

        if ($mappingTemplate instanceof \PHPUnit_Framework_MockObject_MockObject) {
            $mappingTemplate
                ->expects($this->once())
                ->method('doGetDocument')
                ->with($entity)
                ->willReturn($this->getPropertyValues())
            ;
            $mappingTemplate
                ->expects($this->once())
                ->method('support')
                ->with($entity)
                ->willReturn(true)
            ;
        }

        $client
            ->expects($this->once())
            ->method('index')
            ->with([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'id' => $this->getIdValue(),
                'body' => $this->getPropertyValues(),
            ])
            ->willReturn([
                'result' => 'created',
            ])
        ;

        $mappingTemplate->addDocument($this->getIdValue(), $entity);
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage The document wasn't created
     */
    public function testAddDocumentFailure()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $mappingTemplate = $this->mappingTemplate;

        $entity = $this->getEntity();

        if ($mappingTemplate instanceof \PHPUnit_Framework_MockObject_MockObject) {
            $mappingTemplate
                ->expects($this->once())
                ->method('doGetDocument')
                ->with($entity)
                ->willReturn($this->getPropertyValues())
            ;
            $mappingTemplate
                ->expects($this->once())
                ->method('support')
                ->with($entity)
                ->willReturn(true)
            ;
        }

        $client
            ->expects($this->once())
            ->method('index')
            ->with([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'id' => $this->getIdValue(),
                'body' => $this->getPropertyValues(),
            ])
            ->willReturn([
                'created' => false,
            ])
        ;

        $mappingTemplate->addDocument(1, $entity);
    }

    public function testRemoveDocumentSuccessful()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $mappingTemplate = $this->mappingTemplate;

        $client
            ->expects($this->once())
            ->method('delete')
            ->with([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'id' => $this->getIdValue(),
            ])
            ->willReturn([
                'result' => 'deleted',
            ])
        ;

        $mappingTemplate->removeDocument($this->getIdValue());
    }

    public function testRemoveDocumentSuccessfulNotFound()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->once())
            ->method('warning')
            ->with(
                sprintf(
                    'Document %s/%s/%s doesn\'t exist: "%s"',
                    $this->getIndex(),
                    $this->getMapping(),
                    $this->getIdValue(),
                    'error_msg'
                )
            )
        ;

        $mappingTemplate = $this->mappingTemplate;

        $client
            ->expects($this->once())
            ->method('delete')
            ->with([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'id' => $this->getIdValue(),
            ])
            ->willThrowException(
                new Missing404Exception('error_msg')
            )
        ;

        $mappingTemplate->removeDocument($this->getIdValue());
    }

    /**
     * @expectedException \RuntimeException
     */
    public function testRemoveDocumentFailure()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $mappingTemplate = $this->mappingTemplate;

        $client
            ->expects($this->once())
            ->method('delete')
            ->with([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'id' => $this->getIdValue(),
            ])
            ->willReturn([
                'error' => 'Index not found',
            ])
        ;

        $mappingTemplate->removeDocument($this->getIdValue());
    }

    public function testExecute()
    {
        $request = $this->getRequest();
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $mappingTemplate = $this->mappingTemplate;

        $request
            ->expects($this->once())
            ->method('getBody')
            ->willReturn([
                'from' => 0,
                'size' => 10,
                'query' => [
                    'match_all' => (object) [],
                ],
            ])
        ;

        $client
            ->expects($this->once())
            ->method('search')
            ->with([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'client' => [
                    'future' => 'lazy',
                ],
                'body' => [
                    'from' => 0,
                    'size' => 10,
                    'query' => [
                        'match_all' => (object) [],
                    ],
                ],
            ])
            ->willReturn($this->getFuture())
        ;

        $this->assertInstanceOf(FutureArrayInterface::class, $mappingTemplate->execute($request));
    }

    abstract protected function getDocumentParserClass();

    abstract protected function getIndex();

    abstract protected function getMapping();

    abstract protected function getMappingTemplate($index, $mapping, $client, $populateESRepo, $em, $logger);

    abstract protected function getPropertyDefinition();

    abstract protected function getPropertyDefinitionToUpdate();

    abstract protected function getIdValue();

    abstract protected function getPropertyValues();

    abstract protected function getPropertyValuesToUpdate();

    abstract protected function getPropertyValuesToUpdateNonexisting();

    abstract protected function getEntity();

    protected function getSettings()
    {
        return null;
    }

    protected function getClient()
    {
        return $this->getMockBuilder(Client::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    protected function getPopulateESRepo()
    {
        return $this->getMockBuilder(PopulateESInterface::class)
            ->getMock()
        ;
    }

    protected function getEntityManager()
    {
        return $this->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    protected function getLogger()
    {
        return $this->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;
    }

    protected function getIndicesNamespace()
    {
        return $this->getMockBuilder(IndicesNamespace::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    protected function getRequest()
    {
        return $this->getMockBuilder(RequestInterface::class)
            ->getMock()
        ;
    }

    protected function getFuture()
    {
        return $this->getMockBuilder(FutureArrayInterface::class)
            ->getMock()
        ;
    }
}
