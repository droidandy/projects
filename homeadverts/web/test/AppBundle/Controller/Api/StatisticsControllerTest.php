<?php

namespace Test\AppBundle\Controller\Api;

use DateTime;
use AppBundle\Entity\Domain\AbstractDisplayEvent;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\StatsTrait;
use Test\Utils\Traits\UserTrait;

class StatisticsControllerTest extends AbstractWebTestCase
{
    use AddressTrait;
    use LocationTrait;
    use GoogleLocationTrait;
    use UserTrait;
    use ArticleTrait;
    use PropertyTrait;
    use StatsTrait;

    public function testDisplayEventPostActionUser()
    {
        // Add
        $user = $this->newUserPersistent();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $this->logIn($user);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_statistics_event_display_post'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'id' => $article->getId(),
                'source' => AbstractDisplayEvent::SOURCE_COLLECTION,
                'model' => 'article',
                'event' => AbstractDisplayEvent::EVENT_VIEW,
            ])
        );

        // Verify
        $result = $this->getResponseResult();

        $this->assertEquals(200, $this->getResponseStatusCode());
        $this->assertEmpty($result);

        // Verify
        $view = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\ArticleView')
            ->findOneBy([
                'itemId' => $article->getId(),
                'userId' => $user->getId(),
                'source' => AbstractDisplayEvent::SOURCE_COLLECTION,
            ]);

        $this->assertNotNull($view);

        //Remove
        $this->em->remove($article);
        $this->em->remove($user);
        $this->em->flush();
    }

    public function testDisplayEventPostActionGuest()
    {
        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_statistics_event_display_post'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'id' => $property->getId(),
                'source' => AbstractDisplayEvent::SOURCE_COLLECTION,
                'model' => 'property',
                'event' => AbstractDisplayEvent::EVENT_IMPRESSION,
            ])
        );

        // Verify
        $result = $this->getResponseResult();

        $this->assertEquals(200, $this->getResponseStatusCode());
        $this->assertEmpty($result);

        // Verify
        $view = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\PropertyImpression')
            ->findOneBy([
                'itemId' => $property->getId(),
                'userId' => null,
                'source' => AbstractDisplayEvent::SOURCE_COLLECTION,
            ]);

        $this->assertNotNull($view);

        //Remove
        $this->em->remove($property);
        $this->em->remove($user);
        $this->em->flush();
    }

    public function testGetPropertyStatisticsAction()
    {
        $date = new DateTime('2018-05-03');
        $dateAfter = clone $date;
        $dateAfter->modify('+1 day');

        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);
        $this->newStatisticsPropertyPersistent($property, 100, 0, 0, 0, $date);
        $this->newStatisticsPropertyPersistent($property, 200, 0, 0, 0, $dateAfter);

        $this->logIn($user);

        // Test
        $this->client->request(
            'GET',
            $this->generateRoute('ha_statistics_property_get', [
                'id' => $property->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        // Verify
        $result = $this->getResponseResult();

        $this->assertTrue(in_array('ROLE_USER', $user->getRoles()));
        $this->assertTrue(in_array('ROLE_AGENT', $user->getRoles()));
        $this->assertEquals(2, count($user->getRoles()));

        $this->assertEquals(200, $this->getResponseStatusCode());
        $this->assertEquals($property->getId(), $result[2]['itemId']);
        $this->assertEquals($property->getId(), $result[3]['itemId']);
        $this->assertEquals(100, $result[2]['views']);
        $this->assertEquals(200, $result[3]['views']);

        $this->assertEquals(31, count($result)); // 31 days
    }

    public function testGetPropertyStatisticsActionGuestRedirect()
    {
        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        // Test
        $this->client->request(
            'GET',
            $this->generateRoute('ha_statistics_property_get', [
                'id' => $property->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertEquals(302, $this->getResponseStatusCode());
    }

    public function testGetPropertyStatisticsActionUserAccessDenied()
    {
        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);
        $user->removeRole('ROLE_AGENT');
        $this->em->persist($user);
        $this->em->flush();

        $this->logIn($user);

        // Test
        $this->client->request(
            'GET',
            $this->generateRoute('ha_statistics_property_get', [
                'id' => $property->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertTrue(in_array('ROLE_USER', $user->getRoles()));
        $this->assertEquals(1, count($user->getRoles()));
        $this->assertEquals(403, $this->getResponseStatusCode());
    }
}
