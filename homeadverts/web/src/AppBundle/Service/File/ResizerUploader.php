<?php

namespace AppBundle\Service\File;

use Aws\Result;
use Imagine\Image\ImageInterface;
use Imagine\Image\ImagineInterface;
use Imagine\Image\Box;
use Aws\S3\S3Client;
use Guzzle\Http\EntityBody;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ResizerUploader
{
    /**
     * @var S3Client
     */
    protected $s3;
    protected $cacheDir;
    protected $processedLocalFiles = [];
    /**
     * @var Result[]
     */
    protected $processedS3Files = [];
    protected $lastImageSize;
    protected $bucketName;
    protected $imagine;
    protected $test;

    /**
     * @var string
     */
    protected $prefix;

    /**
     * ResizerUploader constructor.
     *
     * @param S3Client         $s3
     * @param ImagineInterface $imagine
     * @param $bucketName
     * @param $cacheDir
     * @param bool $test
     * @param $prefix
     */
    public function __construct(
        S3Client $s3,
        string $prefix,
        ImagineInterface $imagine,
        string $bucketName,
        string $cacheDir,
        $test = false
    ) {
        $this->s3 = $s3;
        $this->imagine = $imagine;
        $this->bucketName = $bucketName;
        $this->setLocalCacheDir($cacheDir);
        $this->test = $test;
        $this->prefix = $prefix;
    }

    /**
     * wrapper function for resizing and uploading an image.
     *
     * @param UploadedFile $file         The uploaded file instance
     * @param array        $sizes        An array of sizes to conver the image to
     * @param string       $pathPrefix   The prefix to the s3 bucket prepend to a file inorder to add it to the right location within S3
     * @param bool         $uploadThumbs Whether to resize and upload thumbnails
     */
    public function process(File $file, array $sizes, $pathPrefix, $uploadThumbs = true)
    {
        $pathPrefix = '/'.$this->prefix.'/'.$pathPrefix;

        if ($file instanceof UploadedFile) {
            //set the file object we're working on
            $safeFilename = sha1($file->getClientOriginalName());
            $ext = $file->guessClientExtension();

            //move the file to its tmp location for resizing
            $file = $file->move($this->cacheDir, $safeFilename.'.'.$ext);
        }

        $this->processedS3Files = [];
        $this->processedLocalFiles = [$file];

        if ($uploadThumbs) {
            // resize it
            $this->createThumbnails($file, $sizes);
        }

        // Upload thumbnails
        $this->upload($pathPrefix);

        // Delete locally resized versions
        $this->removeLocalTmpFiles();

        return $this->getS3OriginalImage();
    }

    /**
     * create a set of thumbnails and save to disk.
     *
     * @param File  $file  The original file to use
     * @param array $sizes An array of sizes, label => dimension
     */
    protected function createThumbnails(File $file, array $sizes)
    {
        //create the safe names and get the extension form the original file
        $safeFilename = $file->getBasename('.'.$file->getExtension());
        $ext = $file->getExtension();

        //create a new Imagine\GD\Image instance
        $image = $this->imagine->open($file->getPathname());
        $this->lastImageSize = $image->getSize();

        foreach ($sizes as $label => $size) {
            list($w, $h) = explode('x', $size);

            //resize the image to the size we require
            $thumb = $image->thumbnail(new Box($w, $h), ImageInterface::THUMBNAIL_INSET);

            //create the full path of the file including cache dir and extension
            $location = $this->cacheDir.'/'.$safeFilename.'-'.$label.'.'.$ext;
            $thumb->save($location, ['jpeg_quality' => 90]);

            //add the file to our processed files array for upload and deletion
            $this->processedLocalFiles[] = new File($location);
        }
    }

    /**
     * upload all of the processed files to s3 via the client adaptor passed to the contructor.
     *
     * @param string $pathPrefix the prefix to prepend to the start of the file (dir structure)
     */
    protected function upload($pathPrefix, $contentType = 'image')
    {
        if (empty($this->processedLocalFiles)) {
            return;
        }

        foreach ($this->processedLocalFiles as $file) {
            if ($this->test) {
                $this->processedS3Files[] = [
                    'ObjectURL' => $this->s3->getObjectUrl($this->bucketName, rtrim($pathPrefix, '/').'/'.$file->getFilename()),
                ];
            } else {
                // Upload an object by streaming the contents of an EntityBody object
                $this->processedS3Files[] = $this->s3->putObject(array(
                    'Bucket' => $this->bucketName,
                    'Key' => trim($pathPrefix, '/').'/'.$file->getFilename(),
                    'Body' => EntityBody::factory(fopen($file->getPathname(), 'r+')),
                    'ACL' => 'public-read',
                    'ContentType' => $contentType,
                ));
            }
        }
    }

    /**
     * Delete multip[e items at once, based on the bucket name and a prefix.
     *
     * @param string|REGEX $prefix A string used to narrow down the list of items within a bucket and delete them
     */
    public function delete($prefix)
    {
        //remove the slash from the left
        $prefix = ltrim($prefix, '/');

        return $this->s3->deleteMatchingObjects($this->bucketName, $prefix);
    }

    /**
     * get the original image from its s3 location after upload.
     *
     * @return string The absolute url of the image on s3
     */
    public function getS3OriginalImage()
    {
        return $this->processedS3Files[0]['ObjectURL'];
    }

    /**
     * get the original image dimensions.
     *
     * @return int[]
     */
    public function getOriginalImageSize()
    {
        return [$this->lastImageSize->getWidth(), $this->lastImageSize->getHeight()];
    }

    /**
     * clean up any files that have been created.
     */
    protected function removeLocalTmpFiles()
    {
        foreach ($this->processedLocalFiles as $file) {
            if (is_file($file->getPathname())) {
                unlink($file->getPathname());
            }
        }
    }

    /**
     * set the cache dir and make sure its writable.
     *
     * @param string $dir The location of the direction
     */
    protected function setLocalCacheDir($dir, $makeDir = true)
    {
        $this->cacheDir = $dir;
        if (true === $makeDir && !is_dir($this->cacheDir)) {
            mkdir($this->cacheDir);
        }
    }

    /**
     * set the class bucket name for when uploading to s3.
     *
     * @param string $name The bucket name, that the file will be appended too
     */
    public function setS3BucketName($name)
    {
        $this->bucketName = $name;
    }
}
