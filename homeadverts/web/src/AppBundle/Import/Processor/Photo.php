<?php

namespace AppBundle\Import\Processor;

use AppBundle\Import\Job\RemoveImages;
use Imagine\Exception\Exception as ImagineException;
use Symfony\Component\HttpFoundation\File\File;
use Guzzle\Http\Client;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyPhoto;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Import\Job\PrepareThumbnails;

/**
 * Downloads media associated to a property. For each photo of the property
 * we do the following.
 *
 * 1. Check to see if it exists on S3 already. If it does, we skip it.
 * 2. Downloads the image from the agent's website.
 * 3. Checks the type, filesize and dimensions of the image and validates it.
 * 4. If the image is valid we resize it to the various dimensions required.
 * 5. Each size is then uploaded to S3.
 */
class Photo extends Processor
{
    const QUALITY = 85;

    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        // todo: Something is not clear here.. FakePhotoHandler used instead.
        if ('sothebys' === $normalised->getSourceName()) {
            return;
        }

        $em = $this->app->get('em');
        $photos = $images = [];

        $totals = [
            'added' => 0,
            'deleted' => 0,
            'modified' => 0,
        ];

        // work out which images have been added, removed and updated
        foreach ($normalised->getPhotos() as $photo) {
            // check if this URL is in our photos
            foreach ($propertyObj->getPhotos() as $existingPhoto) {
                if ($this->clearFromQs($photo->url) === $this->clearFromQs($existingPhoto->sourceUrl)) {
                    if ($photo->modified !== $existingPhoto->modified) {
                        if ($url = $this->transferPhoto($propertyObj, $photo, $existingPhoto)) {
                            ++$totals['modified'];
                            $photos[] = $url;
                            $images[] = [
                                'path' => parse_url($url->url)['path'],
                                'force' => true,
                            ];
                        } else {
                            $photos[] = $existingPhoto;
                        }
                    } else {
                        $photos[] = $existingPhoto;
                    }

                    continue 2;
                }
            }

            ++$totals['added'];

            // New photo!
            $photos[] = $url = $this->transferPhoto($propertyObj, $photo, new PropertyPhoto());
            $images[] = [
                'path' => parse_url($url->url)['path'],
                'force' => false,
            ];
        }

        if (!empty($images)) {
            $this->prepareThumbs($images);
        }

        $photos = array_filter($photos);

        // Loop over old photos to find ones not in $normalised
        foreach ($propertyObj->getPhotos() as $existingPhoto) {
            $found = false;
            foreach ($photos as $photo) {
                if ($this->clearFromQs($existingPhoto->sourceUrl) === $this->clearFromQs($photo->sourceUrl)) {
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $em->remove($existingPhoto);

                $this->app
                    ->get('redis_client')
                    ->enqueue('photo_remove', RemoveImages::class, [
                    'images' => [
                        ['path' => $existingPhoto->url],
                    ],
                ]);
                ++$totals['deleted'];
            }
        }

        // Mark property for update to force ES sync
        if (array_sum($totals) > 0) {
            $this->job->log('Scheduled for update '.$propertyObj);
            //force extra update, hack due to sync between ES and SQL
            $propertyObj->dateUpdated = new \DateTime();
        }

        // Add / update new photos
        $i = 0;
        foreach ($photos as $photo) {
            $photo->sort = $i++;

            if (!isset($photo->id)) {
                $photo->setProperty($propertyObj);
            }

            $propertyObj->getPhotos()->add($photo);

            $em->persist($photo);
        }

        if (array_sum($totals) > 0) {
            $this->job->log('Photos: added '.$totals['added'].' / deleted '.$totals['deleted'].' / modified '.$totals['modified']);
        }
    }

    public function transferPhoto(Property $property, $photo, PropertyPhoto $photoObj)
    {
        // Download the image
        $filename = $this->getTemporaryFilename($photo->url, $property->id);
        $localPath = $this->app->getParameter('media_tmp').$filename;

        if (!is_dir($this->app->getParameter('media_tmp'))) {
            mkdir($this->app->getParameter('media_tmp'), 0777, true);
        }

        // Grab this from the remote
        $file = $this->download(new Client(), $photo->url, $localPath);
        if (false === $file) {
            return;
        }

        // Ensure the image is up to our standards
        if (!$this->validate($file)) {
            return;
        }

        $hash = md5_file($file);
        if ($photoObj->id && $hash === $photoObj->hash) {
            $photoObj->sourceUrl = $photo->url;
            $photoObj->modified = $photo->modified;
            $this->delete((string) $file);

            return;
        }
        $photoObj->hash = $hash;

        list($photoObj->width, $photoObj->height) = getimagesize($file);

        // Ensure we don't already have a hash of this image
        if ($property->id) {
            // foreach ($property->getPhotos() as $existingPhoto) {
            //     dump($existingPhoto->hash, $photoObj->hash);
            //     if($existingPhoto->hash === $photoObj->hash) {
            //         dump('hash found', $existingPhoto, $photo);
            //         return false;
            //     }
            // }
        }

        $uploader = $this->app->get('ha.resizer_uploader');

        try {
            $url = $uploader->process($file, $this->app->getParameter('thumbnails'), $property->id.'/', false);
        } catch (ImagineException $e) {
            $this->job->log('Imagine exception'.$e->getMessage());
            $this->delete((string) $file);

            return;
        }

        $photoObj->url = $url;
        $photoObj->sourceUrl = $photo->url;
        $photoObj->modified = $photo->modified;

        return $photoObj;
    }

    protected function prepareThumbs($images)
    {
        foreach ($images as $image) {
            $this->app
                ->get('redis_client')
                ->enqueue('thumb_process', PrepareThumbnails::class, ['images' => [$image]]);
        }
    }

    protected function download($client, $url, $path)
    {
        try {
            $response = $client
                ->get($url)
                ->setResponseBody($path)
                ->send();

            if (!$response) {
                return false;
            }

            $file = new File($path);
            $ext = $file->guessExtension();
            $file = $file->move($file->getPath(), $file->getFilename().'.'.$ext);
        } catch (\Exception $e) {
            if (file_exists($path)) {
                unlink($path);
            }

            return false;
        }

        return $file;
    }

    protected function getTemporaryFilename($url, $propertyId)
    {
        return $propertyId.'-'.sha1($url);
    }

    protected function validate(File $file)
    {
        if ($file->getSize() > 100000000) {
            return false;
        }

        return true;
    }

    protected function clearFromQs($url)
    {
        return strtok($url, '?');
    }

    public function delete($path)
    {
        if (file_exists($path)) {
            unlink($path);
        }
    }
}
