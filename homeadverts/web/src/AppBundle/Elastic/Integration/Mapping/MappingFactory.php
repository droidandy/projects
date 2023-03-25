<?php

namespace AppBundle\Elastic\Integration\Mapping;

use Doctrine\ORM\EntityManager;
use Elasticsearch\Client;
use Psr\Log\LoggerInterface;

class MappingFactory implements MappingFactoryInterface
{
    /**
     * @var array
     */
    private $typeMappingMap;
    /**
     * @var Client
     */
    private $client;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var string
     */
    private $prefix;
    /**
     * @var bool
     */
    private $test;

    /**
     * @param $typeMappingMap
     * @param Client          $client
     * @param EntityManager   $em
     * @param LoggerInterface $logger
     * @param null            $prefix
     * @param bool            $test
     */
    public function __construct(
        $typeMappingMap,
        Client $client,
        EntityManager $em,
        LoggerInterface $logger,
        $prefix = null,
        $test = false
    ) {
        $this->typeMappingMap = $typeMappingMap;
        $this->client = $client;
        $this->em = $em;
        $this->logger = $logger;
        $this->prefix = $prefix ? $prefix.'_' : '';
        $this->test = $test;
    }

    /**
     * @param string $type
     *
     * @return MappingInterface
     */
    public function get($type)
    {
        $types = (array) $type;
        $mappings = [];
        foreach ($types as $type) {
            $mappings[] = $this->newMapping($type);
        }

        if (count($mappings) > 1) {
            $resultMapping = $this->newCompositeMapping($mappings);
        } else {
            $resultMapping = $mappings[0];
        }

        return $resultMapping;
    }

    /**
     * @param string $type
     *
     * @return MappingInterface
     */
    private function newMapping($type)
    {
        if (!array_key_exists($type, $this->typeMappingMap)) {
            throw new \RuntimeException(sprintf('The type "%s" is not a valid type', $type));
        }
        $className = $this->typeMappingMap[$type]['class'];
        $index = $this->prefix.$this->typeMappingMap[$type]['index'];
        $mapping = $this->typeMappingMap[$type]['mapping'];

        return new $className(
            $index,
            $mapping,
            $this->client,
            $this->typeMappingMap[$type]['db_repo'],
            $this->em,
            $this->logger,
            $this->test
        );
    }

    /**
     * @param array $mappings
     *
     * @return CompositeMapping
     */
    private function newCompositeMapping(array $mappings = [])
    {
        return new CompositeMapping($mappings, $this->client);
    }
}
