<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys;

use AppBundle\Import\Adapter\Sothebys\FeedUserIterator;
use Test\AppBundle\Import_\Adapter\Sothebys\Mock\HydratorMockStatement;

class FeedUserIteratorTest extends \PHPUnit_Framework_TestCase
{
    public function testTraversity()
    {
        $rows = [
            [
                'sa_agent_guid' => '0010846E-1136-4AAE-8A7F-F255648AC167',
                'sa_agent_key' => '62962590',
                'sa_first_name' => 'Fran',
                'sa_last_name' => 'Segal',
                'so_office_name' => 'Lew Geffen Sotheby\'s International Realty',
                'so_phone_1' => '+ 27 21 439 3903',
                'so_address_1' => 'Shop 3 Mimosa Arcade',
                'so_city' => 'Cape Town',
                'so_country_iso_code' => 'ZA',
                'so_postal_code' => '8005',
                'so_state_iso_code' => 'WC',
                'sap_profile' => null,
                'sap_language_code' => null,
                'sawa_web_url' => null,
                'sawa_web_address_type_name' => null,
                'sae_email' => 'fran@sothebysrealty.co.za',
                'sae_email_type_key' => '1',
                'saph_phone_no' => '+27 21 439 3903',
                'saph_phone_type' => '2',
                'samo_media_category_type' => '5',
                'samo_image_sequence_no' => '1',
                'samo_url' => 'http://m.sothebysrealty.com/302i0/nvfahjd4vn8tm463s54rm7zt47i',
            ],
            [
                'sa_agent_guid' => '0010846E-1136-4AAE-8A7F-F255648AC167',
                'sa_agent_key' => '62962590',
                'sa_first_name' => 'Fran',
                'sa_last_name' => 'Segal',
                'so_office_name' => 'Lew Geffen Sotheby\'s International Realty',
                'so_phone_1' => '+ 27 21 439 3903',
                'so_address_1' => 'Shop 3 Mimosa Arcade',
                'so_city' => 'Cape Town',
                'so_country_iso_code' => 'ZA',
                'so_postal_code' => '8005',
                'so_state_iso_code' => 'WC',
                'sap_profile' => null,
                'sap_language_code' => null,
                'sawa_web_url' => null,
                'sawa_web_address_type_name' => null,
                'sae_email' => 'fran.segal@sothebysrealty.com',
                'sae_email_type_key' => '3',
                'saph_phone_no' => '+27 21 439 3903',
                'saph_phone_type' => '2',
                'samo_media_category_type' => '5',
                'samo_image_sequence_no' => '1',
                'samo_url' => 'http://m.sothebysrealty.com/302i0/nvfahjd4vn8tm463s54rm7zt47i',
            ],
            [
                'sa_agent_guid' => '0010846E-1136-4AAE-8A7F-F255648AC167',
                'sa_agent_key' => '62962590',
                'sa_first_name' => 'Fran',
                'sa_last_name' => 'Segal',
                'so_office_name' => 'Lew Geffen Sotheby\'s International Realty',
                'so_phone_1' => '+ 27 21 439 3903',
                'so_address_1' => 'Shop 3 Mimosa Arcade',
                'so_city' => 'Cape Town',
                'so_country_iso_code' => 'ZA',
                'so_postal_code' => '8005',
                'so_state_iso_code' => 'WC',
                'sap_profile' => null,
                'sap_language_code' => null,
                'sawa_web_url' => null,
                'sawa_web_address_type_name' => null,
                'sae_email' => 'fran@sothebysrealty.co.za',
                'sae_email_type_key' => '1',
                'saph_phone_no' => '+27 84 983 5278',
                'saph_phone_type' => '9',
                'samo_media_category_type' => '5',
                'samo_image_sequence_no' => '1',
                'samo_url' => 'http://m.sothebysrealty.com/302i0/nvfahjd4vn8tm463s54rm7zt47i',
            ],
            [
                'sa_agent_guid' => '0010846E-1136-4AAE-8A7F-F255648AC167',
                'sa_agent_key' => '62962590',
                'sa_first_name' => 'Fran',
                'sa_last_name' => 'Segal',
                'so_office_name' => 'Lew Geffen Sotheby\'s International Realty',
                'so_phone_1' => '+ 27 21 439 3903',
                'so_address_1' => 'Shop 3 Mimosa Arcade',
                'so_city' => 'Cape Town',
                'so_country_iso_code' => 'ZA',
                'so_postal_code' => '8005',
                'so_state_iso_code' => 'WC',
                'sap_profile' => null,
                'sap_language_code' => null,
                'sawa_web_url' => null,
                'sawa_web_address_type_name' => null,
                'sae_email' => 'fran.segal@sothebysrealty.com',
                'sae_email_type_key' => '3',
                'saph_phone_no' => '+27 84 983 5278',
                'saph_phone_type' => '9',
                'samo_media_category_type' => '5',
                'samo_image_sequence_no' => '1',
                'samo_url' => 'http://m.sothebysrealty.com/302i0/nvfahjd4vn8tm463s54rm7zt47i',
            ],
        ];

        $output = [
            [
                'agent_guid' => '0010846E-1136-4AAE-8A7F-F255648AC167',
                'agent_key' => '62962590',
                'first_name' => 'Fran',
                'last_name' => 'Segal',
                'office_name' => 'Lew Geffen Sotheby\'s International Realty',
                'phone_1' => '+ 27 21 439 3903',
                'address_1' => 'Shop 3 Mimosa Arcade',
                'city' => 'Cape Town',
                'country_iso_code' => 'ZA',
                'postal_code' => '8005',
                'state_iso_code' => 'WC',
                'descriptions' => [],
                'urls' => [],
                'emails' => [
                        [
                            'email' => 'fran@sothebysrealty.co.za',
                            'email_type_key' => '1',
                        ],
                        [
                            'email' => 'fran.segal@sothebysrealty.com',
                            'email_type_key' => '3',
                        ],
                    ],
                'phones' => [
                        [
                            'phone_no' => '+27 21 439 3903',
                            'phone_type' => '2',
                        ],
                        [
                            'phone_no' => '+27 84 983 5278',
                            'phone_type' => '9',
                        ],
                    ],
                'photos' => [
                        [
                            'media_category_type' => '5',
                            'image_sequence_no' => '1',
                            'url' => 'http://m.sothebysrealty.com/302i0/nvfahjd4vn8tm463s54rm7zt47i',
                        ],
                    ],
            ],
        ];

        $stmt = new HydratorMockStatement($rows);
        $it = new FeedUserIterator($stmt);
        foreach ($it as $key => $item) {
            $this->assertEquals($output[$key], $item);
        }
    }

    public function testEmptySet()
    {
        $rows = [];

        $stmt = new HydratorMockStatement($rows);
        $it = new FeedUserIterator($stmt);

        $i = 0;
        foreach ($it as $item) {
            ++$i;
        }
        $this->assertEquals(0, $i);
    }
}
