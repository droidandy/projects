<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Favourite;

trait FavouriteTrait
{
    public function newFavourite($favouriteData)
    {
        return new Favourite($favouriteData['user'], $favouriteData['item']);
    }
}
