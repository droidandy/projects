<?php

namespace AppBundle\Service\File\Storage;

use AppBundle\Entity\Storage\File;

interface FileStorageInterface
{
    /**
     * @param File $file
     *
     * @return string
     */
    public function save(File $file);
}
