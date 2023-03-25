<?php

namespace AppBundle\Service\File;

use Symfony\Component\HttpFoundation\File\File;

class Hasher
{
    /**
     * @param File $file
     *
     * @return string
     */
    public function getMD5FileHash(File $file)
    {
        return md5_file($file->getPathname());
    }
}
