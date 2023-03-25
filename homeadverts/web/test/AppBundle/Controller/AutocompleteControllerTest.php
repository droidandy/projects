<?php

namespace Test\AppBundle\Controller;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class AutocompleteControllerTest extends AbstractWebTestCase
{
    use AddressTrait, LocationTrait, UserTrait, PropertyTrait;
    use GoogleLocationTrait;

    private $response;

    public function testResultsActionEmpty()
    {
        $this->markTestSkipped('to be fixed');

        $route = $this->generateRoute('ha_autocomplete');

        $this->client->request(
            'POST',
            $route,
            [
                'term' => 'term_which_gives_empty_results',
            ]
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $result = json_decode($content, true);

        $this->assertEquals(200, $response->getStatusCode());

        $this->assertEquals($result['id']['items'], []);
        $this->assertEquals($result['id']['total'], 0);
        $this->assertEquals($result['mls']['items'], []);
        $this->assertEquals($result['mls']['total'], 0);
        $this->assertEquals($result['zip']['items'], []);
        $this->assertEquals($result['mls']['total'], 0);
        $this->assertEquals($result['location']['items'], []);
        $this->assertEquals($result['location']['total'], 0);
        $this->assertEquals($result['blog']['items'], []);
        $this->assertEquals($result['blog']['total'], 0);
        $this->assertEquals($result['agent']['items'], []);
        $this->assertEquals($result['agent']['total'], 0);
    }

    public function testResultsAction()
    {
        $this->markTestSkipped('to be fixed');

        $this->createLocations(
            'New York',
            'New South Wales',
            'New Delhi',
            'New York IA',
            'New Orleans',
            'San Francisco',
            'Los Angeles'
        );
        $usersWithNames = $this->createUsersPersistent([
            [
                'name' => 'Alice Eyebrownew',
            ],
            [
                'name' => 'Bob Eyebrownew',
            ],
            [
                'name' => 'Eve Eyebrownew',
            ],
            [
                'name' => 'Elise Eyebrownew',
                'property_count' => 0,
                'property_count_for_sale' => 0,
                'property_count_to_rent' => 0,
            ],
        ]);
        $this->createUsersByLocationsPersistent([
            'New York' => 3,
            'New Delhi' => 5,
        ]);
        $propertiesToSearchByIds = $this->createProperties(5);
        $propertiesToSearchByMls = $this->createProperties([
            [
                'mlf_ref' => 'new_mlf_ref_1',
                'address' => [
                    'street' => '365 Market St',
                    'town_city' => 'San Francisco',
                    'state_couty' => 'CA',
                    'country' => 'US',
                    'zip' => '94103',
                    'hidden' => false,
                ],
            ],
            [
                'mlf_ref' => 'new_mlf_ref_2',
                'user' => $usersWithNames[0],
                'address' => [
                    'street' => '365 Market St',
                    'town_city' => 'San Francisco',
                    'state_couty' => 'CA',
                    'country' => 'US',
                    'zip' => '94103',
                    'hidden' => true,
                ],
            ],
            [
                'mlf_ref' => 'new_mlf_ref_3',
            ],
            [
                'mlf_ref' => 'another_mlf_ref_4',
            ],
        ]);
        $propertiesToSearchByZip = $this->createProperties([
            [
                'zip' => '111000',
            ],
            [
                'zip' => '222000',
            ],
            [
                'zip' => '333000',
                'address' => [
                    'street' => '365 Market St.',
                    'town_city' => 'San Francisco',
                    'state_couty' => 'CA',
                    'country' => 'US',
                    'zip' => '94103',
                    'hidden' => true,
                ],
            ],
        ]);
        $this->createPropertiesForSalePersistent([
            'New York' => 10,
            'New South Wales' => 50,
            'San Francisco' => 5,
        ]);
        $this->createPropertiesToRentPersistent([
            'New York' => 5,
            'New Orleans' => 11,
        ]);

        $response = $this->getAutocompleteFor('Eye');

        $this->assertRequestSuccessful();
        $this->assertEquals(
            [
                [
                    'id' => $usersWithNames[0]->getId(),
                    'title' => $usersWithNames[0]->getName().', '.$usersWithNames[0]->getCompanyName(),
                    'properties' => $usersWithNames[0]->getPropertyCount(),
                    'url' => 'http://homeadverts.com/directory/'.$usersWithNames[0]->getId().'/alice-eyebrownew',
                ],
            ],
            $response['agent']['items']
        );
        $this->assertEquals(1, $response['agent']['total']);

        $response = $this->getAutocompleteFor('mls_ref_2');

        $this->assertRequestSuccessful();
        $this->assertEquals(
            [
                [
                    'id' => $propertiesToSearchByMls[1]->getId(),
                    'zip' => $propertiesToSearchByMls[1]->getZip(),
                    'mls' => $propertiesToSearchByMls[1]->getMlsRef(),
                    'agent' => [
                        'details' => [
                            'id' => $usersWithNames[0]->getId(),
                            'name' => $usersWithNames[0]->getName(),
                            'companyName' => $usersWithNames[0]->getCompanyName(),
                            'phone' => $usersWithNames[0]->phone,
                        ],
                        'url' => 'http://homeadverts.com/directory/'.$usersWithNames[0]->getId().'/alice-eyebrownew',
                    ],
                    'address' => 'new-york-ny-11201-united-states',
                    'url' => 'http://homeadverts.com/'.$propertiesToSearchByMls[1]->getId().'/detached-for-sale-san-francisco-ca-united-states',
                ],
            ],
            $response['mls']['items']
        );
        $this->assertEquals(1, $response['mls']['total']);

        $response = $this->getAutocompleteFor('333');

        $this->assertRequestSuccessful();
        $this->assertEquals(
            [
            [
                'id' => $propertiesToSearchByZip[2]->getId(),
                'zip' => $propertiesToSearchByZip[2]->getZip(),
                'mls' => $propertiesToSearchByZip[2]->getMlsRef(),
                'agent' => [
                    'details' => [
                        'id' => $usersWithNames[0]->getId(),
                        'name' => $usersWithNames[0]->getName(),
                        'companyName' => $usersWithNames[0]->getCompanyName(),
                        'phone' => $usersWithNames[0]->phone,
                    ],
                    'url' => 'http://homeadverts.com/directory/'.$usersWithNames[0]->getId().'/alice-eyebrownew',
                ],
                'address' => 'new-york-ny-11201-united-states',
                'url' => 'http://homeadverts.com/'.$propertiesToSearchByZip[2]->getId().'/detached-for-sale-san-francisco-ca-united-states',
            ],
        ],
            $response['zip']['items']
        );
        $this->assertEquals(1, $response['zip']['total']);

        $response = $this->getAutocompleteFor('new');

        $this->assertRequestSuccessful();
        $this->assertEquals(
            [
                [
                    'id' => $usersWithNames[0]->getId(),
                    'title' => $usersWithNames[0]->getName().', '.$usersWithNames[0]->getCompanyName(),
                    'properties' => $usersWithNames[0]->getPropertyCount(),
                    'url' => 'http://homeadverts.com/directory/'.$usersWithNames[0]->getId().'/alice-eyebrownew',
                ],
            ],
            $response['agent']['items']
        );
        $this->assertEquals(1, $response['agent']['total']);
        $this->assertEquals(
            [
                [
                    'id' => $propertiesToSearchByMls[0]->getId(),
                    'zip' => $propertiesToSearchByMls[0]->getZip(),
                    'mls' => $propertiesToSearchByMls[0]->getMlsRef(),
                    'agent' => [
                        'details' => [
                            'id' => $usersWithNames[0]->getId(),
                            'name' => $usersWithNames[0]->getName(),
                            'companyName' => $usersWithNames[0]->getCompanyName(),
                            'phone' => $usersWithNames[0]->phone,
                        ],
                        'url' => 'http://homeadverts.com/directory/'.$usersWithNames[0]->getId().'/alice-eyebrownew',
                    ],
                    'address' => 'new-york-ny-11201-united-states',
                    'url' => 'http://homeadverts.com/'.$propertiesToSearchByMls[0]->getId().'/detached-for-sale-365-market-st-san-francisco-ca-94103-united-states',
                ],
            ],
            $response['mls']['items']
        );
        $this->assertEquals(1, $response['mls']['total']);
        $this->assertEquals(
            [
                [
                    'title' => 'New York, NY, USA',
                    'properties' => [
                        'sale' => [
                            'total' => 10,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New York')->getId().'/new-york-ny-united-states',
                        ],
                        'rent' => [
                            'total' => 5,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New York')->getId().'/new-york-ny-united-states',
                        ],
                    ],
                    'agents' => [
                        'total' => 3,
                        'url' => 'http://homeadverts.com/directory/agent/location/'.$this->getLocation('New York')->getId().'/new-york-ny-united-states',
                    ],
                    'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New York')->getId().'/new-york-ny-united-states',
                ],
                [
                    'title' => 'New South Wales, Australia',
                    'properties' => [
                        'sale' => [
                            'total' => 50,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New South Wales')->getId().'/new-south-wales-australia',
                        ],
                        'rent' => [
                            'total' => 0,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New South Wales')->getId().'/new-south-wales-australia',
                        ],
                    ],
                    'agents' => [
                        'total' => 0,
                        'url' => 'http://homeadverts.com/directory/agent/location/'.$this->getLocation('New South Wales')->getId().'/new-south-wales-australia',
                    ],
                    'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New South Wales')->getId().'/new-south-wales-australia',
                ],
                [
                    'title' => 'New Delhi, Delhi 110001, India',
                    'properties' => [
                        'sale' => [
                            'total' => 0,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New Delhi')->getId().'/new-delhi-delhi-india',
                        ],
                        'rent' => [
                            'total' => 0,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New Delhi')->getId().'/new-delhi-delhi-india',
                        ],
                    ],
                    'agents' => [
                        'total' => 5,
                        'url' => 'http://homeadverts.com/directory/agent/location/'.$this->getLocation('New Delhi')->getId().'/new-delhi-delhi-india',
                    ],
                    'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New Delhi')->getId().'/new-delhi-delhi-india',
                ],
                [
                    'title' => 'New York, IA 50238, USA',
                    'properties' => [
                        'sale' => [
                            'total' => 0,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New York IA')->getId().'/new-york-ia-united-states',
                        ],
                        'rent' => [
                            'total' => 0,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New York IA')->getId().'/new-york-ia-united-states',
                        ],
                    ],
                    'agents' => [
                        'total' => 0,
                        'url' => 'http://homeadverts.com/directory/agent/location/'.$this->getLocation('New York IA')->getId().'/new-york-ia-united-states',
                    ],
                    'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New York IA')->getId().'/new-york-ia-united-states',
                ],
                [
                    'title' => 'New Orleans, LA, USA',
                    'properties' => [
                        'sale' => [
                            'total' => 0,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New Orleans')->getId().'/new-orleans-la-united-states',
                        ],
                        'rent' => [
                            'total' => 11,
                            'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New Orleans')->getId().'/new-orleans-la-united-states',
                        ],
                    ],
                    'agents' => [
                        'total' => 0,
                        'url' => 'http://homeadverts.com/directory/agent/location/'.$this->getLocation('New Orleans')->getId().'/new-orleans-la-united-states',
                    ],
                    'url' => 'http://homeadverts.com/search/for-sale/'.$this->getLocation('New Orleans')->getId().'/new-orleans-la-united-states',
                ],
            ],
            $response['location']['items']
        );
        $this->assertEquals(5, $response['location']['total']);
    }

    private function getAutocompleteFor($term)
    {
        $route = $this->generateRoute('ha_autocomplete');

        $this->client->request(
            'POST',
            $route,
            [
                'term' => $term,
            ]
        );

        $this->response = $response = $this->client->getResponse();
        $content = $response->getContent();

        return json_decode($content, true);
    }

    private function assertRequestSuccessful()
    {
        $this->assertEquals(200, $this->response->getStatusCode());
    }
}
