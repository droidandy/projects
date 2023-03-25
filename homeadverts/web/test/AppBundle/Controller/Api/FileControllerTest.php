<?php

namespace Test\AppBundle\Controller\Api;

use AppBundle\Entity\Storage\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\MessageTrait;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class FileControllerTest extends AbstractWebTestCase
{
    use TagTrait;
    use UserTrait;
    use MessageTrait;
    use RoomTrait;
    use FileTrait;
    use ArticleTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testUploadActionConvertWebp()
    {
        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_file_post'),
            [],
            ['file' => $this->buildUploadedFile('mountain.webp')],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'origin' => 'article',
            ])
        );

        // Verify
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(201, $statusCode);

        $this->assertEquals('mountain.jpg', $result['source']);
        $this->assertEquals('image/jpeg', $result['mimeType']);
        $this->assertEquals('jpeg', $result['ext']);

// todo: produce different values on different OS, to be investigated
//        $this->assertEquals('62326',$result['size']);
//        $this->assertEquals(
//            'a9883238a9797357cd66c5f5d24212fb9bac0a6d218511abd3f9eba914d9d9c8',
//            $result['hash']
//        );

        unlink($this->getFixturesPath() . 'mountain.jpg');
    }

    public function testUploadActionWrongMimeTypeAndOrigin()
    {
        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_file_post'),
            [],
            ['file' => $this->buildUploadedFile('stars.avi')],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'origin' => 'homepage',
            ])
        );

        // Verify
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(400, $statusCode);
        $this->assertEquals(
            'The mime type of the file is invalid ("video/x-msvideo"). Allowed mime types are "image/webp", "image/jpeg", "image/png", "image/gif", "image/bmp", "image".',
            $result['errors']['fileInfo']
        );
        $this->assertEquals(
            'File origin is wrong',
            $result['errors']['origin']
        );
    }

    public function testUploadActionEmptyFile()
    {
        $this->expectException(\TypeError::class);

        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_file_post'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'origin' => 'article',
            ])
        );
    }

    public function testUploadActionMessengerAttachmentSuccessful()
    {
        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $message = $this->newMessagePersistent($user, $room);

        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_file_post'),
            [],
            ['file' => $this->buildUploadedFile('image.jpg')],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'origin' => 'message',
                'message' => [
                    'id' => $message->getId()
                ],
            ])
        );

        // Verify response
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(201, $statusCode);
        $this->assertEquals($user->getId(), $result['user']['id']);
        $this->assertEquals('message', $result['origin']);
        $this->assertEquals($user->getId(), $result['message']['user']['id']);
    }

    public function testUploadActionMessengerAttachmentMessageOwnershipFails()
    {
        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $message = $this->newMessagePersistent($user, $room);

        $userOther = $this->newUserPersistent();
        $this->logIn($userOther);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_file_post'),
            [],
            ['file' => $this->buildUploadedFile('image.jpg')],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'origin' => 'message',
                'message' => [
                    'id' => $message->getId()
                ],
            ])
        );

        // Verify response
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(400, $statusCode);
        $this->assertEquals('File uploader must be the owner of message', $result['errors']['message']);
    }

    public function testUploadActionSuccessful()
    {
        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_file_post'),
            [],
            ['file' => $this->buildUploadedFile('image.jpg')],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'origin' => 'article',
            ])
        );

        // Verify response
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(201, $statusCode);
        $this->assertEquals($user->getId(), $result['user']['id']);
        $this->assertEquals('article', $result['origin']);
        $this->assertEquals('image/jpeg', $result['mimeType']);
        $this->assertEquals(372963, $result['size']);
        $this->assertEquals('jpeg', $result['ext']);
        $this->assertNotNull($result['hash']);

        // Non needed at this moment, to be uncommented and improved after.
        // $this->assertNotNull($result['urlSmall']);
        // $this->assertNotNull($result['urlMedium']);
        // $this->assertNotNull($result['urlLarge']);

        $this->assertArrayNotHasKey('metadata', $result);

        // Verify DB
        $file = $this->em
            ->getRepository(File::class)
            ->find($result['id']);

        $this->assertEquals(
            '35d00f733c8e699b1cfe8defd04ccef82cee621f8a05fb1ad391aba3e9a9384c',
            $file->hash
        );
        $this->assertEquals(
            'https://luxuryaffairs-dev.s3.amazonaws.com/media/35/d0/0f733c8e699b1cfe8defd04ccef82cee621f8a05fb1ad391aba3e9a9384c.jpeg',
            $file->metadata['ObjectURL']
        );
    }

    public function testUploadArticleOriginActionSuccessful()
    {
        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_file_upload_article'),
            [],
            ['files' => [
                $this->buildUploadedFile('image.jpg')
            ]],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        // Verify response
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(201, $statusCode);
        $this->assertNotNull($result['source']);
        $this->assertNotNull($result['url']);
    }

    public function testGet()
    {
        $user = $this->newUserPersistent();
        $file = $this->newFilePersistent($user);
        $this->logIn($user);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_file_get', [
                'id' => $file->getId()
            ]),
            [],
            ['file' => $this->buildUploadedFile('image.jpg')],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'origin' => 'article',
            ])
        );

        // Verify
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(200, $statusCode);
        $this->assertEquals('article', $result['origin']);
        $this->assertEquals('image/jpg', $result['mimeType']);
        $this->assertEquals(0, $result['size']);
        $this->assertEquals('jpg', $result['ext']);
        $this->assertEquals($file->source, $result['source']);
        $this->assertNotEmpty($result['hash']);
        $this->assertNotEmpty($result['createdAt']);
        $this->assertNotEmpty($result['updatedAt']);
        $this->assertArrayNotHasKey('metadata', $result);
    }

    /**
     * @param string $file
     *
     * @return UploadedFile
     */
    private function buildUploadedFile(string $file)
    {
        return new UploadedFile($this->getFixturesPath() . $file, $file);
    }
}
