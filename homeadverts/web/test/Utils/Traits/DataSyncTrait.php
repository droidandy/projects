<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Import\NormalisedProperty;
use AppBundle\Import\NormalisedUser;
use AppBundle\Import\User\EmailTypes;
use AppBundle\Import\Wellcomemat\WellcomematFeed;
use AppBundle\Entity\User\SourceRef;

trait DataSyncTrait
{
    public function getNormalisedProperty()
    {
        return new NormalisedProperty([
            'name' => 'Lot 59 Springridge Reserve',
            'market' => 'for-sale',
            'status' => Property::STATUS_ACTIVE,
            'bedrooms' => null,
            'totalBathrooms' => null,
            'bathrooms' => null,
            'halfBathrooms' => null,
            'threeQuarterBathrooms' => null,
            'street' => 'Lot 59 Hidden Valley',
            'aptBldg' => null,
            'townCity' => 'Glenwood Springs',
            'neighbourhood' => null,
            'stateCounty' => 'CO',
            'country' => 'US',
            'zip' => '81601',
            'addressHidden' => false,
            'latitude' => null,  // We can't trust Listhub latlngs
            'longitude' => null, // We can't trust Listhub latlngs
            'latitudeFallback' => 39.4610595703125, // We can't trust Listhub latlngs
            'longitudeFallback' => -107.311660766602, // We can't trust Listhub latlngs
            'type' => PropertyTypes::OTHER,
            'price' => (object) [
                'amount' => 129000.0,
                'currency' => 'USD',
                'period' => null,
                'qualifier' => Property::PRICE_QUALIFIER_NONE,
                'priceInUSD' => null,
            ],
            'primaryPhoto' => '//openapi.azureedge.net/37DAD8F7-4D91-454F-B8E5-A91AEB218819',
            'photos' => [
                (object) [
                    'url' => '//openapi.azureedge.net/37DAD8F7-4D91-454F-B8E5-A91AEB218819',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 1,
                    'caption' => 'Lot 59 Springridge Reserve',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/B3B11B72-BB2D-4383-A98C-2F3E78B3CE28',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 2,
                    'caption' => 'Springridge Reserve Entrance',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/D6B5CD2A-F01B-4009-999B-FF51D1E74E65',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 3,
                    'caption' => 'Mt. Sopris',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/4AE9F063-4BF4-4DA2-A2F1-2B8BC2D307E6',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 4,
                    'caption' => 'Lots',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/AC84547E-C20B-4582-88FC-38B86AC7E341',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 5,
                    'caption' => 'Lots',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/68CAE640-356E-41C4-90EE-A80C7D9CCC2B',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 6,
                    'caption' => 'Views',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/F786E6A3-D486-424A-A9EE-FE9003C680FB',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 7,
                    'caption' => 'Springridge Reserve Entrance',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/FB962DF0-EAEE-4351-8142-E7EE8AEE0AC5',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 8,
                    'caption' => 'Views',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/3D50E025-1149-40B7-87B9-57A4E41623DA',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 9,
                    'caption' => 'Lots',
                ],
                (object) [
                    'url' => '//openapi.azureedge.net/B68E2175-E3B1-4EF6-9BEA-B430A9AB558D',
                    'modified' => '2017-12-09T15:00:54.250',
                    'index' => 10,
                    'caption' => 'Lots',
                ],
            ],
            'videos' => [
                (object) [
                    'url' => WellcomematFeed::buildEmbedUrl('abc'),
                    'modified' => '2018-08-31T05:05:22.000+03:00',
                    'caption' => null,
                    'metadata' => [
                        'hash' => 'abc',
                        'created' => '2018-08-31T05:05:22.000+03:00',
                    ],
                ],
            ],
            'videos3d' => [],
            'descriptions' => [
                (object) [
                    'locale' => 'en',
                    'description' => 'Welcome to Springridge Reserve, a community where the wildlife roam freely, views are cherished and ownership is treasured. Whether you explore Springridge Reserve by car, bike, or on foot, you&rsquo;ll immediately notice a difference in how it is designed. The lots range from 1 to 7 acres and all 81 of them have been positioned to take in either views or privacy, and in many cases, both. There are over 300 acres of designated open spaces naturally serve as gathering grounds for neighbors, kids, and pets. Located 1/2 between Glenwood and Sunlight Ski and 10 minutes to Carbondale in the coveted Four Mile area. Come see for yourself, and you&rsquo;ll discover why so many others have chosen to call Springridge Reserve home.',
                ],
            ],
            'yearBuilt' => null,
            'expirationDate' => null, // a property will be invalidated on sync
            'interiorArea' => null,
            'exteriorArea' => 1000,
            'sourceUrl' => 'https://www.sothebysrealty.com/id/7w6jbw',
            'sourceRef' => '3yd-RFGSIR-7W6JBW',
            'mlsRef' => '136787',
            'sourceGuid' => '000b8b54-ccf5-4a2f-9e68-0d837c70698c',
            'sourceName' => 'sothebys',
            'sourceType' => 'datasync',
            'user' => null,
            'dateUpdated' => '2017-12-20T05:12:12.110',
            'misc' => [
                'prop_features' => array(
                    0 => array(
                            'group_name' => 'Amenities',
                            'desc' => 'Ski Resort',
                        ),
                    1 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Area Climbing',
                        ),
                    2 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Area Hiking',
                        ),
                    3 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Area Hunting',
                        ),
                    4 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Area Skiing',
                        ),
                    5 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Area Snowmobiling',
                        ),
                    6 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Biking',
                        ),
                    7 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Jogging / Biking Path',
                        ),
                    8 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Outdoor Activities',
                        ),
                    9 => array(
                            'group_name' => 'Area Description',
                            'desc' => 'Country Living',
                        ),
                    10 => array(
                            'group_name' => 'Area Description',
                            'desc' => 'Mountain',
                        ),
                    11 => array(
                            'group_name' => 'Area Description',
                            'desc' => 'Skiing',
                        ),
                    12 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Country Living',
                        ),
                    13 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Hiking',
                        ),
                    14 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Hunting',
                        ),
                    15 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Mountain',
                        ),
                    16 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Outdoor Activities',
                        ),
                    17 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Ski',
                        ),
                    18 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Skiing',
                        ),
                    19 => array(
                            'group_name' => 'Lot Description',
                            'desc' => 'New Development',
                        ),
                    20 => array(
                            'group_name' => 'Property Description',
                            'desc' => 'Acreage',
                        ),
                    21 => array(
                            'group_name' => 'Special Market',
                            'desc' => 'NewHomes',
                        ),
                    22 => array(
                            'group_name' => 'Special Market',
                            'desc' => 'Vacation / Second Home',
                        ),
                    23 => array(
                            'group_name' => 'Special Program',
                            'desc' => 'QC Approved Listing',
                        ),
                    24 => array(
                            'group_name' => 'Views',
                            'desc' => 'Mountain',
                        ),
                ),
            ],
            'userRef' => '2c317472-99e3-40de-8045-563f286a4e1f',
            'userRefType' => 'guid',
        ]);
    }

    public function getNormalisedProperty3d()
    {
        return new NormalisedProperty([
            'name' => '566 Terlun Drive',
            'market' => 'for-sale',
            'status' => Property::STATUS_ACTIVE,
            'bedrooms' => 6,
            'totalBathrooms' => 3,
            'bathrooms' => 2,
            'halfBathrooms' => 1,
            'threeQuarterBathrooms' => 3,
            'street' => '566 TERLUN DRIVE',
            'aptBldg' => null,
            'townCity' => 'Durango',
            'neighbourhood' => null,
            'stateCounty' => 'CO',
            'country' => 'US',
            'zip' => '81301',
            'addressHidden' => false,
            'latitude' => null,  // We can't trust Listhub latlngs
            'longitude' => null, // We can't trust Listhub latlngs
            'latitudeFallback' => 37.274585723877, // We can't trust Listhub latlngs
            'longitudeFallback' => -107.963249206543, // We can't trust Listhub latlngs
            'type' => PropertyTypes::SEMI_DETACHED,
            'price' => (object) [
                'amount' => 4500000000,
                'currency' => 'CLP',
                'period' => null,
                'qualifier' => Property::PRICE_QUALIFIER_NONE,
                'priceInUSD' => 6490300,
            ],
            'primaryPhoto' => '//openapi.azureedge.net/75EAFBEF-86CA-4E56-837F-6789555B5D83',
            'photos' => json_decode(json_encode(array(
                0 => array(
                        'url' => '//openapi.azureedge.net/98A38379-B3F3-4C2B-BF12-EDECD860E798',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 1,
                        'caption' => '3762_front1_4436',
                    ),
                1 => array(
                        'url' => '//openapi.azureedge.net/9946752F-8AAE-48BE-9CA9-123D65BB7072',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 2,
                        'caption' => '3513_lr_ml2',
                    ),
                2 => array(
                        'url' => '//openapi.azureedge.net/E5A21ECC-E389-4C69-A725-AD48CB214653',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 3,
                        'caption' => '3513_foyer_ml1',
                    ),
                3 => array(
                        'url' => '//openapi.azureedge.net/9698ED5C-BA26-43C1-ACDA-A1D2059D0A4C',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 4,
                        'caption' => '3513_lr_ml1',
                    ),
                4 => array(
                        'url' => '//openapi.azureedge.net/B184EAA7-1BA1-4B01-BF6A-1DA6B6BF55AE',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 5,
                        'caption' => '3513_kit_ml1',
                    ),
                5 => array(
                        'url' => '//openapi.azureedge.net/087606D4-77A4-4987-81A9-7F49772BFDFD',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 6,
                        'caption' => '3513_kit_ml3',
                    ),
                6 => array(
                        'url' => '//openapi.azureedge.net/F22185EF-3323-4F81-8041-5A42C80444D2',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 7,
                        'caption' => '3513_kit_ml2',
                    ),
                7 => array(
                        'url' => '//openapi.azureedge.net/664EEF06-BEB5-4FDB-82C1-D5C09AE6F35B',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 8,
                        'caption' => '3513_dr_ml1',
                    ),
                8 => array(
                        'url' => '//openapi.azureedge.net/8E2F6479-C52E-48CE-A9DE-5413B9F15AF3',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 9,
                        'caption' => '3762_deck1_ul_4442',
                    ),
                9 => array(
                        'url' => '//openapi.azureedge.net/80C4268D-5494-44A3-B78F-A46BAC2A2289',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 10,
                        'caption' => '3762_deck2_ul_4443',
                    ),
                10 => array(
                        'url' => '//openapi.azureedge.net/8E707D1F-D78B-40F5-A1B3-281235591244',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 11,
                        'caption' => '3513_mbr_ml1',
                    ),
                11 => array(
                        'url' => '//openapi.azureedge.net/13A94E4A-9AEB-48E9-938C-7F88385818D8',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 12,
                        'caption' => '3513_mba_ml2',
                    ),
                12 => array(
                        'url' => '//openapi.azureedge.net/B0DFB511-A696-4CA5-A556-361898F1E0F8',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 13,
                        'caption' => '3513_mba_ml1',
                    ),
                13 => array(
                        'url' => '//openapi.azureedge.net/146D4849-10DD-45BA-BFA7-1D6970B7514D',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 14,
                        'caption' => '3513_lau_ml1',
                    ),
                14 => array(
                        'url' => '//openapi.azureedge.net/7D5BD19B-FB4D-4FFF-A591-499F7E867AD1',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 15,
                        'caption' => '3513_bonus_ml1',
                    ),
                15 => array(
                        'url' => '//openapi.azureedge.net/A12FA5E4-413A-411F-9426-F319AF625702',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 16,
                        'caption' => '3513_bonus_ml2',
                    ),
                16 => array(
                        'url' => '//openapi.azureedge.net/6458B6A6-0BA0-44F3-8E8C-45DDDCEC0E09',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 17,
                        'caption' => '3513_4ba_ml1',
                    ),
                17 => array(
                        'url' => '//openapi.azureedge.net/3B2D7211-810A-462A-8314-58F937E7BEA8',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 18,
                        'caption' => '3513_1ba_ul1',
                    ),
                18 => array(
                        'url' => '//openapi.azureedge.net/8766C43F-7075-4D6A-AF68-6D96B4D97DD2',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 19,
                        'caption' => '3513_lr_ml3',
                    ),
                19 => array(
                        'url' => '//openapi.azureedge.net/EE15F36A-C744-4F00-97A9-CDF741464DA6',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 20,
                        'caption' => '3513_lft_ul3',
                    ),
                20 => array(
                        'url' => '//openapi.azureedge.net/0B6106F2-B203-4028-A973-D18A7303862F',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 21,
                        'caption' => '3513_lft_ul1',
                    ),
                21 => array(
                        'url' => '//openapi.azureedge.net/FA528FE3-3F51-40B1-8900-C6FF1FE98450',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 22,
                        'caption' => '3513_lft_ul2',
                    ),
                22 => array(
                        'url' => '//openapi.azureedge.net/A7AB2C81-EDA4-4D68-B5D4-04523D3268EC',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 23,
                        'caption' => '3513_1br_ul1',
                    ),
                23 => array(
                        'url' => '//openapi.azureedge.net/D45CC056-0CEF-423D-B9BC-0278CFA4D23B',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 24,
                        'caption' => '3513_1ba_ul2',
                    ),
                24 => array(
                        'url' => '//openapi.azureedge.net/68244845-561B-4413-A6F1-64C739A14BAB',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 25,
                        'caption' => '3513_2br_ul1',
                    ),
                25 => array(
                        'url' => '//openapi.azureedge.net/FDF1BAA3-033A-473D-BBEF-662E58B9A7A3',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 26,
                        'caption' => '3513_2ba_ul2',
                    ),
                26 => array(
                        'url' => '//openapi.azureedge.net/7BD9F8C0-4163-4E5D-8F97-0D7DD7472383',
                        'modified' => '2017-12-20T05:01:39.913',
                        'index' => 27,
                        'caption' => '3513_3br_ul1',
                    ),
                27 => array(
                        'url' => '//openapi.azureedge.net/505550FE-E1EA-43E9-AC51-7AAAA4E3DBDA',
                        'modified' => '2017-12-20T05:01:39.913',
                        'index' => 28,
                        'caption' => '3513_fr_ll2',
                    ),
                28 => array(
                        'url' => '//openapi.azureedge.net/E0D43500-4E1D-41FE-8677-7D9E89F12356',
                        'modified' => '2017-12-20T05:01:39.913',
                        'index' => 29,
                        'caption' => '3513_fr_ll1',
                    ),
                29 => array(
                        'url' => '//openapi.azureedge.net/8467B816-097C-4109-A3D5-57A65983C7A6',
                        'modified' => '2017-12-20T05:01:39.913',
                        'index' => 30,
                        'caption' => '3513_fr_ll3',
                    ),
                30 => array(
                        'url' => '//openapi.azureedge.net/ED42A527-C697-4E80-8148-A2E48BBB3D2E',
                        'modified' => '2017-12-20T05:01:39.913',
                        'index' => 31,
                        'caption' => '3513_exr_ll1',
                    ),
                31 => array(
                        'url' => '//openapi.azureedge.net/9A8F8885-840C-4908-89FB-5EF41CF41105',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 32,
                        'caption' => '3762_garage_4418',
                    ),
                32 => array(
                        'url' => '//openapi.azureedge.net/840EC4B1-6202-4D08-AA34-8B4C16E1D481',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 33,
                        'caption' => '3513_gar_ll2',
                    ),
                33 => array(
                        'url' => '//openapi.azureedge.net/2EF7CD25-4256-4E78-88DE-99D28BF6BFD0',
                        'modified' => '2018-06-27T21:23:41.297',
                        'index' => 34,
                        'caption' => 'IMG_1989',
                    ),
                34 => array(
                        'url' => '//openapi.azureedge.net/E01D3F61-82C8-4F7E-BB20-18C98FCD054F',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 35,
                        'caption' => '3762_hot tub_ll_4426',
                    ),
                35 => array(
                        'url' => '//openapi.azureedge.net/3019C072-1461-4EF3-B7B1-756A0BD0F990',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 36,
                        'caption' => '3762_patio1_ll_4424',
                    ),
                36 => array(
                        'url' => '//openapi.azureedge.net/3FD52A36-0875-43E0-A7EE-2A0A82764C08',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 37,
                        'caption' => '3762_waterfall2_4433',
                    ),
                37 => array(
                        'url' => '//openapi.azureedge.net/6F21CFC0-00BD-44A8-B80B-E319EFDF3200',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 38,
                        'caption' => '3762_patio3_4422',
                    ),
                38 => array(
                        'url' => '//openapi.azureedge.net/BD5EEAED-A8E5-4A42-9312-8736A5E7A5FD',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 39,
                        'caption' => '3762_patio2_4421',
                    ),
                39 => array(
                        'url' => '//openapi.azureedge.net/57F6898D-437A-4298-B2AB-B2FC48D580C8',
                        'modified' => '2018-06-27T21:23:41.280',
                        'index' => 40,
                        'caption' => '3762_front2_4438',
                    ),
                40 => array(
                        'url' => '//openapi.azureedge.net/75EAFBEF-86CA-4E56-837F-6789555B5D83',
                        'modified' => null,
                        'index' => 41,
                        'caption' => null,
                    ),
                41 => array(
                        'url' => '//openapi.azureedge.net/FC8B03F4-177A-D671-8516-95735682F706',
                        'modified' => '2017-11-06T17:56:32.457',
                        'index' => 42,
                        'caption' => null,
                    ),
                42 => array(
                        'url' => '//openapi.azureedge.net/E834298A-089C-6A9E-CBFF-7F63B9E00EE4',
                        'modified' => '2017-11-06T17:56:32.457',
                        'index' => 43,
                        'caption' => null,
                    ),
            ))),
            'videos' => [],
            'videos3d' => [
                (object) [
                    'url' => 'https://my.matterport.com/show/?m=B5Yayg8nTj2',
                    'modified' => '2017-12-20T05:01:39.913',
                    'index' => 1,
                    'caption' => '766 Terlun 3D',
                    'metadata' => [
                        'media_id' => '00DCC953-86D6-41D4-868C-ED9E48749B08',
                    ],
                ],
            ],
            'descriptions' => [
                (object) [
                    'locale' => 'en',
                    'description' => 'One of Durango\'s finest! Beautiful 5,000 square foot luxury log home on over 35 acres only 5 minutes to town!!! Main level features Great Room with soaring 20 foot floor to ceiling river rock fireplace opening to the dining room and a perfect kitchen to entertain. Incredible windows look out to the large covered wrap around Trex deck with log railings and a grand log staircase to access the custom landscaped yard below. The views are simply unbelievable! The main floor master suite includes large walk in closet, bath with marble sinks and laundry. There is also a powder room and ensuite (currently used as a piano room) which can be accessed with no stairs off the entry, other options; office, den, library or bedroom. The upper level features 3 bedrooms, 2 bathrooms, a second laundry room and a stunning loft area with beautiful views. The lower level has an additional living room with pellet stove embedded in stacked stone fireplace, pool table (included), gym, office and bathroom. Walk out from the lower level to 1 acre of landscaped grounds with auto irrigation system. Here you\'ll find the fire pit, Jacuzzi and waterfall with two pools connected by a creek. The 3 car over sized garage opens to the lower level with plenty of storage throughout. The front of the home faces South for great sunshine, with the back facing to the North for breathtaking mountain views. There is plenty of space and electric to a future 2nd garage/toy barn/shop (plans available). The home sits up on the ridge surrounded by 35.77 acres of Pine, Ponderosa and Juniper + 3 meadows . Privacy, luxury, mountain views, and only 5 minutes from town...This home is a Durango dream!',
                ],
            ],
            'yearBuilt' => '2007',
            'expirationDate' => null, // a property will be invalidated on sync
            'interiorArea' => 100,
            'exteriorArea' => 1000,
            'sourceUrl' => 'https://www.sothebysrealty.com/id/wyxlxq',
            'sourceRef' => '3yd-RFGSIR-WYXLXQ',
            'mlsRef' => '728706',
            'sourceGuid' => 'd740ee9b-0385-444f-b6d8-3b3c999b8550',
            'sourceName' => 'sothebys',
            'sourceType' => 'datasync',
            'user' => null,
            'dateUpdated' => '2018-07-17T01:49:11.323',
            'misc' => [
                'prop_features' => array(
                    0 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Dishwasher',
                        ),
                    1 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Double Oven',
                        ),
                    2 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Dryer',
                        ),
                    3 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Garbage Disposal',
                        ),
                    4 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Microwave',
                        ),
                    5 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Range / Oven',
                        ),
                    6 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Refrigerator',
                        ),
                    7 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Trash Compactor',
                        ),
                    8 => array(
                            'group_name' => 'Appliances',
                            'desc' => 'Washer',
                        ),
                    9 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Area Fishing',
                        ),
                    10 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Area Hiking',
                        ),
                    11 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Area Skiing',
                        ),
                    12 => array(
                            'group_name' => 'Area Amenities',
                            'desc' => 'Outdoor Activities',
                        ),
                    13 => array(
                            'group_name' => 'Area Description',
                            'desc' => 'Country Living',
                        ),
                    14 => array(
                            'group_name' => 'Area Description',
                            'desc' => 'Mountain',
                        ),
                    15 => array(
                            'group_name' => 'Area Description',
                            'desc' => 'Privacy',
                        ),
                    16 => array(
                            'group_name' => 'Basement',
                            'desc' => 'Finished',
                        ),
                    17 => array(
                            'group_name' => 'Exterior',
                            'desc' => 'Fire Pit',
                        ),
                    18 => array(
                            'group_name' => 'Exterior',
                            'desc' => 'Gardens',
                        ),
                    19 => array(
                            'group_name' => 'Exterior',
                            'desc' => 'Sprinkler System',
                        ),
                    20 => array(
                            'group_name' => 'Exterior',
                            'desc' => 'Water Feature',
                        ),
                    21 => array(
                            'group_name' => 'Exterior Description',
                            'desc' => 'Log',
                        ),
                    22 => array(
                            'group_name' => 'Exterior Description',
                            'desc' => 'Stone',
                        ),
                    23 => array(
                            'group_name' => 'Exterior Living Space',
                            'desc' => 'Deck',
                        ),
                    24 => array(
                            'group_name' => 'Exterior Living Space',
                            'desc' => 'Patio',
                        ),
                    25 => array(
                            'group_name' => 'Fireplace Count',
                            'desc' => '3 Fireplaces',
                        ),
                    26 => array(
                            'group_name' => 'Fireplace Description',
                            'desc' => 'Fireplace',
                        ),
                    27 => array(
                            'group_name' => 'Flooring',
                            'desc' => 'Hardwood',
                        ),
                    28 => array(
                            'group_name' => 'Flooring',
                            'desc' => 'Tile',
                        ),
                    29 => array(
                            'group_name' => 'Flooring',
                            'desc' => 'Wall to Wall Carpet',
                        ),
                    30 => array(
                            'group_name' => 'Garage Count',
                            'desc' => '3 Car Garage',
                        ),
                    31 => array(
                            'group_name' => 'Garage Description',
                            'desc' => 'Attached Garage',
                        ),
                    32 => array(
                            'group_name' => 'General',
                            'desc' => 'Security System',
                        ),
                    33 => array(
                            'group_name' => 'General',
                            'desc' => 'Stereo System',
                        ),
                    34 => array(
                            'group_name' => 'Heating - Fuel Type',
                            'desc' => 'Propane',
                        ),
                    35 => array(
                            'group_name' => 'Heating - Fuel Type',
                            'desc' => 'Wood',
                        ),
                    36 => array(
                            'group_name' => 'Heating Type',
                            'desc' => 'Other',
                        ),
                    37 => array(
                            'group_name' => 'Heating Type',
                            'desc' => 'Radiant Floor',
                        ),
                    38 => array(
                            'group_name' => 'Interior',
                            'desc' => 'Exercise Area',
                        ),
                    39 => array(
                            'group_name' => 'Interior',
                            'desc' => 'Fireplace in Master BR',
                        ),
                    40 => array(
                            'group_name' => 'Interior',
                            'desc' => 'In-Home Gym',
                        ),
                    41 => array(
                            'group_name' => 'Interior',
                            'desc' => 'Vaulted Ceilings',
                        ),
                    42 => array(
                            'group_name' => 'Interior',
                            'desc' => 'Walk-in Closet',
                        ),
                    43 => array(
                            'group_name' => 'Kitchen Features',
                            'desc' => 'Breakfast Bar',
                        ),
                    44 => array(
                            'group_name' => 'Kitchen Features',
                            'desc' => 'Eat-in Kitchen',
                        ),
                    45 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Country Living',
                        ),
                    46 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Fishing',
                        ),
                    47 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Hiking',
                        ),
                    48 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Mountain',
                        ),
                    49 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Outdoor Activities',
                        ),
                    50 => array(
                            'group_name' => 'Lifestyles',
                            'desc' => 'Ski (Snow)',
                        ),
                    51 => array(
                            'group_name' => 'Lot Description',
                            'desc' => 'Open',
                        ),
                    52 => array(
                            'group_name' => 'Lot Description',
                            'desc' => 'Stream on Lot',
                        ),
                    53 => array(
                            'group_name' => 'Lot Size',
                            'desc' => '20-50 Acres',
                        ),
                    54 => array(
                            'group_name' => 'Pool Description',
                            'desc' => 'Hot Tub',
                        ),
                    55 => array(
                            'group_name' => 'Property Description',
                            'desc' => 'Acreage',
                        ),
                    56 => array(
                            'group_name' => 'Road Type',
                            'desc' => 'County Street',
                        ),
                    57 => array(
                            'group_name' => 'Roof',
                            'desc' => 'Metal Roof',
                        ),
                    58 => array(
                            'group_name' => 'Sewer',
                            'desc' => 'Septic',
                        ),
                    59 => array(
                            'group_name' => 'Special Program',
                            'desc' => 'QC Approved Listing',
                        ),
                    60 => array(
                            'group_name' => 'Special Program',
                            'desc' => 'Video QC Approved Listing',
                        ),
                    61 => array(
                            'group_name' => 'Views',
                            'desc' => 'Mountain',
                        ),
                    62 => array(
                            'group_name' => 'Views',
                            'desc' => 'Scenic',
                        ),
                    63 => array(
                            'group_name' => 'Water',
                            'desc' => 'Well',
                        ),
                ),
            ],
            'userRef' => '9a16958a-f9f8-4299-b8b9-3269c74c07cb',
            'userRefType' => 'guid',
        ]);
    }

    private function getNormalisedUser()
    {
        $user = new NormalisedUser();
        $user->sourceRef = 'd693de6e-2de4-45ea-ba02-53944df70c10';
        $user->sourceRefType = 'guid';
        $user->sourceRefs = [
            (object) [
                'ref' => '30d0942c-97f2-4520-a37a-0b1f9405c441',
                'type' => SourceRef::TYPE_PERSON_ID,
            ],
        ];
        $user->virtualSourceRefs = [
            (object) [
                'ref' => 'D693DE6E-2DE4-45EA-BA02-53944DF70C10',
                'type' => SourceRef::TYPE_GUID,
            ],
        ];
        $user->name = 'Sandy Chittenden';
        $user->phone = '+1 9149219207';
        $user->email = 'sandy.chittenden@juliabfee.com';
        $user->leadEmail = '800024.lead.4016403@leads.leadrouter.com';
        $user->allEmails = [
            (object) [
                'type' => EmailTypes::LEAD_ROUTER,
                'email' => '800024.lead.4016403@leads.leadrouter.com',
            ],
            (object) [
                'type' => EmailTypes::PERSONAL,
                'email' => 'sandy.chittenden@juliabfee.com',
            ],
            (object) [
                'type' => EmailTypes::VANITY,
                'email' => 'sandy.chittenden@sothebysrealty.com',
            ],
        ];
        $user->homePageUrl = null;
        $user->avatarUrl = '//openapi.azureedge.net/B4793351-8761-4893-8339-DDB6B79608E6';
        $user->descriptions = [
            (object) [
                'locale' => 'en',
                'description' => 'Sandy has over twenty one years experience in the Westchester real estate market. Sandy is a lifetime resident of Rye and has been a top producing agent for the last decade. Her knowledge of the local marketplace provides her clients with a distinctive edge in the purchase or sale of real estate. Sandy has a notable percentage of repeat business from satisfied clients. It would be difficult to overstate Sandy\'s talent in negotiating or her determination and enthusiasm for the success of her clients. Sandy is a member of the National Association of Realtors, New York State Association of Realtors, Westchester Putnam Board of Realtors and Rye-Harrison Multiple Listing Service.Call Sandy today to discuss your real estate goals.',
            ],
        ];
        $user->companyName = 'William Pitt Sotheby\'s International Realty';
        $user->companyPhone = '9149674600';
        $user->street = '49 Purchase Street';
        $user->aptBldg = null;
        $user->townCity = 'Rye';
        $user->country = 'US';
        $user->zip = '10580';
        $user->stateCounty = 'NY';
        $user->fallbackLatitude = 40.98324;
        $user->fallbackLongitude = -73.68497;

        return $user;
    }

    private function getProperty()
    {
        return json_decode(file_get_contents($this->getFixture('import/datasync/get-property-by-id/000b8b54-ccf5-4a2f-9e68-0d837c70698c.json')));
    }

    private function getProperty3d()
    {
        return json_decode(file_get_contents($this->getFixture('import/datasync/get-property-by-id/d740ee9b-0385-444f-b6d8-3b3c999b8550-[3d].json')));
    }

    private function getUser()
    {
        return json_decode(file_get_contents($this->getFixture('import/datasync/get-agent-by-id/d693de6e-2de4-45ea-ba02-53944df70c10.json')));
    }

    abstract protected function getFixture($filename);
}
