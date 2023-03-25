<?php

namespace AppBundle\Import\Media;

use AppBundle\Entity\User\User;

/**
 * Class FakeAvatarManager.
 *
 * Useful when avatar is already uploaded to bucket
 */
class FakeAvatarManager implements AvatarManagerInterface
{
    /**
     * @var string
     */
    private $bucketName;

    public function __construct($bucketName)
    {
        $this->bucketName = $bucketName;
    }

    public function process(User $user)
    {
        $user->profileImage = $this->bucketName.$this->getPrefix($user).$this->getTemporaryName($user->profileImage);
    }

    private function getTemporaryName($url)
    {
        return 'profile-'.sha1($url).'.jpeg';
    }

    private function getPrefix(User $user)
    {
        return '/users/'.str_replace('3yd-RFGSIR-', '', $user->sourceRef).'/';
    }
}
