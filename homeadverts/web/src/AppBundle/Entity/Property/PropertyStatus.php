<?php

namespace AppBundle\Entity\Property;

use JMS\DiExtraBundle\Annotation\Service;

/**
 * @Service("property_status")
 */
class PropertyStatus
{
    const DELETED = -100;
    const INVALID = -10;
    const INCOMPLETE = 0;
    const INACTIVE = 50;
    const ACTIVE = 100;

    const DELETED_SLUG = 'deleted';
    const INVALID_SLUG = 'invalid';
    const INCOMPLETE_SLUG = 'incomplete';
    const INACTIVE_SLUG = 'inactive';
    const ACTIVE_SLUG = 'active';

    public function idToSlug($id)
    {
        $slugs = $this->getSlugs();

        return isset($slugs[$id]) ? $slugs[$id] : false;
    }

    public function getSlugs()
    {
        return [
            self::DELETED => self::DELETED_SLUG,
            self::INVALID => self::INVALID_SLUG,
            self::INCOMPLETE => self::INCOMPLETE_SLUG,
            self::INACTIVE => self::INACTIVE_SLUG,
            self::ACTIVE => self::ACTIVE_SLUG,
        ];
    }
}
