<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Storage\File;
use AppBundle\Entity\User\User;
use DateTime;

trait FileTrait
{
    /**
     * @param User $user
     * @param $fileData
     * @return File
     */
    public function newFile(User $user, $fileData = [])
    {
        $fileData = array_merge([
            'hash' => null,
            'size' => null,
            'mimeType' => null,
            'ext' => null,
            'fileInfo' => null,
        ], $fileData);

        $file = new File();
        $file->user = $user;
        $file->source = uniqid();
        $file->origin = 'article';
        $file->hash = $fileData['hash'] ?: hash('sha256', uniqid());
        $file->size = $fileData['size'] ?: 0;
        $file->mimeType = $fileData['mimeType'] ?: 'image/jpg';
        $file->ext = $fileData['ext'] ?: 'jpg';
        $file->fileInfo = $fileData['fileInfo'];

        return $file;
    }

    /**
     * @param User $user
     * @return File
     */
    protected function newFilePersistent(User $user)
    {
        $file = $this->newFile($user);

        $this->em->persist($file);
        $this->em->flush($file);

        return $file;
    }
}
