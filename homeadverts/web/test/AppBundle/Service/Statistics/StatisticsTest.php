<?php

namespace Test\Service\Statistics;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\StatsTrait;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\ViewEventTrait;
use DateTime;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Domain\AbstractDisplayEvent;

class StatisticsTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;
    use PropertyTrait;
    use ViewEventTrait;
    use StatsTrait;
    use AddressTrait;
    use GoogleLocationTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testAddArticleViewEventAsUser()
    {
        $request = $this->getRequest();

        // Add
        $user = $this->newUserPersistent();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);

        // Test
        $this
            ->getContainer()
            ->get('ha_statistics')
            ->addDisplayEventNowFromRequest(
                $request,
                [
                    'id' => $article->getId(),
                    'source' => AbstractDisplayEvent::SOURCE_COLLECTION,
                    'model' => 'article',
                    'event' => AbstractDisplayEvent::EVENT_VIEW,
                ],
                $user
            );
        $this->em->flush();

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
    }

    public function testAddPropertyImpressionEventAsGuest()
    {
        $request = $this->getRequest();

        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        // Test
        $this
            ->getContainer()
            ->get('ha_statistics')
            ->addDisplayEventNowFromRequest(
                $request,
                [
                    'id' => $property->getId(),
                    'source' => AbstractDisplayEvent::SOURCE_COLLECTION,
                    'model' => 'property',
                    'event' => AbstractDisplayEvent::EVENT_IMPRESSION,
                ]
            );
        $this->em->flush();

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
    }

    public function testGetArticleStatistics()
    {
        $date = new DateTime('2018-05-03');
        $dateAfter = clone $date;
        $dateAfter->modify('+1 day');

        // Add
        $user = $this->newUserPersistent();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);

        $this->newStatisticsArticlePersistent($article, 10, 0, 0, 0, $date);
        $this->newStatisticsArticlePersistent($article, 20, 0, 0, 0, $dateAfter);

        // Run
        $data = $this
            ->getContainer()
            ->get('ha_statistics')
            ->getArticleStatistics(
                $article->getId()
            );

        $this->assertEquals($article->getId(), $data[2]->getItemId());
        $this->assertEquals($article->getId(), $data[3]->getItemId());
        $this->assertEquals(10, $data[2]->getViews());
        $this->assertEquals(20, $data[3]->getViews());
    }

    public function testGetPropertyStatistics()
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

        // Run
        $data = $this
            ->getContainer()
            ->get('ha_statistics')
            ->getPropertyStatistics(
                $property->getId()
            )
        ;

        $this->assertEquals($property->getId(), $data[2]->getItemId());
        $this->assertEquals($property->getId(), $data[3]->getItemId());
        $this->assertEquals(100, $data[2]->getViews());
        $this->assertEquals(200, $data[3]->getViews());
    }

    /**
     * @return Request
     */
    public function getRequest()
    {
        $session = $this->getContainer()->get('session');
        $session->setId($this->faker->uuid);

        $request = new Request();
        $request->server->set('REMOTE_ADDR', '127.0.0.1');
        $request->headers->set('userAgent', $this->faker->userAgent);

        $request->setSession($session);

        return $request;
    }
}
