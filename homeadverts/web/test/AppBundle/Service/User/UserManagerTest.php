<?php

namespace Test\AppBundle\Service\User;

use AppBundle\Entity\User\User;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class UserManagerTest extends AbstractWebTestCase
{
    use UserTrait;

    protected $rollbackTransactions = true;

    public function testNewPasswordAction()
    {
        $user = $this->newUser();

        $this->assertNull($user->activeAt);

        $this->getContainer()
            ->get('ha.user_manager')
            ->setLastSeenNow($user);

        $this->em->refresh($user);

        $this->assertNotNull($user->activeAt);
    }

    public function testCreateServiceUser()
    {
        $user = $this->getContainer()
            ->get('ha.user_manager')
            ->createServiceUser();

        $this->assertEquals($user->getEmail(), User::SERVICE_USER['email']);
    }
}
