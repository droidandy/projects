<?php

namespace Learning\AWS;

use Aws\S3\S3Client;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class S3ClientTest extends KernelTestCase
{
    public function testObjectUrl()
    {
        self::bootKernel();
        $s3Client = static::$kernel->getContainer()->get('ha.s3_client');

        dump($s3Client->getObjectUrl('properties-homeadverts-com', 'properties/16716/16716-51e44273dd13e4d94d58376df92c3ac9af64294f.jpeg'));
        dump($s3Client->getObjectUrl('properties-homeadverts-com', 'properties-homeadverts-com/properties/16716/16716-51e44273dd13e4d94d58376df92c3ac9af64294f.jpeg'));
        dump($s3Client->getObjectUrl('properties-homeadverts-com', 'list_thumb_adv/properties-homeadverts-com/properties/16716/16716-51e44273dd13e4d94d58376df92c3ac9af64294f.jpeg'));

        $anotherClient = new S3Client([
            'region' => 'us-east-1',
            'version' => '2006-03-01',
            'credentials' => [
                'key' => 'key',
                'secret' => 'secret',
            ],
            'bucket_endpoint' => true,
            'endpoint' => 'https://properties-homeadverts-com.s3.amazonaws.com',
        ]);

        dump($anotherClient->getObjectUrl('properties-homeadverts-com', 'properties/16716/16716-51e44273dd13e4d94d58376df92c3ac9af64294f.jpeg'));
        dump($anotherClient->getObjectUrl('properties-homeadverts-com', 'properties-homeadverts-com/properties/16716/16716-51e44273dd13e4d94d58376df92c3ac9af64294f.jpeg'));
        dump($anotherClient->getObjectUrl('properties-homeadverts-com', 'list_thumb_adv/properties-homeadverts-com/properties/16716/16716-51e44273dd13e4d94d58376df92c3ac9af64294f.jpeg'));
    }
}
