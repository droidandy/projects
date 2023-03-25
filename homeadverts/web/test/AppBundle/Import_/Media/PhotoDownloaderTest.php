<?php

namespace Test\AppBundle\Import_\Media;

use AppBundle\Import\Media\PhotoDownloader;
use Guzzle\Http\Client;
use Guzzle\Http\Message\Request;
use Guzzle\Http\Message\Response;
use Monolog\Logger;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\File;

class PhotoDownloaderTest extends \PHPUnit_Framework_TestCase
{
    public function testDownload()
    {
        $httpClient = $this->getHttpClient();
        $httpClient
            ->expects($this->once())
            ->method('get')
            ->with('fake_url')
            ->willReturn($request = $this->getRequest())
        ;
        $request
            ->expects($this->once())
            ->method('setResponseBody')
            ->with('local_path/filename')
            ->willReturnSelf()
        ;
        $request
            ->expects($this->once())
            ->method('send')
            ->willReturn($this->getResponse())
        ;

        $filesystem = $this->getFilesystem();
        $filesystem
            ->expects($this->never())
            ->method('exists')
            ->withAnyParameters()
        ;
        $filesystem
            ->expects($this->never())
            ->method('remove')
            ->withAnyParameters()
        ;

        $file = $this->getFile();
        $file->expects($this->once())
            ->method('guessExtension')
            ->willReturn('jpg')
        ;
        $file
            ->expects($this->once())
            ->method('getPath')
            ->willReturn('local_path')
        ;
        $file
            ->expects($this->once())
            ->method('getPathname')
            ->willReturn('local_path/filename.jpg')
        ;
        $file
            ->expects($this->once())
            ->method('getFilename')
            ->willReturn('filename')
        ;
        $file
            ->expects($this->once())
            ->method('move')
            ->with('local_path', 'filename.jpg')
            ->willReturnSelf()
        ;

        $downloader = $this->getPhotoDownloader($httpClient, $filesystem, $this->getLogger(), $file);
        $this->assertSame($file, $downloader->download('fake_url', 'local_path/filename'));
    }

    private function getPhotoDownloader(Client $httpClient, Filesystem $filesystem, Logger $logger, File $file)
    {
        $downloader = $this
            ->getMockBuilder(PhotoDownloader::class)
            ->setConstructorArgs([$httpClient, $filesystem, $logger])
            ->setMethods(['makeFile'])
            ->getMock()
        ;
        $downloader
            ->method('makeFile')
            ->willReturn($file)
        ;

        return $downloader;
    }

    private function getFile()
    {
        return $this
            ->getMockBuilder(File::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getHttpClient()
    {
        return $this
            ->getMockBuilder(Client::class)
            ->getMock()
            ;
    }

    private function getRequest()
    {
        return $this
            ->getMockBuilder(Request::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getResponse()
    {
        return $this
            ->getMockBuilder(Response::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getFilesystem()
    {
        return $this
            ->getMockBuilder(Filesystem::class)
            ->getMock()
        ;
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(Logger::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
