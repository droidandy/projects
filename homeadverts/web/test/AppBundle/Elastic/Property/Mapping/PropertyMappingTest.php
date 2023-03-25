<?php

namespace Test\AppBundle\Elastic\Category\Mapping;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Elastic\Property\Mapping\PropertyDocumentParser;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;
use Test\AppBundle\Elastic\Integration\Mapping\AbstractMappingTemplateTest;
use Test\Utils\Traits\DateTrait;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\RandomizeTrait;
use Test\Utils\Traits\UserTrait;

class PropertyMappingTest extends AbstractMappingTemplateTest
{
    use DateTrait, RandomizeTrait, AddressTrait, GoogleLocationTrait, UserTrait, PropertyTrait;

    protected function getDocumentParserClass()
    {
        return PropertyDocumentParser::class;
    }

    protected function getIndex()
    {
        return 'properties';
    }

    protected function getMapping()
    {
        return 'property';
    }

    protected function getMappingTemplate($index, $mapping, $client, $populateESRepo, $em, $logger)
    {
        return new PropertyMapping($index, $mapping, $client, $populateESRepo, $em, $logger);
    }

    protected function getPropertyDefinition()
    {
        return [
            'location' => [
                'type' => 'geo_shape',
            ],
            'point' => [
                'type' => 'geo_point',
            ],
            'userID' => [
                'type' => 'integer',
            ],
            'agent' => [
                'type' => 'object',
            ],
            'address' => [
                'type' => 'keyword',
            ],
            'mlsRef' => [
                'type' => 'keyword',
            ],
            'sourceGuid' => [
                'type' => 'keyword',
            ],
            'source' => [
                'type' => 'keyword',
            ],
            'sourceUrl' => [
                'type' => 'keyword',
            ],
            'sourceRef' => [
                'type' => 'keyword',
            ],
            'zip' => [
                'type' => 'keyword',
            ],
            'country' => [
                'type' => 'keyword',
            ],
            'addressHidden' => [
                'type' => 'boolean',
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
            'bedrooms' => [
                'type' => 'short',
            ],
            'bathrooms' => [
                'type' => 'short',
            ],
            'price' => [
                'type' => 'long',
            ],
            'priceHidden' => [
                'type' => 'boolean',
            ],
            'basePrice' => [
                'type' => 'integer',
            ],
            'type' => [
                'type' => 'integer',
            ],
            'status' => [
                'type' => 'integer',
            ],
            'availability' => [
                'type' => 'integer',
            ],
            'rental' => [
                'type' => 'boolean',
            ],
            'featured' => [
                'type' => 'boolean',
            ],
            'featuredAt' => [
                'type' => 'date',
            ],
            'likesCount' => [
                'type' => 'integer',
            ],
            'dateAdded' => [
                'type' => 'date',
            ],
            'dateUpdated' => [
                'type' => 'date',
            ],
        ];
    }

    protected function getPropertyDefinitionToUpdate()
    {
        return [
            'price' => [
                'type' => 'long',
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
            'point' => [
                'lat' => 51.507222,
                'lon' => -0.1275,
            ],
            'status' => Property::STATUS_ACTIVE,
            'availability' => Property::AVAILABILITY_FOR_SALE,
            'address1' => 'Baker Street',
            'address2' => '#2021',
            'street' => 'Baker Street',
            'aptBldg' => '#2021',
            'neighbourhood' => 'Marylebone',
            'postcode' => 'NW1 6XE',
            'zip' => 'NW1 6XE',
            'townCity' => 'London',
            'stateCounty' => 'County of London',
            'country' => 'GB',
            'addressHidden' => false,
            'descriptions' => 1,
            'bedrooms' => 5,
            'bathrooms' => 3,
            'price' => 1000000,
            'priceHidden' => false,
            'currency' => 'GBP',
            'basePrice' => 1000000,
            'period' => 'month',
            'baseMonthlyPrice' => null,
            'type' => PropertyTypes::DETACHED,
            'rental' => false,
            'yearBuilt' => 1901,
            'grossLivingArea' => 1000.0,
            'plotArea' => 3000.0,
            'source' => 'sothebys',
            'sourceUrl' => 'sourceUrlValue',
            'sourceRef' => 'sourceRefValue',
            'mlsRef' => 'mlsRefValue',
            'sourceGuid' => '000b8b54-ccf5-4a2f-9e68-0d837c70698c',
            'likesCount' => 0,
            'dateAdded' => $this->getDate()->format('c'),
            'dateUpdated' => $this->getDate()->format('c'),
            'featured' => false,
            'featuredAt' => null,
            'userID' => 1,
            'agent' => [
                'id' => 1,
                'name' => 'agent_name',
                'companyName' => 'company_name',
                'phone' => '+123456789',
            ],
            'videos' => [
                [
                    'url' => 'url1_wellcomemat',
                    'type' => 'wellcomemat',
                ],
                [
                    'url' => 'url2_wellcomemat',
                    'type' => 'wellcomemat',
                ],
            ],
            'videos3d' => [
                [
                    'url' => 'matterport',
                ],
            ],
            'primaryPhotoIndex' => 1,
            'primaryPhotoManualIndex' => 2,
            'photos' => [
                [
                    'url' => 'url1',
                    'hash' => 'hash1',
                    'sort' => 0,
                ],
                [
                    'url' => 'url2',
                    'hash' => 'hash2',
                    'sort' => 2,
                ],
                [
                    'url' => 'url3',
                    'hash' => 'hash3',
                    'sort' => 1,
                ],
            ],
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
        ];
    }

    protected function getPropertyValuesToUpdate()
    {
        return ['price'];
    }

    protected function getPropertyValuesToUpdateNonexisting()
    {
        return ['nonexisting_field'];
    }

    protected function getEntity()
    {
        return $this->newProperty([
            'address' => [
                'coords' => [
                    'lat' => 51.507222,
                    'lng' => -0.1275,
                ],
                'street' => 'Baker Street',
                'apt_bldg' => '#2021',
                'neighbourhood' => 'Marylebone',
                'zip' => 'NW1 6XE',
                'town_city' => 'London',
                'state_county' => 'County of London',
                'country' => 'GB',
                'hidden' => false,
            ],
            'status' => Property::STATUS_ACTIVE,
            'descriptions' => [
                [
                    'description' => 'desc1',
                    'locale' => 'en',
                ],
            ],
            'bedrooms' => 5,
            'bathrooms' => 3,
            'price' => 1000000,
            'price_qualifier' => 1,
            'currency' => 'GBP',
            'base_price' => 1000000,
            'period' => 'month',
            'base_monthly_price' => null,
            'type' => PropertyTypes::DETACHED,
            'rental' => false,
            'year_built' => 1901,
            'gross_living_area' => 1000.0,
            'plot_area' => 3000.0,
            'source' => 'sothebys',
            'source_url' => 'sourceUrlValue',
            'source_ref' => 'sourceRefValue',
            'mls_ref' => 'mlsRefValue',
            'source_guid' => '000b8b54-ccf5-4a2f-9e68-0d837c70698c',
            'date_added' => $this->getDate(),
            'date_updated' => $this->getDate(),
            'featured' => false,
            'user' => [
                'id' => 1,
                'name' => 'agent_name',
                'company_name' => 'company_name',
                'phone' => '+123456789',
            ],
            'videos' => [
                [
                    'url' => 'url1_wellcomemat',
                    'type' => 'wellcomemat',
                ],
                [
                    'url' => 'url2_wellcomemat',
                    'type' => 'wellcomemat',
                ],
            ],
            'videos3d' => [
                [
                    'url' => 'matterport',
                ],
            ],
            'primary_photo' => 1,
            'primary_photo_manual' => 2,
            'photos' => [
                [
                    'url' => 'url1',
                    'hash' => 'hash1',
                    'sort' => 0,
                ],
                [
                    'url' => 'url2',
                    'hash' => 'hash2',
                    'sort' => 2,
                ],
                [
                    'url' => 'url3',
                    'hash' => 'hash3',
                    'sort' => 1,
                ],
            ],
            'google_locations' => [
                [
                    'id' => 1,
                    'place_id' => 'place_id_1',
                ],
                [
                    'id' => 2,
                    'place_id' => 'place_id_2',
                ],
                [
                    'id' => 3,
                    'place_id' => 'place_id_3',
                ],
            ],
        ]);
    }

    public function getContainer()
    {
    }

    protected function doSetUp()
    {
    }

    protected function doTearDown()
    {
    }
}
