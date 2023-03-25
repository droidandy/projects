<?php

namespace Test\AppBundle\Entity\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\StatsTrait;
use Test\Utils\Traits\ViewEventTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;
use DateTime;

class StatisticsRepositoryTest extends AbstractTestCase
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

    public function testGetEventsTotalForDate()
    {
        $date = new DateTime();
        $dateAfter = clone $date;
        $dateAfter->modify('+1 day');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $articleA = $this->newArticlePersistent([
            'user' => $userA,
        ]);
        $articleB = $this->newArticlePersistent([
            'user' => $userB,
        ]);
        $articleC = $this->newArticlePersistent([
            'user' => $userB,
        ]);
        $sessionA = $this->faker->md5;
        $sessionB = $this->faker->md5;
        $sessionC = $this->faker->md5;

        $this->newDisplayEventPersistent($articleA, $userA, $date, $sessionA, 'article', 'view');
        $this->newDisplayEventPersistent($articleA, $userB, $date, $sessionA, 'article', 'view');
        $this->newDisplayEventPersistent($articleB, $userB, $date, $sessionB, 'article', 'view');

        $this->newDisplayEventPersistent($articleA, null, $date, $sessionC, 'article', 'view');
        $this->newDisplayEventPersistent($articleA, null, $date, $sessionC, 'article', 'view');
        $this->newDisplayEventPersistent($articleB, null, $date, $sessionC, 'article', 'view');

        $this->newDisplayEventPersistent($articleA, $userB, $dateAfter, $sessionB, 'article', 'view');
        $this->newDisplayEventPersistent($articleC, $userB, $dateAfter, $sessionB, 'article', 'view');

        // Test
        $total = $this->getContainer()->get('statistics_repo')->getEventsTotalForDate('article', 'view', $date);

        // Verify
        $this->assertEquals($articleA->getId(), $total[0]['itemId']);
        $this->assertEquals($articleB->getId(), $total[1]['itemId']);
        $this->assertEquals(4, $total[0]['view']);
        $this->assertEquals(2, $total[1]['view']);
    }

    public function testGetLikesTotalForDate()
    {
        $date = new DateTime();
        $dateAfter = clone $date;
        $dateAfter->modify('+1 day');

        // Add
        $user = $this->newUserPersistent();
        $articleA = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $articleB = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $articleC = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $this->newArticleLikePersistent($user, $articleA);
        $this->newArticleLikePersistent($user, $articleA);
        $this->newArticleLikePersistent($user, $articleA);
        $this->newArticleLikePersistent($user, $articleB);
        $this->newArticleLikePersistent($user, $articleC, $dateAfter);

        // Test
        $total = $this->getContainer()->get('statistics_repo')->getLikesTotalForDate('article', $date);

        // Verify
        $this->assertEquals($articleB->getId(), $total[0]['itemId']);
        $this->assertEquals($articleA->getId(), $total[1]['itemId']);
        $this->assertEquals(1, $total[0]['likes']);
        $this->assertEquals(3, $total[1]['likes']);
        $this->assertEquals(2, count($total));
    }

    public function testGetSummaryEventsTotalForDate()
    {
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
        $sessionB = $this->faker->md5;
        $sessionC = $this->faker->md5;

        $this->newDisplayEventPersistent($article, $userA, $date, $sessionA, 'article', 'view');
        $this->newDisplayEventPersistent($article, $userB, $date, $sessionA, 'article', 'view');
        $this->newDisplayEventPersistent($article, $userB, $date, $sessionB, 'article', 'impression');
        $this->newArticleLikePersistent($userA, $article);
        $this->newArticleLikePersistent($userB, $article);

        $this->newDisplayEventPersistent($property, null, $date, $sessionC, 'property', 'view');
        $this->newDisplayEventPersistent($property, null, $date, $sessionC, 'property', 'view');
        $this->newDisplayEventPersistent($property, null, $date, $sessionC, 'property', 'view');
        $this->newDisplayEventPersistent($property, null, $date, $sessionC, 'property', 'impression');
        $this->newPropertyLikePersistent($userA, $property);

        // Test
        $total = $this->getContainer()->get('statistics_repo')->getSummaryEventsTotalForDate($date);

        // Verify
        $this->assertEquals(1, $total['article'][$article->getId()]['impression']);
        $this->assertEquals(2, $total['article'][$article->getId()]['view']);
        $this->assertEquals(2, $total['article'][$article->getId()]['like']);
        $this->assertEquals(1, $total['property'][$property->getId()]['impression']);
        $this->assertEquals(3, $total['property'][$property->getId()]['view']);
        $this->assertEquals(1, $total['property'][$property->getId()]['like']);
    }

    public function testGetTotalViews()
    {
        $date = new DateTime();
        $dateAfter = clone $date;
        $dateAfter->modify('+1 day');
        $dateBefore = clone $date;
        $dateBefore->modify('-1 day');

        // Add
        $user = $this->newUserPersistent();
        $propertyA = $this->newPropertyPersistent([
            'user' => $user,
        ]);
        $propertyB = $this->newPropertyPersistent([
            'user' => $user,
        ]);
        $propertyC = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        $this->newStatisticsPropertyPersistent($propertyA, 1, 0, 0, 0, $date);
        $this->newStatisticsPropertyPersistent($propertyA, 1, 0, 0, 0, $date);
        $this->newStatisticsPropertyPersistent($propertyA, 1, 0, 0, 0, $date);
        $this->newStatisticsPropertyPersistent($propertyB, 10, 0, 0, 0, $dateAfter);
        $this->newStatisticsPropertyPersistent($propertyB, 10, 0, 0, 0, $dateAfter);
        $this->newStatisticsPropertyPersistent($propertyB, 10, 0, 0, 0, $dateAfter);
        $this->newStatisticsPropertyPersistent($propertyC, 100, 0, 0, 0, $dateBefore);
        $this->newStatisticsPropertyPersistent($propertyC, 100, 0, 0, 0, $dateBefore);
        $this->newStatisticsPropertyPersistent($propertyC, 100, 0, 0, 0, $dateBefore);

        $viewCounts = $this->getContainer()->get('statistics_repo')->getTotalViews('property');

        $this->assertEquals(3, $viewCounts[0]['viewCount']);
        $this->assertEquals(30, $viewCounts[1]['viewCount']);
        $this->assertEquals(300, $viewCounts[2]['viewCount']);
    }
}
