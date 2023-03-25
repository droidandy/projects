<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys;

use AppBundle\Import\Adapter\Sothebys\DbalFeed;
use AppBundle\Import\Adapter\Sothebys\Extractor;
use AppBundle\Import\Adapter\Sothebys\FeedPropertyIterator;
use AppBundle\Import\Adapter\Sothebys\Normalizer;
use AppBundle\Import\ImportHelper;
use AppBundle\Import\NormalisedProperty;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes as Type;
use Monolog\Logger;

class ExtractorTest extends \PHPUnit_Framework_TestCase
{
    public function testGetProperties()
    {
        $properties = $this->getProperties();
        $normalizedProperties = $this->getNormalizedProperties();
        $it = $this->getIterator();
        $it
            ->method('current')
            ->willReturnOnConsecutiveCalls(...$properties)
        ;
        $it
            ->method('valid')
            ->willReturnOnConsecutiveCalls(true, true, true, true, true, false)
        ;
        $feed = $this->getFeed();
        $feed
            ->expects($this->once())
            ->method('getProperties')
            ->willReturn($it)
        ;
        $normalizer = $this->getNormalizer();
        $normalizer
            ->expects($this->exactly(5))
            ->method('propertyNormalize')
            ->willReturnMap([
                [$properties[0], $normalizedProperties[0]],
                [$properties[1], $normalizedProperties[1]],
                [$properties[2], $normalizedProperties[2]],
                [$properties[3], $normalizedProperties[3]],
                [$properties[4], $normalizedProperties[4]],
            ])
        ;
        $extractor = $this->getExtractor($feed, $normalizer);
        foreach ($extractor->getProperties() as $i => $property) {
            $this->assertSame($normalizedProperties[$i], $property);
        }
    }

    public function testGetPropertiesIteratively()
    {
        $properties = $this->getProperties();
        $normalizedProperties = $this->getNormalizedProperties();
        $it1 = $this->getIterator();
        $it1
            ->method('current')
            ->willReturnOnConsecutiveCalls($properties[0], $properties[1], $properties[2])
        ;
        $it1
            ->method('valid')
            ->willReturnOnConsecutiveCalls(true, true, true, false)
        ;
        $it2 = $this->getIterator();
        $it2
            ->method('current')
            ->willReturnOnConsecutiveCalls($properties[3], $properties[4])
        ;
        $it2
            ->method('valid')
            ->willReturnOnConsecutiveCalls(true, true, false)
        ;
        $feed = $this->getFeed();
        $feed
            ->expects($this->once())
            ->method('getPropertiesTotal')
            ->willReturn(5)
        ;
        $feed
            ->expects($this->exactly(2))
            ->method('getProperties')
            ->willReturnMap([
                [0, 3, $it1],
                [3, 3, $it2],
            ])
        ;
        $normalizer = $this->getNormalizer();
        $normalizer
            ->expects($this->exactly(5))
            ->method('propertyNormalize')
            ->willReturnMap([
                [$properties[0], $normalizedProperties[0]],
                [$properties[1], $normalizedProperties[1]],
                [$properties[2], $normalizedProperties[2]],
                [$properties[3], $normalizedProperties[3]],
                [$properties[4], $normalizedProperties[4]],
            ])
        ;
        $extractor = $this->getExtractor($feed, $normalizer);
        foreach ($extractor->getPropertiesIteratively() as $i => $property) {
            $this->assertSame($normalizedProperties[$i], $property);
        }
    }

    private function getExtractor($feed, $normalizer)
    {
        $em = $this->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $importHelper = $this->getMockBuilder(ImportHelper::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $logger = $this->getMockBuilder(Logger::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        return new Extractor($em, $importHelper, $feed, $normalizer, $logger);
    }

    private function getFeed()
    {
        return $this->getMockBuilder(DbalFeed::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getNormalizer()
    {
        return $this->getMockBuilder(Normalizer::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getIterator()
    {
        return $this->getMockBuilder(FeedPropertyIterator::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getNormalizedProperties()
    {
        return [
            new NormalisedProperty([
                'market' => 'to-rent',
                'status' => 100,
                'bedrooms' => '1',
                'bathrooms' => '1',
                'halfBathrooms' => null,
                'threeQuarterBathrooms' => null,
                'street' => '3500 Ocean Drive #207',
                'aptBldg' => null,
                'townCity' => 'Vero Beach',
                'neighbourhood' => 'Vero Beach',
                'stateCounty' => 'FL',
                'country' => 'US',
                'zip' => '32963',
                'addressHidden' => false,
                'latitude' => null,  // We can't trust Listhub latlngs
                'longitude' => null, // We can't trust Listhub latlngs
                'latitudeFallback' => '27.656133652', // We can't trust Listhub latlngs
                'longitudeFallback' => '-80.356704712', // We can't trust Listhub latlngs
                'type' => Type::OTHER,
                'price' => (object) [
                    'amount' => (float) '299900.00',
                    'currency' => 'USD',
                    'period' => null,
                    'qualifier' => Property::PRICE_QUALIFIER_NONE,
                ],
                'photos' => [
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/egh43t1p5fbk4xeqg5njcqegr2i',
                        'modified' => '08/22/2016 09:48:36.997',
                        'index' => '1',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/et9j42k5c9e7m4p34mmycnyvq5i',
                        'modified' => '08/22/2016 09:48:36.997',
                        'index' => '2',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/hkwp0zmkyhs84pym0sz8zg5cr4i',
                        'modified' => '08/22/2016 09:48:36.997',
                        'index' => '3',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/hzrxfvya5pe64cpaz1jtv4tr25i',
                        'modified' => '08/22/2016 09:48:36.997',
                        'index' => '4',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/ydh2sat2bagnmqa9ee45n0e983i',
                        'modified' => '08/22/2016 09:48:36.997',
                        'index' => '5',
                        'caption' => null,
                    ],
                ],
                'videos' => [
                    (object) [
                        'url' => '//www.youtube.com/embed/PIF-KWZhYJc',
                        'modified' => '08/26/2016 10:32:11.470',
                        'caption' => null,
                    ],
                ],
                'descriptions' => [
                    (object) [
                        'locale' => 'EN',
                        'description' => <<<DESC
<span style="font-size:12.0pt;line-height:115%;font-family:'Times New Roman','serif';">Carefree oceanfront living awaits you at this 4 star Kimpton Condo hotel. This unit comes fully furnished and move-in ready. Enjoy all the amenities this resort has to offer; heated oceanfront pool, Jacuzzi, two restaurants, golf/tennis available, 24/7 fitness center, business center, White Orchid Med- Spa, and much more. Located in the heart of Vero on Ocean Drive, it is walking distance to fine restaurants and boutique shops. The condo hotel unit is income producing and a great way to own your very own oceanfront condo!</span> | Carefree oceanfront living awaits you at this 4 star Kimpton Condo hotel. This unit comes fully furnished and move-in ready. Enjoy all the amenities this resort has to offer; heated oceanfront pool, Jacuzzi, two restaurants, golf/tennis available, 24/7 fitness center, business center, White Orchid Med- Spa, and much more. Located in the heart of Vero on Ocean Drive, it is walking distance to fine restaurants and boutique shops. The condo hotel unit is income producing and a great way to own your very own oceanfront condo!
DESC
                    ],
                ],
                'yearBuilt' => 2006,
                'expirationDate' => '03/15/2017',
                'interiorArea' => 100, //convertion result will be mocked
                'exteriorArea' => null,
                'sourceUrl' => 'http://www.sothebysrealty.com/id/qddzyk',
                'sourceRef' => '3yd-RFGSIR-QDDZYK',
                'mlsRef' => '175369',
                'sourceName' => 'sothebys',
                'sourceType' => 'csv',
                'user' => null,
                'userId' => 1,
                'dateUpdated' => '08/22/2016 09:48:36.960',
                'misc' => [
                    'prop_features' => [
                        [
                            'group_key' => '1',
                            'key' => '6',
                        ],
                        [
                            'group_key' => '11',
                            'key' => '164',
                        ],
                        [
                            'group_key' => '12',
                            'key' => '167',
                        ],
                        [
                            'group_key' => '15',
                            'key' => '229',
                        ],
                        [
                            'group_key' => '2',
                            'key' => '427',
                        ],
                        [
                            'group_key' => '21',
                            'key' => '248',
                        ],
                        [
                            'group_key' => '23',
                            'key' => '286',
                        ],
                    ],
                ],
            ]),
            new NormalisedProperty([
                'market' => 'for-sale',
                'status' => 100,
                'bedrooms' => null,
                'bathrooms' => null,
                'halfBathrooms' => null,
                'threeQuarterBathrooms' => null,
                'street' => 'E16',
                'aptBldg' => 'address2 address3',
                'townCity' => 'Salem',
                'neighbourhood' => 'The Cliffs at Keowee Falls',
                'stateCounty' => 'SC',
                'country' => 'US',
                'zip' => '29676',
                'addressHidden' => false,
                'latitude' => null,  // We can't trust Listhub latlngs
                'longitude' => null, // We can't trust Listhub latlngs
                'latitudeFallback' => '34.933254242', // We can't trust Listhub latlngs
                'longitudeFallback' => '-82.960403442', // We can't trust Listhub latlngs
                'type' => Type::LAND,
                'price' => (object) [
                    'amount' => (float) '329000.00',
                    'currency' => 'USD',
                    'period' => null,
                    'qualifier' => Property::PRICE_QUALIFIER_NONE,
                ],
                'photos' => [
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/er7hs3w25yyf4pjwr432nksrc4i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '1',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/p1nmtjk26n2g44t9y3tejdba33i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '2',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/70gt407csa6p4xtkww8mmq08e3i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '3',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/fzgzv74tnqtbm9y9ggkds3ebv0i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '4',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/4d2xb74srqqvmdah352h9p0mx5i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '5',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/xxwnkxaj11yp4h60sy9ayv79y0i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '6',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/tq8rcvddx41d45ex2ha3c677e1i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '7',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/ha6h66cdq1na43acsz99wzz577i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '8',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/rryxtn9h64x1mh2anba4eqvvm3i',
                        'modified' => '08/22/2016 16:53:40.530',
                        'index' => '9',
                        'caption' => null,
                    ],
                ],
                'videos' => [
                    [
                        'url' => '//www.wellcomemat.com/embed/juj3bb060c85fbh',
                        'modified' => '2016-04-26 16:16:27 EST',
                        'caption' => null,
                        'metadata' => [
                            'hash' => 'juj3bb060c85fbh',
                            'created' => '2016-04-26 16:16:27 EST',
                            'replaced' => '2016-04-26 16:22:30 EST',
                            'status_code' => '400',
                            'status_message' => 'Active',
                            'title' => 'Southpointe, Mercer Island Waterfront',
                            'description' => 'Sitting at the southernmost tip of Mercer Island awaits Southpointe. Boasting 147 feet of no bank, south facing waterfront, this impeccable 5 bedroom, 4.75 bath estate has the most phenomenal views of any home on Lake Washington.Mt. Rainier in all its splendor, takes center stage in the jaw dropping 180-degree view.With the utmost attention to detail, this iconic home was completely renovated in 2009 including all new baths, gourmet kitchen with top-of-the-line appliances, new roof, driveway, furnaces, new deck and 42 pin pilers placed along the water\'s edge to ensure the stability of the shoreline. The main floor offers a master suites with private deck and separate mother-in-laws quarters boasting a spacious living areaperfectfor an office, den or media room. The lower level adorns three additional bedrooms including a grand master suite with his and her closets and separate dressing areas, gas fireplace, inspiring water views and a luxurious spa-like bath. With parking for seven cars, enjoy hosting family and friends to celebrate in the beauty of this marvelous estate. Offering floor to ceiling windows throughout the main level, the views are an ever changing vista of waterfront living at its best. The backyard is an entertainer\'s oasis. An intimate fire pit ideal for unwinding after a long day\'s work, a stunning upper deck perfect for large cocktail parties or al fresco dining, and lush green gardens irrigated from the lake, enjoy a slice of paradise every time you step outside. A covered dock with boat lift capable of housing a 30 foot boat, a tie up space for a larger yacht and jet ski lift, come home by land or water and feel like you\'ve arrived.',
                            'keywords' => '7QYGKF,930949,Mercer Island,WA,Southpointe,United States',
                            'customid' => '7QYGKF',
                            'original_http_url' => 'http://82465a8c6019cbd03786-7b33788af20eb16deff7769bccdf782b.r23.cf1.rackcdn.com/',
                            'original' => 'original_juj3bb060c85fbh_o69cbf.mp4',
                            'source' => 'site',
                            'traffic_url' => null,
                            'slideshow' => '0',
                            'video_type' => '1',
                            'price' => '7950000',
                            'location' => [
                                    'address' => 'Southpointe',
                                    'city' => 'Mercer Island',
                                    'state_province' => 'WA',
                                    'postal_code' => '98040',
                                    'latitude' => '47.524266100000',
                                    'longitude' => '-122.226233500000',
                                ],
                            'image' => [
                                    'hash' => '5fbh1bf84474pmfk',
                                    'http_url' => 'https://0f09f3dc97720fdbfce6-edffc6cf84a1214568eae26dc2113f20.ssl.cf1.rackcdn.com/',
                                    'icon' => 'juj3bb060c85fbh_5fbh1bf84474pmfk_icon.jpg',
                                    'square' => 'juj3bb060c85fbh_5fbh1bf84474pmfk_square.jpg',
                                    'thumbnail' => 'juj3bb060c85fbh_5fbh1bf84474pmfk_thumbnail.jpg',
                                    'thumbnail_16x9' => 'juj3bb060c85fbh_5fbh1bf84474pmfk_thumbnail16x9.jpg',
                                    'small' => 'juj3bb060c85fbh_5fbh1bf84474pmfk_small.jpg',
                                    'medium' => null,
                                    'large' => null,
                                    'play' => 'juj3bb060c85fbh_5fbh1bf84474pmfk_play.jpg',
                                ],
                            'video' => [
                                    'http_url' => 'http://0f837d73c52260b6ff9d-eaef829eae7c04fd12005cc3ad780db0.r48.cf1.rackcdn.com/',
                                    'v270p' => 'juj3bb060c85fbh_11a5aeff_360p.mp4',
                                    'v360p' => 'juj3bb060c85fbh_11a5aeff_360p.mp4',
                                    'v480p' => 'juj3bb060c85fbh_7f11a7bc_480p.mp4',
                                    'v720p' => 'juj3bb060c85fbh_94522f0c_720p.mp4',
                                    'v1080p' => 'juj3bb060c85fbh_2c306046_1080p.mp4',
                                ],
                        ],
                    ],
                ],
                'descriptions' => [
                    (object) [
                        'locale' => 'EN',
                        'description' => <<<DESC
<p>This private, 2.42 acre custom home site is conveniently located for easy ingress and egress and only minutes from the new $3mm Falls South amenities and highway 11 market. Enjoy a level building site and year-round vistas of emerald green Lake Keowee and the mountains from custom home's deck &amp; outside living areas. A winding walk to the shoreline reveals a quiet and private cove location and a covered slip dock awaiting the arrival of your pleasure craft for cruising Lake Keowee's crystal clear waters. Impressively dotted with Oaks, Maples and other hardwoods, this home site is far from ordinary.</p>                                                                                                                                                                                                                                                                                                                                                                                                                          | This private, 2.42 acre custom home site is conveniently located for easy ingress and egress and only minutes from the new $3mm Falls South amenities and highway 11 market. Enjoy a level building site and year-round vistas of emerald green Lake Keowee and the mountains from custom home's deck  outside living areas. A winding walk to the shoreline reveals a quiet and private cove location and a covered slip dock awaiting the arrival of your pleasure craft for cruising Lake Keowee's crystal clear waters. Impressively dotted with Oaks, Maples and other hardwoods, this home site is far from ordinary. 
DESC
                    ],
                ],
                'yearBuilt' => null,
                'expirationDate' => '12/31/2016',
                'interiorArea' => null, //convertion result will be mocked
                'exteriorArea' => 100,
                'sourceUrl' => 'http://www.sothebysrealty.com/id/ngnscm',
                'sourceRef' => '3yd-RFGSIR-NGNSCM',
                'mlsRef' => '20162316',
                'sourceName' => 'sothebys',
                'sourceType' => 'csv',
                'user' => null,
                'userId' => 2,
                'dateUpdated' => '08/23/2016 16:12:38.037',
                'misc' => [
                    'prop_features' => [
                        [
                            'group_key' => '25',
                            'key' => '1046',
                        ],
                        [
                            'group_key' => '25',
                            'key' => '940',
                        ],
                        [
                            'group_key' => '25',
                            'key' => '942',
                        ],
                        [
                            'group_key' => '26',
                            'key' => '980',
                        ],
                    ],
                ],
            ]),
            new NormalisedProperty([
                'market' => 'for-sale',
                'status' => 100,
                'bedrooms' => '7',
                'bathrooms' => '7',
                'halfBathrooms' => null,
                'threeQuarterBathrooms' => null,
                'street' => '18 Avenue des GenÃªts',
                'aptBldg' => null,
                'townCity' => 'Rhode-Saint-GenÃ¨se',
                'neighbourhood' => null,
                'stateCounty' => 'VBR',
                'country' => 'BE',
                'zip' => '1640',
                'addressHidden' => true,
                'latitude' => null,  // We can't trust Listhub latlngs
                'longitude' => null, // We can't trust Listhub latlngs
                'latitudeFallback' => '50.770601900', // We can't trust Listhub latlngs
                'longitudeFallback' => '4.368267700', // We can't trust Listhub latlngs
                'type' => Type::OTHER,
                'price' => (object) [
                    'amount' => (float) '7300000.00',
                    'currency' => 'EUR',
                    'period' => null,
                    'qualifier' => Property::PRICE_QUALIFIER_NONE,
                ],
                'photos' => [
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/447xjwctket2mbpeyg8njberw4i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '1',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/9sjjt1zjm231mepmtmx1289th1i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '2',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/sbtyv5qnp4xvmdyy4zeq4eekb1i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '3',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/cnap0mrtaqzvm7tedyqebb4tq1i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '4',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/92372c7vya17m727nfqyxx54w3i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '5',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/vyakjm719n6n4d6sspaznster0i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '6',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/ghje45vxc9re452ceehhdmty73i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '7',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/ebe8saf9g25wmbjsmht77yvfk6i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '8',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/hf5j4h8w8ebkm4jh8jbt9vk4k2i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '9',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/t5yder900j5a4rpkqbjr6qj5h2i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '10',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/wtd44vapkqwjmm25fb9x8387w0i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '11',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/964i0/20yja5jxsrzh4mjm2yasxyw0h3i',
                        'modified' => '07/28/2016 01:22:08.807',
                        'index' => '12',
                        'caption' => null,
                    ],
                ],
                'videos' => [],
                'descriptions' => [
                    (object) [
                        'locale' => 'EN',
                        'description' => <<<DESC
Beautiful and original property in cottage style, located on the border of Uccle and Rhode Saint Genese. The house was built in 2008, and designed by a well-known international architect, Vlassak-Verhulst 1250 sqm of constructed surface, of which Â± 900 sqm are living space, and an exceptional South facing front width of 75 m, all of this included in a beautiful 52 ares of land.<br><br>Reception rooms include a sitting room with fire place, a dining room and a kitchen with fittings by Obumex, a large study, a meeting room with seperate entrance, four to five bedrooms, plus a service flat.<br><br>The caretakers lodge (previously stables) includes a large reception area and two bedrooms.<br><br>Other: home automation, garage for eight cars with elevator, inside swimming pool with adjustable height, wellness space (fitness area, hammam and jacuzzi), automatic garden watering system, new garden, and two separate entrances.<br><br>Company sale Under Belgian law.<br><br>For any further information, please contact Anne Montanari at +32 (0) 475 523 343. | Beautiful and original property in cottage style, located on the border of Uccle and Rhode Saint Genese. The house was built in 2008, and designed by a well-known international architect, Vlassak-Verhulst 1250 sqm of constructed surface, of which Â± 900 sqm are living space, and an exceptional South facing front width of 75 m, all of this included in a beautiful 52 ares of land.

Reception rooms include a sitting room with fire place, a dining room and a kitchen with fittings by Obumex, a large study, a meeting room with seperate entrance, four to five bedrooms, plus a service flat.

The caretakers lodge (previously stables) includes a large reception area and two bedrooms.

Other: home automation, garage for eight cars with elevator, inside swimming pool with adjustable height, wellness space (fitness area, hammam and jacuzzi), automatic garden watering system, new garden, and two separate entrances.

Company sale Under Belgian law.

For any further information, please contact Anne Montanari at +32 (0) 475 523 343.
DESC
                    ],
                ],
                'yearBuilt' => null,
                'expirationDate' => '01/01/2032',
                'interiorArea' => 9684.00,
                'exteriorArea' => 5289.0,
                'sourceUrl' => 'http://www.sothebysrealty.com/id/t4d4lc',
                'sourceRef' => '3yd-RFGSIR-T4D4LC',
                'mlsRef' => null,
                'sourceName' => 'sothebys',
                'sourceType' => 'csv',
                'user' => null,
                'userId' => 3,
                'dateUpdated' => '09/28/2016 00:15:22.993',
                'misc' => [
                    'prop_features' => [
                        [
                            'group_key' => '25',
                            'key' => '1046',
                        ],
                        [
                            'group_key' => '26',
                            'key' => '387',
                        ],
                    ],
                ],
            ]),
            new NormalisedProperty([
                'market' => 'for-sale',
                'status' => 100,
                'bedrooms' => '4',
                'bathrooms' => '7',
                'halfBathrooms' => null,
                'threeQuarterBathrooms' => null,
                'street' => 'Lumiar',
                'aptBldg' => null,
                'townCity' => 'lisboa',
                'neighbourhood' => null,
                'stateCounty' => null,
                'country' => 'PT',
                'zip' => null,
                'addressHidden' => true,
                'latitude' => null,  // We can't trust Listhub latlngs
                'longitude' => null, // We can't trust Listhub latlngs
                'latitudeFallback' => '38.771198273', // We can't trust Listhub latlngs
                'longitudeFallback' => '-9.160300255', // We can't trust Listhub latlngs
                'type' => Type::DETACHED,
                'price' => (object) [
                    'amount' => (float) '1509105.00',
                    'currency' => 'EUR',
                    'period' => null,
                    'qualifier' => Property::PRICE_QUALIFIER_ENQUIRE,
                ],
                'photos' => [],
                'videos' => [],
                'descriptions' => [
                    (object) [
                        'locale' => 'EN',
                        'description' => <<<DESC
The Quinta do PaÃ§o do Lumiar has 14.557 sqm and is located in the secular parish Lumiar, known in the XVIII century by his nobles farmhouses, olive groves and vineyards, that is the reason why this area is classified as an area of historical manor houses in Lisbon city center.

The project consist of seventeen townhouses, eleven with three bedrooms and six with four bedrooms, arranged perpendicularly along the new road that crosses the property from North to South. 
The west townhouses have a pool in the exterior garden while in the east townhouses the pool is located in the interior patio. The houses are different but have structurally common characteristics. Both types have a central â€œpatioâ€ that divides the social area from the private area, and have in common a corridor that crosses the house and works as a structuring element in the organization of space.

Security doors, wooden floors, bathrooms clad in marble stone, aluminum Windows frames, painted carpentry, central heating, air conditioned pre installation, fully equipped german kitchens, gardened pÃ¡tios, pool.
The architectural design has the signature of Eduardo Souto de Moura, Pritzker prize winner in 2011


DESC
                    ],
                ],
                'yearBuilt' => null,
                'expirationDate' => '10/05/2016',
                'interiorArea' => 4002.72, //convertion result will be mocked
                'exteriorArea' => 262.0,
                'sourceUrl' => 'http://www.sothebysrealty.com/id/693rkq',
                'sourceRef' => '3yd-RFGSIR-693RKQ',
                'mlsRef' => null,
                'sourceName' => 'sothebys',
                'sourceType' => 'csv',
                'user' => null,
                'userId' => 4,
                'dateUpdated' => '09/28/2016 00:15:22.993',
                'misc' => [
                    'prop_features' => [],
                ],
            ]),
            new NormalisedProperty([
                'market' => 'for-sale',
                'status' => 100,
                'bedrooms' => '5',
                'bathrooms' => '2',
                'halfBathrooms' => '1',
                'threeQuarterBathrooms' => null,
                'street' => '6475 County Road 740',
                'aptBldg' => null,
                'townCity' => 'Crested Butte',
                'neighbourhood' => null,
                'stateCounty' => 'CO',
                'country' => 'US',
                'zip' => '81224',
                'addressHidden' => false,
                'latitude' => null,  // We can't trust Listhub latlngs
                'longitude' => null, // We can't trust Listhub latlngs
                'latitudeFallback' => '38.857425690', // We can't trust Listhub latlngs
                'longitudeFallback' => '-106.811058044', // We can't trust Listhub latlngs
                'type' => Type::DETACHED,
                'price' => (object) [
                    'amount' => (float) '2350000.00',
                    'currency' => 'USD',
                    'period' => null,
                    'qualifier' => Property::PRICE_QUALIFIER_NONE,
                ],
                'photos' => [
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/1tx17v58y6mz44j10b74dm6xz2i',
                        'modified' => '06/16/2016 12:41:03.893',
                        'index' => '1',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/pw1cxm0pe5pc4bp5szsbyfqqx7i',
                        'modified' => '06/16/2016 12:41:03.893',
                        'index' => '2',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/0t06x9s0k7t24eab9666vkvn41i',
                        'modified' => '06/16/2016 12:41:03.893',
                        'index' => '3',
                        'caption' => null,
                    ],
                    (object) [
                        'url' => 'http://m.sothebysrealty.com/236i0/zrw0sk5k4jf6m2t3mwtwhf8a50i',
                        'modified' => '06/16/2016 12:41:03.893',
                        'index' => '4',
                        'caption' => null,
                    ],
                ],
                'videos' => [],
                'descriptions' => [],
                'yearBuilt' => null,
                'expirationDate' => '12/04/2017',
                'interiorArea' => 100, //convertion result will be mocked
                'exteriorArea' => 100,
                'sourceUrl' => 'http://www.sothebysrealty.com/id/3bd2kd',
                'sourceRef' => '3yd-RFGSIR-3BD2KD',
                'mlsRef' => '719463',
                'sourceName' => 'sothebys',
                'sourceType' => 'csv',
                'user' => null,
                'userId' => 5,
                'dateUpdated' => '08/08/2016 11:37:53.940',
                'misc' => [
                    'prop_features' => [
                        [
                            'group_key' => '57',
                            'key' => '306',
                        ],
                        [
                            'group_key' => '71',
                            'key' => '870',
                        ],
                        [
                            'group_key' => '75',
                            'key' => '933',
                        ],
                    ],
                ],
            ]),
        ];
    }

    private function getProperties()
    {
        return
            [
                [
                    'listing_guid' => '00005394-C464-4798-9466-28A2939B283E',
                    'mls_id' => '175369',
                    'listing_id' => 'QDDZYK',
                    'listing_status' => 'AC',
                    'address1' => '3500 Ocean Drive #207',
                    'address2' => '',
                    'address3' => '',
                    'latitude' => '27.656133652',
                    'longitude' => '-80.356704712',
                    'bedrooms' => '1',
                    'full_bath' => '1',
                    'half_bath' => '',
                    'three_quarter_bath' => '',
                    'neighborhood_name' => 'Vero Beach',
                    'city' => 'Vero Beach',
                    'country_iso_code' => 'US',
                    'state_iso_code' => 'FL',
                    'postal_code' => '32963',
                    'show_address' => 'Y',
                    'listing_type' => 'Residential Rental',
                    'property_type' => 'R',
                    'property_subtype' => '62',
                    'expiration_date' => '03/15/2017',
                    'list_price' => '299900.00',
                    'show_list_price' => 'Y',
                    'currency_code' => 'USD',
                    'year_built' => '2006',
                    'building_area' => '565.00',
                    'building_area_uom' => 'SF',
                    'lot_size' => '',
                    'lot_size_uom' => '',
                    'source_listing_url' => 'http://www.sothebysrealty.com/id/qddzyk',
                    'last_update_date' => '08/22/2016 09:48:36.960',
                    'descriptions' => [
                        [
                            'property_remark' => <<<DESC
<span style="font-size:12.0pt;line-height:115%;font-family:'Times New Roman','serif';">Carefree oceanfront living awaits you at this 4 star Kimpton Condo hotel. This unit comes fully furnished and move-in ready. Enjoy all the amenities this resort has to offer; heated oceanfront pool, Jacuzzi, two restaurants, golf/tennis available, 24/7 fitness center, business center, White Orchid Med- Spa, and much more. Located in the heart of Vero on Ocean Drive, it is walking distance to fine restaurants and boutique shops. The condo hotel unit is income producing and a great way to own your very own oceanfront condo!</span> | Carefree oceanfront living awaits you at this 4 star Kimpton Condo hotel. This unit comes fully furnished and move-in ready. Enjoy all the amenities this resort has to offer; heated oceanfront pool, Jacuzzi, two restaurants, golf/tennis available, 24/7 fitness center, business center, White Orchid Med- Spa, and much more. Located in the heart of Vero on Ocean Drive, it is walking distance to fine restaurants and boutique shops. The condo hotel unit is income producing and a great way to own your very own oceanfront condo!
DESC
                            , 'language_code' => 'EN',
                        ],
                    ],
                    'prop_features' => [
                        [
                            'group_key' => '1',
                            'key' => '6',
                        ],
                        [
                            'group_key' => '11',
                            'key' => '164',
                        ],
                        [
                            'group_key' => '12',
                            'key' => '167',
                        ],
                        [
                            'group_key' => '15',
                            'key' => '229',
                        ],
                        [
                            'group_key' => '2',
                            'key' => '427',
                        ],
                        [
                            'group_key' => '21',
                            'key' => '248',
                        ],
                        [
                            'group_key' => '23',
                            'key' => '286',
                        ],
                    ],
                    'photos' => [
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/egh43t1p5fbk4xeqg5njcqegr2i',
                            'image_sequence_no' => '1',
                            'last_update_date' => '08/22/2016 09:48:36.997',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/et9j42k5c9e7m4p34mmycnyvq5i',
                            'image_sequence_no' => '2',
                            'last_update_date' => '08/22/2016 09:48:36.997',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/hkwp0zmkyhs84pym0sz8zg5cr4i',
                            'image_sequence_no' => '3',
                            'last_update_date' => '08/22/2016 09:48:36.997',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/hzrxfvya5pe64cpaz1jtv4tr25i',
                            'image_sequence_no' => '4',
                            'last_update_date' => '08/22/2016 09:48:36.997',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/ydh2sat2bagnmqa9ee45n0e983i',
                            'image_sequence_no' => '5',
                            'last_update_date' => '08/22/2016 09:48:36.997',
                        ],
                    ],
                    'videos' => [
                        [
                            'url' => 'https://www.youtube.com/watch?v=PIF-KWZhYJc&feature=em-share_video_user',
                            'image_sequence_no' => '1',
                            'last_update_date' => '08/26/2016 10:32:11.470',
                        ],
                    ],
                    'agents' => [
                        [
                            'agent_key' => '4034028',
                        ],
                    ],
                ],
                [
                    'listing_guid' => '0001F233-1721-43EE-99EC-EA50E0A034DC',
                    'mls_id' => '20162316',
                    'listing_id' => 'NGNSCM',
                    'listing_status' => 'AC',
                    'address1' => 'E16',
                    'address2' => 'address2',
                    'address3' => 'address3',
                    'latitude' => '34.933254242',
                    'longitude' => '-82.960403442',
                    'bedrooms' => '',
                    'full_bath' => '',
                    'half_bath' => '',
                    'three_quarter_bath' => '',
                    'neighborhood_name' => 'The Cliffs at Keowee Falls',
                    'city' => 'Salem',
                    'country_iso_code' => 'US',
                    'state_iso_code' => 'SC',
                    'postal_code' => '29676',
                    'show_address' => 'Y',
                    'listing_type' => 'Residential Sale',
                    'property_type' => 'LL',
                    'property_subtype' => '18',
                    'expiration_date' => '12/31/2016',
                    'list_price' => '329000.00',
                    'show_list_price' => 'Y',
                    'currency_code' => 'USD',
                    'year_built' => '',
                    'building_area' => '',
                    'building_area_uom' => '',
                    'lot_size' => '2.42',
                    'lot_size_uom' => 'AC',
                    'source_listing_url' => 'http://www.sothebysrealty.com/id/ngnscm',
                    'last_update_date' => '08/23/2016 16:12:38.037',
                    'descriptions' => [
                        [
                            'property_remark' => <<<DESC
<p>This private, 2.42 acre custom home site is conveniently located for easy ingress and egress and only minutes from the new $3mm Falls South amenities and highway 11 market. Enjoy a level building site and year-round vistas of emerald green Lake Keowee and the mountains from custom home's deck &amp; outside living areas. A winding walk to the shoreline reveals a quiet and private cove location and a covered slip dock awaiting the arrival of your pleasure craft for cruising Lake Keowee's crystal clear waters. Impressively dotted with Oaks, Maples and other hardwoods, this home site is far from ordinary.</p>                                                                                                                                                                                                                                                                                                                                                                                                                          | This private, 2.42 acre custom home site is conveniently located for easy ingress and egress and only minutes from the new $3mm Falls South amenities and highway 11 market. Enjoy a level building site and year-round vistas of emerald green Lake Keowee and the mountains from custom home's deck  outside living areas. A winding walk to the shoreline reveals a quiet and private cove location and a covered slip dock awaiting the arrival of your pleasure craft for cruising Lake Keowee's crystal clear waters. Impressively dotted with Oaks, Maples and other hardwoods, this home site is far from ordinary. 
DESC
                            , 'language_code' => 'EN',
                        ],
                    ],
                    'prop_features' => [
                        [
                            'group_key' => '25',
                            'key' => '1046',
                        ],
                        [
                            'group_key' => '25',
                            'key' => '940',
                        ],
                        [
                            'group_key' => '25',
                            'key' => '942',
                        ],
                        [
                            'group_key' => '26',
                            'key' => '980',
                        ],
                    ],
                    'photos' => [
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/er7hs3w25yyf4pjwr432nksrc4i',
                            'image_sequence_no' => '1',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/p1nmtjk26n2g44t9y3tejdba33i',
                            'image_sequence_no' => '2',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/70gt407csa6p4xtkww8mmq08e3i',
                            'image_sequence_no' => '3',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/fzgzv74tnqtbm9y9ggkds3ebv0i',
                            'image_sequence_no' => '4',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/4d2xb74srqqvmdah352h9p0mx5i',
                            'image_sequence_no' => '5',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/xxwnkxaj11yp4h60sy9ayv79y0i',
                            'image_sequence_no' => '6',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/tq8rcvddx41d45ex2ha3c677e1i',
                            'image_sequence_no' => '7',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/ha6h66cdq1na43acsz99wzz577i',
                            'image_sequence_no' => '8',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/rryxtn9h64x1mh2anba4eqvvm3i',
                            'image_sequence_no' => '9',
                            'last_update_date' => '08/22/2016 16:53:40.530',
                        ],
                    ],
                    'videos' => [],
                    'agents' => [
                        [
                            'agent_key' => '4030489',
                        ],
                    ],
                ],
                [
                    'listing_guid' => '000217B2-DFB3-4FD4-A2C2-C97686355E73',
                    'mls_id' => '',
                    'listing_id' => 'T4D4LC',
                    'listing_status' => 'AC',
                    'address1' => '18 Avenue des GenÃªts',
                    'address2' => '',
                    'address3' => '',
                    'latitude' => '50.770601900',
                    'longitude' => '4.368267700',
                    'bedrooms' => '7',
                    'full_bath' => '7',
                    'half_bath' => '',
                    'three_quarter_bath' => '',
                    'neighborhood_name' => '',
                    'city' => 'Rhode-Saint-GenÃ¨se',
                    'country_iso_code' => 'BE',
                    'state_iso_code' => 'VBR',
                    'postal_code' => '1640',
                    'show_address' => 'N',
                    'listing_type' => 'Residential Sale',
                    'property_type' => 'R',
                    'property_subtype' => '62',
                    'expiration_date' => '01/01/2032',
                    'list_price' => '7300000.00',
                    'show_list_price' => 'Y',
                    'currency_code' => 'EUR',
                    'year_built' => '',
                    'building_area' => '9684.00',
                    'building_area_uom' => 'SM',
                    'lot_size' => '5289',
                    'lot_size_uom' => 'SM',
                    'source_listing_url' => 'http://www.sothebysrealty.com/id/t4d4lc',
                    'last_update_date' => '09/28/2016 00:15:22.993',
                    'descriptions' => [
                        [
                            'property_remark' => <<<DESC
Beautiful and original property in cottage style, located on the border of Uccle and Rhode Saint Genese. The house was built in 2008, and designed by a well-known international architect, Vlassak-Verhulst 1250 sqm of constructed surface, of which Â± 900 sqm are living space, and an exceptional South facing front width of 75 m, all of this included in a beautiful 52 ares of land.<br><br>Reception rooms include a sitting room with fire place, a dining room and a kitchen with fittings by Obumex, a large study, a meeting room with seperate entrance, four to five bedrooms, plus a service flat.<br><br>The caretakers lodge (previously stables) includes a large reception area and two bedrooms.<br><br>Other: home automation, garage for eight cars with elevator, inside swimming pool with adjustable height, wellness space (fitness area, hammam and jacuzzi), automatic garden watering system, new garden, and two separate entrances.<br><br>Company sale Under Belgian law.<br><br>For any further information, please contact Anne Montanari at +32 (0) 475 523 343. | Beautiful and original property in cottage style, located on the border of Uccle and Rhode Saint Genese. The house was built in 2008, and designed by a well-known international architect, Vlassak-Verhulst 1250 sqm of constructed surface, of which Â± 900 sqm are living space, and an exceptional South facing front width of 75 m, all of this included in a beautiful 52 ares of land.

Reception rooms include a sitting room with fire place, a dining room and a kitchen with fittings by Obumex, a large study, a meeting room with seperate entrance, four to five bedrooms, plus a service flat.

The caretakers lodge (previously stables) includes a large reception area and two bedrooms.

Other: home automation, garage for eight cars with elevator, inside swimming pool with adjustable height, wellness space (fitness area, hammam and jacuzzi), automatic garden watering system, new garden, and two separate entrances.

Company sale Under Belgian law.

For any further information, please contact Anne Montanari at +32 (0) 475 523 343.
DESC
                            , 'language_code' => 'EN',
                        ],
                    ],
                    'prop_features' => [
                        [
                            'group_key' => '25',
                            'key' => '1046',
                        ],
                        [
                            'group_key' => '26',
                            'key' => '387',
                        ],
                    ],
                    'photos' => [
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/447xjwctket2mbpeyg8njberw4i',
                            'image_sequence_no' => '1',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/9sjjt1zjm231mepmtmx1289th1i',
                            'image_sequence_no' => '2',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/sbtyv5qnp4xvmdyy4zeq4eekb1i',
                            'image_sequence_no' => '3',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/cnap0mrtaqzvm7tedyqebb4tq1i',
                            'image_sequence_no' => '4',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/92372c7vya17m727nfqyxx54w3i',
                            'image_sequence_no' => '5',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/vyakjm719n6n4d6sspaznster0i',
                            'image_sequence_no' => '6',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/ghje45vxc9re452ceehhdmty73i',
                            'image_sequence_no' => '7',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/ebe8saf9g25wmbjsmht77yvfk6i',
                            'image_sequence_no' => '8',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/hf5j4h8w8ebkm4jh8jbt9vk4k2i',
                            'image_sequence_no' => '9',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/t5yder900j5a4rpkqbjr6qj5h2i',
                            'image_sequence_no' => '10',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/wtd44vapkqwjmm25fb9x8387w0i',
                            'image_sequence_no' => '11',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/964i0/20yja5jxsrzh4mjm2yasxyw0h3i',
                            'image_sequence_no' => '12',
                            'last_update_date' => '07/28/2016 01:22:08.807',
                        ],
                    ],
                    'videos' => [],
                    'agents' => [
                        [
                            'agent_key' => '65129025',
                        ],
                    ],
                ],
                [
                    'listing_guid' => '0003DD2E-6536-423B-BCC8-C6BAF33032D8',
                    'mls_id' => '',
                    'listing_id' => '693RKQ',
                    'listing_status' => 'AC',
                    'address1' => 'Lumiar',
                    'address2' => '',
                    'address3' => '',
                    'latitude' => '38.771198273',
                    'longitude' => '-9.160300255',
                    'bedrooms' => '4',
                    'full_bath' => '7',
                    'half_bath' => '',
                    'three_quarter_bath' => '',
                    'neighborhood_name' => '',
                    'city' => 'lisboa',
                    'country_iso_code' => 'PT',
                    'state_iso_code' => '',
                    'postal_code' => '',
                    'show_address' => 'N',
                    'listing_type' => 'Residential Sale',
                    'property_type' => 'R',
                    'property_subtype' => '44',
                    'expiration_date' => '10/05/2016',
                    'list_price' => '1509105.00',
                    'show_list_price' => 'N',
                    'currency_code' => 'EUR',
                    'year_built' => '0',
                    'building_area' => '4002.72',
                    'building_area_uom' => 'SM',
                    'lot_size' => '262',
                    'lot_size_uom' => 'SM',
                    'source_listing_url' => 'http://www.sothebysrealty.com/id/693rkq',
                    'last_update_date' => '09/28/2016 00:15:22.993',
                    'descriptions' => [
                        [
                            'property_remark' => <<<DESC
The Quinta do PaÃ§o do Lumiar has 14.557 sqm and is located in the secular parish Lumiar, known in the XVIII century by his nobles farmhouses, olive groves and vineyards, that is the reason why this area is classified as an area of historical manor houses in Lisbon city center.

The project consist of seventeen townhouses, eleven with three bedrooms and six with four bedrooms, arranged perpendicularly along the new road that crosses the property from North to South. 
The west townhouses have a pool in the exterior garden while in the east townhouses the pool is located in the interior patio. The houses are different but have structurally common characteristics. Both types have a central â€œpatioâ€ that divides the social area from the private area, and have in common a corridor that crosses the house and works as a structuring element in the organization of space.

Security doors, wooden floors, bathrooms clad in marble stone, aluminum Windows frames, painted carpentry, central heating, air conditioned pre installation, fully equipped german kitchens, gardened pÃ¡tios, pool.
The architectural design has the signature of Eduardo Souto de Moura, Pritzker prize winner in 2011


DESC
                            , 'language_code' => 'EN',
                        ],
                    ],
                    'prop_features' => [],
                    'photos' => [],
                    'videos' => [],
                    'agents' => [
                        [
                            'agent_key' => '68653848',
                        ],
                    ],
                ],
                [
                    'listing_guid' => '3B9063ED-FADC-4AE3-9549-E31B1E321CDA',
                    'mls_id' => '719463',
                    'listing_id' => '3BD2KD',
                    'listing_status' => 'AC',
                    'address1' => '6475 County Road 740',
                    'address2' => '',
                    'address3' => '',
                    'latitude' => '38.857425690',
                    'longitude' => '-106.811058044',
                    'bedrooms' => '5',
                    'full_bath' => '2',
                    'half_bath' => '1',
                    'three_quarter_bath' => '',
                    'neighborhood_name' => '',
                    'city' => 'Crested Butte',
                    'country_iso_code' => 'US',
                    'state_iso_code' => 'CO',
                    'postal_code' => '81224',
                    'show_address' => 'Y',
                    'listing_type' => 'Residential Sale',
                    'property_type' => 'R',
                    'property_subtype' => '44',
                    'expiration_date' => '12/04/2017',
                    'list_price' => '2350000.00',
                    'show_list_price' => 'Y',
                    'currency_code' => 'USD',
                    'year_built' => '',
                    'building_area' => '6511.00',
                    'building_area_uom' => 'SF',
                    'lot_size' => '43.65',
                    'lot_size_uom' => 'AC',
                    'source_listing_url' => 'http://www.sothebysrealty.com/id/3bd2kd',
                    'last_update_date' => '08/08/2016 11:37:53.940',
                    'descriptions' => [],
                    'prop_features' => [
                        [
                            'group_key' => '57',
                            'key' => '306',
                        ],
                        [
                            'group_key' => '71',
                            'key' => '870',
                        ],
                        [
                            'group_key' => '75',
                            'key' => '933',
                        ],
                    ],
                    'photos' => [
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/1tx17v58y6mz44j10b74dm6xz2i',
                            'image_sequence_no' => '1',
                            'last_update_date' => '06/16/2016 12:41:03.893',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/pw1cxm0pe5pc4bp5szsbyfqqx7i',
                            'image_sequence_no' => '2',
                            'last_update_date' => '06/16/2016 12:41:03.893',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/0t06x9s0k7t24eab9666vkvn41i',
                            'image_sequence_no' => '3',
                            'last_update_date' => '06/16/2016 12:41:03.893',
                        ],
                        [
                            'url' => 'http://m.sothebysrealty.com/236i0/zrw0sk5k4jf6m2t3mwtwhf8a50i',
                            'image_sequence_no' => '4',
                            'last_update_date' => '06/16/2016 12:41:03.893',
                        ],
                    ],
                    'videos' => [
                        [
                            'url' => 'http://www.crestedbutteforsale.com/listing.aspx?address=6475-County-Road-740&id=719463&status=active',
                            'image_sequence_no' => '1',
                            'last_update_date' => '07/14/2016 17:23:29.830',
                        ],
                        [
                            'url' => 'https://424ab3360cd45b4ab42b-eaef829eae7c04fd12005cc3ad780db0.ssl.cf1.rackcdn.com/s8a6c4aa1775ovk_d7838889_720p.mp4',
                            'image_sequence_no' => '1',
                            'last_update_date' => '07/14/2016 17:23:29.830',
                        ],
                    ],
                    'agents' => [
                        [
                            'agent_key' => '4013737',
                        ],
                    ],
                ],
            ];
    }
}
