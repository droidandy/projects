<?php

namespace Test\AppBundle\Controller\Api\User;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class UserSettingControllerTest extends AbstractWebTestCase
{
    use UserTrait;

    public function testSocialUnlink()
    {
        $data = [
            'email' => $this->faker->email,
            'password' => $this->faker->numberBetween(),
        ];

        $user = $this->newUser($data);
        $this->em->persist($user);
        $this->em->flush($user);

        $this->logIn($user);

        //Test
        $this->client->request(
            'DELETE',
            $this->generateRoute('ha_user_settings_social_disconnect', [
                'service' => 'facebook',
            ]),
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

    public function testBioPostActionSuccess()
    {
        $data = [
            'email' => $this->faker->email,
            'password' => $this->faker->numberBetween(),
        ];

        $user = $this->newUser($data);
        $this->em->persist($user);
        $this->em->flush($user);

        $this->logIn($user);

        //Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_settings_bio'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'name' => $this->faker->name,
                'bio' => $this->faker->text,
            ])
        );

        $response = $this->client->getResponse();
        $statusCode = $response->getStatusCode();
        $this->assertEquals(200, $statusCode);

        $this->removeEntity($user);
    }

    public function testBioPostActionFail()
    {
        $data = [
            'email' => $this->faker->email,
            'password' => $this->faker->numberBetween(),
        ];

        $user = $this->newUser($data);
        $this->em->persist($user);
        $this->em->flush($user);

        $this->logIn($user);

        //Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_settings_bio'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'name' => '',
                'bio' => '',
            ])
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(400, $statusCode);
        $this->assertEquals('Please enter your full name.', $result['errors']['name']);
        $this->removeEntity($user);
    }

    public function testSettingsPostActionInvalidSettingsFail()
    {
        $data = [
            'A' => true,
        ];

        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_settings_post', [
                'id' => $user->getId(),
            ]),
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
        $this->assertEquals('Property "A" is not a part of settings', $result['errors']['settings']);
        $this->removeEntity($user);
    }

    public function testSettingsPostActionSuccess()
    {
        $data = [
            'twitterAutoshare' => true,
        ];

        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_settings_post', [
                'id' => $user->getId(),
            ]),
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
}
