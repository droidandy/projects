<?php

namespace HA\ImportBundle\Processor;

use org\bovigo\vfs\vfsStream;
use HA\ImportBundle\Property;
use HA\ImportBundle\NormalisedProperty;

class PhotoTest extends \PHPUnit_Framework_TestCase
{
    public function testDownloading()
    {
        vfsStream::setup('testTmpDir');

        $plugin = new \Guzzle\Plugin\Mock\MockPlugin();
        $plugin->addResponse(new \Guzzle\Http\Message\Response(200, null, file_get_contents(__DIR__.'/fixtures/image.jpg')));
        $client = new \Guzzle\Http\Client();
        $client->addSubscriber($plugin);

        $mockS3 = $this->getMockBuilder('Aws\\S3\\S3Client')
            ->setMethods(array('putObject'))
            ->disableOriginalConstructor()
            ->getMock();

        $mockS3
            ->expects($this->once())
            ->method('putObject')
            ->with($this->equalTo(array(
              'Bucket' => 'test/test',
              'Key' => '/images/bob.jpg',
              'SourceFile' => 'vfs://testTmpDir/234-1034b6a4fd6725cb8852615b535cc487',
            )))
            ->will($this->returnValue(true));

        $app = array(
            'guzzle.client' => $client,
            's3.client' => $mockS3,
            's3.bucket' => 'test/test',
            'media.tmp' => vfsStream::url('testTmpDir').'/',
        );

        $photo = new Photo($app, [], 123);
        $property = new Property();
        $normalised = new NormalisedProperty(array(
            'photos' => [
                (object) [
                    'url' => 'bob.jpg',
                    'caption' => 'This is a caption',
                ],
            ],
        ));

        $photo->process($normalised, $property);
    }
}
