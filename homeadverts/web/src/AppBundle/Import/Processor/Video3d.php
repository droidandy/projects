<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Property\PropertyVideo3d;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;

class Video3d extends Processor
{
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        $em = $this->app->get('em');
        $feedVideos3d = $normalised->getVideos3d();
        $propertyVideos3d = $propertyObj->getVideos3d()->toArray();

        $this->job->log('Count of 3d videos '.count($feedVideos3d));

        $existingIndexes = [];

        foreach ($feedVideos3d as $i => $video3d) {
            foreach ($propertyVideos3d as $j => $existingVideo3d) {
                if ($video3d->url == $existingVideo3d->url) {
                    unset($feedVideos3d[$i]);
                    $existingIndexes[] = $j;
                }
            }
        }

        foreach ($feedVideos3d as $feedVideo3d) {
            $video3d = new PropertyVideo3d();
            $video3d->url = $feedVideo3d->url;
            $this->job->log('Url '.$feedVideo3d->url);
            $video3d->property = $propertyObj;

            if (!empty($feedVideo3d->metadata)) {
                $video3d->metadata = $feedVideo3d->metadata;
            }

            $propertyObj->getVideos3d()->add($video3d);
            $em->persist($video3d);
        }

        foreach ($propertyVideos3d as $i => $propertyVideo3d) {
            if (!in_array($i, $existingIndexes)) {
                $em->remove($propertyVideos3d[$i]);
            }
        }

        $em->flush();
    }
}
