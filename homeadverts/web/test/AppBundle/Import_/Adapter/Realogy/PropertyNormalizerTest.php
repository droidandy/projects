<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Adapter\Sothebys\PropertyNormalizer;
use AppBundle\Import\Adapter\Sothebys\StandardTypeStrategy;
use AppBundle\Import\NormalisedPropertyInterface;
use AppBundle\Import\User\SourceRefUserRegistry;
use AppBundle\Import\Wellcomemat\WellcomematFeed;
use AppBundle\Service\Geo\LocaleHelper;

class PropertyNormalizerTest extends \PHPUnit_Framework_TestCase
{
    private $wellcomematFeed;
    private $localeHelper;
    private $userRepo;
    private $standardTypeStrategy;
    private $sourceRefUserRegistry;
    /**
     * @var PropertyNormalizer
     */
    private $propertyNormalizer;

    protected function setUp()
    {
        $this->wellcomematFeed = $this->getWellcomematFeed();

        $this->localeHelper = $this->getLocaleHelper();
        $this
            ->localeHelper
            ->expects($this->any())
            ->method('acresToSquareMetres')
            ->willReturnArgument(0)
        ;
        $this
            ->localeHelper
            ->expects($this->any())
            ->method('squareFeetToSquareMetres')
            ->willReturnArgument(0)
        ;
        $this
            ->localeHelper
            ->expects($this->any())
            ->method('hectaresToSquareMetres')
            ->willReturnArgument(0)
        ;
        $this
            ->localeHelper
            ->expects($this->any())
            ->method('pingsToSquareMetres')
            ->willReturnArgument(0)
        ;

        $this->userRepo = $this->getUserRepo();
        $this->standardTypeStrategy = $this->getStandardTypeStrategy();
        $this->sourceRefUserRegistry = $this->getSourceRefUserRegistry();
        $this
            ->sourceRefUserRegistry
            ->expects($this->any())
            ->method('getUserId')
            ->willReturnArgument(1)
        ;

        $this->propertyNormalizer = $this->getPropertyNormalizer(
            $this->wellcomematFeed,
            $this->localeHelper,
            $this->userRepo,
            $this->standardTypeStrategy,
            $this->sourceRefUserRegistry
        );
    }

    public function testNormalizeHash()
    {
        $propertyData = $this->getPropertyData();
        foreach ($propertyData as $propertyDatum) {
            $normalizedProperty = $this->propertyNormalizer->normalize($propertyDatum);
            $hash1 = $this->getHash($normalizedProperty);
            $normalizedProperty = $this->propertyNormalizer->normalize($propertyDatum);
            $hash2 = $this->getHash($normalizedProperty);

            $this->assertEquals($hash1, $hash2);
        }
    }

    private function getHash(NormalisedPropertyInterface $property)
    {
        $arr = clone $property;
        $arr->setIndex(null);

        return sha1(serialize($arr));
    }

    private function getWellcomematFeed()
    {
        return $this
            ->getMockBuilder(WellcomematFeed::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getLocaleHelper()
    {
        return $this
            ->getMockBuilder(LocaleHelper::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getUserRepo()
    {
        return $this
            ->getMockBuilder(UserRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getStandardTypeStrategy()
    {
        return new StandardTypeStrategy();
    }

    private function getSourceRefUserRegistry()
    {
        return $this
            ->getMockBuilder(SourceRefUserRegistry::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getPropertyNormalizer(
        $wellcomematFeed,
        $localeHelper,
        $userRepo,
        $standardTypeStrategy,
        $sourceRefUserRegistry
    ) {
        return new PropertyNormalizer(
            $wellcomematFeed,
            $localeHelper,
            $userRepo,
            $standardTypeStrategy,
            $sourceRefUserRegistry
        );
    }

    // todo: move to fixtures.
    private function getPropertyData()
    {
        return [
            array(
                'listing_guid' => '4A8581A5-63D5-469E-BB79-216D9F0ACFEB',
                'mls_id' => '20153304',
                'listing_id' => 'B9368W',
                'listing_status' => 'OP',
                'address1' => '11302 Elle Ellen',
                'address2' => '',
                'address3' => '',
                'latitude' => '39.300151825',
                'longitude' => '-120.157608032',
                'bedrooms' => '',
                'full_bath' => '',
                'half_bath' => '',
                'three_quarter_bath' => '',
                'neighborhood_name' => 'Lahontan',
                'city' => 'Truckee',
                'country_iso_code' => 'US',
                'state_iso_code' => 'CA',
                'postal_code' => '96161',
                'show_address' => 'Y',
                'listing_type' => 'Residential Sale',
                'property_type' => 'LL',
                'property_subtype' => '38',
                'expiration_date' => '05/31/2018',
                'list_price' => '129000.00',
                'show_list_price' => 'Y',
                'currency_code' => 'USD',
                'year_built' => '',
                'building_area' => '',
                'building_area_uom' => 'SF',
                'lot_size' => '0.51',
                'lot_size_uom' => 'AC',
                'source_listing_url' => 'https://www.sothebysrealty.com/id/b9368w',
                'last_update_date' => '01/17/2018 13:57:42.073',
                'descriptions' => array(
                        0 => array(
                                'property_remark' => 'Exciting Lahontan Parcel perfect for your legacy home. Large corner parcel with easy access to the amenities.',
                                'language_code' => 'EN',
                            ),
                    ),
                'prop_features' => array(
                        0 => array(
                                'group_key' => '15',
                                'key' => '220',
                            ),
                        1 => array(
                                'group_key' => '23',
                                'key' => '286',
                            ),
                        2 => array(
                                'group_key' => '24',
                                'key' => '307',
                            ),
                        3 => array(
                                'group_key' => '25',
                                'key' => '1046',
                            ),
                        4 => array(
                                'group_key' => '26',
                                'key' => '980',
                            ),
                        5 => array(
                                'group_key' => '27',
                                'key' => '409',
                            ),
                        6 => array(
                                'group_key' => '43',
                                'key' => '872',
                            ),
                        7 => array(
                                'group_key' => '43',
                                'key' => '880',
                            ),
                        8 => array(
                                'group_key' => '43',
                                'key' => '897',
                            ),
                        9 => array(
                                'group_key' => '49',
                                'key' => '670',
                            ),
                        10 => array(
                                'group_key' => '49',
                                'key' => '679',
                            ),
                        11 => array(
                                'group_key' => '56',
                                'key' => '22',
                            ),
                        12 => array(
                                'group_key' => '56',
                                'key' => '23',
                            ),
                        13 => array(
                                'group_key' => '56',
                                'key' => '301',
                            ),
                        14 => array(
                                'group_key' => '56',
                                'key' => '431',
                            ),
                        15 => array(
                                'group_key' => '56',
                                'key' => '433',
                            ),
                        16 => array(
                                'group_key' => '56',
                                'key' => '526',
                            ),
                        17 => array(
                                'group_key' => '57',
                                'key' => '312',
                            ),
                        18 => array(
                                'group_key' => '77',
                                'key' => '1066',
                            ),
                        19 => array(
                                'group_key' => '77',
                                'key' => '1069',
                            ),
                        20 => array(
                                'group_key' => '77',
                                'key' => '1072',
                            ),
                        21 => array(
                                'group_key' => '77',
                                'key' => '1093',
                            ),
                    ),
                'photos' => array(
                        0 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/7f4032y7515b46pkcfq0e1w0g5i',
                                'image_sequence_no' => '22',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        1 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/vk691x3fx6cjm0t1srhk8hcws4i',
                                'image_sequence_no' => '20',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        2 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/dta5ek9e21bpmhyqx1eh5dr5r1i',
                                'image_sequence_no' => '17',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        3 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/s1ws52pmhjzb4hp7ytbt20ebd3i',
                                'image_sequence_no' => '19',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        4 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/47tvfacr2042mt23mfk2gv9eh2i',
                                'image_sequence_no' => '25',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        5 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/nkme39dbjxhs4r6qcze3thbtb1i',
                                'image_sequence_no' => '11',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        6 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/4eqcdpn5z16qmbyr3gpd87tv36i',
                                'image_sequence_no' => '15',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        7 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/v098vcdmma904gykxj60merpf5i',
                                'image_sequence_no' => '10',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        8 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/cx8pb3mxv0j0mvjqmh4emryrj4i',
                                'image_sequence_no' => '4',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        9 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/g702y26jzmfmmaaqz2969ddzf3i',
                                'image_sequence_no' => '6',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        10 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/kpdcgp31dtpzmcekfgrywhfzq7i',
                                'image_sequence_no' => '9',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        11 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/hvgweksz8vs14wj8zbd94y53s0i',
                                'image_sequence_no' => '2',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        12 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/fqj3fd1et7x6mtazbn8pdpcf25i',
                                'image_sequence_no' => '7',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        13 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/2admc5trk54s4hyyr4q6c0gna3i',
                                'image_sequence_no' => '16',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        14 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/pj13b2b94her40ezwfjz2f6ha0i',
                                'image_sequence_no' => '14',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        15 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/e0f85szc75ma4x6r81nnrrrtx4i',
                                'image_sequence_no' => '24',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        16 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/6582nt3v0cgg4m2xphmrverpg0i',
                                'image_sequence_no' => '26',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        17 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/3fqq6nb5ksc6mrj8614xadszx1i',
                                'image_sequence_no' => '3',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        18 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/0g8y0m373ft04dj9jjfm1pmv45i',
                                'image_sequence_no' => '13',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        19 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/ve501sebkc18mvjzv8v01h96a3i',
                                'image_sequence_no' => '5',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        20 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/pmxjrmrh8qrn4s637sz4j5pmf5i',
                                'image_sequence_no' => '23',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        21 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/bed1qhzngnty4kj7f6chh4t2x5i',
                                'image_sequence_no' => '21',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        22 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/gbhg9x0yb2n74kjtsrkm53pmc5i',
                                'image_sequence_no' => '18',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        23 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/nxtj104hf3px4p2xxpmraesv76i',
                                'image_sequence_no' => '8',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        24 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/8ka59deejpa34k6y6j5x6jhw15i',
                                'image_sequence_no' => '12',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                        25 => array(
                                'url' => 'http://m.sothebysrealty.com/236i0/x3qts8s82wbqmp2e533yez92w6i',
                                'image_sequence_no' => '1',
                                'last_update_date' => '10/04/2017 13:04:25.217',
                            ),
                    ),
                'videos' => array(
                    ),
                'agents' => array(
                        0 => array(
                                'agent_key' => '4031754',
                            ),
                    ),
            ),
            array(
                'listing_guid' => '9B57847F-6AA9-4EA1-8474-4605CC56494D',
                'mls_id' => '28281',
                'listing_id' => 'M3BGFX',
                'listing_status' => 'AC',
                'address1' => '524 CR 224 W',
                'address2' => '',
                'address3' => '',
                'latitude' => '30.962677896',
                'longitude' => '-98.038609251',
                'bedrooms' => '',
                'full_bath' => '',
                'half_bath' => '',
                'three_quarter_bath' => '',
                'neighborhood_name' => '',
                'city' => 'Lampasas',
                'country_iso_code' => 'US',
                'state_iso_code' => 'TX',
                'postal_code' => '76550',
                'show_address' => 'Y',
                'listing_type' => 'Residential Sale',
                'property_type' => 'FA',
                'property_subtype' => '54',
                'expiration_date' => '05/10/2018',
                'list_price' => '7206330.00',
                'show_list_price' => 'Y',
                'currency_code' => 'USD',
                'year_built' => '',
                'building_area' => '',
                'building_area_uom' => 'SF',
                'lot_size' => '2670',
                'lot_size_uom' => 'AC',
                'source_listing_url' => 'https://www.sothebysrealty.com/id/m3bgfx',
                'last_update_date' => '12/19/2017 23:20:16.380',
                'descriptions' => array(
                        0 => array(
                                'property_remark' => 'Only 45 minutes from Austin, this 2,670.46-acre ranch features unique game facilities and two creeks, one spring and 18 ponds and lakes.Miller Creek runs across the front and Panther Creek meanders through the back. Varied topography, views, two primary residences, two mobile homes and working improvements for cattle and horses are available in this potential hunter&rsquo;s paradise. Available separately or as a complete estate. Minerals will transfer with the sale.',
                                'language_code' => 'EN',
                            ),
                    ),
                'prop_features' => array(
                        0 => array(
                                'group_key' => '26',
                                'key' => '964',
                            ),
                    ),
                'photos' => array(
                    ),
                'videos' => array(
                    ),
                'agents' => array(
                        0 => array(
                                'agent_key' => '4028808',
                            ),
                    ),
            ),
            array(
                'listing_guid' => '101FCA69-EA10-4F2C-8BE9-5B9FEE7DA8CC',
                'mls_id' => 'S170260',
                'listing_id' => '5HPEH5',
                'listing_status' => 'AC',
                'address1' => '27555 Whitewood Drive East',
                'address2' => '',
                'address3' => '',
                'latitude' => '40.397243500',
                'longitude' => '-106.908660889',
                'bedrooms' => '2',
                'full_bath' => '3',
                'half_bath' => '',
                'three_quarter_bath' => '',
                'neighborhood_name' => '',
                'city' => 'Steamboat Springs',
                'country_iso_code' => 'US',
                'state_iso_code' => 'CO',
                'postal_code' => '80487',
                'show_address' => 'Y',
                'listing_type' => 'Residential Sale',
                'property_type' => 'R',
                'property_subtype' => '44',
                'expiration_date' => '03/15/2018',
                'list_price' => '665000.00',
                'show_list_price' => 'Y',
                'currency_code' => 'USD',
                'year_built' => '',
                'building_area' => '2592.00',
                'building_area_uom' => 'SF',
                'lot_size' => '8.07',
                'lot_size_uom' => 'AC',
                'source_listing_url' => 'https://www.sothebysrealty.com/id/5hpeh5',
                'last_update_date' => '01/15/2018 17:51:39.677',
                'descriptions' => array(
                        0 => array(
                                'property_remark' => 'You will love the breathtaking views and serene setting for this inviting Whitewood home. The home sits on 8 acres and features 2 bedrooms and 3 full baths with over 2500 square feet of living space on two levels. Built in 2006 by local builder Fox Construction, this home is flooded with natural light and is finished beautifully with wood floors, vaulted ceilings, granite countertops, stainless appliances, a steam shower, and abundant storage. Radiant floor heat provides efficient warmth, and a welcoming wood fireplace is featured in the living room. The home is set in an aspen grove with spectacular views to the south and east, and includes a detached shed with power and an attached wood storage area. Enjoy the birds, wildlife and views from the large deck off the main living area. The private well for this home has been called the "best well in Whitewood" and produces excellent quality water.',
                                'language_code' => 'EN',
                            ),
                    ),
                'prop_features' => array(
                        0 => array(
                                'group_key' => '11',
                                'key' => '155',
                            ),
                        1 => array(
                                'group_key' => '11',
                                'key' => '164',
                            ),
                        2 => array(
                                'group_key' => '11',
                                'key' => '165',
                            ),
                        3 => array(
                                'group_key' => '21',
                                'key' => '251',
                            ),
                        4 => array(
                                'group_key' => '24',
                                'key' => '307',
                            ),
                        5 => array(
                                'group_key' => '25',
                                'key' => '1040',
                            ),
                        6 => array(
                                'group_key' => '25',
                                'key' => '1046',
                            ),
                        7 => array(
                                'group_key' => '26',
                                'key' => '387',
                            ),
                        8 => array(
                                'group_key' => '3',
                                'key' => '762',
                            ),
                        9 => array(
                                'group_key' => '50',
                                'key' => '1025',
                            ),
                        10 => array(
                                'group_key' => '51',
                                'key' => '734',
                            ),
                        11 => array(
                                'group_key' => '51',
                                'key' => '736',
                            ),
                        12 => array(
                                'group_key' => '51',
                                'key' => '737',
                            ),
                        13 => array(
                                'group_key' => '51',
                                'key' => '738',
                            ),
                        14 => array(
                                'group_key' => '51',
                                'key' => '739',
                            ),
                        15 => array(
                                'group_key' => '51',
                                'key' => '740',
                            ),
                        16 => array(
                                'group_key' => '51',
                                'key' => '742',
                            ),
                        17 => array(
                                'group_key' => '54',
                                'key' => '552',
                            ),
                        18 => array(
                                'group_key' => '55',
                                'key' => '79',
                            ),
                        19 => array(
                                'group_key' => '56',
                                'key' => '301',
                            ),
                        20 => array(
                                'group_key' => '56',
                                'key' => '309',
                            ),
                        21 => array(
                                'group_key' => '56',
                                'key' => '431',
                            ),
                        22 => array(
                                'group_key' => '56',
                                'key' => '433',
                            ),
                        23 => array(
                                'group_key' => '56',
                                'key' => '434',
                            ),
                        24 => array(
                                'group_key' => '56',
                                'key' => '436',
                            ),
                        25 => array(
                                'group_key' => '56',
                                'key' => '437',
                            ),
                        26 => array(
                                'group_key' => '57',
                                'key' => '296',
                            ),
                        27 => array(
                                'group_key' => '57',
                                'key' => '306',
                            ),
                        28 => array(
                                'group_key' => '57',
                                'key' => '312',
                            ),
                        29 => array(
                                'group_key' => '57',
                                'key' => '314',
                            ),
                        30 => array(
                                'group_key' => '61',
                                'key' => '749',
                            ),
                        31 => array(
                                'group_key' => '65',
                                'key' => '782',
                            ),
                        32 => array(
                                'group_key' => '65',
                                'key' => '784',
                            ),
                        33 => array(
                                'group_key' => '67',
                                'key' => '154',
                            ),
                        34 => array(
                                'group_key' => '67',
                                'key' => '986',
                            ),
                        35 => array(
                                'group_key' => '68',
                                'key' => '174',
                            ),
                        36 => array(
                                'group_key' => '69',
                                'key' => '106',
                            ),
                        37 => array(
                                'group_key' => '70',
                                'key' => '55',
                            ),
                        38 => array(
                                'group_key' => '74',
                                'key' => '480',
                            ),
                        39 => array(
                                'group_key' => '74',
                                'key' => '91',
                            ),
                        40 => array(
                                'group_key' => '75',
                                'key' => '933',
                            ),
                        41 => array(
                                'group_key' => '77',
                                'key' => '1065',
                            ),
                        42 => array(
                                'group_key' => '77',
                                'key' => '1069',
                            ),
                        43 => array(
                                'group_key' => '77',
                                'key' => '1072',
                            ),
                        44 => array(
                                'group_key' => '77',
                                'key' => '1073',
                            ),
                        45 => array(
                                'group_key' => '77',
                                'key' => '1074',
                            ),
                        46 => array(
                                'group_key' => '77',
                                'key' => '1084',
                            ),
                        47 => array(
                                'group_key' => '77',
                                'key' => '1089',
                            ),
                        48 => array(
                                'group_key' => '77',
                                'key' => '1093',
                            ),
                        49 => array(
                                'group_key' => '77',
                                'key' => '1097',
                            ),
                        50 => array(
                                'group_key' => '8',
                                'key' => '146',
                            ),
                    ),
                'photos' => array(
                        0 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/sx1x8jz70vna41yksz03emp5k5i',
                                'image_sequence_no' => '12',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        1 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/esx3h4f6btgc4sy1mjdy3eq4s3i',
                                'image_sequence_no' => '13',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        2 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/0cs3zvh85m8m4qjkhqm2yh3ps2i',
                                'image_sequence_no' => '14',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        3 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/v038wf2hgkpz4wey3zxqj95dg2i',
                                'image_sequence_no' => '17',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        4 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/cnbn2fafd50s4r6gyd2bzh2xk6i',
                                'image_sequence_no' => '19',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        5 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/xh9wjc21fpgymx2537qf8g0xz3i',
                                'image_sequence_no' => '4',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        6 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/rdksgs4mg2974wpx834731stg0i',
                                'image_sequence_no' => '1',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        7 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/9my12z0j8b8a4967tb3ze8y870i',
                                'image_sequence_no' => '21',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        8 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/qrq97mg984c245tfbt5reech44i',
                                'image_sequence_no' => '5',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        9 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/2pb2p638d96v4ce5qyjk0j14r0i',
                                'image_sequence_no' => '15',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        10 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/bennfdaqz80z4wyvpey2bkqx95i',
                                'image_sequence_no' => '9',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        11 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/npttr7b0bjd74h6dggdtmj2wr7i',
                                'image_sequence_no' => '7',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        12 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/8z9yfddpsm7a4c22p362vw66m3i',
                                'image_sequence_no' => '3',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        13 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/gc09k7h8pwj8mpt1k3fyvtwbk7i',
                                'image_sequence_no' => '16',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        14 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/s5ab5nmx18rzm2aj4aq16t2xv5i',
                                'image_sequence_no' => '8',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        15 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/kqp6rr6rk0bh4te11teknbpnz1i',
                                'image_sequence_no' => '10',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        16 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/221jz0gf3v6b4e2qpzmjjp1ee6i',
                                'image_sequence_no' => '20',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        17 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/n4tjm14z1xqgmcjk9xwjcfkd41i',
                                'image_sequence_no' => '11',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        18 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/p0s15d3xkvha4k6p721p4chdy7i',
                                'image_sequence_no' => '2',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        19 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/at6fysgr9tjpm0t238wcy7whc5i',
                                'image_sequence_no' => '6',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                        20 => array(
                                'url' => 'http://m.sothebysrealty.com/1103i0/3y251wjvh5jw48jaxsnjbx1za1i',
                                'image_sequence_no' => '18',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                    ),
                'videos' => array(
                        0 => array(
                                'url' => 'https://424ab3360cd45b4ab42b-eaef829eae7c04fd12005cc3ad780db0.ssl.cf1.rackcdn.com/sgfd062128d6b1p_60a59984_720p.mp4',
                                'image_sequence_no' => '1',
                                'last_update_date' => '01/15/2018 17:51:39.740',
                            ),
                    ),
                'agents' => array(
                        0 => array(
                                'agent_key' => '4029965',
                            ),
                    ),
            ),
        ];
    }
}
