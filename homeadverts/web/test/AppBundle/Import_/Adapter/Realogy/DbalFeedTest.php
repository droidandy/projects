<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys;

use AppBundle\Import\Adapter\Sothebys\DbalFeed;
use AppBundle\Import\Adapter\Sothebys\FeedPropertyIterator;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Statement;
use Monolog\Logger;

class DbalFeedTest extends \PHPUnit_Framework_TestCase
{
    public function testGetPropertiesNoLimits()
    {
        $statement = $this->getStatement();
        $logger = $this->getLogger();
        $conn = $this->getConnection();
        $conn
            ->expects($this->once())
            ->method('executeQuery')
            ->with(
                <<<SQL
            SELECT
                srl.listing_guid srl_listing_guid,
                srl.mls_id srl_mls_id,
                srl.listing_id srl_listing_id,
                srl.listing_status srl_listing_status,
                srl.address1 srl_address1,
                srl.address2 srl_address2,
                srl.address3 srl_address3,
                srl.latitude srl_latitude,
                srl.longitude srl_longitude,
                srl.bedrooms srl_bedrooms,
                srl.full_bath srl_full_bath,
                srl.half_bath srl_half_bath,
                srl.three_quarter_bath srl_three_quarter_bath,
                srl.neighborhood_name srl_neighborhood_name,
                srl.city srl_city,
                srl.country_iso_code srl_country_iso_code,
                srl.state_iso_code srl_state_iso_code,
                srl.postal_code srl_postal_code,
                srl.show_address srl_show_address,
                srl.listing_type srl_listing_type,
                srl.property_type srl_property_type,
                srl.property_subtype srl_property_subtype,
                srl.list_price srl_list_price,
                srl.show_list_price srl_show_list_price,
                srl.expiration_date srl_expiration_date,
                srl.currency_code srl_currency_code,
                srl.year_built srl_year_built,
                srl.building_area srl_building_area,
                srl.building_area_uom srl_building_area_uom,
                srl.lot_size srl_lot_size,
                srl.lot_size_uom srl_lot_size_uom,
                srl.source_listing_url srl_source_listing_url,
                srl.last_update_date srl_last_update_date,
                srlr.property_remark srlr_property_remark,
                srlr.language_code srlr_language_code,
                srlpf.feature_group_key srlpf_feature_group_key,
                srlpf.feature_key srlpf_feature_key,
                srlom.url srom_url,
                srlom.image_sequence_no srom_image_sequence_no,
                srlom.last_update_date srom_last_update_date,
                srlvid.url srlvid_url,
                srlvid.image_sequence_no srlvid_image_sequence_no,
                srlvid.last_update_date srlvid_last_update_date,
                sa.agent_key sa_agent_key
            FROM sir_residential_listing srl
            LEFT JOIN sir_residential_listing_media_original srlom ON srl.listing_guid = srlom.listing_guid AND srlom.media_category_type = '1'
            LEFT JOIN sir_residential_listing_media_original srlvid ON srl.listing_guid = srlvid.listing_guid AND (srlvid.media_category_type = '2' OR srlvid.media_category_type = '24')
            LEFT JOIN sir_residential_listing_remark srlr ON srl.listing_guid = srlr.listing_guid AND srlr.remark_key = '14'
            LEFT JOIN sir_residential_listing_prop_features srlpf ON srl.listing_guid = srlpf.listing_guid
            INNER JOIN sir_residential_listing_agent_details srlad ON srl.listing_guid = srlad.listing_guid
            INNER JOIN sir_agent sa ON srlad.agent_guid = sa.agent_guid WHERE srl.list_price > 5000000
SQL
            )
            ->willReturn($statement)
        ;
        $dbalFeed = $this->getDbalFeed($conn, $logger);
        $this->assertEquals($this->getFeedPropertiesIterator($statement), $dbalFeed->getProperties());
    }

    public function testGetPropertiesWithLimits()
    {
        $logger = $this->getLogger();

        $distinctStatement = $this->getStatement();
        $distinctStatement
            ->expects($this->exactly(6))
            ->method('fetchColumn')
            ->with(0)
            ->willReturnOnConsecutiveCalls(
                '257D1819-A4D7-40A0-A02F-57FE16780D3E',
                '6A6CBA3B-F3D7-4460-A92C-4401015F7828',
                'ABE5286A-D53B-46AB-97FF-BDD56CFEDA7C',
                'E28BCEA5-9408-409E-8CE0-78ED783A19D8',
                'D3BF5D85-9A32-45F8-9067-AE80987268F5',
                false
            )
        ;
        $statement = $this->getStatement();
        $conn = $this->getConnection();
        $conn
            ->expects($this->exactly(2))
            ->method('executeQuery')
            ->withConsecutive(
                [<<<SQL
            SELECT
                DISTINCT srl.listing_guid srl_listing_guid
            FROM sir_residential_listing srl
            LEFT JOIN sir_residential_listing_media_original srlom ON srl.listing_guid = srlom.listing_guid AND srlom.media_category_type = '1'
            LEFT JOIN sir_residential_listing_media_original srlvid ON srl.listing_guid = srlvid.listing_guid AND (srlvid.media_category_type = '2' OR srlvid.media_category_type = '24')
            LEFT JOIN sir_residential_listing_remark srlr ON srl.listing_guid = srlr.listing_guid AND srlr.remark_key = '14'
            LEFT JOIN sir_residential_listing_prop_features srlpf ON srl.listing_guid = srlpf.listing_guid
            INNER JOIN sir_residential_listing_agent_details srlad ON srl.listing_guid = srlad.listing_guid
            INNER JOIN sir_agent sa ON srlad.agent_guid = sa.agent_guid WHERE srl.list_price > 5000000 LIMIT 0, 5
SQL
            ],
            [<<<SQL
            SELECT
                srl.listing_guid srl_listing_guid,
                srl.mls_id srl_mls_id,
                srl.listing_id srl_listing_id,
                srl.listing_status srl_listing_status,
                srl.address1 srl_address1,
                srl.address2 srl_address2,
                srl.address3 srl_address3,
                srl.latitude srl_latitude,
                srl.longitude srl_longitude,
                srl.bedrooms srl_bedrooms,
                srl.full_bath srl_full_bath,
                srl.half_bath srl_half_bath,
                srl.three_quarter_bath srl_three_quarter_bath,
                srl.neighborhood_name srl_neighborhood_name,
                srl.city srl_city,
                srl.country_iso_code srl_country_iso_code,
                srl.state_iso_code srl_state_iso_code,
                srl.postal_code srl_postal_code,
                srl.show_address srl_show_address,
                srl.listing_type srl_listing_type,
                srl.property_type srl_property_type,
                srl.property_subtype srl_property_subtype,
                srl.list_price srl_list_price,
                srl.show_list_price srl_show_list_price,
                srl.expiration_date srl_expiration_date,
                srl.currency_code srl_currency_code,
                srl.year_built srl_year_built,
                srl.building_area srl_building_area,
                srl.building_area_uom srl_building_area_uom,
                srl.lot_size srl_lot_size,
                srl.lot_size_uom srl_lot_size_uom,
                srl.source_listing_url srl_source_listing_url,
                srl.last_update_date srl_last_update_date,
                srlr.property_remark srlr_property_remark,
                srlr.language_code srlr_language_code,
                srlpf.feature_group_key srlpf_feature_group_key,
                srlpf.feature_key srlpf_feature_key,
                srlom.url srom_url,
                srlom.image_sequence_no srom_image_sequence_no,
                srlom.last_update_date srom_last_update_date,
                srlvid.url srlvid_url,
                srlvid.image_sequence_no srlvid_image_sequence_no,
                srlvid.last_update_date srlvid_last_update_date,
                sa.agent_key sa_agent_key
            FROM sir_residential_listing srl
            LEFT JOIN sir_residential_listing_media_original srlom ON srl.listing_guid = srlom.listing_guid AND srlom.media_category_type = '1'
            LEFT JOIN sir_residential_listing_media_original srlvid ON srl.listing_guid = srlvid.listing_guid AND (srlvid.media_category_type = '2' OR srlvid.media_category_type = '24')
            LEFT JOIN sir_residential_listing_remark srlr ON srl.listing_guid = srlr.listing_guid AND srlr.remark_key = '14'
            LEFT JOIN sir_residential_listing_prop_features srlpf ON srl.listing_guid = srlpf.listing_guid
            INNER JOIN sir_residential_listing_agent_details srlad ON srl.listing_guid = srlad.listing_guid
            INNER JOIN sir_agent sa ON srlad.agent_guid = sa.agent_guid WHERE srl.listing_guid IN (?)
SQL
            , [['257D1819-A4D7-40A0-A02F-57FE16780D3E', '6A6CBA3B-F3D7-4460-A92C-4401015F7828', 'ABE5286A-D53B-46AB-97FF-BDD56CFEDA7C', 'E28BCEA5-9408-409E-8CE0-78ED783A19D8', 'D3BF5D85-9A32-45F8-9067-AE80987268F5']], [Connection::PARAM_STR_ARRAY],
            ]
            )
            ->willReturnOnConsecutiveCalls($distinctStatement, $statement)
        ;

        $dbalFeed = $this->getDbalFeed($conn, $logger);
        $this->assertEquals($this->getFeedPropertiesIterator($statement), $dbalFeed->getProperties(0, 5));
    }

    public function testGetPropertiesWithLimitsNoOffset()
    {
        $logger = $this->getLogger();

        $distinctStatement = $this->getStatement();
        $distinctStatement
            ->expects($this->exactly(6))
            ->method('fetchColumn')
            ->with(0)
            ->willReturnOnConsecutiveCalls(
                '257D1819-A4D7-40A0-A02F-57FE16780D3E',
                '6A6CBA3B-F3D7-4460-A92C-4401015F7828',
                'ABE5286A-D53B-46AB-97FF-BDD56CFEDA7C',
                'E28BCEA5-9408-409E-8CE0-78ED783A19D8',
                'D3BF5D85-9A32-45F8-9067-AE80987268F5',
                false
            )
        ;
        $statement = $this->getStatement();
        $conn = $this->getConnection();
        $conn
            ->expects($this->exactly(2))
            ->method('executeQuery')
            ->withConsecutive(
                [<<<SQL
            SELECT
                DISTINCT srl.listing_guid srl_listing_guid
            FROM sir_residential_listing srl
            LEFT JOIN sir_residential_listing_media_original srlom ON srl.listing_guid = srlom.listing_guid AND srlom.media_category_type = '1'
            LEFT JOIN sir_residential_listing_media_original srlvid ON srl.listing_guid = srlvid.listing_guid AND (srlvid.media_category_type = '2' OR srlvid.media_category_type = '24')
            LEFT JOIN sir_residential_listing_remark srlr ON srl.listing_guid = srlr.listing_guid AND srlr.remark_key = '14'
            LEFT JOIN sir_residential_listing_prop_features srlpf ON srl.listing_guid = srlpf.listing_guid
            INNER JOIN sir_residential_listing_agent_details srlad ON srl.listing_guid = srlad.listing_guid
            INNER JOIN sir_agent sa ON srlad.agent_guid = sa.agent_guid WHERE srl.list_price > 5000000 LIMIT 5
SQL
            ],
            [<<<SQL
            SELECT
                srl.listing_guid srl_listing_guid,
                srl.mls_id srl_mls_id,
                srl.listing_id srl_listing_id,
                srl.listing_status srl_listing_status,
                srl.address1 srl_address1,
                srl.address2 srl_address2,
                srl.address3 srl_address3,
                srl.latitude srl_latitude,
                srl.longitude srl_longitude,
                srl.bedrooms srl_bedrooms,
                srl.full_bath srl_full_bath,
                srl.half_bath srl_half_bath,
                srl.three_quarter_bath srl_three_quarter_bath,
                srl.neighborhood_name srl_neighborhood_name,
                srl.city srl_city,
                srl.country_iso_code srl_country_iso_code,
                srl.state_iso_code srl_state_iso_code,
                srl.postal_code srl_postal_code,
                srl.show_address srl_show_address,
                srl.listing_type srl_listing_type,
                srl.property_type srl_property_type,
                srl.property_subtype srl_property_subtype,
                srl.list_price srl_list_price,
                srl.show_list_price srl_show_list_price,
                srl.expiration_date srl_expiration_date,
                srl.currency_code srl_currency_code,
                srl.year_built srl_year_built,
                srl.building_area srl_building_area,
                srl.building_area_uom srl_building_area_uom,
                srl.lot_size srl_lot_size,
                srl.lot_size_uom srl_lot_size_uom,
                srl.source_listing_url srl_source_listing_url,
                srl.last_update_date srl_last_update_date,
                srlr.property_remark srlr_property_remark,
                srlr.language_code srlr_language_code,
                srlpf.feature_group_key srlpf_feature_group_key,
                srlpf.feature_key srlpf_feature_key,
                srlom.url srom_url,
                srlom.image_sequence_no srom_image_sequence_no,
                srlom.last_update_date srom_last_update_date,
                srlvid.url srlvid_url,
                srlvid.image_sequence_no srlvid_image_sequence_no,
                srlvid.last_update_date srlvid_last_update_date,
                sa.agent_key sa_agent_key
            FROM sir_residential_listing srl
            LEFT JOIN sir_residential_listing_media_original srlom ON srl.listing_guid = srlom.listing_guid AND srlom.media_category_type = '1'
            LEFT JOIN sir_residential_listing_media_original srlvid ON srl.listing_guid = srlvid.listing_guid AND (srlvid.media_category_type = '2' OR srlvid.media_category_type = '24')
            LEFT JOIN sir_residential_listing_remark srlr ON srl.listing_guid = srlr.listing_guid AND srlr.remark_key = '14'
            LEFT JOIN sir_residential_listing_prop_features srlpf ON srl.listing_guid = srlpf.listing_guid
            INNER JOIN sir_residential_listing_agent_details srlad ON srl.listing_guid = srlad.listing_guid
            INNER JOIN sir_agent sa ON srlad.agent_guid = sa.agent_guid WHERE srl.listing_guid IN (?)
SQL
            , [['257D1819-A4D7-40A0-A02F-57FE16780D3E', '6A6CBA3B-F3D7-4460-A92C-4401015F7828', 'ABE5286A-D53B-46AB-97FF-BDD56CFEDA7C', 'E28BCEA5-9408-409E-8CE0-78ED783A19D8', 'D3BF5D85-9A32-45F8-9067-AE80987268F5']], [Connection::PARAM_STR_ARRAY],
            ]
            )
            ->willReturnOnConsecutiveCalls($distinctStatement, $statement)
        ;

        $dbalFeed = $this->getDbalFeed($conn, $logger);
        $this->assertEquals($this->getFeedPropertiesIterator($statement), $dbalFeed->getProperties(null, 5));
    }

    /** @expectedException \RuntimeException */
    public function testGetPropertiesNoLimitsWithOffset()
    {
        $logger = $this->getLogger();

        $distinctStatement = $this->getStatement();
        $distinctStatement
            ->expects($this->never())
            ->method('fetchColumn')
        ;
        $conn = $this->getConnection();
        $conn
            ->expects($this->never())
            ->method('executeQuery')
        ;

        $dbalFeed = $this->getDbalFeed($conn, $logger);
        $dbalFeed->getProperties(5, null);
    }

    private function getDbalFeed(Connection $conn, Logger $logger)
    {
        return new DbalFeed($conn, $logger);
    }

    private function getConnection()
    {
        return $this->getMockBuilder(Connection::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getLogger()
    {
        return $this->getMockBuilder(Logger::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getStatement()
    {
        return $this->getMockBuilder(Statement::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getFeedPropertiesIterator(Statement $statement)
    {
        return new FeedPropertyIterator($statement);
    }
}
