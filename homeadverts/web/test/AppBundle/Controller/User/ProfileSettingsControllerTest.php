<?php

namespace Test\AppBundle\Controller;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class ProfileSettingsControllerTest extends AbstractWebTestCase
{
    use UserTrait;

    public function testProfileImageUpload()
    {
        $user = $this->newUserPersistent();

        $this->logIn($user);
        $profileDetailsUrl = $this->generateRoute('ha_user_articles', [
            'id' => $user->getId(),
            'slug' => $user->slug(),
        ]);

        $crawler = $this->client->request(
            'GET',
            $profileDetailsUrl
        );
        $response = $this->client->getResponse();

        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());

        $form = $crawler->filter('form[action="/profile/settings/edit/photo"]')->form();
        $csrfToken = $form['profile_image[_token]']->getValue();

        $sourceName = 'profile_photo.png';
        $destName = 'profile_photo_'.sha1(uniqid()).'.png';
        copy($this->getFixturesPath().$sourceName, $this->getFixturesPath().$destName);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_account_settings', [
                'type' => 'profile_image',
                'redirect' => $profileDetailsUrl,
            ]),
            ['profile_image' => [
                '_token' => $csrfToken,
            ]],
            ['profile_image' => [
                'profileImageManual' => $this->getFile($destName, 'image/png'),
            ]]
        );
        $response = $this->client->getResponse();

        $location = $response->headers->get('location');
        $this->assertEquals(Response::HTTP_FOUND, $response->getStatusCode());
        $this->assertEquals($profileDetailsUrl, $location);
    }

    /**
     * @param $file
     * @param $mimeType
     *
     * @return UploadedFile
     */
    private function getFile($file, $mimeType)
    {
        return new UploadedFile(
            $this->getFixturesPath().$file,
            $file,
            $mimeType
        );
    }
}
