<?php

namespace Test\AppBundle\Entity;

use AppBundle\Entity\User\User;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;

class UserTest extends AbstractWebTestCase
{
    use LocationTrait;
    use AddressTrait;
    use GoogleLocationTrait;

    public function testShouldFollowAndHaveFollowers()
    {
        $user1 = new User();
        $user2 = new User();
        $user3 = new User();
        $user4 = new User();

        $user2->followUser($user3);
        $user2->followUser($user4);
        $user3->followUser($user4);
        $user4->followUser($user1);
        $user4->followUser($user2);
        $user4->followUser($user3);

        $this->assertEquals(0, $user1->getFollowings()->count());
        $this->assertEquals(2, $user2->getFollowings()->count());
        $this->assertEquals(1, $user3->getFollowings()->count());
        $this->assertEquals(3, $user4->getFollowings()->count());
    }

    public function testIsAutoshareEnabled()
    {
        $name = 'facebook';
        $user = new User();
        $user->setAutoshare($name, true);

        $this->assertEquals(
            true,
            $user->isAutoshareEnabled($name)
        );

        $user->setAutoshare($name, false);

        $this->assertEquals(
            false,
            $user->isAutoshareEnabled($name)
        );
    }

    public function testGetAutoshareKey()
    {
        $name = 'facebook';
        $user = new User();

        $this->assertEquals(
            $name.User::SETTINGS_AUTOSHARE_SUFFIX,
            $user->getAutoshareKey($name)
        );
    }
}
