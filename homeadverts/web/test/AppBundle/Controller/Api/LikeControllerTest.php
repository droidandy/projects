<?php

namespace Test\AppBundle\Controller\Api;

use AppBundle\Entity\UserRepository;
use AppBundle\Entity\User\User;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;

class LikeControllerTest extends AbstractWebTestCase
{
    use UserTrait, ArticleTrait;

    public function testAddLikeAction()
    {
        /** @var UserRepository $userRepository */
        $userRepository = $this->getContainer()->get('user_repo');

        // Add
        $user = $this->newUserPersistent();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $this->logIn($user);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_article_like_add', [
                'id' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        // Verify
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $updatedArticle = $this->em
            ->getRepository('AppBundle:Social\Article')
            ->findOneBy([
                'token' => $article->getToken(),
            ]);

        $this->assertEquals(200, $statusCode);
        $this->assertEmpty($result);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(1, $updatedArticle->likes->count());
        $this->assertEquals(
            $updatedArticle->likes->first()->getUser()->getId(),
            $user->getId()
        );
        $this->assertTrue($userRepository->isLikedByUser($user, $article));

        //Remove
        $this->em->remove($article);
        $this->em->remove($user);
        $this->em->flush();
    }

    public function testRemoveLikeAction()
    {
        /** @var UserRepository $userRepository */
        $userRepository = $this->getContainer()->get('user_repo');

        // Add
        $user = $this->newUserPersistent();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $like = $this->newArticleLikePersistent($user, $article);
        $this->logIn($user);

        // Test
        $this->client->request(
            'DELETE',
            $this->generateRoute('ha_article_like_remove', [
                'id' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        // Verify
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $updatedArticle = $this->em
            ->getRepository('AppBundle:Social\Article')
            ->findOneBy([
                'token' => $article->getToken(),
            ]);

        $this->assertEquals(200, $statusCode);
        $this->assertEmpty($result);

        $this->assertEquals(0, $updatedArticle->likes->count());
        $this->assertFalse($userRepository->isLikedByUser($user, $article));

        //Remove
        $this->em->remove($article);
        $this->em->remove($like);
        $this->em->remove($user);
        $this->em->flush();
    }
}
