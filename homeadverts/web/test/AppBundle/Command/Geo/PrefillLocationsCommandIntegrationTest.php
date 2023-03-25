<?php

namespace Test\AppBundle\Command\Geo;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Geo\Geocode\HttpClient;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use function GuzzleHttp\Promise\promise_for;
use AppBundle\Entity\User\User;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class PrefillLocationsCommandIntegrationTest extends AbstractTestCase
{
    use AddressTrait, LocationTrait, GoogleLocationTrait, UserTrait, PropertyTrait;
    /**
     * @var HttpClient
     */
    private $httpClient;
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var MappingInterface[]
     */
    private $mappings;
    /**
     * @var Application
     */
    private $application;

    protected function setUp()
    {
        parent::setUp();

        $this->flush = false;
        $this->createGoogleLocations = false;

        $container = static::$kernel->getContainer();

        $this->httpClient = $this->getHttpClient();
        $container->set('ha.geo.geocode_http_client', $this->httpClient);

        /** @var \PHPUnit_Framework_MockObject_MockObject $httpClient */
        $httpClient = $this->httpClient;
        $httpClient
            ->method('reverseGeocodeAsync')
            ->willReturnCallback(function (Address $address) {
                switch ((string) $address->getCoords()) {
                    case '40.7830603,-73.9712488':
                        $filename = 'new_york_central_park_west'; break;
                    case '40.7127837,-74.0059413':
                        $filename = 'new_york_broadway'; break;
                    case '36.778261,-119.4179324':
                        $filename = 'sanger_croydon_drive'; break;
                    case '51.5073509,-0.1277583':
                        $filename = 'london_a4'; break;
                    case '40.463667,-3.74922':
                        $filename = 'madrid_ciudad'; break;
                    case '28.6139391,77.2090212':
                        $filename = 'new_delhi_panjabi'; break;
                    case '-31.2532183,146.921099':
                        $filename = 'girilambone_unnamed_road'; break;
                    case '40.8516701,-93.2599318':
                        $filename = 'iowa_corydon'; break;
                    case '29.9510658,-90.0715323':
                        $filename = 'new_orleans_caron_delet'; break;
                    case '37.7749295,-122.4194155':
                        $filename = 'san_francisco_market_street'; break;
                    case '34.0522342,-118.2436849':
                        $filename = 'los_angeles_west_1st_street'; break;
                    default:
                        $this->fail(
                            sprintf('Unexpected coordinates "%s"', (string) $address->getCoords())
                        );
                }

                return $this->getPromiseWithReverseGeocodeResponse($filename);
            })
        ;
        $httpClient
            ->method('geocodeAsync')
            ->willReturnCallback(function ($path, $country) {
                switch ($path) {
                    case 'Sanger, CA, US':
                        $filename = 'sanger_ca_us'; break;
                    case 'Corydon, IA, US':
                        $filename = 'corydon_ia_us'; break;
                    default:
                        $this->fail(sprintf('Unexpected path "%s"', $path));
                }

                return $this->getPromiseWithGeocodeResponse($filename);
            })
        ;

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'category', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

        $this->esClient = $container->get('es_client');

        $locations = $this->createLocationsPersistent(
            'Manhattan',
            'New York',
            'California',
            'London',
            'Spain',
            'New Delhi',
            'New South Wales',
            'New York IA',
            'New Orleans',
            'San Francisco',
            'Los Angeles'
        );

        $this->application = new Application(static::$kernel);
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }
    }

    /**
     * @dataProvider getFlags
     */
    public function testPrefillProperties($flags)
    {
        $properties = $this->createPropertiesPersistent([
            'Manhattan' => 1,
            'New York' => 1,
            'California' => 1,
            'London' => 1,
            'Spain' => 1,
            'New Delhi' => 1,
            'New South Wales' => 1,
            'New York IA' => 1,
            'New Orleans' => 1,
            'San Francisco' => 1,
            'Los Angeles' => 1,
        ]);
        $this->em->flush();

        $this->application->doRun(
            new ArrayInput(
                array_merge(
                    [
                        'command' => 'geo:prefill_locations_command',
                        'type' => 'property',
                    ],
                    $flags
                )
            ),
            new NullOutput()
        );

        $this->esClient->indices()->refresh(['index' => 'test_properties']);

        foreach ($properties as $property) {
            if ($this->em->contains($property)) {
                $this->em->refresh($property);
            } else {
                $property = $this->em->find(Property::class, $property->getId());
            }

            $this->assertEquals(
                GoogleLocation::STATUS_PROCESSED,
                $property->getGoogleLocationsStatus(),
                sprintf(
                    'Property "%s":"%s" status is "%s"',
                    $property->getId(),
                    $property->getAddress()->getShortAddress(),
                    $property->getGoogleLocationsStatus()
                )
            );
            $this->assertTrue($property->getGoogleLocations()->count() > 0);

            $propertyDoc = $this->esClient->get([
                'index' => 'test_properties',
                'type' => 'property',
                'id' => $property->getId(),
            ]);

            $this->assertEquals(
                array_map(
                    function (GoogleLocation $googleLocation) {
                        return $googleLocation->getPlaceId();
                    },
                    $property->getGoogleLocations()->toArray()
                ),
                array_map(
                    function ($googleLocationDoc) {
                        return $googleLocationDoc['placeId'];
                    },
                    $propertyDoc['_source']['googleLocations']
                ),
                '',
                0.0,
                10,
                true
            );
        }
    }

    /**
     * @dataProvider getFlags
     */
    public function testPrefillUsers($flags)
    {
        $users = $this->createUsersByLocationsPersistent([
            'Manhattan' => 1,
            'New York' => 1,
            'California' => 1,
            'London' => 1,
            'Spain' => 1,
            'New Delhi' => 1,
            'New South Wales' => 1,
            'New York IA' => 1,
            'New Orleans' => 1,
            'San Francisco' => 1,
            'Los Angeles' => 1,
        ]);
        $this->em->flush();

        $this->application->doRun(
            new ArrayInput(
                array_merge(
                    [
                        'command' => 'geo:prefill_locations_command',
                        'type' => 'user',
                        '--from' => 0,
                        '--step' => 2,
                    ],
                    $flags
                )
            ),
            new NullOutput()
        );

        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        foreach ($users as $user) {
            if ($this->em->contains($user)) {
                $this->em->refresh($user);
            } else {
                $user = $this->em->find(User::class, $user->getId());
            }

            $this->assertEquals(
                GoogleLocation::STATUS_PROCESSED,
                $user->getGoogleLocationsStatus(),
                sprintf(
                    'User "%s":"%s" status is "%s"',
                    $user->getId(),
                    $user->getAddress()->getShortAddress(),
                    $user->getGoogleLocationsStatus()
                )
            );
            $this->assertTrue($user->getGoogleLocations()->count() > 0);

            $userDoc = $this->esClient->get([
                'index' => 'test_agents',
                'type' => 'agent',
                'id' => $user->getId(),
            ]);

            $this->assertEquals(
                array_map(
                    function (GoogleLocation $googleLocation) {
                        return $googleLocation->getPlaceId();
                    },
                    $user->getGoogleLocations()->toArray()
                ),
                array_map(
                    function ($googleLocationDoc) {
                        return $googleLocationDoc['placeId'];
                    },
                    $userDoc['_source']['googleLocations']
                ),
                '',
                0.0,
                10,
                true
            );
        }
    }

    public function getFlags()
    {
        return [
            [
                [
                    '--from' => 0,
                    '--step' => 2,
                ],
            ],
            [
                [
                    '--from' => 0,
                    '--step' => 2,
                    '--unprocessed' => true,
                ],
            ],
        ];
    }

    private function getHttpClient()
    {
        return $this
            ->getMockBuilder(HttpClient::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getPromiseWithReverseGeocodeResponse($filename)
    {
        return $this->getPromiseWithResponse('google-reverse-geocode/'.$filename);
    }

    private function getPromiseWithGeocodeResponse($filename)
    {
        return $this->getPromiseWithResponse('google-geocode/'.$filename);
    }

    private function getPromiseWithResponse($filename)
    {
        return promise_for(json_decode(
            file_get_contents(
                $this->getStaticFixture(sprintf('geo/%s.json', $filename))
            )
        ));
    }
}
