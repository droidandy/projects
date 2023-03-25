<?php

namespace AppBundle\Import\Job;

use AppBundle\Service\File\Hasher;
use AppBundle\Import\Media\PhotoDownloader;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Property\PropertyPhoto;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Filesystem\Filesystem;

class PhotoFix extends ResqueJob
{
    /**
     * @var Filesystem
     */
    private $filesystem;
    /**
     * @var string
     */
    private $mediaTmp;

    public function run($args, $app)
    {
        /** @var EntityManager $em */
        /** @var PhotoDownloader $photoDownloader */
        /** @var Hasher $hasher */
        $photoId = $args['photo_id'];
        $em = $app->get('em');
        $this->filesystem = $app->get('filesystem');
        $this->mediaTmp = $app->getParameter('media_tmp');
        $photoDownloader = $app->get('ha.import.photo_downloader');
        $hasher = $app->get('ha.import.hasher');

        $photo = $em->find(PropertyPhoto::class, $photoId);
        $file = $photoDownloader->download($photo->url, $this->getTemporaryName($photo->url));
        if (!$file) {
            $this->log(sprintf('Skipped %s. File Downloading error', $photo->id));

            return;
        }
        $photo->hash = $hasher->getMD5FileHash($file);
        list($photo->width, $photo->height) = getimagesize($file);
        $this->log(sprintf('Photo %s  %s %s %sx%s', $photo->id, $photo->url, $photo->hash, $photo->width, $photo->height));

        $em->persist($photo);
        $em->flush();
        $this->deleteFile($file);
    }

    private function deleteFile(File $file)
    {
        $this->filesystem->remove($file);
    }

    private function getTemporaryName($url)
    {
        return $this->mediaTmp.uniqid().'-'.sha1($url);
    }
}
