<?php

namespace AppBundle\Service\File;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\Storage\File;
use AppBundle\Service\Article\ArticleMedia;
use AppBundle\Service\File\Storage\S3FileStorage;
use AppBundle\Service\File\Storage\FileStorageInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileManager
{
    /**
     * @var EntityRepository
     */
    private $fileRepo;
    /**
     * @var S3FileStorage
     */
    private $storage;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var ArticleMedia
     */
    private $articleMedia;

    /**
     * @param EntityRepository $fileRepo
     * @param S3FileStorage    $storage
     * @param EntityManager    $em
     * @param ArticleMedia     $articleMedia
     */
    public function __construct(
        EntityRepository $fileRepo,
        FileStorageInterface $storage,
        EntityManager $em,
        ArticleMedia $articleMedia
    ) {
        $this->fileRepo = $fileRepo;
        $this->storage = $storage;
        $this->em = $em;
        $this->articleMedia = $articleMedia;
    }

    /**
     * @param File $newFile
     *
     * @return File
     */
    public function save(File $newFile)
    {
        $file = $newFile;

        $oldFile = $this->fileRepo->findOneBy([
            'hash' => $newFile->hash,
        ]);

        // Retrieving previously uploaded images may lead to a various of bugs.
        // Due to the difficulty of all possible cases.
        if ($oldFile) {
            $file = $oldFile;
        } else {
            $converted = $this->convertWebpToJpg($newFile);

            $this->storage->save($converted);
        }

        $file->url = $file->metadata['ObjectURL'];

        // Non needed at this moment, to be uncommented and improved after.
        // $file->urlSmall = $this->articleMedia->getCroppedImage($file, 'article_small');
        // $file->urlMedium = $this->articleMedia->getCroppedImage($file, 'article_medium');
        // $file->urlLarge = $this->articleMedia->getCroppedImage($file, 'article_large');

        $this->em->persist($file);
        $this->em->flush($file);

        return $file;
    }

    /**
     * @param File $file
     *
     * @return File
     */
    private function convertWebpToJpg(File $file)
    {
        if ('webp' !== $file->ext) {
            return $file;
        }

        $dir = dirname($file->fileInfo->getRealPath());
        $newName = str_replace('.webp', '.jpg', $file->fileInfo->getClientOriginalName());
        $newPath = $dir.'/'.$newName;

        $image = imagecreatefromwebp($file->fileInfo->getRealPath());
        imagejpeg($image, $newPath, 90);

        // Set new
        $uploadedFile = new UploadedFile(
            $newPath,
            $newName,
            'image/jpeg',
            filesize($newPath),
            null,
            true
        );
        $file->setFileInfo($uploadedFile);

        return $file;
    }
}
