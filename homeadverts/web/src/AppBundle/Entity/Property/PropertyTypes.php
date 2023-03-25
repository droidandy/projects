<?php

namespace AppBundle\Entity\Property;

/**
 * @author Ivan Proskuryakov <volgodark@gmail.com>
 */
class PropertyTypes
{
    const UNKNOWN = -1000;
    const DETACHED = 100;
    const SEMI_DETACHED = 200;
    const APARTMENT = 300;
    const TOWNHOUSE = 400;
    const MOVABLE = 500;
    const CHARACTER = 600;
    const COMMERCIAL = 700;
    const FARM = 800;
    const LAND = 900;
    const OTHER = 1000;

    const ISLAND = 1100;
    const RENTAL = 1200;
    const RESIDENTIAL = 1300;
    const COMMON_INTEREST = 1400;
    const MULTI_FAMILY = 1500;

    const DETACHED_SLUG = 'detached';
    const SEMI_DETACHED_SLUG = 'semi-detached';
    const APARTMENT_SLUG = 'flat-apartment';
    const TOWNHOUSE_SLUG = 'townhouse';
    const MOVABLE_SLUG = 'movable';
    const CHARACTER_SLUG = 'character';
    const COMMERCIAL_SLUG = 'commercial';
    const FARM_SLUG = 'farm-ranch';
    const LAND_SLUG = 'land';
    const ISLAND_SLUG = 'island';
    const OTHER_SLUG = 'other';
    const UNKNOWN_SLUG = 'unknown';

    const DETACHED_TITLE = 'Detached';
    const SEMI_DETACHED_TITLE = 'Semi-detached';
    const APARTMENT_TITLE = 'Flat/Apartment';
    const TOWNHOUSE_TITLE = 'Townhouse';
    const MOVABLE_TITLE = 'Movable';
    const CHARACTER_TITLE = 'Character';
    const COMMERCIAL_TITLE = 'Commercial';
    const FARM_TITLE = 'Farm/Ranch';
    const LAND_TITLE = 'Land';
    const ISLAND_TITLE = 'Island';
    const OTHER_TITLE = 'Other';
    const UNKNOWN_TITLE = 'Unknown';

    /**
     * Return array of property titles.
     *
     * @return array
     */
    public static function getCodeTitleMapping()
    {
        return [
            self::DETACHED => self::DETACHED_TITLE,
            self::SEMI_DETACHED => self::SEMI_DETACHED_TITLE,
            self::APARTMENT => self::APARTMENT_TITLE,
            self::TOWNHOUSE => self::TOWNHOUSE_TITLE,
            self::MOVABLE => self::MOVABLE_TITLE,
            self::CHARACTER => self::CHARACTER_TITLE,
            self::COMMERCIAL => self::COMMERCIAL_TITLE,
            self::FARM => self::FARM_TITLE,
            self::LAND => self::LAND_TITLE,
            self::ISLAND => self::ISLAND_TITLE,
            self::OTHER => self::OTHER_TITLE,
            self::UNKNOWN => self::UNKNOWN_TITLE,
        ];
    }

    /**
     * Return array of property slugs.
     *
     * @return array
     */
    public static function getCodeSlugMapping()
    {
        return [
            self::DETACHED => self::DETACHED_SLUG,
            self::SEMI_DETACHED => self::SEMI_DETACHED_SLUG,
            self::APARTMENT => self::APARTMENT_SLUG,
            self::TOWNHOUSE => self::TOWNHOUSE_SLUG,
            self::MOVABLE => self::MOVABLE_SLUG,
            self::CHARACTER => self::CHARACTER_SLUG,
            self::COMMERCIAL => self::COMMERCIAL_SLUG,
            self::FARM => self::FARM_SLUG,
            self::LAND => self::LAND_SLUG,
            self::ISLAND => self::ISLAND_SLUG,
            self::OTHER => self::OTHER_SLUG,
            self::UNKNOWN => self::UNKNOWN_SLUG,
        ];
    }

    /**
     * @param int $id
     *
     * @return string|bool
     */
    public static function getById($id)
    {
        $types = self::getCodeTitleMapping();

        if (isset($types[$id])) {
            return $types[$id];
        }

        return false;
    }

    /**
     * @param string $slug
     *
     * @return string|bool
     */
    public static function getBySlug($slug)
    {
        $types = array_flip(self::getCodeTitleMapping());

        if (isset($types[$slug])) {
            return $types[$slug];
        }

        return false;
    }
}
