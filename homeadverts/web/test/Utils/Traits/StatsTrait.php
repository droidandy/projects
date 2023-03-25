<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Statistics\ArticleStatistics;
use AppBundle\Entity\Statistics\PropertyStatistics;
use DateTime;
use AppBundle\Entity\Social\Article;

trait StatsTrait
{
    /**
     * @param Property $property
     * @param int      $views
     * @param int      $impressions
     * @param int      $likes
     * @param int      $shares
     * @param DateTime $date
     *
     * @return PropertyStatistics
     */
    public function newStatisticsPropertyPersistent(
        Property $property,
        $views,
        $impressions,
        $likes,
        $shares,
        DateTime $date
    ) {
        $this->newStatisticsPersistent(
            PropertyStatistics::class,
            $property->getId(),
            $views,
            $impressions,
            $likes,
            $shares,
            $date
        );
    }

    /**
     * @param Article  $article
     * @param int      $views
     * @param int      $impressions
     * @param int      $likes
     * @param int      $shares
     * @param DateTime $date
     *
     * @return ArticleStatistics
     */
    public function newStatisticsArticlePersistent(
        Article $article,
        $views,
        $impressions,
        $likes,
        $shares,
        DateTime $date
    ) {
        $this->newStatisticsPersistent(
            ArticleStatistics::class,
            $article->getId(),
            $views,
            $impressions,
            $likes,
            $shares,
            $date
        );
    }

    /**
     * @param int      $id
     * @param int      $views
     * @param int      $impressions
     * @param int      $likes
     * @param int      $shares
     * @param DateTime $date
     *
     * @return ArticleStatistics
     */
    private function newStatisticsPersistent(
        $class,
        $id,
        $views,
        $impressions,
        $likes,
        $shares,
        DateTime $date
    ) {
        $statistics = new $class();
        $statistics->setItemId($id);
        $statistics->setViews($views);
        $statistics->setImpressions($impressions);
        $statistics->setLikes($likes);
        $statistics->setShares($shares);
        $statistics->setDate($date);

        $this->em->persist($statistics);
        $this->em->flush($statistics);

        return $statistics;
    }
}
