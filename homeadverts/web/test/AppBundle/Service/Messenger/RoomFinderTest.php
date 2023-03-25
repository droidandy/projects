<?php

namespace AppBundle\Tests\Service;

use AppBundle\Entity\User\User;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\MessageTrait;
use Test\Utils\Traits\GoogleLocationTrait;

class RoomFinderTest extends AbstractTestCase
{
    use UserTrait;
    use MessageTrait;
    use RoomTrait;
    use ArticleTrait;
    use PropertyTrait;
    use GoogleLocationTrait;
    use AddressTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testCreateOnBoardingRoomWithServiceUser()
    {
        $user = $this->newUserPersistent();
        $serviceUser = $this
            ->getContainer()
            ->get('ha.user_manager')
            ->createServiceUser();

        $room = $this
            ->getContainer()
            ->get('app.room_finder')
            ->createOnBoardingRoom($user);

        $this->assertNotNull($room->getId());
        $this->assertEquals(2, $room->users->count());
        $this->assertNotNull($serviceUser->getId());
        $this->assertEquals($serviceUser->getEmail(), User::SERVICE_USER['email']);
    }

    public function testLoadRoomForArticle()
    {
        $article = $this->newArticlePersistent();

        $room = $this
            ->getContainer()
            ->get('app.room_finder')
            ->loadRoomForArticle($article);

        $this->assertEquals(1, $room->users->count());
        $this->assertEquals($room->article, $article);
        $this->assertFalse($room->isPrivate);
    }

    public function testLoadRoomForArticleAddUser()
    {
        $userA = $this->newUserPersistent();
        $article = $this->newArticlePersistent();

        $room = $this
            ->getContainer()
            ->get('app.room_finder')
            ->loadRoomForArticle($article, $userA);

        $this->assertEquals(2, $room->users->count());
        $this->assertEquals($room->article, $article);
        $this->assertFalse($room->isPrivate);
    }

    public function testLoadRoomForProperty()
    {
        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        // Test
        $room = $this
            ->getContainer()
            ->get('app.room_finder')
            ->loadRoomForProperty($property);

        // Check
        $this->assertEquals(1, $room->users->count());
        $this->assertEquals($room->property, $property);
        $this->assertFalse($room->isPrivate);
    }

    public function testLoadRoomForPropertyAddUser()
    {
        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $userB,
        ]);

        // Test
        $room = $this
            ->getContainer()
            ->get('app.room_finder')
            ->loadRoomForProperty($property, $userA);

        // Check
        $this->assertEquals(2, $room->users->count());
        $this->assertEquals($room->property, $property);
        $this->assertFalse($room->isPrivate);
    }

    public function testLoadRoomForPropertyAddNextUsers()
    {
        $roomFinder = $this
            ->getContainer()
            ->get('app.room_finder');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $userC = $this->newUserPersistent();
        $userD = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $userB,
        ]);

        // Test
        $room = $roomFinder->loadRoomForProperty($property, $userA);
        $roomFinder->addUserToRoom($room, $userC);
        $roomFinder->addUserToRoom($room, $userD);

        // Check
        $this->assertEquals(4, $room->users->count());
        $this->assertEquals($room->property, $property);
        $this->assertFalse($room->isPrivate);
    }

}
