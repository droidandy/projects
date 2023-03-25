<?php

namespace AppBundle\Service\Statistics;

use Doctrine\ORM\EntityManager;
use DateTime;
use DatePeriod;
use DateInterval;
use AppBundle\Entity\Statistics\ArticleStatistics;
use AppBundle\Entity\Statistics\PropertyStatistics;
use AppBundle\Entity\Statistics\StatisticsRepository;

class StatisticsAggregation
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var EntityManager
     */
    private $statisticsRepository;

    /**
     * @param EntityManager        $entityManager
     * @param StatisticsRepository $statisticsRepository
     */
    public function __construct(
        EntityManager $entityManager,
        StatisticsRepository $statisticsRepository
    ) {
        $this->em = $entityManager;
        $this->statisticsRepository = $statisticsRepository;
    }

    public function populateStatsForAllDates()
    {
        $begin = $this->getFirstEventDate();
        $end = (new DateTime())->modify('+1 day');

        $interval = new DateInterval('P1D');
        $dateRange = new DatePeriod($begin, $interval, $end);

        foreach ($dateRange as $date) {
            $this->populateStatsForDate($date, false);
        }

        $this->em->flush();
    }

    /**
     * $summary = [
     *   'article' => [
     *       [
     *          'articleId' => [
     *              'view' => 1,
     *              'impression' => 2,
     *           ]
     *       ]
     *   ],
     *   'property' => [...]
     * ];.
     *
     * @param DateTime $date
     * @param bool     $withFlush
     */
    public function populateStatsForDate(DateTime $date, $withFlush = true)
    {
        $summary = $this->statisticsRepository->getSummaryEventsTotalForDate($date);

        foreach ($summary as $model => $rows) {
            foreach ($rows as $id => $data) {
                $entity = $this->getStatisticsEntity($model, $id, $date);

                if (isset($data['impression'])) {
                    $entity->setImpressions($data['impression']);
                }
                if (isset($data['view'])) {
                    $entity->setViews($data['view']);
                }
                if (isset($data['like'])) {
                    $entity->setLikes($data['like']);
                }

                $this->em->persist($entity);
            }
        }

        if ($withFlush) {
            $this->em->flush();
        }
    }

    public function populateSummaries()
    {
        $impressionArticle = $this->statisticsRepository->getTotalImpressions('article');
        $viewsArticle = $this->statisticsRepository->getTotalViews('article');

        $impressionProperty = $this->statisticsRepository->getTotalImpressions('property');
        $viewsProperty = $this->statisticsRepository->getTotalViews('property');

        foreach ($impressionProperty as $property) {
            $this->statisticsRepository
                ->updatePropertyStats(
                    'impression',
                    $property['itemId'],
                    $property['impressionCount']
                );
        }
        foreach ($viewsProperty as $property) {
            $this->statisticsRepository
                ->updatePropertyStats(
                    'view',
                    $property['itemId'],
                    $property['viewCount']
                );
        }

        foreach ($impressionArticle as $article) {
            $this->statisticsRepository
                ->updateArticleStats(
                    'impression',
                    $article['itemId'],
                    $article['impressionCount']
                );
        }
        foreach ($viewsArticle as $article) {
            $this->statisticsRepository
                ->updateArticleStats(
                    'view',
                    $article['itemId'],
                    $article['viewCount']
                );
        }
    }

    /**
     * @param string   $model
     * @param int      $id
     * @param DateTime $date
     *
     * @return ArticleStatistics|PropertyStatistics
     */
    private function getStatisticsEntity($model, $id, DateTime $date)
    {
        $className = sprintf('AppBundle\Entity\Statistics\%sStatistics', ucfirst($model));
        $entity = $this->em->getRepository($className)->findOneBy([
            'itemId' => $id,
            'date' => $date,
        ]);

        if ($entity) {
            return $entity;
        }

        /**
         * @var ArticleStatistics|PropertyStatistics
         */
        $entity = new $className();
        $entity->setDate($date);
        $entity->setItemId($id);

        return $entity;
    }

    /**
     * @return DateTime
     */
    private function getFirstEventDate()
    {
        $initialDate = new DateTime();
        $events = [];

        $events[] = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\ArticleImpression')
            ->findOneBy([], ['id' => 'ASC']);
        $events[] = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\PropertyImpression')
            ->findOneBy([], ['id' => 'ASC']);
        $events[] = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\ArticleView')
            ->findOneBy([], ['id' => 'ASC']);
        $events[] = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\PropertyView')
            ->findOneBy([], ['id' => 'ASC']);
        $events[] = $this
            ->em
            ->getRepository('AppBundle\Entity\Social\ArticleLike')
            ->findOneBy([], ['id' => 'ASC']);
        $events[] = $this
            ->em
            ->getRepository('AppBundle\Entity\Property\PropertyLike')
            ->findOneBy([], ['id' => 'ASC']);

        foreach ($events as $event) {
            if ($event) {
                if ($initialDate > $event->getCreatedAt()) {
                    $initialDate = $event->getCreatedAt();
                }
            }
        }

        return $initialDate;
    }
}
