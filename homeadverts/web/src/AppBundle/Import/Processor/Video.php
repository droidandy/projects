<?php

namespace AppBundle\Import\Processor;

use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Entity\Property\PropertyVideo;

/**
 * Downloads video associated to a property.
 */
class Video extends Processor
{
    /**
     * @param NormalisedPropertyInterface $normalised
     * @param $propertyObj
     *
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        $em = $this->app->get('em');
        $feedVideos = $normalised->getVideos();
        $propertyVideos = $propertyObj->getVideos()->toArray();
        $existingIndexes = [];

        $this->job->log('Count of videos '.count($feedVideos));

        foreach ($feedVideos as $i => $video) {
            foreach ($propertyVideos as $j => $existingVideo) {
                if ($video->url == $existingVideo->url) {
                    unset($feedVideos[$i]);
                    $existingIndexes[] = $j;
                }
            }
        }
        foreach ($feedVideos as $feedVideo) {
            $video = new PropertyVideo();
            $video->url = $feedVideo->url;
            $this->job->log('Url '.$feedVideo->url);
            $video->property = $propertyObj;
            if (!empty($feedVideo->metadata)) {
                $video->metadata = $feedVideo->metadata;
            }
            $propertyObj->getVideos()->add($video);
            $em->persist($video);
        }

        foreach ($propertyVideos as $i => $propertyVideo) {
            if (!in_array($i, $existingIndexes)) {
                $em->remove($propertyVideos[$i]);
            }
        }

        $em->flush();
    }
}
