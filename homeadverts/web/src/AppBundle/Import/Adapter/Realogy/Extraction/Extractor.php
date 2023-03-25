<?php

namespace AppBundle\Import\Adapter\Realogy\Extraction;

use AppBundle\Entity\Embeddable\Status;
use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Import\ImportJobRepository;
use AppBundle\Service\Import\Wellcomemat\PrecachedWellcomematFeed;
use Doctrine\ORM\EntityManager;

class Extractor
{
    /**
     * @var StrategyFactory
     */
    private $strategyFactory;
    /**
     * @var ImportJobRepository
     */
    private $importJobRepo;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var PrecachedWellcomematFeed
     */
    private $wellcomematFeed;

    public function __construct(
        ImportJobRepository $importJobRepo,
        StrategyFactory $strategyFactory,
        EntityManager $em,
        PrecachedWellcomematFeed $wellcomematFeed
    )
    {
        $this->importJobRepo = $importJobRepo;
        $this->strategyFactory = $strategyFactory;
        $this->em = $em;
        $this->wellcomematFeed = $wellcomematFeed;
    }

    /**
     * @param ImportJob $importJob
     *
     * @throws \Exception
     */
    public function createCompanies(ImportJob $importJob)
    {
        try {
            /** @var ActiveExtractionStrategy $strategy */
            $strategy = $this->getStrategy($importJob);

            $strategy->createCompanies(
                function ($totalCompanies) use ($importJob) {
                    // todo: setCompanyTotalNotify method is missing
                    // $importJob->setCompanyTotalNotify($totalCompanies);
                    // $this->em->flush($importJob);
                },
                function () use ($importJob) {
                    $importJob->setStatusCompanyExtractingOn();
                    $this->importJobRepo->setStatusOn($importJob, 'company_extracting');
                },
                function () use ($importJob) {
                    $importJob->setStatusCompanyExtractingDone();
                    $this->importJobRepo->setStatusDone($importJob, 'company_extracting');
                }
            );
        } catch (\Exception $e) {
            if (Status::MODE_ON == $importJob->getStatusCompanyExtracting()->getMode()) {
                $importJob->setStatusCompanyExtractingFailed($e->getMessage());
                $this->importJobRepo->setStatusFailed($importJob, 'company_extracting', $e->getMessage());
            }

            throw $e;
        }
    }

    /**
     * @param ImportJob $importJob
     * @return mixed|void
     * @throws \Exception
     */
    public function createOffices(ImportJob $importJob)
    {
        try {
            $this->getStrategy($importJob)->createOffices(
                function ($totalOffices) use ($importJob) {
                    // todo: setOfficeTotalNotify method is missing
                    // $importJob->setOfficeTotalNotify($totalOffices);
                    // $this->em->flush($importJob);
                },
                function () use ($importJob) {
                    $importJob->setStatusOfficeExtractingOn();
                    $this->importJobRepo->setStatusOn($importJob, 'office_extracting');
                },
                function () use ($importJob) {
                    $importJob->setStatusOfficeExtractingDone();
                    $this->importJobRepo->setStatusDone($importJob, 'office_extracting');
                }
            );
        } catch (\Exception $e) {
            if (Status::MODE_ON == $importJob->getStatusOfficeExtracting()->getMode()) {
                $importJob->setStatusOfficeExtractingFailed($e->getMessage());
                $this->importJobRepo->setStatusFailed($importJob, 'office_extracting', $e->getMessage());
            }

            throw $e;
        }
    }

    /**
     * @param ImportJob $importJob
     * @return mixed|void
     */
    public function createUsers(ImportJob $importJob)
    {
        $this->getStrategy($importJob)->createUsers(function ($totalUsers) use ($importJob) {
            $importJob->setUserTotalNotify($totalUsers);
            $this->em->flush($importJob);
        });
    }

    /**
     * @param ImportJob $importJob
     * @return mixed|void
     */
    public function createProperties(ImportJob $importJob)
    {
        $this->wellcomematFeed->precacheVideos();

        $this->getStrategy($importJob)->createProperties(function ($totalProperties) use ($importJob) {
            $importJob->setTotalNotify($totalProperties);
            $this->em->flush($importJob);
        });
    }

    /**
     * @param ImportJob $importJob
     *
     * @return ExtractionStrategyInterface
     */
    private function getStrategy(ImportJob $importJob): ExtractionStrategyInterface
    {
        $strategyFactory = $this->strategyFactory;

        $isAllowedMethod = in_array(
            $importJob->method,
            [ImportJob::DATA_SYNC_ACTIVE, ImportJob::DATA_SYNC_DELTA]
        );

        if (!$isAllowedMethod) {
            throw new \InvalidArgumentException(
                sprintf(
                    'DataSync import method %s is not supported.',
                    $importJob->method
                )
            );
        }

        $parts = explode(':', $importJob->method);

        return $strategyFactory($parts[1], $importJob);

    }
}
