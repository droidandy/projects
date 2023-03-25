<?php

namespace AppBundle\Service\Statistics;

use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManager;
use DateTime;
use DateInterval;
use DatePeriod;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Statistics\ArticleStatistics;
use AppBundle\Entity\Statistics\PropertyStatistics;
use AppBundle\Entity\Domain\AbstractDisplayEvent;
use AppBundle\Entity\Statistics\StatisticsRepository;
use AppBundle\Entity\Statistics\ArticleImpression;
use AppBundle\Entity\Statistics\ArticleView;
use AppBundle\Entity\Statistics\PropertyImpression;
use AppBundle\Entity\Statistics\PropertyView;

class Statistics
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
    public function __construct(EntityManager $entityManager, StatisticsRepository $statisticsRepository)
    {
        $this->em = $entityManager;
        $this->statisticsRepository = $statisticsRepository;
    }

    public function addDemoEvents()
    {
        // todo: add more numbers for demo purposes
    }

    /**
     * @param Request   $request
     * @param array     $data
     * @param User|null $user
     *
     * @return AbstractDisplayEvent
     */
    public function addDisplayEventNowFromRequest(Request $request, array $data, User $user = null)
    {
        return $this->addDisplayEvent(
            new DateTime(),
            $data,
            $request->getClientIp(),
            $this->buildSessionFingerprint($request),
            $this->buildMeta($request),
            $user
        );
    }

    /**
     * @param int $id
     *
     * @return array
     */
    public function getArticleStatistics($id)
    {
        $statistics = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\ArticleStatistics')
            ->findBy([
                'itemId' => $id,
            ], [
                'date' => 'ASC',
            ]);

        return $this->populateMissingDates($statistics);
    }

    /**
     * @param int $id
     *
     * @return array
     */
    public function getPropertyStatistics($id)
    {
        $statistics = $this
            ->em
            ->getRepository('AppBundle\Entity\Statistics\PropertyStatistics')
            ->findBy([
                'itemId' => $id,
            ], [
                'date' => 'ASC',
            ]);

        return $this->populateMissingDates($statistics);
    }

    /**
     * @param Request $request
     *
     * @return string
     */
    private function buildSessionFingerprint(Request $request)
    {
        return md5(
            sprintf(
                '%s%s',
                $request->getSession()->getId(),
                AbstractDisplayEvent::SESSION_SALT
            )
        );
    }

    /**
     * @param DateTime  $dateTime
     * @param User|null $user
     * @param array     $data
     * @param string    $ip
     * @param string    $sessionId
     * @param array     $meta
     *
     * @return AbstractDisplayEvent
     */
    private function addDisplayEvent(DateTime $dateTime, array $data, $ip, $sessionId, array $meta, User $user = null)
    {
        $viewEvent = $this->newDisplayEventInstance($data);

        if ($user) {
            $viewEvent->setUserId($user->getId());
        }

        $viewEvent->setIp($ip);
        $viewEvent->setSessionId($sessionId);
        $viewEvent->setMetadata($meta);
        $viewEvent->setItemId($data['id']);
        $viewEvent->setSource($data['source']);
        $viewEvent->setCreatedAt(new DateTime());

        $this->em->persist($viewEvent);

        return $viewEvent;
    }

    /**
     * @param Request $request
     *
     * @return array
     */
    private function buildMeta(Request $request)
    {
        return [
            'userAgent' => $request->headers->get('User-Agent'),
        ];
    }

    /**
     * @param array $data
     *
     * @return ArticleView|ArticleImpression|PropertyView|PropertyImpression
     */
    private function newDisplayEventInstance(array $data)
    {
        $className = sprintf(
            'AppBundle\Entity\Statistics\%s%s',
            ucfirst($data['model']),
            ucfirst($data['event'])
        );

        return new $className();
    }

    /**
     * @param array<PropertyStatistics|ArticleStatistics> $statistics
     *
     * @return array
     */
    private function populateMissingDates(array $statistics)
    {
        $statisticsWithMissingDates = [];

        if ($statistics) {
            $begin = clone $statistics[0]->getDate();
            $end = clone $statistics[count($statistics) - 1]->getDate();
            $begin->modify('first day of this month');
            $end->modify('first day of next month');

            $interval = new DateInterval('P1D');
            $dateRange = new DatePeriod($begin, $interval, $end);

            foreach ($dateRange as $date) {
                $item = new PropertyStatistics();
                $item->setDate($date);

                /** @var PropertyStatistics|ArticleStatistics $row */
                foreach ($statistics as $row) {
                    if ($row->getDate() == $date) {
                        $item = $row;
                    }
                }

                $statisticsWithMissingDates[] = $item;
            }
        }

        return $statisticsWithMissingDates;
    }
}
