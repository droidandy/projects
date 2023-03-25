<?php

namespace AppBundle\Serializer\Constructor;

interface UniqueFieldConstructableInterface
{
    /**
     * @return string
     */
    public static function getUniqueFieldName();
}
