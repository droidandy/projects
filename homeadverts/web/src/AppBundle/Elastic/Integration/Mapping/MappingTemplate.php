<?php

namespace AppBundle\Elastic\Integration\Mapping;

use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Helper\SprintfLoggerTrait;
use Doctrine\ORM\EntityManager;
use Elasticsearch\Client;
use Elasticsearch\Common\Exceptions\Missing404Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Helper\ProgressHelper;
use Symfony\Component\Console\Output\OutputInterface;

abstract class MappingTemplate implements MappingInterface
{
    use SprintfLoggerTrait;
    /**
     * @var Client
     */
    protected $client;
    /**
     * @var PopulateESInterface
     */
    protected $dbRepo;
    /**
     * @var EntityManager
     */
    protected $em;
    /**
     * @var string
     */
    private $index;
    /**
     * @var string
     */
    private $mapping;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var bool
     */
    private $test;

    /**
     * MappingTemplate constructor.
     *
     * @param string              $index
     * @param string              $mapping
     * @param Client              $client
     * @param PopulateESInterface $dbRepo
     * @param EntityManager       $em
     * @param bool                $test
     */
    public function __construct(
        $index,
        $mapping,
        Client $client,
        PopulateESInterface $dbRepo,
        EntityManager $em,
        LoggerInterface $logger,
        $test = false
    ) {
        $this->index = $index;
        $this->mapping = $mapping;
        $this->client = $client;
        $this->dbRepo = $dbRepo;
        $this->em = $em;
        $this->logger = $logger;
        $this->test = $test;
    }

    public function apply()
    {
        $index = $this->getIndex();
        if ($this->indexExists($index)) {
            $request = [
                'index' => $index,
                'type' => $this->getMapping(),
                'body' => [
                    'properties' => $this->getProperties(),
                ],
            ];

            if ($metaFields = $this->getMetaFields()) {
                foreach ($metaFields as $field => $value) {
                    $request['body']['mappings'][$this->getMapping()][$field] = $value;
                }
            }

            $this->client->indices()->putMapping($request);
        // breaks the tests:
            //  - ArticleTagRepositoryTest
            //  - ArticleStreamRepositoryTest
            //  - ArticleRecommendedRepositoryTest
        } else {
            $request = [
                'index' => $index,
                'body' => [
                    'mappings' => [
                        $this->getMapping() => [
                            'properties' => $this->getProperties(),
                        ],
                    ],
                ],
            ];

            if ($metaFields = $this->getMetaFields()) {
                foreach ($metaFields as $field => $value) {
                    $request['body']['mappings'][$this->getMapping()][$field] = $value;
                }
            }

            if ($settings = $this->getSettings()) {
                $request['body']['settings'] = $settings;
            }
            if ($this->test) {
                $request['body']['settings']['number_of_shards'] = 1;
            }

            $this->client->indices()->create($request);
        }
    }

    public function update(...$fields)
    {
        if ($this->typeExists()) {
            $propertiesToUpdate = array_intersect_key($this->getProperties(), array_flip($fields));
            if (count($propertiesToUpdate) !== count($fields)) {
                throw new \InvalidArgumentException(
                    sprintf(
                        'No mapping defined for the fields "%s"',
                        implode('", "', array_diff($fields, array_keys($propertiesToUpdate)))
                    )
                );
            }
            $this->client->indices()->putMapping([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'body' => [
                    'properties' => $propertiesToUpdate,
                ],
            ]);
        } else {
            throw new \RuntimeException(
                sprintf(
                    'Mapping %s/%s doesn\'t exist',
                    $this->getIndex(),
                    $this->getMapping()
                )
            );
        }
    }

    /**
     * @see https://www.elastic.co/guide/en/elasticsearch/reference/5.4/indices-delete-mapping.html
     */
    public function remove()
    {
        $index = $this->getIndex();
        if ($this->indexExists($index)) {
            $result = $this->client->indices()->delete(['index' => $index]);
            if (isset($result['acknowledged']) && $result['acknowledged']) {
                return;
            } else {
                throw new \RuntimeException($result['error']['reason']);
            }
        }

        throw new \RuntimeException(sprintf("Index %s doesn't exist", $index));
    }

    /**
     * @param ProgressHelper|null  $progress
     * @param OutputInterface|null $output
     */
    public function populateFromDB(ProgressHelper $progress = null, OutputInterface $output = null)
    {
        $totalEntities = $this->dbRepo->getEntitiesForDocTotal();
        if ($progress) {
            $progress->start($output, $totalEntities);
        }
        foreach ($this->dbRepo->getEntities() as $row) {
            $entity = $row[0];
            $this->addDocument($entity->getId(), $entity);
            if ($progress) {
                $progress->advance();
            }
            $this->em->detach($entity);
        }
    }

    /**
     * @param int    $id
     * @param object $entity
     */
    public function addDocument($id, $entity)
    {
        $result = $this->client->index([
            'index' => $this->getIndex(),
            'type' => $this->getMapping(),
            'id' => $id,
            'body' => $this->getDocument($entity),
        ]);

        if (!isset($result['result']) || !in_array($result['result'], ['created', 'updated'])) {
            throw new \RuntimeException('The document wasn\'t created');
        }
    }

    public function removeDocument($id)
    {
        try {
            $result = $this->client->delete([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'id' => $id,
            ]);

            if (!isset($result['result']) || 'deleted' != $result['result']) {
                throw new \RuntimeException('Removal failed');
            }
        } catch (Missing404Exception $e) {
            $this->warning(
                'Document %s/%s/%s doesn\'t exist: "%s"',
                $this->getIndex(),
                $this->getMapping(),
                $id,
                $e->getMessage()
            );

            return;
        }
    }

    public function execute(RequestInterface $request)
    {
        $query['body'] = $request->getBody();
        $query['index'] = $this->getIndex();
        $query['type'] = $this->getMapping();
        $query['client']['future'] = 'lazy';

        return $this->client->search($query);
    }

    /**
     * @param object $entity
     *
     * @return array
     */
    public function getDocument($entity)
    {
        if (!$this->support($entity)) {
            throw new \RuntimeException(sprintf('Entity must be instance of %s', get_class($entity)));
        }

        return $this->doGetDocument($entity);
    }

    abstract public function support($entity);

    protected function getIndex()
    {
        return $this->index;
    }

    protected function getMapping()
    {
        return $this->mapping;
    }

    abstract protected function getProperties();

    abstract protected function doGetDocument($entity);

    protected function getSettings()
    {
        return null;
    }

    protected function getMetaFields()
    {
        return null;
    }

    private function indexExists($index)
    {
        return $this->client->indices()->exists(['index' => $index]);
    }

    private function typeExists()
    {
        return $this->client->indices()->existsType(
            [
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
            ]
        );
    }
}
