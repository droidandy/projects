<?php

namespace Test\AppBundle\Elastic\User\Mapping;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\User\User;
use AppBundle\Elastic\User\Mapping\UserDocumentParser;
use AppBundle\Elastic\User\Mapping\UserMapping;
use Test\AppBundle\Elastic\Integration\Mapping\AbstractMappingTemplateTest;
use Test\Utils\Traits\DateTrait;
use Test\Utils\Traits\GoogleLocationTrait;

class UserMappingTest extends AbstractMappingTemplateTest
{
    use GoogleLocationTrait, DateTrait;

    public function testMarkDocumentDeleted()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $client
            ->expects($this->once())
            ->method('update')
            ->with([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'id' => 1,
                'body' => [
                    'doc' => ['deletedAt' => $this->getDate()->format('c')],
                ],
            ])
        ;

        $this->mappingTemplate->markDocumentDeleted(1, $this->getDate());
    }

    protected function getDocumentParserClass()
    {
        return UserDocumentParser::class;
    }

    protected function getIndex()
    {
        return 'users';
    }

    protected function getMapping()
    {
        return 'user';
    }

    protected function getMappingTemplate($index, $mapping, $client, $populateESRepo, $em, $logger)
    {
        return new UserMapping($index, $mapping, $client, $populateESRepo, $em, $logger);
    }

    protected function getPropertyDefinition()
    {
        return [
            'name' => [
                'type' => 'keyword',
                'fields' => [
                    'autocomplete' => [
                        'type' => 'text',
                        'analyzer' => 'autocomplete',
                        'fielddata' => true,
                    ],
                ],
            ],
            'companyName' => [
                'type' => 'keyword',
                'fields' => [
                    'autocomplete' => [
                        'type' => 'text',
                        'analyzer' => 'autocomplete',
                    ],
                ],
            ],
            'companyPhone' => [
                'type' => 'keyword',
            ],
            'location' => [
                'type' => 'geo_shape',
            ],
            'email' => [
                'type' => 'keyword',
            ],
            'bio' => [
                'type' => 'keyword',
            ],
            'phone' => [
                'type' => 'keyword',
            ],
            'mobilePhone' => [
                'type' => 'keyword',
            ],
            'homePageUrl' => [
                'type' => 'keyword',
            ],
            'profileImage' => [
                'type' => 'keyword',
            ],
            'primaryLanguage' => [
                'type' => 'keyword',
            ],
            'spokenLanguages' => [
                'type' => 'keyword',
            ],
            'preferredCurrency' => [
                'type' => 'keyword',
            ],
            'status' => [
                'type' => 'byte',
            ],
            'address1' => [
                'type' => 'keyword',
            ],
            'townCity' => [
                'type' => 'keyword',
            ],
            'county' => [
                'type' => 'keyword',
            ],
            'country' => [
                'type' => 'keyword',
            ],
            'postcode' => [
                'type' => 'keyword',
            ],
            'googleLocations' => [
                'type' => 'object',
                'properties' => [
                    'id' => [
                        'type' => 'long',
                    ],
                    'placeId' => [
                        'type' => 'keyword',
                    ],
                ],
            ],
            'plan' => [
                'type' => 'keyword',
            ],
            'planDate' => [
                'type' => 'keyword',
            ],
            'vatNumber' => [
                'type' => 'integer',
            ],
            'vatCountry' => [
                'type' => 'keyword',
            ],
            'marketflag' => [
                'type' => 'byte',
            ],
            'propertyCount' => [
                'type' => 'integer',
            ],
            'deletedAt' => [
                'type' => 'date',
            ],
        ];
    }

    protected function getPropertyDefinitionToUpdate()
    {
        return [
            'propertyCount' => [
                'type' => 'integer',
            ],
        ];
    }

    protected function getIdValue()
    {
        return 1;
    }

    protected function getPropertyValues()
    {
        return [
            'location' => [
                'type' => 'point',
                'coordinates' => [-0.1275, 51.507222],
            ],
            'email' => 'user@example.com',
            'name' => 'user_name',
            'bio' => 'user_bio',
            'companyName' => 'company_name',
            'phone' => '+123456789',
            'mobilePhone' => '+123456789',
            'companyPhone' => '+123456789',
            'homePageUrl' => 'home_page_url',
            'profileImage' => 'profile_image_url',
            'primaryLanguage' => 'en_US',
            'spokenLanguages' => ['en_US', 'fr_FR'],
            'preferredCurrency' => 'USD',
            'status' => 1,
            'address1' => 'Baker Street',
            'address2' => '#2021',
            'townCity' => 'London',
            'county' => 'County of London',
            'country' => 'GB',
            'postcode' => 'NW1 6XE',
            'googleLocations' => [
                [
                    'id' => 1,
                    'placeId' => 'place_id_1',
                ],
                [
                    'id' => 2,
                    'placeId' => 'place_id_2',
                ],
                [
                    'id' => 3,
                    'placeId' => 'place_id_3',
                ],
            ],
//            'plan'                 => 'basic',
            'propertyCount' => 5,
            'propertyToRentCount' => 2,
            'propertyForSaleCount' => 3,
            'deletedAt' => $this->getDate()->format('c'),
        ];
    }

    protected function getPropertyValuesToUpdate()
    {
        return ['propertyCount'];
    }

    protected function getPropertyValuesToUpdateNonexisting()
    {
        return ['nonexisting_field'];
    }

    protected function getSettings()
    {
        return [
            'analysis' => [
                'analyzer' => [
                    'autocomplete' => [
                        'type' => 'custom',
                        'tokenizer' => 'standard',
                        'filter' => [
                            'standard', 'lowercase', 'stop', 'kstem', 'ngram', 'token_filters',
                        ],
                    ],
                ],
                'filter' => [
                    'ngram' => [
                        'type' => 'ngram',
                        'min_gram' => 1,
                        'max_gram' => 20,
                    ],
                    'token_filters' => [
                        'type' => 'word_delimiter',
                        'preserve_original' => 'true',
                        'catenate_words' => 'true',
                        'stem_english_possessive' => 'true',
                    ],
                ],
            ],
        ];
    }

    protected function getEntity()
    {
        $user = new User();
        $user->setEmail('user@example.com');
        $user->setName('user_name');
        $user->bio = 'user_bio';
        $user->companyName = 'company_name';
        $user->phone = '+123456789';
        $user->mobilePhone = '+123456789';
        $user->companyPhone = '+123456789';
        $user->homePageUrl = 'home_page_url';
        $user->profileImage = 'profile_image_url';
        $user->primaryLanguage = 'en_US';
        $user->spokenLanguages = ['en_US', 'fr_FR'];
        $user->preferredCurrency = 'USD';
        $user->status = 1;
        $user->address = $this->getAddress();
        $user->setGoogleLocations([
            $this->newGoogleLocation([
                'id' => 1,
                'place_id' => 'place_id_1',
            ]),
            $this->newGoogleLocation([
                'id' => 2,
                'place_id' => 'place_id_2',
            ]),
            $this->newGoogleLocation([
                'id' => 3,
                'place_id' => 'place_id_3',
            ]),
        ]);
//        $user->getSubscription()->setPlanToBasic();
        $user->propertyCount = 5;
        $user->propertyToRentCount = 2;
        $user->propertyForSaleCount = 3;
        $user->deletedAt = $this->getDate();

        return $user;
    }

    private function getAddress()
    {
        $address = new Address();
        $address->latitude = 51.507222;
        $address->longitude = -0.1275;
        $address->street = 'Baker Street';
        $address->aptBldg = '#2021';
        $address->neighbourhood = 'Marylebone';
        $address->zip = 'NW1 6XE';
        $address->townCity = 'London';
        $address->stateCounty = 'County of London';
        $address->country = 'GB';
        $address->hidden = false;

        return $address;
    }
}
