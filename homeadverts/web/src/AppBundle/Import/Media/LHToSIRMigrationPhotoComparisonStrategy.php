<?php

namespace AppBundle\Import\Media;

use AppBundle\Entity\Property\PropertyPhoto;

class LHToSIRMigrationPhotoComparisonStrategy implements PhotoComparisonStrategyInterface
{
    public function isEqual($photo, PropertyPhoto $existingPhoto)
    {
        $sourceUrl = $existingPhoto->getSourceUrl();
        if ($this->isUrlsEqual($sourceUrl, $photo->url)) {
            return true;
        } elseif ($this->isLHAndSIRIndicesEqual($sourceUrl, $photo)) {
            return true;
        }

        return false;
    }

    private function isUrlsEqual($sourceUrl, $photoUrl)
    {
        return $sourceUrl == $photoUrl;
    }

    private function isLHAndSIRIndicesEqual($sourceUrl, $photo)
    {
        if (false === strpos($sourceUrl, 'photos.listhub.net')) {
            return false;
        }
        preg_match('#http:\/\/photos.listhub.net\/RFGSIR\/\w+\/(\d+)#i', $sourceUrl, $matches);
        if (!empty($matches[1])) {
            $no = $matches[1];
            if ($photo->index == $no) {
                return true;
            } else {
                return false;
            }
        } else {
            throw new \RuntimeException('Url is misformed');
        }
    }
}
