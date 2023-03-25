<?php

namespace AppBundle\Import\Media;

use AppBundle\Entity\User\User;
use AppBundle\Service\File\Storage\S3PhotoStorage;
use Symfony\Component\HttpFoundation\File\File;

class AvatarManager implements AvatarManagerInterface
{
    /**
     * @var S3PhotoStorage
     */
    private $storage;
    /**
     * @var PhotoDownloader
     */
    private $photoDownloader;

    private $mediaTmp;

    public function __construct(S3PhotoStorage $storage, PhotoDownloader $downloader, $mediaTmp)
    {
        $this->storage = $storage;
        $this->photoDownloader = $downloader;
        $this->mediaTmp = $mediaTmp;
    }

    public function process(User $user)
    {
        $url = $user->profileImage;
        $file = $this->photoDownloader->download($url, $this->getTemporaryName($url));
        $this->validate($file);
        $user->profileImage = $this->storage->save($file, $this->getPrefix($user));
    }

    private function getTemporaryName($url)
    {
        return $this->mediaTmp.'profile-'.sha1($url);
    }

    private function getPrefix(User $user)
    {
        return str_replace('3yd-RFGSIR-', '', $user->sourceRef).'/';
    }

    private function validate(File $file)
    {
        if ($file->getSize() > 100000000) {
            throw new MediaException('File is too huge');
        }
    }
}
