<?php

namespace Test\AppBundle\Import_\Job;

use AppBundle\Entity\Import\Import;
use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Import\ImportJobGroup;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Import\Adapter\Sothebys\DataSync\Middleware;
use AppBundle\Import\Job\Deploy;
use AppBundle\Import\Wellcomemat\PrecachedWellcomematFeed;
use AppBundle\Geo\Geocode\ReverseGeocodeLocationUnfolder;
use Doctrine\DBAL\Connection;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use Predis\ClientInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Test\AppBundle\AbstractTestCase;
use GuzzleHttp\Promise as P;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class DataSyncDeployIntegrationTest extends AbstractTestCase
{
    use LocationTrait, GoogleLocationTrait, AddressTrait, UserTrait, PropertyTrait;
    /**
     * @var ContainerInterface
     */
    private $container;
    /**
     * @var ContainerInterface
     */
    private $untouchedContainer;
    /**
     * @var MappingInterface[]
     */
    private $mappings;
    private $esClient;
    /**
     * @var ClientInterface
     */
    private $redisClient;
    /**
     * @var Connection
     */
    protected $conn;

    protected function setUp()
    {
        parent::setUp();

        Middleware::$internalHttpHandler = function (Request $request) {
            switch (true) {
                case 'https://realogy.oktapreview.com/oauth2/okta_token_url/v1/token' == (string) $request->getUri():
                    $content = <<<OKTA_RESPONSE
    {"access_token":"random_token","token_type":"Bearer","expires_in":3600,"scope":"https://btt.realogyfg.com/datasyncapi"}
OKTA_RESPONSE;
                    break;
                case 'https://stg.api.realogyfg.com/datasync/agents/active' == (string) $request->getUri():
                    $content = file_get_contents(
                        $this->getStaticFixture('import/datasync/test-dataset/agent/active.json')
                    );
                    break;
                case 'https://stg.api.realogyfg.com/datasync/listings/active' == (string) $request->getUri():
                    $content = file_get_contents(
                        $this->getStaticFixture('import/datasync/test-dataset/property/active.json')
                    );
                    break;
                case preg_match(
                    '#https://stg.api.realogyfg.com/datasync/agents/([\w-]+)#',
                    (string) $request->getUri(),
                    $matches
                ):
                    $guid = $matches[1];
                    $content = file_get_contents(
                        $this->getStaticFixture(
                            sprintf(
                                'import/datasync/test-dataset/agent/%s.json',
                                strtoupper($guid)
                            )
                        )
                    );
                    break;
                case preg_match(
                    '#https://stg.api.realogyfg.com/datasync/listings/([\w-]+)#',
                    (string) $request->getUri(),
                    $matches
                ):
                    $guid = $matches[1];
                    $content = file_get_contents(
                        $this->getStaticFixture(
                            sprintf(
                                'import/datasync/test-dataset/property/%s.json',
                                strtoupper($guid)
                            )
                        )
                    );
                    break;
                default:
                    throw new \InvalidArgumentException(
                        sprintf(
                            'Unexpected url "%s"',
                            (string) $request->getUri()
                        )
                    );
            }

            return P\promise_for(
                new Response(
                    200,
                    [],
                    $content
                )
            );
        };

        $this->container = $container = self::$kernel->getContainer();
        $container->set('ha.geo.location_unfolder', $this->getLocationUnfolder());
        $container->set('wellcomemat.feed', $this->getWellcomematFeed());

        $this->untouchedContainer = clone $this->container;

        $this->conn = $container->get('db');
        $this->esClient = $container->get('es_client');
        $this->redisClient = $container->get('snc_redis.default_client');

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

        // use non-default db for test env
        \Resque::setBackend(null, 1);
    }

    protected function tearDown()
    {
        $this->redisClient->flushdb();

        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }

        $tableNames = $this
            ->conn
            ->executeQuery(
                'SELECT table_name FROM information_schema.tables where table_schema=:db',
                [
                    'db' => $this->container->getParameter('database_name_test'),
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;
        $tableNames = array_diff(
            $tableNames,
            [
                'acl_classes',
                'acl_entries',
                'acl_object_identities',
                'acl_object_identity_ancestors',
                'acl_security_identities',
            ]
        );

        $this->conn->exec(sprintf('SET FOREIGN_KEY_CHECKS=0'));
        foreach ($tableNames as $tableName) {
            $this->conn->exec(sprintf('TRUNCATE %s', $tableName));
        }
        $this->conn->exec(sprintf('SET FOREIGN_KEY_CHECKS=1'));

        parent::tearDown();
    }

    public function testActiveAndDelta()
    {
        $this->createLocationsPersistent('New York');
        $users = $this->createUsersPersistent([
            [
                'source_ref' => 'aaa',
                'source_ref_type' => 'key',
                'source_refs' => [
                    [
                        'ref' => '0ea8fd3f-9c99-48b4-b55a-d6bd98dfe845',
                        'type' => 'guid',
                    ],
                ],
            ],
            [
                'source_ref' => 'bbb',
                'source_ref_type' => 'key',
                'source_refs' => [
                    [
                        'ref' => 'f33f24b8-fb34-46a6-ac77-09a80a296362',
                        'type' => 'guid',
                    ],
                ],
            ],
            [
                'source_ref' => 'ccc',
                'source_ref_type' => 'key',
                'source_refs' => [
                    [
                        'ref' => 'c8840aec-1be0-46cc-bc33-0fd25687ed7a',
                        'type' => 'guid',
                    ],
                ],
            ],
        ]);
        $this->createPropertiesForSalePersistent([
            'New York' => [
                [
                    'source_ref' => '3yd-RFGSIR-FVDNLK',
                    'source_guid' => '18368d33-002e-4e91-b1d6-b509f2f3d28a',
                    'source' => 'sothebys',
                    'user' => $users[0],
                ],
                [
                    'source_ref' => '3yd-RFGSIR-DNB83M',
                    'source_guid' => 'e52d9110-eecb-414c-bf7c-87c91b5195bb',
                    'source' => 'sothebys',
                    'user' => $users[1],
                ],
                [
                    'source_ref' => '3yd-RFGSIR-6H7M7T',
                    'source_guid' => '36827ed3-ace0-406a-8d75-cee1cfa165a6',
                    'source' => 'sothebys',
                    'user' => $users[2],
                ],
            ],
        ]);
        $importJob = $this->createImportJob($import, 'datasync:active');
        $this->em->flush();

        $this->assertEquals(3, $this->conn->executeQuery('SELECT count(*) FROM user')->fetchColumn());
        $this->assertEquals(3, $this->conn->executeQuery('SELECT count(*) FROM property')->fetchColumn());

        $deployContainer = clone $this->untouchedContainer;
        $deploy = new Deploy($deployContainer);

        $deploy->run(['jobID' => $importJob->getId()], $deployContainer);

        $this->em->refresh($importJob);
        $this->assertEquals(15, $importJob->getUserTotal());
        $this->assertEquals(15, $importJob->getTotal());

        for ($i = 0; $i < 30; ++$i) {
            $this->imitateResqueAppInclude();
            $job = \Resque_Job::reserve('import_process');
            $this->assertInstanceOf(\Resque_Job::class, $job);
            try {
                $job->perform();
            } catch (\Exception $e) {
                echo 'Entity failed to be processed '.json_encode($job->payload);
                throw $e;
            }
        }

        $this->em->refresh($importJob);

        $this->assertEquals(15, $importJob->getUserProcessed());
        $this->assertEquals(12, $importJob->getUserAdded());
        $this->assertEquals(3, $importJob->getUserUpdated());

        $this->assertEquals(15, $importJob->getProcessed());
        $this->assertEquals(12, $importJob->getAdded());
        $this->assertEquals(3, $importJob->getUpdated());

        $this->assertEquals(15, $this->conn->executeQuery('SELECT count(*) FROM user')->fetchColumn());
        $this->assertEquals(15, $this->conn->executeQuery('SELECT count(*) FROM property')->fetchColumn());

        //TEST USER REMOVAL
        $this->imitateResqueAppInclude();
        $job = \Resque_Job::reserve('import_remove');
        $this->assertInstanceOf(\Resque_Job::class, $job);
        try {
            $job->perform();
        } catch (\Exception $e) {
            echo 'User removal failed to be processed '.json_encode($job->payload);
            throw $e;
        }

        $this->em->refresh($importJob);

        $this->assertEquals(0, $importJob->getUserRemoved());

        //TEST PROPERTY REMOVAL
        $this->imitateResqueAppInclude();
        $job = \Resque_Job::reserve('import_remove');
        $this->assertInstanceOf(\Resque_Job::class, $job);
        try {
            $job->perform();
        } catch (\Exception $e) {
            echo 'Property removal failed to be processed '.json_encode($job->payload);
            throw $e;
        }

        $this->em->refresh($importJob);

        $this->assertEquals(0, $importJob->getRemoved());
    }

    private function createImport()
    {
        $import = new Import();
        $import->setUrl('soth_url');
        $import->setSourceName('listhub');
        $import->setDateAdded(new \DateTime('now'));

        $this->em->persist($import);

        return $import;
    }

    private function createImportJob(Import $import, $method, ImportJobGroup $importJobGroup = null)
    {
        $job = new ImportJob($import);
        $job->setMethod($method);

        if ($importJobGroup) {
            $importJobGroup->addImportJob($job);
        }

        $this->em->persist($job);

        return $job;
    }

    private function imitateResqueAppInclude()
    {
        $GLOBALS['ha_resque_container_hack'] = $container = clone $this->untouchedContainer;

        \Resque_Event::clearListeners();
        \Resque_Event::listen(
            'onFailure',
            function (\Exception $e, \Resque_Job $job) use ($container) {
                $container->get('monolog.logger.import')->error($e->getMessage(), ['trace' => $e->getTraceAsString()]);
            }
        );
    }

    private function getWellcomematFeed()
    {
        $wellcomematFeed = $this
            ->getMockBuilder(PrecachedWellcomematFeed::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $wellcomematFeed
            ->method('getVideos')
            ->willReturn([])
        ;

        return $wellcomematFeed;
    }

    private function getLocationUnfolder()
    {
        $locationUnfolder = $this
            ->getMockBuilder(ReverseGeocodeLocationUnfolder::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $locationUnfolder
            ->method('unfold')
            ->willReturn(P\promise_for(null))
        ;

        return $locationUnfolder;
    }
}
