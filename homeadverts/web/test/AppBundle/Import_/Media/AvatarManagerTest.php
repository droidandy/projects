<?php

namespace Test\AppBundle\Import_\Media;

use AppBundle\Import\Media\AvatarManager;
use AppBundle\Import\Media\PhotoDownloader;
use AppBundle\Import\Media\S3PhotoStorage;
use AppBundle\Entity\User\User;
use Symfony\Component\HttpFoundation\File\File;

class AvatarManagerTest extends \PHPUnit_Framework_TestCase
{
    public function testProcess()
    {
        $mediaTmp = __DIR__.'/';

        $user = $this->getUser(1);
        $user->profileImage = 'remote_avatar_url';

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
            ->with($user->profileImage, $this->getTemporaryName($user->profileImage, $mediaTmp))
            ->willReturn($file)
        ;

        $avatarManager = $this->getAvatarManager($storage, $photoDownloader, $mediaTmp, $file);
        $avatarManager->process($user);

        $this->assertEquals('absolute_path', $user->profileImage);
    }

    private function getAvatarManager($storage, $photoDownloader, $mediaTmp, $file)
    {
        $avatarManager = new AvatarManager($storage, $photoDownloader, $mediaTmp);

        return $avatarManager;
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

    private function getUser($id)
    {
        $user = new User();
        $user->id = $id;

        return $user;
    }

    private function getTemporaryName($url, $mediaTmp)
    {
        return $mediaTmp.'profile-'.sha1($url);
    }
}
