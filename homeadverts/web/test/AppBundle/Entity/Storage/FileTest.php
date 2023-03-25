<?php

namespace Test\AppBundle\File;

use AppBundle\Entity\Storage\File;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\UserTrait;

class FileTest extends AbstractTestCase
{
    use FileTrait;
    use UserTrait;

    public function testCalculateHash()
    {
        $user = $this->newUser();
        $file = $this->newFile($user);
        $file->hash = '28df8d363a504c8f4f10d632115218f9776e3199d9b3a0af2a1304dfd26b35bb';

        $urlA = 'https://properties-homeadverts-com.s3.amazonaws.com/media/ba/7a/e11209ac3a68958b40a14f5ab720edca01a3f8a129ce83177e2c31a2c772.jpeg';
        $urlB = 'https://cdn.homeadverts.dev/media/3e/ee/a9abc37a81022ba87327a8fc5374c0a551da454b1f4346487a41d8ae064cc8.jpg';
        $urlC = 'https://cdn.homeadverts.dev/media/'. $file->getNameOnStorage();

        $this->assertEquals(
            'ba7ae11209ac3a68958b40a14f5ab720edca01a3f8a129ce83177e2c31a2c772',
            File::getHashImage($urlA)
        );
        $this->assertEquals(
            '3eeea9abc37a81022ba87327a8fc5374c0a551da454b1f4346487a41d8ae064cc8',
            File::getHashImage($urlB)
        );
        $this->assertEquals(
            '28df8d363a504c8f4f10d632115218f9776e3199d9b3a0af2a1304dfd26b35bb',
            File::getHashImage($urlC)
        );
    }

    public function getHashImage()
    {
        /**
         * Hashes by sha256sum.
         */
        $hashMap = [
            'cbe5d41157ffebdff040c961827abb3ce24953f7f3322cbcb763d936141f0295' => $this->getFixture('file1'),
            'c4340a472a93098af1aaeaa0462592d459f34e8fc4520bdb067808f2e44e8d41' => $this->getFixture('file2'),
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' => $this->getFixture('file3'),
        ];

        foreach ($hashMap as $hash => $filename) {
            $this->assertEquals(
                $hash,
                File::calculateHash($filename)
            );
        }
    }
}
