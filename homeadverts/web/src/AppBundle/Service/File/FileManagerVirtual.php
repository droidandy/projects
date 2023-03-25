<?php

namespace AppBundle\Service\File;

use AppBundle\Entity\Storage\File;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Aws\Result;

class FileManagerVirtual
{
    /**
     * @var EntityRepository
     */
    private $fileRepo;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var TokenStorage
     */
    private $tokenStorage;

    /**
     * @param EntityRepository $fileRepo
     * @param EntityManager    $em
     * @param TokenStorage     $tokenStorage
     */
    public function __construct(
        EntityRepository $fileRepo,
        EntityManager $em,
        TokenStorage $tokenStorage
    ) {
        $this->fileRepo = $fileRepo;
        $this->em = $em;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @param array  $urls
     * @param string $origin
     *
     * @return File[]
     */
    public function save(array $urls, $origin)
    {
        $files = [];

        foreach ($urls as $url) {
            /** @var File $file */
            $hash = File::getHashPropertyPhoto($url);
            $file = $this->fileRepo->findOneBy([
                'hash' => $hash,
            ]);

            if (!$file) {
                $file = $this->createFile($url, $origin);
                $this->em->persist($file);
            } else {
                // backwards compatibility, update data for old files
                $file->url = $url;
                $file->origin = $origin;
            }

            $files[] = $file;
        }

        $this->em->flush($files);

        return $files;
    }

    /**
     * @param string $url
     * @param string $origin
     *
     * @return File
     */
    private function createFile($url, $origin)
    {
        $awsResult = new Result([
            'ObjectURL' => $url,
        ]);
        $hash = File::getHashPropertyPhoto($url);
        $pathInfo = pathinfo($url);

        $file = new File();
        $file->hash = $hash;
        $file->size = 0;
        $file->mimeType = 'image';
        $file->ext = '';
        $file->origin = $origin;
        $file->source = $url;
        $file->url = $url;
        $file->metadata = serialize($awsResult);

        if (isset($pathInfo['extension'])) {
            $file->ext = $pathInfo['extension'];
        }

        return $file;
    }
}
