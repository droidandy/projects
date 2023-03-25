<?php

namespace Test\AppBundle\Import_\Job;

use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Import\Job\PropertyPhotoProcess;
use AppBundle\Import\Wellcomemat\WellcomematFeed;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use GuzzleHttp\Exception\RequestException;
use Monolog\Handler\TestHandler;
use Monolog\Logger;
use Predis\ClientInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;
use GuzzleHttp\Promise as P;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use AppBundle\Import\Adapter\Sothebys\DataSync\Middleware;

class PropertyPhotoProcessIntegrationTest extends AbstractTestCase
{
    use AddressTrait, LocationTrait, GoogleLocationTrait, UserTrait, PropertyTrait;

    /**
     * @var ContainerInterface
     */
    private $container;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var ClientInterface
     */
    private $redisClient;
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var MappingInterface[]
     */
    private $mappings;
    /**
     * @var TestHandler
     */
    private $loggerHandler;

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
                case preg_match(
                    '#https://stg.api.realogyfg.com/datasync/listings/([\w-]+)#',
                    (string) $request->getUri(),
                    $matches
                ):
                    $guid = strtolower($matches[1]);
                    $content = file_get_contents(
                        $this->getStaticFixture(
                            sprintf(
                                'import/datasync/get-property-by-id/%s.json',
                                $guid
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

            if (isset($guid) && '08ead264-f922-4458-8c6a-c347a1053463' == $guid) {
                return P\rejection_for(
                    RequestException::create(
                        $request,
                        new Response(
                            404,
                            [],
                            $content
                        )
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

        $this->loggerHandler = new TestHandler();
        $logger = new Logger('import', [$this->loggerHandler]);

        $this->container->set('monolog.logger.import', $logger);
        $container->set('wellcomemat.feed', $this->getWellcomematFeed());

        $this->conn = $container->get('db');
        $this->esClient = $container->get('es_client');
        $this->redisClient = $container->get('snc_redis.default_client');

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'category', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

        // use non-default db for test env
        \Resque::setBackend(null, 1);

        $this->conn->beginTransaction();
    }

    protected function tearDown()
    {
        $this->redisClient->flushdb();

        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }

        $this->conn->rollBack();

        parent::tearDown();
    }

    public function testProcess()
    {
        $this->createLocationsPersistent('New York');
        $dir = __DIR__.'/../../../fixtures/property/';
        $properties = $this->createPropertiesForSalePersistent([
            'New York' => [
                include $dir.'007f1591-03b6-43ed-93f2-23b5febdb937.php',
                include $dir.'03fde3de-55de-426d-ab9e-7a61b1d3ebc8.php',
                include $dir.'0461cc69-054b-46e9-b421-3c2707e00cb0.php',
                include $dir.'06bea900-9d9c-4d54-877d-11159bad3d2d.php',
                include $dir.'06f37771-627e-4673-b91f-3cd755ed28f2.php',
                include $dir.'08ead264-f922-4458-8c6a-c347a1053463.php',
                include $dir.'0b91a550-7f16-4c6d-aa2c-15cd24c9dda2.php',
                include $dir.'5419f66b-e3a7-4491-865f-a15b1926153e.php',
                include $dir.'7b31512f-4fb5-4f11-a6ed-b2f86bf762e7.php',
                include $dir.'99eb9c79-35fc-4168-a646-24dc5537c6e5.php',
                include $dir.'2edb79aa-8f3c-4864-b53d-ff516ea873b4.php',
            ],
        ]);

        $this->assertEquals(11, $this->conn->fetchColumn('SELECT count(*) FROM property'));
        $this->assertEquals(11, $this->conn->fetchColumn('SELECT count(*) FROM property WHERE primary_photo_id IS NOT NULL'));
        $this->assertEquals(259, $this->conn->fetchColumn('SELECT count(*) FROM property_photo'));
        $this->assertEquals(18, $this->conn->fetchColumn('SELECT count(*) FROM property_photo WHERE sourceUrl LIKE "%openapi.azureedge.net%"'));
        $this->assertEquals(241, $this->conn->fetchColumn('SELECT count(*) FROM property_photo WHERE sourceUrl LIKE "%sothebys%"'));

        $guidDateUpdatedOld = $this->conn->executeQuery('SELECT sourceGuid, dateUpdated FROM property')->fetchAll(\PDO::FETCH_KEY_PAIR);

        $process = new PropertyPhotoProcess($this->container);

        $statsAggregated = [
            'added' => 0,
            'modified' => 0,
            'deleted' => 0,
        ];
        foreach ($properties as $property) {
            $process->run(
                [
                    'property_id' => $property->getId(),
                    'property_guid' => $property->getSourceGuid(),
                ],
                $this->container
            );
            $stats = $process->getStats();

            $statsAggregated = [
                'added' => $statsAggregated['added'] + $stats['added'],
                'modified' => $statsAggregated['modified'] + $stats['modified'],
                'deleted' => $statsAggregated['deleted'] + $stats['deleted'],
            ];
        }

        $this->assertEquals(
            [
                'added' => 198,
                'modified' => 18,
                'deleted' => 219,
            ],
            $statsAggregated
        );
        $this->assertEquals(11, $this->conn->fetchColumn('SELECT count(*) FROM property'));
        $this->assertEquals(11, $this->conn->fetchColumn('SELECT count(*) FROM property WHERE primary_photo_id IS NOT NULL'));
        $this->assertEquals(238, $this->conn->fetchColumn('SELECT count(*) FROM property_photo'));
        $this->assertEquals(238, $this->conn->fetchColumn('SELECT count(DISTINCT sourceUrl) FROM property_photo'));
        $this->assertEquals(216, $this->conn->fetchColumn('SELECT count(*) FROM property_photo WHERE sourceUrl LIKE "%openapi.azureedge.net%"'));
        $this->assertEquals(22, $this->conn->fetchColumn('SELECT count(*) FROM property_photo WHERE sourceUrl LIKE "%sothebys%"'));

        $guidDateUpdatedNew = $this->conn->executeQuery('SELECT sourceGuid, dateUpdated FROM property')->fetchAll(\PDO::FETCH_KEY_PAIR);

        $this->assertEquals(
            $guidDateUpdatedOld['08ead264-f922-4458-8c6a-c347a1053463'],
            $guidDateUpdatedNew['08ead264-f922-4458-8c6a-c347a1053463']
        );
        unset(
            $guidDateUpdatedNew['08ead264-f922-4458-8c6a-c347a1053463'],
            $guidDateUpdatedOld['08ead264-f922-4458-8c6a-c347a1053463']
        );

        foreach ($guidDateUpdatedNew as $guid => $dateUpdated) {
            $this->assertNotEquals(
                $guidDateUpdatedOld[$guid],
                $dateUpdated
            );
        }

        $this->assertTrue(
            $this
                ->loggerHandler
                ->hasRecordThatMatches(
                    '#^\[Property \d+:08ead264-f922-4458-8c6a-c347a1053463\] ERROR 404#',
                    Logger::ERROR
                )
        );
    }

    private function getWellcomematFeed()
    {
        $wellcomematFeed = $this
            ->getMockBuilder(WellcomematFeed::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $wellcomematFeed
            ->method('getVideos')
            ->willReturn([])
        ;

        return $wellcomematFeed;
    }
}
