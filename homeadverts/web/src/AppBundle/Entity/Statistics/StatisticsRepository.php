<?php

namespace AppBundle\Entity\Statistics;

use DateTime;
use Doctrine\ORM\EntityManager;
use RuntimeException;

class StatisticsRepository
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @param EntityManager $entityManager
     */
    public function __construct(EntityManager $entityManager)
    {
        $this->em = $entityManager;
    }

    /**
     * @param DateTime $date
     *
     * @return array
     */
    public function getSummaryEventsTotalForDate(DateTime $date)
    {
        $summary = [
            'article' => [],
            'property' => [],
        ];

        foreach (['article', 'property'] as $k => $model) {
            // Views & Impressions
            foreach (['view', 'impression'] as $k => $event) {
                foreach ($this->getEventsTotalForDate($model, $event, $date) as $item) {
                    $summary[$model][$item['itemId']][$event] = $item[$event];
                }
            }

            // Likes
            foreach ($this->getLikesTotalForDate($model, $date) as $item) {
                $summary[$model][$item['itemId']]['like'] = $item['likes'];
            }
        }

        return $summary;
    }

    /**
     * @param string   $model
     * @param DateTime $date
     *
     * @return mixed
     */
    public function getLikesTotalForDate($model, DateTime $date)
    {
        if ('article' == $model) {
            $entity = 'AppBundle\Entity\Social\ArticleLike';
        } elseif ('property' == $model) {
            $entity = 'AppBundle\Entity\Property\PropertyLike';
        } else {
            throw new RuntimeException();
        }

        $from = clone $date;
        $to = clone $date;
        $from->setTime(0, 0, 0);
        $to->setTime(23, 59, 59);

        return $this
            ->em
            ->createQueryBuilder()
            ->select('count(l.id) as likes', 'e.id as itemId')

            ->from($entity, 'l')
            ->innerJoin('l.liked', 'e')

            ->where('l.createdAt >= :from')->setParameter('from', $from)
            ->andWhere('l.createdAt <= :to')->setParameter('to', $to)
            ->groupBy('l.liked')
            ->orderBy('likes', 'ASC')
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param string   $entity
     * @param string   $event
     * @param DateTime $date
     *
     * @return mixed
     */
    public function getEventsTotalForDate($entity, $event, DateTime $date)
    {
        if (!in_array($event, ['view', 'impression'])) {
            throw new RuntimeException();
        }

        $className = sprintf(
            'AppBundle\Entity\Statistics\%s%s',
            ucfirst($entity),
            ucfirst($event)
        );

        $from = clone $date;
        $to = clone $date;
        $from->setTime(0, 0, 0);
        $to->setTime(23, 59, 59);

        return $this
            ->em
            ->createQueryBuilder()
            ->select('count(e.id) as '.$event, 'e.itemId')
            ->from($className, 'e')
            ->where('e.createdAt >= :from')->setParameter('from', $from)
            ->andWhere('e.createdAt <= :to')->setParameter('to', $to)
            ->groupBy('e.itemId')
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param string $field
     * @param int    $id
     * @param int    $count
     * @param $count
     */
    public function updatePropertyStats($field, $id, $count)
    {
        $dql = $this->getStatsCountDql('AppBundle\Entity\Property\Property', $field);

        $this
            ->em
            ->createQuery($dql)
            ->setParameter('count', $count)
            ->setParameter('id', $id)
            ->execute()
        ;
    }

    /**
     * @param string $field
     * @param int    $id
     * @param int    $count
     * @param $count
     */
    public function updateArticleStats($field, $id, $count)
    {
        $dql = $this->getStatsCountDql('AppBundle\Entity\Social\Article', $field);

        $this
            ->em
            ->createQuery($dql)
            ->setParameter('count', $count)
            ->setParameter('id', $id)
            ->execute()
        ;
    }

    /**
     * @param string $entityName
     *
     * @return mixed
     */
    public function getTotalViews($entity)
    {
        if (!in_array($entity, ['article', 'property'])) {
            throw new RuntimeException();
        }

        $className = sprintf(
            'AppBundle\Entity\Statistics\%sStatistics',
            ucfirst($entity)
        );

        return $this
            ->em
            ->createQueryBuilder()
            ->select('sum(s.views) as viewCount, s.itemId')
            ->from($className, 's')
            ->where('s.views > 0')
            ->groupBy('s.itemId')
            ->orderBy('viewCount', 'ASC')
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param string $entityName
     *
     * @return mixed
     */
    public function getTotalImpressions($entity)
    {
        if (!in_array($entity, ['article', 'property'])) {
            throw new RuntimeException();
        }

        $className = sprintf(
            'AppBundle\Entity\Statistics\%sStatistics',
            ucfirst($entity)
        );

        return $this
            ->em
            ->createQueryBuilder()
            ->select('sum(s.impressions) as impressionCount, s.itemId')
            ->from($className, 's')
            ->where('s.impressions > 0')
            ->groupBy('s.itemId')
            ->orderBy('impressionCount', 'ASC')
            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param string
     * @param string
     *
     * @return string
     */
    private function getStatsCountDql($entity, $field)
    {
        if (!in_array($field, ['view', 'impression'])) {
            throw new RuntimeException(sprintf('%s is not allowed value', $field));
        }

        return sprintf(
            'UPDATE %s al
            SET
                al.%sCount = :count
            WHERE al.id = :id',
            $entity,
            $field
        );
    }
}
