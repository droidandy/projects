<?php

namespace Test\AppBundle\Controller\Api\User;

use AppBundle\Entity\User\User;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class UserControllerTest extends AbstractWebTestCase
{
    use UserTrait;
    use ArticleTrait;
    use GoogleLocationTrait;
    use AddressTrait;
    use PropertyTrait;

    public function testFeedActionSuccess()
    {
        $user = $this->newUserPersistent();
        $article = $this->newArticlePersistent([
            'user' => $user,
            'published_at' => new \DateTime(),
        ]);
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_user_get_feed', [
                'id' => $user->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(2, count($result));
        $this->assertEquals(200, $statusCode);

        $this->removeEntity($property);
        $this->removeEntity($article);
        $this->removeEntity($user);
    }

    public function testLoginUserActionSuccess()
    {
        $data = [
            'email' => $this->faker->email,
            'password' => $this->faker->numberBetween(),
        ];

        $user = $this->newUser($data);
        $this->em->persist($user);
        $this->em->flush($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_login'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $statusCode = $response->getStatusCode();
        $this->assertEquals(200, $statusCode);

        $this->removeEntity($user);
    }

    public function testLoginUserActionFailWrongCredentials()
    {
        $data = [
            'email' => $this->faker->email,
            'password' => $this->faker->numberBetween(),
        ];
        $wrongData = [
            'email' => $this->faker->email,
            'password' => 'wrong!',
        ];

        $user = $this->newUser($data);
        $this->em->persist($user);
        $this->em->flush($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_login'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($wrongData)
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(422, $statusCode);
        $this->assertEquals('A user with such Email doesn\'t exists', $result['message']);
        $this->removeEntity($user);
    }

    public function testLoginUserActionFailNotEnabled()
    {
        $data = [
            'email' => $this->faker->email,
            'password' => $this->faker->numberBetween(),
        ];
        $userData = $data;
        $userData['enabled'] = false;

        $user = $this->newUser($userData);
        $this->em->persist($user);
        $this->em->flush($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_login'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(422, $statusCode);
        $this->assertEquals('A user with such Email doesn\'t exists', $result['message']);
        $this->removeEntity($user);
    }

    public function testPostUserActionFailUserAgreement()
    {
        $data = [
            'email' => $this->faker->email,
            'name' => $this->faker->name,
            'username' => $this->faker->userName,
            'plainPassword' => 'password',
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_post'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(400, $statusCode);
        $this->assertEquals('Terms of use must be accepted.', $result['message']);
    }

    public function testPostUserActionFailShortPassword()
    {
        $data = [
            'email' => $this->faker->email,
            'name' => $this->faker->name,
            'username' => $this->faker->userName,
            'plainPassword' => '123',
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_post'),
            [],
            [],
            [
                'HTTP_X-USER-AGREEMENT' => 1,
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(400, $statusCode);
        $this->assertEquals(1, count($result['errors']));
        $this->assertEquals('Your password is too short.', $result['errors']['plainPassword']);
    }

    public function testPostUserActionFailDuplicatedEmail()
    {
        $user = $this->newUserPersistent();
        $data = [
            'email' => $user->getEmail(),
            'name' => $this->faker->name,
            'username' => $this->faker->userName,
            'plainPassword' => 'password',
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_post'),
            [],
            [],
            [
                'HTTP_X-USER-AGREEMENT' => 1,
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(400, $statusCode);
        $this->assertEquals(1, count($result['errors']));
        $this->assertEquals('This email is already in use', $result['errors']['email']);
        $this->removeEntity($user);
    }

    public function testPostUserActionSuccess()
    {
        $data = [
            'email' => $this->faker->email,
            'name' => $this->faker->name,
            'username' => $this->faker->userName,
            'plainPassword' => 'password',
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_post'),
            [],
            [],
            [
                'HTTP_X-USER-AGREEMENT' => 1,
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertNotEmpty($response->headers->get('location'));
        $this->assertEquals(201, $statusCode);
        $this->assertEmpty($result);

        // Verify user is initially enabled.
        $user = $this->getContainer()->get('user_repo')->findOneBy([
            'email' => $data['email'],
            'enabled' => 1,
        ]);
        $this->assertNotNull($user);
        $this->assertEquals($user->getRoles()[0], User::ROLE_USER);
    }

    public function testGetActionSuccess()
    {
        $user = $this->newUserPersistent();

        $this->client->request(
            'GET',
            $this->generateRoute('ha_user_get', [
                'id' => $user->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(200, $statusCode);
        $this->assertEquals($user->getEmail(), $result['email']);
        $this->assertFalse($result['isOnline']);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayNotHasKey('password', $result);
        $this->assertArrayNotHasKey('salt', $result);

        $this->assertArrayHasKey('counters', $result);
        $this->assertArrayHasKey('links', $result);
        $this->assertArrayHasKey('url', $result);

        $this->assertFalse($result['isFollowing']);
        $this->removeEntity($user);
    }

    public function testUpgradeAction()
    {
        $this->markTestSkipped();
        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_upgrade'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $result = $this->getResponseResult();
        $this->assertEmpty($result);
        $this->assertNotNull($result);

        $message = $this->getSwiftMailMessage();

        $this->assertEquals(200, $this->getResponseStatusCode());
        $this->assertEquals(
            $this->getContainer()->getParameter('admin_email'),
            key($message->getTo())
        );

        $this->removeEntity($user);
    }

    public function testUpgradeGuestFailsWithRedirect()
    {
        $this->markTestSkipped();
        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_upgrade'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $result = $this->getResponseResult();

        $this->assertEquals(302, $this->getResponseStatusCode());
        $this->assertNull($result);
    }

    public function testNewPasswordAction()
    {
        $user = $this->newUserPersistent();

        $data = [
            'email' => $user->getEmail(),
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_password_new'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $message = $this->getSwiftMailMessage();

        $this->assertEquals(200, $this->getResponseStatusCode());
        $this->assertEquals(
            $this->getContainer()->getParameter('email_noreply'),
            key($message->getFrom())
        );
        $this->assertEquals(
            $user->getEmail(),
            key($message->getTo())
        );

        $this->removeEntity($user);
    }
}
