<?php

namespace Test\AppBundle\Import_\Media;

use AppBundle\Import\Media\Hasher;
use AppBundle\Import\Media\PhotoDownloader;
use AppBundle\Import\Media\PhotoManager;
use AppBundle\Import\Media\S3PhotoStorage;
use HA\SearchBundle\Entity\Property\Property;
use HA\SearchBundle\Entity\Property\PropertyPhoto;
use Symfony\Component\HttpFoundation\File\File;

class PhotoManagerTest extends \PHPUnit_Framework_TestCase
{
    public function testProcess()
    {
        $mediaTmp = __DIR__.'/';

        $propertyPhoto = $this->getPropertyPhoto(1);
        $propertyPhoto->setSourceUrl('fake_url');

        $file = $this->getFile();
        $file
            ->method('getSize')
            ->willReturn(100000)
        ;

        $storage = $this->getPhotoStorage();
        $storage
            ->expects($this->once())
            ->method('save')
            ->with($file)
            ->willReturn('absolute_path')
        ;

        $photoDownloader = $this->getPhotoDownloader($file);
        $photoDownloader
            ->expects($this->once())
            ->method('download')
            ->with('fake_url', $this->getTemporaryName($propertyPhoto, $mediaTmp))
            ->willReturn($file)
        ;

        $hasher = $this->getHasher();
        $hasher
            ->method('getFileHash')
            ->with($file)
            ->willReturn('hash')
        ;

        $photoManager = $this->getPhotoManager($storage, $photoDownloader, $hasher, $mediaTmp, $file);
        $photoManager->process($propertyPhoto);

        $this->assertEquals('absolute_path', $propertyPhoto->url);
        $this->assertEquals('hash', $propertyPhoto->hash);
        $this->assertEquals(640, $propertyPhoto->width);
        $this->assertEquals(480, $propertyPhoto->height);
    }

    private function getPhotoManager($storage, $photoDownloader, $hasher, $mediaTmp, $file)
    {
        $photoManager = $this
            ->getMockBuilder(PhotoManager::class)
            ->setConstructorArgs([$storage, $photoDownloader, $hasher, $mediaTmp])
            ->setMethods(['getImageSize'])
            ->getMock()
        ;
        $photoManager
            ->method('getImageSize')
            ->with($file)
            ->willReturn([640, 480])
        ;

        return $photoManager;
    }

    private function getPhotoDownloader(File $file)
    {
        $downloader = $this->getMockBuilder(PhotoDownloader::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        $downloader
            ->method('download')
            ->willReturn($file)
        ;

        return $downloader;
    }

    private function getFile()
    {
        return $this->getMockBuilder(File::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getPhotoStorage()
    {
        return $this
            ->getMockBuilder(S3PhotoStorage::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getPropertyPhoto($id)
    {
        $property = new Property();
        $property->id = $id;
        $photo = new PropertyPhoto();
        $photo->setProperty($property);

        return $photo;
    }

    private function getHasher()
    {
        return $this
            ->getMockBuilder(Hasher::class)
            ->getMock()
        ;
    }

    private function getTemporaryName(PropertyPhoto $photo, $mediaTmp)
    {
        return $mediaTmp.$photo->getProperty()->id.'-'.sha1($photo->getSourceUrl());
    }
}
