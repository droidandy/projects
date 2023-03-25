<?php

namespace AppBundle\Service\Article\Import;

use andreskrey\Readability\ParseException;
use andreskrey\Readability\Readability;
use andreskrey\Readability\Configuration;
use AppBundle\Entity\Storage\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Exception;
use AppBundle\Service\File\FileManager;

class PageImporter
{
    /**
     * @var FileManager
     */
    private $fileManager;
    /**
     * @var ContentsReaderInterface
     */
    private $contentsReader;

    /**
     * @param FileManager             $fileManager
     * @param ContentsReaderInterface $contentsReader
     */
    public function __construct(FileManager $fileManager, ContentsReaderInterface $contentsReader)
    {
        $this->fileManager = $fileManager;
        $this->contentsReader = $contentsReader;
    }

    /**
     * @param string $source
     *
     * @return array
     */
    public function import($source)
    {
        $contentMutator = new ContentMutator();
        $readability = new Readability(
            $this->buildConfig($source)
        );

        $html = $this->contentsReader->getContents($source);
        $html = $contentMutator->replaceProgressiveImages($html);
        $html = $contentMutator->updateLazyloadImages($html);

        try {
            $readability->parse($html);
        } catch (ParseException $e) {
            // todo: possibly add errors processing later
            throw $e;
        }

        $content = $contentMutator->convertHTMLEntitiesToCharacters($readability->getContent());
        $content = $contentMutator->stripTags($content);

        $images = $this->uploadImages($content, $readability->getImages());

        $content = $contentMutator->replaceImages($content, $images);
        $content = $contentMutator->addLinkToOriginalSource($content, $readability->getTitle(), $source);

        return [
            'title' => $readability->getTitle(),
            'body' => $content,
            'images' => $images,
        ];
    }

    /**
     * @param string $originalContent
     * @param array  $originalImages
     *
     * @return array
     */
    private function uploadImages($originalContent, array $originalImages)
    {
        $images = [];

        try {
            foreach ($originalImages as $url) {
                if (false !== strpos($originalContent, $url)) {
                    $newFile = $this->newFileInstanceFromUrl($url);
                    $file = $this->fileManager->save($newFile);

                    $images[] = $file;
                }
            }
        } catch (Exception $e) {
            // move forward in case of error
        }

        $this->removeTemporaryImageFiles($images);

        return $images;
    }

    /**
     * @param $url
     *
     * @return Configuration
     */
    private function buildConfig($url)
    {
        $config = new Configuration();
        $parts = parse_url($url);

        $config->setCleanConditionally(false);

        if (isset($parts['scheme'])) {
            $config->setFixRelativeURLs(true);
            $config->setOriginalURL(
                $parts['scheme'].'://'.$parts['host']
            );
        }

        return $config;
    }

    /**
     * @param string $url
     *
     * @return File
     */
    private function newFileInstanceFromUrl($url)
    {
        $name = md5($url);
        $filename = $this->buildTemporaryFilename($name);

        file_put_contents(
            $filename,
            $this->contentsReader->getContents($url)
        );

        $uploadedFile = new UploadedFile($filename, $name, 'image');
        $file = new File();
        $file->origin = 'articleImport';
        $file->setFileInfo($uploadedFile, $url);

        return $file;
    }

    /**
     * @param File[] $images
     */
    private function removeTemporaryImageFiles(array $images)
    {
        foreach ($images as $image) {
            $name = md5($image->url);
            $fileName = $this->buildTemporaryFilename($name);

            if (file_exists($fileName)) {
                unlink($fileName);
            }
        }
    }

    /**
     * @param string $name
     *
     * @return string
     */
    private function buildTemporaryFilename($name)
    {
        return sys_get_temp_dir().'/'.$name;
    }
}
