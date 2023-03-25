<?php

namespace AppBundle\Import\Media;

use AppBundle\Entity\Property\PropertyPhoto;
use AppBundle\Service\File\Hasher;
use AppBundle\Service\File\Storage\S3PhotoStorage;
use Symfony\Component\HttpFoundation\File\File;

class PhotoManager
{
    /**
     * @var S3PhotoStorage
     */
    private $storage;
    /**
     * @var PhotoDownloader
     */
    private $photoDownloader;
    /**
     * @var Hasher
     */
    private $hasher;

    private $mediaTmp;

    public function __construct(
        S3PhotoStorage $storage,
        PhotoDownloader $photoDownloader,
        Hasher $hasher,
        $mediaTmp
    ) {
        $this->storage = $storage;
        $this->mediaTmp = rtrim($mediaTmp, '/').'/';
        $this->photoDownloader = $photoDownloader;
        $this->hasher = $hasher;
    }

    public function process(PropertyPhoto $photo)
    {
        $url = $photo->getSourceUrl();
        $file = $this->photoDownloader->download($url, $this->getTemporaryName($photo));
        $this->validate($file);
        $photo->hash = $this->hasher->getMD5FileHash($file);
        list($photo->width, $photo->height) = $this->getImageSize($file);
        $absolutePath = $this->saveToStorage($file, $photo);
        $photo->url = $absolutePath;
    }

    protected function getImageSize(File $file)
    {
        return getimagesize($file);
    }

    private function getTemporaryName(PropertyPhoto $photo)
    {
        return $this->mediaTmp.$photo->getProperty()->id.'-'.sha1($photo->getSourceUrl());
    }

    private function validate(File $file)
    {
        if ($file->getSize() > 100000000) {
            throw new MediaException('File is too huge');
        }
    }

    private function saveToStorage($file, $photo)
    {
        return $this->storage->save($file, $this->getStoragePrefix($photo));
    }

    private function getStoragePrefix(PropertyPhoto $photo)
    {
        return $photo->getProperty()->id.'/';
    }
}
