<?php

namespace AppBundle\Service\Report;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Job\ExecutionTimeTracker;
use AppBundle\Service\Email\ImportMailerInterface;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Import\Queue\ImportContext;

class ImportReporter
{
    /**
     * @var ImportMailerInterface
     */
    private $mailer;
    /**
     * @var PropertyRepository
     */
    private $propertyRepo;
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var ExecutionTimeTracker
     */
    private $executionTimeTracker;

    /**
     * ImportReporter constructor.
     *
     * @param ImportMailerInterface $mailer
     * @param PropertyRepository    $propertyRepo
     * @param UserRepository        $userRepo
     * @param ExecutionTimeTracker  $executionTimeTracker
     */
    public function __construct(
        ImportMailerInterface $mailer,
        PropertyRepository $propertyRepo,
        UserRepository $userRepo,
        ExecutionTimeTracker $executionTimeTracker
    ) {
        $this->mailer = $mailer;
        $this->propertyRepo = $propertyRepo;
        $this->userRepo = $userRepo;
        $this->executionTimeTracker = $executionTimeTracker;
    }

    public function sendSummary(ImportContext $importContext)
    {
        $summary = $this->getSummary($importContext);
        $this->mailer->send($summary, $importContext);
    }

    private function getSummary(ImportContext $importContext)
    {
        $importJob = $importContext->getImportJob();

        $counts = $this->propertyRepo->getSummary();
        $companyCounts = $this->userRepo->getCompanySummary();
        $officeCounts = $this->userRepo->getOfficeSummary();
        $userCounts = $this->userRepo->getAgentSummary();
        $summary = [
            'job_id' => $importJob->getId(),
            'type' => $importJob->getType(),
            'date_added' => $importJob->getDateAdded()->format('c'),
            'time_summary' => $this->executionTimeTracker->getAggregatedStat($importJob),
            'feed_summary' => [
                'company' => [
                    'total' => $importJob->getCompanyTotal(),
                    'processed' => $importJob->getCompanyProcessed(),
                    'skipped' => $importJob->getCompanySkipped(),
                    'updated' => $importJob->getCompanyUpdated(),
                    'added' => $importJob->getCompanyAdded(),
                    'errors' => $importJob->getCompanyErrors(),
                    'removed' => $importJob->getCompanyRemoved(),
                ],
                'office' => [
                    'total' => $importJob->getOfficeTotal(),
                    'processed' => $importJob->getOfficeProcessed(),
                    'skipped' => $importJob->getOfficeSkipped(),
                    'updated' => $importJob->getOfficeUpdated(),
                    'added' => $importJob->getOfficeAdded(),
                    'errors' => $importJob->getOfficeErrors(),
                    'removed' => $importJob->getOfficeRemoved(),
                ],
                'property' => [
                    'total' => $importJob->getTotal(),
                    'processed' => $importJob->getProcessed(),
                    'skipped' => $importJob->getSkipped(),
                    'updated' => $importJob->getUpdated(),
                    'added' => $importJob->getAdded(),
                    'errors' => [
                        'total' => $importJob->getErrors(),
                        'bedroom' => $importJob->getErrorsBedroom(),
                        'metadata' => $importJob->getErrorsMetadata(),
                        'address' => $importJob->getErrorsAddress(),
                        'price' => $importJob->getErrorsPrice(),
                        'photos' => $importJob->getErrorsPhotos(),
                        'other' => $importJob->getErrorsOther(),
                    ],
                    'removed' => $importJob->getRemoved(),
                ],
                'user' => [
                    'total' => $importJob->getUserTotal(),
                    'processed' => $importJob->getUserProcessed(),
                    'skipped' => $importJob->getUserSkipped(),
                    'updated' => $importJob->getUserUpdated(),
                    'added' => $importJob->getUserAdded(),
                    'errors' => $importJob->getUserErrors(),
                    'removed' => $importJob->getUserRemoved(),
                ],
            ],
            'db_summary' => [
                'company' => [
                    'total' => array_sum($companyCounts),
                    'active' => isset($companyCounts['0']) ? $companyCounts['0'] : 0,
                    'soft_deleted' => isset($companyCounts['1']) ? $companyCounts['1'] : 0,
                ],
                'office' => [
                    'total' => array_sum($officeCounts),
                    'active' => isset($officeCounts['0']) ? $officeCounts['0'] : 0,
                    'soft_deleted' => isset($officeCounts['1']) ? $officeCounts['1'] : 0,
                ],
                'property' => [
                    'total' => array_sum($counts),
                    'active' => $counts[Property::STATUS_ACTIVE],
                    'inactive' => $counts[Property::STATUS_INACTIVE],
                    'incomplete' => $counts[Property::STATUS_INCOMPLETE],
                    'invalid' => $counts[Property::STATUS_INVALID],
                    'soft_deleted' => $counts[Property::STATUS_DELETED],
                ],
                'user' => [
                    'total' => array_sum($userCounts),
                    'active' => isset($userCounts['0']) ? $userCounts['0'] : 0,
                    'soft_deleted' => isset($userCounts['1']) ? $userCounts['1'] : 0,
                ],
            ],
        ];

        return $summary;
    }
}
