<?php

namespace Test\AppBundle\Elastic\Integration\Mapping;

use AppBundle\Elastic\Integration\Mapping\CompositeMapping;
use AppBundle\Elastic\Integration\Mapping\MappingTemplate;
use AppBundle\Elastic\Integration\Mapping\PopulateESInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use Doctrine\ORM\EntityManager;
use Elasticsearch\Client;
use GuzzleHttp\Ring\Future\FutureArrayInterface;

class CompositeMappingTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Composite mappings should be used only for search
     */
    public function testApply()
    {
        $client = $this->getClient();
        $compositeMapping = $this->getCompositeMapping([], $client);

        $compositeMapping->apply();
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Composite mappings should be used only for search
     */
    public function testRemove()
    {
        $client = $this->getClient();
        $compositeMapping = $this->getCompositeMapping([], $client);

        $compositeMapping->remove();
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Composite mappings should be used only for search
     */
    public function testAddDocument()
    {
        $client = $this->getClient();
        $compositeMapping = $this->getCompositeMapping([], $client);
        $entity = new \stdClass();

        $compositeMapping->addDocument(1, $entity);
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Composite mappings should be used only for search
     */
    public function testRemoveDocument()
    {
        $client = $this->getClient();
        $compositeMapping = $this->getCompositeMapping([], $client);

        $compositeMapping->removeDocument(1);
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Composite mappings should be used only for search
     */
    public function testGetDocumentParser()
    {
        $client = $this->getClient();
        $compositeMapping = $this->getCompositeMapping([], $client);

        $compositeMapping->getDocumentParser();
    }

    public function testExecute()
    {
        $queryCommand = $this->getRequest();
        $client = $this->getClient();
        $mappings = [];
        foreach ([['test_index1', 'test_mapping1'], ['test_index1', 'test_mapping2'], ['test_index3', 'test_mapping3']] as $mapping) {
            $mappings[] = $this->getMappingTemplate($mapping[0], $mapping[1], $client);
        }

        $compositeMapping = $this->getCompositeMapping($mappings, $client);

        $queryCommand
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
                'index' => 'test_index1,test_index3',
                'type' => 'test_mapping1,test_mapping2,test_mapping3',
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

        $this->assertInstanceOf(FutureArrayInterface::class, $compositeMapping->execute($queryCommand));
    }

    private function getCompositeMapping($mappings, $client)
    {
        return new CompositeMapping($mappings, $client);
    }

    private function getMappingTemplate($index, $mapping, $client)
    {
        $mock = $this
            ->getMockBuilder(MappingTemplate::class)
            ->setConstructorArgs([
                $index, $mapping, $client, $this->getDbRepo(), $this->getEntityManager(),
            ])
            ->getMockForAbstractClass()
        ;

        return $mock;
    }

    private function getClient()
    {
        return $this->getMockBuilder(Client::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getDbRepo()
    {
        return $this
            ->getMockBuilder(PopulateESInterface::class)
            ->getMock()
        ;
    }

    private function getEntityManager()
    {
        return $this
            ->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getRequest()
    {
        return $this->getMockBuilder(RequestInterface::class)
            ->getMock()
        ;
    }

    private function getFuture()
    {
        return $this->getMockBuilder(FutureArrayInterface::class)
            ->getMock()
        ;
    }
}
