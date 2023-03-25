<?php

namespace Test\AppBundle\Import_\Email;

use AppBundle\Import\Media\AvatarManagerInterface;
use AppBundle\Import\NormalisedUser;
use AppBundle\Import\User\Populator\PhotoPopulator;
use AppBundle\Entity\User\User;

class PhotoPopulatorTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var PhotoPopulator
     */
    private $photoPopulator;
    /**
     * @var AvatarManagerInterface
     */
    private $avatarManager;

    protected function setUp()
    {
        $this->avatarManager = $this->getAvatarManager();
        $this->photoPopulator = new PhotoPopulator($this->avatarManager);
    }

    public function testPopulateSucess()
    {
        $user = new User();
        $normalisedUser = new NormalisedUser();
        $normalisedUser->avatarUrl = 'avatar_url';

        /** @var \PHPUnit_Framework_MockObject_MockObject $avatarManager */
        $avatarManager = $this->avatarManager;
        $avatarManager
            ->expects($this->once())
            ->method('process')
            ->willReturnCallback(function ($userToProcess) use ($user) {
                $this->assertSame($user, $userToProcess);
                $this->assertEquals('avatar_url', $userToProcess->profileImage);

                $userToProcess->profileImage = 'processed_avatar_url';
            })
        ;

        $this->photoPopulator->populate($user, $normalisedUser);

        $this->assertEquals('processed_avatar_url', $user->profileImage);
    }

    public function testPopulateEmpty()
    {
        $user = new User();
        $normalisedUser = new NormalisedUser();
        $normalisedUser->avatarUrl = null;

        /** @var \PHPUnit_Framework_MockObject_MockObject $avatarManager */
        $avatarManager = $this->avatarManager;
        $avatarManager
            ->expects($this->never())
            ->method('process')
        ;

        $this->photoPopulator->populate($user, $normalisedUser);
    }

    private function getAvatarManager()
    {
        return $this
            ->getMockBuilder(AvatarManagerInterface::class)
            ->getMock()
        ;
    }
}
