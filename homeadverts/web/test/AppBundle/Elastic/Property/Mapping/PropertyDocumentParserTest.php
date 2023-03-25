<?php

namespace Test\AppBundle\Elastic\Category\Mapping;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Elastic\Property\Mapping\PropertyDocumentParser;
use Test\Utils\Traits\DateTrait;

class PropertyDocumentParserTest extends \PHPUnit_Framework_TestCase
{
    use DateTrait;

    public function testSupport()
    {
        $parser = $this->getDocumentParser();

        $el = [
            '_index' => 'properties',
            '_type' => 'property',
        ];
        $this->assertTrue($parser->support($el));

        $el = [
            '_index' => 'not_properties',
            '_type' => 'property',
        ];
        $this->assertFalse($parser->support($el));

        $el = [
            '_index' => 'properties',
            '_type' => 'not_property',
        ];
        $this->assertFalse($parser->support($el));
    }

    public function testParse()
    {
        $hitElements[] = [
            '_index' => 'properties',
            '_type' => 'property',
            '_id' => 1,
            '_source' => $this->createDoc(),
        ];
        $hitElements[] = [
            '_index' => 'properties',
            '_type' => 'property',
            '_id' => 2,
            '_source' => $this->createDoc([
                'likesCount' => 1,
                'primaryPhotoIndex' => null,
                'primaryPhotoManualIndex' => null,
                'photos' => [],
            ]),
        ];
        $hitElements[] = [
            '_index' => 'properties',
            '_type' => 'property',
            '_id' => 3,
            '_source' => $this->createDoc([
                'likesCount' => 10,
                'videos' => [],
            ]),
        ];

        $parser = $this->getDocumentParser();

        foreach ($hitElements as $i => $hitElement) {
            $source = $hitElement['_source'];
            /** @var Property $property */
            $property = $parser->parse($hitElement);
            $this->assertInstanceOf(Property::class, $property);
            $this->assertEquals($hitElement['_id'], $property->getId());
            $this->assertEquals($source['status'], $property->getStatus());
            $this->assertEquals($source['availability'], $property->getAvailability());
            $this->assertEquals($source['address1'], $property->getAddress()->getStreet());
            $this->assertEquals($source['address2'], $property->getAddress()->getAptBldg());
            $this->assertEquals($source['street'], $property->getAddress()->getStreet());
            $this->assertEquals($source['aptBldg'], $property->getAddress()->getAptBldg());
            $this->assertEquals($source['neighbourhood'], $property->getAddress()->getNeighbourhood());
            $this->assertEquals($source['postcode'], $property->getAddress()->getZip());
            $this->assertEquals($source['zip'], $property->getAddress()->getZip());
            $this->assertEquals($source['townCity'], $property->getAddress()->getTownCity());
            $this->assertEquals($source['stateCounty'], $property->getAddress()->getStateCounty());
            $this->assertEquals($source['country'], $property->getAddress()->getCountry());
            $this->assertEquals($source['addressHidden'], $property->getAddress()->isHidden());
            foreach ($property->getGoogleLocations() as $j => $googleLocation) {
                $this->assertEquals($source['googleLocations'][$j]['id'], $googleLocation->getId());
                $this->assertEquals($source['googleLocations'][$j]['placeId'], $googleLocation->getPlaceId());
            }
            $this->assertEquals($source['bedrooms'], $property->getBedrooms());
            $this->assertEquals($source['bathrooms'], $property->getBathrooms());
            $this->assertEquals($source['price'], $property->getPrice());
            $this->assertEquals($source['priceHidden'], $property->priceQualifier < 0);
            $this->assertEquals($source['currency'], $property->getCurrency());
            $this->assertEquals($source['basePrice'], $property->getBasePrice());
            $this->assertEquals($source['period'], $property->getPeriod());
            $this->assertEquals($source['baseMonthlyPrice'], $property->getBaseMonthlyPrice());
            $this->assertEquals($source['type'], $property->getType());
            $this->assertEquals($source['rental'], $property->getRental());
            $this->assertEquals($source['yearBuilt'], $property->getYearBuilt());
            $this->assertEquals($source['grossLivingArea'], $property->getGrossLivingArea());
            $this->assertEquals($source['plotArea'], $property->getPlotArea());
            $this->assertEquals($source['source'], $property->getSource());
            $this->assertEquals($source['sourceUrl'], $property->getSourceUrl());
            $this->assertEquals($source['sourceRef'], $property->getSourceRef());
            $this->assertEquals($source['mlsRef'], $property->getMlsRef());
            $this->assertEquals($this->getDate()->format('c'), $property->getDateAdded()->format('c'));
            $this->assertEquals($this->getDate()->format('c'), $property->getDateUpdated()->format('c'));
            $this->assertEquals($this->getDate()->format('c'), $property->getFeatured()->format('c'));
            $this->assertEquals($source['likesCount'], $property->getLikesCount());
            $this->assertEquals($source['userID'], $property->getUser()->getId());
            $this->assertEquals($source['agent']['id'], $property->getUser()->getId());
            $this->assertEquals($source['agent']['name'], $property->getUser()->getName());
            $this->assertEquals($source['agent']['companyName'], $property->getUser()->getCompanyName());
            $this->assertEquals($source['agent']['phone'], $property->getUser()->phone);
            $this->assertEquals(count($source['videos']), count($property->getVideos()));
            foreach ($property->getVideos() as $j => $video) {
                $this->assertEquals($source['videos'][$j]['url'], $video->url);
                $this->assertEquals($source['videos'][$j]['type'], $video->type);
            }
            foreach ($property->getVideos3d() as $j => $video3d) {
                $this->assertEquals($source['videos3d'][$j]['url'], $video3d->url);
            }
            $this->assertEquals(count($source['photos']), count($property->getPhotos()));
            foreach ($property->getPhotos() as $j => $photo) {
                $this->assertEquals($source['photos'][$j]['url'], $photo->getUrl());
                $this->assertEquals($source['photos'][$j]['hash'], $photo->getHash());
                $this->assertEquals($source['photos'][$j]['sort'], $photo->getSort());
            }
            if (null !== $source['primaryPhotoIndex']) {
                $this->assertEquals(
                    $source['photos'][$source['primaryPhotoIndex']]['url'],
                    $property->getPrimaryPhotoDefault()->getUrl()
                );
            }
            if (null !== $source['primaryPhotoManualIndex']) {
                $this->assertEquals(
                    $source['photos'][$source['primaryPhotoManualIndex']]['url'],
                    $property->getPrimaryPhotoManual()->getUrl()
                );
            }
        }
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage Supported index "properties" and mapping "property"
     */
    public function testParseFailure()
    {
        $hitElement = [
            '_index' => 'not_properties',
            '_type' => 'not_property',
            '_id' => 1,
            '_source' => $this->createDoc(),
        ];

        $parser = $this->getDocumentParser();

        $parser->parse($hitElement);
    }

    private function getDocumentParser()
    {
        return new PropertyDocumentParser('properties', 'property');
    }

    private function createDoc(array $doc = [])
    {
        $docTemplate = [
            'location' => [
                'type' => 'point',
                'coordinates' => [-0.1275, 51.507222],
            ],
            'point' => [
                'lat' => 51.507222,
                'lon' => -0.1275,
            ],
            'status' => Property::STATUS_ACTIVE,
            'availability' => 1,
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
            'dateAdded' => $this->getDate()->format('c'),
            'dateUpdated' => $this->getDate()->format('c'),
            'featured' => false,
            'featuredAt' => $this->getDate()->format('c'),
            'likesCount' => 0,
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
            'primaryPhotoManualIndex' => 1,
            'photos' => [
                [
                    'url' => 'url_1',
                    'hash' => 'hash_1',
                    'sort' => 0,
                ],
                [
                    'url' => 'url_2',
                    'hash' => 'hash_2',
                    'sort' => 2,
                ],
                [
                    'url' => 'url_3',
                    'hash' => 'hash_3',
                    'sort' => 1,
                ],
            ],
        ];

        return array_merge($docTemplate, $doc);
    }
}
