<?php

namespace Test\AppBundle\Controller;

use Doctrine\DBAL\Connection;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class PageControllerTest extends AbstractWebTestCase
{
    use UserTrait;

    /**
     * @var Connection
     */
    protected $conn;

    protected function setUp()
    {
        parent::setUp();

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();
    }

    protected function tearDown()
    {
        $this->conn->rollBack();

        parent::tearDown();
    }

    public function testUserCanAccessStream()
    {
        $user = $this->newUser();
        $this->em->persist($user);
        $this->em->flush($user);

        $this->logIn($user);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_stream')
        );

        $this->assertEquals(200, $this->getResponseStatusCode());
    }

    public function testGuestAccessStreamWithRedirect()
    {
        $this->client->request(
            'GET',
            $this->generateRoute('ha_stream')
        );

        $this->assertEquals(302, $this->getResponseStatusCode());
    }
}
