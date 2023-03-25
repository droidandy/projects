<?php

namespace AppBundle\Import\Media;

use AppBundle\Entity\Property\PropertyPhoto;

interface PhotoComparisonStrategyInterface
{
    /**
     * @param $photoIndex
     * @param $photo
     * @param $existingPhoto
     *
     * @return mixed
     */
    public function isEqual($photoIndex, PropertyPhoto $existingPhoto);
}
