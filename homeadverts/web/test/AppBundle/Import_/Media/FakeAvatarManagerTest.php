<?php

namespace Test\AppBundle\Import_\Media;

use AppBundle\Import\Media\FakeAvatarManager;
use AppBundle\Entity\User\User;

class FakeAvatarManagerTest extends \PHPUnit_Framework_TestCase
{
    public function testProcess()
    {
        $user = $this->getUser(1);
        $user->sourceRef = '3yd-RFGSIR-4604085';
        $user->profileImage = 'remote_avatar_url';

        $avatarManager = $this->getFakeAvatarManager('https://profiles-homeadverts-com.s3.amazonaws.com');
        $avatarManager->process($user);

        $this->assertEquals('https://profiles-homeadverts-com.s3.amazonaws.com/users/4604085/'.$this->getTemporaryName('remote_avatar_url'), $user->profileImage);
    }

    private function getFakeAvatarManager($bucketName)
    {
        $avatarManager = new FakeAvatarManager($bucketName);

        return $avatarManager;
    }

    private function getUser($id)
    {
        $user = new User();
        $user->id = $id;

        return $user;
    }

    private function getTemporaryName($url)
    {
        return 'profile-'.sha1($url).'.jpeg';
    }
}
