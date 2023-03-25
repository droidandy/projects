<?php

namespace AppBundle\Service\File\Storage;

use AppBundle\Service\File\ResizerUploader;
use Monolog\Logger;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;

class S3PhotoStorage
{
    /**
     * @var ResizerUploader
     */
    private $uploader;
    /**
     * @var Filesystem
     */
    private $filesystem;
    /**
     * @var Logger
     */
    private $logger;

    public function __construct(ResizerUploader $uploader, Filesystem $filesystem, Logger $logger)
    {
        $this->uploader = $uploader;
        $this->filesystem = $filesystem;
        $this->logger = $logger;
    }

    public function save(File $file, $pathPrefix)
    {
        $this->logger->debug(sprintf('Uploading file %s to %s', $file->getPathname(), $pathPrefix));
        $absolutePath = $this->uploader->process($file, [], $pathPrefix, false);
        $this->secureFileDeleted($file);

        return $absolutePath;
    }

    private function secureFileDeleted(File $file)
    {
        $path = $file->getPathname();
        if ($this->filesystem->exists($path)) {
            $this->filesystem->remove($path);
        }
    }
}
