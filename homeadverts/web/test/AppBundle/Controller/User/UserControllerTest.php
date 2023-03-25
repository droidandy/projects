<?php

namespace Test\AppBundle\Controller;

use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use Symfony\Component\HttpFoundation\Session\Session;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\UserTrait;

class UserControllerTest extends AbstractWebTestCase
{
    use AddressTrait, LocationTrait, GoogleLocationTrait, UserTrait;

    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var Session
     */
    private $session;
    /**
     * @var MappingInterface[]
     */
    private $mappings;

    protected function setUp()
    {
        parent::setUp();

        $this->client->disableReboot();
        $container = static::$kernel->getContainer();

        $this->session = $container->get('session');
        $this->esClient = $container->get('es_client');

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }

        parent::tearDown();
    }

    public function testLocationActionDefaultState()
    {
        $this->createLocationsPersistent(
            'New York',
            'California',
            'London',
            'Spain'
        );

        $this->assertUsersCountOnPage(0, 'New York');
        $this->assertUsersCountOnPage(0, 'California');
        $this->assertUsersCountOnPage(0, 'London');
        $this->assertUsersCountOnPage(0, 'Spain');
    }

    public function testLocationActionListing()
    {
        $this->createLocationsPersistent(
            'New York',
            'California',
            'London',
            'Spain'
        );

        $this->createUsersByLocationsPersistent([
            'New York' => 10,
            'California' => 15,
            'London' => 7,
        ]);

        $this->assertUsersCountOnPage(10, 'New York');
        $this->assertUsersCountOnPage(15, 'California');
        $this->assertUsersCountOnPage(7, 'London');
        $this->assertUsersCountOnPage(0, 'Spain');
    }

    public function testLocationActionPagination()
    {
        $this->createLocationsPersistent(
            'New York',
            'California',
            'London',
            'Spain'
        );

        $this->createUsersByLocationsPersistent([
            'New York' => 37,
            'London' => 7,
            'Spain' => 15,
        ]);

        $this->assertUsersCountOnPage(15, 'New York', ['p' => 1]);
        $this->assertUsersCountOnPage(15, 'New York', ['p' => 2]);
        $this->assertUsersCountOnPage(7, 'New York', ['p' => 3]);
        $this->assertUsersCountOnPage(0, 'New York', ['p' => 4]);
        $this->assertUsersCountOnPage(0, 'California');
        $this->assertUsersCountOnPage(7, 'London');
        $this->assertUsersCountOnPage(15, 'Spain');
    }

    public function testLocationActionFiltering()
    {
        $this->markTestSkipped('...');

        $this->createLocationsPersistent(
            'New York',
            'California',
            'London',
            'Spain'
        );

        $this->createUsersByLocationsPersistent([
            'New York' => [
                [
                    'name' => 'Alice',
                    'primary_language' => 'en',
                    'spoken_languages' => ['fr'],
                ],
                [
                    'name' => 'Bob',
                    'primary_language' => 'en',
                ],
                [
                    'name' => 'Eve',
                    'primary_language' => 'fr',
                ],
            ],
        ]);

        $this->assertUsersCountOnPage(3, 'New York');
        $this->assertUsersCountOnPage(2, 'New York', ['filters' => ['language' => 'en']]);
        $this->assertUsersCountOnPage(2, 'New York', ['filters' => ['language' => 'fr']]);
        $this->assertUsersCountOnPage(0, 'New York', ['filters' => ['language' => 'zh']]);

        $this->assertUsersCountOnPage(2, 'New York', ['filters' => ['language' => 'fr', 'sort' => 'name:desc']]);
        $this->assertUserOrderOnPage('Eve', 'Alice');
    }

    public function testLocationActionListingRepresentation()
    {
        $this->createLocationsPersistent(
            'New York',
            'California',
            'London',
            'Spain'
        );

        list($users, $expectedImages, $expectedAddresses) = $this->createAliceBobEveForRepresentation();
        $users = $this->createUsersByLocationsPersistent([
            'California' => $users,
        ]);

        $this->searchUsersIn('California');
        $this->assertProfileImagesAreCorrect(
            $users,
            $expectedImages
        );
        $this->assertUsernamesAreCorrect($users);
        $this->assertCompaniesAreCorrect($users);
        $this->assertAddressesAreCorrect(...$expectedAddresses);
    }

    private function searchUsersIn($locationName, $options = [])
    {
        $location = $this->getLocation($locationName);

        $route = $this->generateRoute('ha_user_search', [
            'id' => $location->getId(),
            'user_type' => 'agent',
            'slug' => $location->getSlug(),
        ]);

        $crawler = $this->client->request('GET', $route, $options, [], [
            'HTTP_PAGINATION' => true,
        ]);
        if ($this->session->isStarted()) {
            $this->session->save();
        }

        return $crawler;
    }

    private function assertUsersCountOnPage($count, ...$query)
    {
        $this->searchUsersIn(...$query);
        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode(), $response->getContent());
        $this->assertEquals($count, $this->crawlerFilter('li div.user-info')->count());
    }

    private function assertUserOrderOnPage(...$userNames)
    {
        $this->crawlerFilter('div.user-info a.username')->each(function ($node, $i) use ($userNames) {
            $this->assertEquals($userNames[$i], trim($node->text()));
        });
    }

    private function assertProfileImagesAreCorrect($users, $profileImages)
    {
        foreach ($users as $i => $user) {
            $a = $this->crawlerFilter('div.user-info a.photo')->eq($i);

            $this->assertEquals($this->getProfileUrl($user), $a->attr('href'));
            $this->assertTrue(strpos($a->attr('style'), $profileImages[$i]) !== -1);
        }
    }

    private function getProfileUrl($user)
    {
        return '/profile/'.$user->getId().'/'.strtolower($user->getName().'-'.$user->getCompanyName());
    }

    private function assertUsernamesAreCorrect($users)
    {
        foreach ($users as $i => $user) {
            $a = $this->crawlerFilter('div.user-info a.username')->eq($i);
            $this->assertEquals($this->getProfileUrl($user), $a->attr('href'));
            $this->assertEquals($user->getName(), trim($a->text()));
        }
    }

    private function assertCompaniesAreCorrect($users)
    {
        foreach ($users as $i => $user) {
            $a = $this->crawlerFilter('div.user-info a.company')->eq($i);
            $this->assertEquals($this->getProfileUrl($user), $a->attr('href'));
            $this->assertEquals($user->getCompanyName(), trim($a->text()));
        }
    }

    private function assertAddressesAreCorrect(...$addresses)
    {
        foreach ($addresses as $i => $address) {
            $span = $this->crawlerFilter('div.user-info span.address')->eq($i);
            $this->assertEquals($address, trim($span->text()));
        }
    }

    private function createAliceBobEveForRepresentation()
    {
        $california = $this->getLocation('California')->getCoords();
        $googleLocations = $this->getGoogleLocationsForLocation('California');
        $users = [
            [
                'name' => 'Alice',
                'company_name' => 'companyA',
                'profile_image' => 'localhost/profile/image/path',
                'address' => [
                    'street' => 'Market St',
                    'apt_bldg' => '365',
                    'town_city' => 'San Francisco',
                    'state_county' => 'CA',
                    'zip' => '94103',
                    'country' => 'US',
                    'coords' => [
                        'lat' => $california->getLatitude(),
                        'lng' => $california->getLongitude(),
                    ],
                ],
                'google_locations' => $googleLocations,
            ],
            [
                'name' => 'Bob',
                'company_name' => 'companyB',
                'address' => [
                    'street' => null,
                    'apt_bldg' => null,
                    'town_city' => 'San Francisco',
                    'state_county' => 'CA',
                    'zip' => '94103',
                    'country' => 'US',
                    'coords' => [
                        'lat' => $california->getLatitude(),
                        'lng' => $california->getLongitude(),
                    ],
                ],
                'google_locations' => $googleLocations,
            ],
            [
                'name' => 'Eve',
                'company_name' => 'companyE',
                'address' => [
                    'street' => null,
                    'apt_bldg' => null,
                    'town_city' => 'Los Angeles',
                    'state_county' => 'CA',
                    'zip' => null,
                    'country' => 'US',
                    'coords' => [
                        'lat' => $california->getLatitude(),
                        'lng' => $california->getLongitude(),
                    ],
                ],
                'google_locations' => $googleLocations,
            ],
        ];

        $expectedImages = [
            'profile/image/path',
            '/assets/images/sir-logo.jpg',
            '/assets/images/coming-soon-sq.jpg',
        ];

        $expectedAddresses = [
            '365, Market St, San Francisco, CA 94103',
            'San Francisco, CA 94103',
            'Los Angeles, CA',
        ];

        return [$users, $expectedImages, $expectedAddresses];
    }
}
