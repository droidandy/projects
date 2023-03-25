<?php

namespace AppBundle\Import\Queue;

use AppBundle\Exception\BadImportStateException;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Embeddable\Status;

class QueueImportCompletenessStrategy implements ImportJobCompletenessStrategyInterface
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var WorkerStatusChecker
     */
    private $workerStatusChecker;
    /**
     * @var QueueAdapterInterface
     */
    private $queueAdapter;

    /**
     * QueueImportCompletenessStrategy constructor.
     *
     * @param EntityManager $em
     */
    public function __construct(
        EntityManager $em,
        WorkerStatusChecker $workerStatusChecker,
        QueueAdapterInterface $queueAdapter
    ) {
        $this->em = $em;
        $this->workerStatusChecker = $workerStatusChecker;
        $this->queueAdapter = $queueAdapter;
    }

    public function isCompanyImportComplete(ImportJob $importJob)
    {
        $this->em->refresh($importJob);

        if (Status::MODE_ON === $importJob->getStatusCompanyExtracting()->getMode()) {
            return false;
        }

        if ($importJob->getCompanyTotal() <= $importJob->getCompanyProcessed()) {
            return true;
        }

        if ($this->queueAdapter->isJobCompanyProcessingQueueComplete($importJob)) {
            if ($importJob->getCompanyTotal() - $importJob->getCompanyProcessed() > 50) {
                throw new BadImportStateException('Too much unprocessed items for Company Import');
            } else {
                return true;
            }
        }

        return false;
    }

    public function isOfficeImportComplete(ImportJob $importJob)
    {
        $this->em->refresh($importJob);

        if (Status::MODE_ON === $importJob->getStatusOfficeExtracting()->getMode()) {
            return false;
        }

        if ($importJob->getOfficeTotal() <= $importJob->getOfficeProcessed()) {
            return true;
        }

        if ($this->queueAdapter->isJobOfficeProcessingQueueComplete($importJob)) {
            if ($importJob->getOfficeTotal() - $importJob->getOfficeProcessed() > 50) {
                throw new BadImportStateException('Too much unprocessed items for Office Import');
            } else {
                return true;
            }
        }

        return false;
    }

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isUserImportComplete(ImportJob $importJob)
    {
        $this->em->refresh($importJob);

//        TODO split extraction on user_extraction, property_extraction, etc
//        if ($importJob->getStatusExtracting()->getMode() === Status::MODE_ON) {
//            return false;
//        }

        if ($importJob->getUserTotal() <= $importJob->getUserProcessed()) {
            return true;
        }

        if ($this->queueAdapter->isJobUserProcessingQueueComplete($importJob)) {
            if ($importJob->getUserTotal() - $importJob->getUserProcessed() > 50) {
                throw new BadImportStateException('Too much unprocessed items for User Import');
            } else {
                return true;
            }
        }

        return false;
    }

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isPropertyImportComplete(ImportJob $importJob)
    {
        $this->em->refresh($importJob);

        if (Status::MODE_ON === $importJob->getStatusExtracting()->getMode()) {
            return false;
        }

        if ($importJob->getTotal() <= $importJob->getProcessed()) {
            return true;
        }

        if ($this->queueAdapter->isJobPropertyProcessingQueueComplete($importJob)) {
            if ($importJob->getTotal() - $importJob->getProcessed() > 50) {
                throw new BadImportStateException('Too much unprocessed items for Property Import');
            } else {
                return true;
            }
        }

        return false;
    }
}
