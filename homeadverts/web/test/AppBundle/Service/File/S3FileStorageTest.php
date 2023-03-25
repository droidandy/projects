<?php

namespace Test\AppBundle\File;

use Doctrine\Common\Collections\ArrayCollection;
use Test\AppBundle\AbstractFrameworkTestCase;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\UserTrait;

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;
use AppBundle\Entity\Storage\File;
use AppBundle\Service\File\Storage\S3FileStorage;

class S3FileStorageTest extends AbstractFrameworkTestCase
{
    use UserTrait;
    use FileTrait;

    public function testSaveNotExistingThrows500()
    {
        $s3Exception = $this->getS3Exception();
        $s3Exception
            ->method('getStatusCode')
            ->willReturn(500)
        ;

        $s3Client = $this->getS3Client();
        $s3Client
            ->method('headObject')
            ->withAnyParameters()
            ->will($this->throwException($s3Exception));

        $s3Client
            ->expects($this->never())
            ->method('getObjectUrl')
            ->withAnyParameters()
        ;
        $s3Client
            ->expects($this->never())
            ->method('putObject')
            ->withAnyParameters()
        ;
    }

    public function testSaveExisting()
    {
        $file = $this->getFile();

        $s3Client = $this->getS3Client();
        $s3Client
            ->expects($this->never())
            ->method('putObject')
        ;
        $s3Client
            ->expects($this->once())
            ->method('headObject')
            ->withAnyParameters()
            ->willReturn(new ArrayCollection())
        ;
        $s3Client
            ->expects($this->exactly(2))
            ->method('getObjectUrl')
            ->with($this->equalTo('test_bucket'), $this->equalTo('media/e3/b0/c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.jpg'))
            ->willReturn('test_object_url')
        ;

        $storage = new S3FileStorage($s3Client, 'test_bucket', 'media');
        $storage->save($file);

        $this->assertEquals('test_object_url', $storage->getUrl($file));
    }

    public function testSaveNotExisting()
    {
        /** @var File $file */
        $file = $this->getFile();

        $s3Exception = $this->getS3Exception();
        $s3Exception
            ->method('getStatusCode')
            ->willReturn(404)
        ;

        $s3Client = $this->getS3Client();
        $s3Client
            ->expects($this->once())
            ->method('headObject')
            ->withAnyParameters()
            ->will($this->throwException($s3Exception));

        $s3Client
            ->expects($this->once())
            ->method('getObjectUrl')
            ->with($this->equalTo('test_bucket'), $this->equalTo('media/e3/b0/c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.jpg'))
            ->willReturn('test_object_url')
        ;
        $s3Client
            ->expects($this->once())
            ->method('putObject')
            ->with(
                $this->callback(function ($subject) {
                    if (
                        'test_bucket' == $subject['Bucket']
                        && 'media/e3/b0/c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.jpg' == $subject['Key']
                    ) {
                        return true;
                    }

                    return false;
                })
            )
        ;

        $storage = new S3FileStorage($s3Client, 'test_bucket', 'media');
        $storage->save($file);

        $this->assertEquals('test_object_url', $storage->getUrl($file));
    }

    /**
     * @return File
     */
    private function getFile()
    {
        $user = $this->newUser();
        $file = $this->getFixture('file3');

        return $this->newFile($user, [
            'hash' => 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            'size' => 0,
            'ext' => 'jpg',
            'mimeType' => 'image/jpeg',
            'fileInfo' => new \SplFileInfo($file),
        ]);
    }

    private function getS3Client()
    {
        return $this->getMockBuilder(S3Client::class)
            ->disableOriginalConstructor()
            ->setMethods([
                'putObject',
                'headObject',
                'getObjectUrl',
            ])
            ->getMock()
        ;
    }

    private function getS3Exception()
    {
        return $this->getMockBuilder(S3Exception::class)
            ->disableOriginalConstructor()
            ->setMethods([
                'getStatusCode',
            ])
            ->getMock()
        ;
    }

}
