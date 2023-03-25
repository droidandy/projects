<?php

namespace AppBundle\Elastic\Integration\Mapping;

use Elasticsearch\Client;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Console\Helper\ProgressHelper;
use Symfony\Component\Console\Output\OutputInterface;

class CompositeMapping extends MappingTemplate
{
    /**
     * @var MappingTemplate[]
     */
    private $mappings = [];

    /**
     * CompositeMapping constructor.
     *
     * @param array                    $mappings
     * @param Client                   $client
     * @param PopulateESInterface|null $dbRepo
     * @param EntityManager|null       $em
     * @param bool                     $test
     */
    public function __construct(
        array $mappings,
        Client $client,
        PopulateESInterface $dbRepo = null,
        EntityManager $em = null,
        $test = false
    ) {
        $this->client = $client;
        $this->mappings = $mappings;
    }

    /**
     * @throws \RuntimeException
     */
    public function support($entity)
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }

    /**
     * @throws \RuntimeException
     */
    public function apply()
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }

    /**
     * @throws \RuntimeException
     */
    public function remove()
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }

    /**
     * @param ProgressHelper|null  $progress
     * @param OutputInterface|null $output
     *
     * @throws \RuntimeException
     */
    public function populateFromDB(ProgressHelper $progress = null, OutputInterface $output = null)
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }

    /**
     * @param int    $id
     * @param object $document
     *
     * @throws \RuntimeException
     */
    public function addDocument($id, $document)
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }

    /**
     * @param int $id
     *
     * @throws \RuntimeException
     */
    public function removeDocument($id)
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }

    /**
     * @throws \RuntimeException
     */
    public function getDocumentParser()
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }

    protected function getIndex()
    {
        $indexes = array_map(
            function (MappingTemplate $mapping) {
                return $mapping->getIndex();
            },
            $this->mappings
        );
        $indexes = array_unique($indexes);

        return implode(',', $indexes);
    }

    protected function getMapping()
    {
        $mappings = array_map(
            function (MappingTemplate $mapping) {
                return $mapping->getMapping();
            },
            $this->mappings
        );
        $mappings = array_unique($mappings);

        return implode(',', $mappings);
    }

    /**
     * @throws \RuntimeException
     */
    protected function getProperties()
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }

    /**
     * @param object $entity
     *
     * @throws \RuntimeException
     */
    protected function doGetDocument($entity)
    {
        throw new \RuntimeException('Composite mappings should be used only for search');
    }
}
