<?php

namespace Test\AppBundle\Controller;

use DateTime;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\StatsTrait;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\ViewEventTrait;

class StatisticsAggregationTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;
    use PropertyTrait;
    use ViewEventTrait;
    use StatsTrait;
    use GoogleLocationTrait;
    use AddressTrait;

    protected $rollbackTransactions = true;

    public function testPopulateStatsForDate()
    {
        $statisticsRepoProperty = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\PropertyStatistics');
        $statisticsRepoArticle = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\ArticleStatistics');

        $date = new DateTime();
        $dateAfter = clone $date;
        $dateAfter->modify('+1 day');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $article = $this->newArticlePersistent([
            'user' => $userA,
        ]);
        $property = $this->newPropertyPersistent([
            'user' => $userB,
        ]);
        $sessionA = $this->faker->md5;
        $sessionC = $this->faker->md5;

        $this->newDisplayEventPersistent($article, $userA, $date, $sessionA, 'article', 'view');
        $this->newDisplayEventPersistent($article, $userB, $date, $sessionA, 'article', 'view');
        $this->newArticleLikePersistent($userA, $article);
        $this->newArticleLikePersistent($userB, $article);

        $this->newDisplayEventPersistent($property, null, $date, $sessionC, 'property', 'view');
        $this->newDisplayEventPersistent($property, null, $date, $sessionC, 'property', 'view');
        $this->newDisplayEventPersistent($property, null, $date, $sessionC, 'property', 'view');
        $this->newDisplayEventPersistent($property, null, $date, $sessionC, 'property', 'impression');
        $this->newPropertyLikePersistent($userA, $property);

        // Run
        $this->getContainer()->get('ha_statistics_aggregation')->populateStatsForDate($date);

        // Verify
        $propertyStatsDate = $statisticsRepoProperty->findOneBy([
            'itemId' => $property->getId(),
            'date' => $date,
        ]);
        $propertyStatsDateAfter = $statisticsRepoProperty->findOneBy([
            'itemId' => $property->getId(),
            'date' => $dateAfter,
        ]);
        $articleStatsDate = $statisticsRepoArticle->findOneBy([
            'itemId' => $article->getId(),
            'date' => $date,
        ]);
        $articleStatsDateAfter = $statisticsRepoArticle->findOneBy([
            'itemId' => $article->getId(),
            'date' => $dateAfter,
        ]);

        $this->assertEquals(2, $articleStatsDate->getViews());
        $this->assertEquals(0, $articleStatsDate->getImpressions());
        $this->assertEquals(2, $articleStatsDate->likes);
        $this->assertEquals(3, $propertyStatsDate->getViews());
        $this->assertEquals(1, $propertyStatsDate->getImpressions());
        $this->assertEquals(1, $propertyStatsDate->likes);

        $this->assertNotNull($articleStatsDate->getImpressions()); // Must be zero, not NULL

        $this->assertNull($propertyStatsDateAfter);
        $this->assertNull($articleStatsDateAfter);
    }

    public function testPopulateSummaries()
    {
        $date = new DateTime();

        // Add
        $user = $this->newUserPersistent();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        $this->newStatisticsPropertyPersistent($property, 1, 0, 0, 0, $date);
        $this->newStatisticsArticlePersistent($article, 2, 0, 0, 0, $date);

        // Run
        $this->getContainer()->get('ha_statistics_aggregation')->populateSummaries();

        $this->em->refresh($article);
        $this->em->refresh($property);

        $this->assertEquals(1, $property->getViewCount());
        $this->assertEquals(2, $article->getViewCount());
    }
}
