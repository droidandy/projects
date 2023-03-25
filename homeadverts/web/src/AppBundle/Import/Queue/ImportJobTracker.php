<?php

namespace AppBundle\Import\Queue;

use AppBundle\Entity\Import\ImportJobRepository;
use AppBundle\Event\ImportEvent;
use AppBundle\Exception\BadImportStateException;
use AppBundle\Helper\SprintfLoggerTrait;
use AppBundle\Service\Lock\LockInterface;
use Doctrine\ORM\EntityManager;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use AppBundle\Entity\Embeddable\Status as ImportStatus;

class ImportJobTracker
{
    use SprintfLoggerTrait;
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var ImportJobRepository
     */
    private $importJobRepo;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var ImportJobCompletenessStrategyInterface
     */
    private $completenessStrategy;
    /**
     * @var EventDispatcherInterface
     */
    private $importEventDispatcher;
    /**
     * @var LockInterface
     */
    private $lock;
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @param ImportContext                          $importContext
     * @param ImportJobRepository                    $importJobRepo
     * @param EntityManager                          $em
     * @param ImportJobCompletenessStrategyInterface $completenessStrategy
     * @param EventDispatcherInterface               $importEventDispatcher
     * @param LockInterface                          $lock
     * @param LoggerInterface                        $logger
     */
    public function __construct(
        ImportContext $importContext,
        ImportJobRepository $importJobRepo,
        EntityManager $em,
        ImportJobCompletenessStrategyInterface $completenessStrategy,
        EventDispatcherInterface $importEventDispatcher,
        LockInterface $lock,
        LoggerInterface $logger
    ) {
        $this->importContext = $importContext;
        $this->importJobRepo = $importJobRepo;
        $this->em = $em;
        $this->completenessStrategy = $completenessStrategy;
        $this->importEventDispatcher = $importEventDispatcher;
        $this->lock = $lock;
        $this->logger = $logger;
    }

    public function notifyCompanySkipped()
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementCompanyProcessed(
                $importJob,
                0,
                ImportJobRepository::STATUS_SKIPPED
            )
        ;

        $importJob->incrementCompanySkipped();
        $importJob->incrementCompanyProcessed();
    }

    public function notifyCompanyUpdated($errors)
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementCompanyProcessed(
                $importJob,
                count($errors) ? 1 : 0,
                ImportJobRepository::STATUS_UPDATED
            )
        ;

        if (!empty($errors)) {
            $importJob->incrementCompanyErrors();
        }
        $importJob->incrementCompanyUpdated();
        $importJob->incrementCompanyProcessed();
    }

    public function notifyCompanyAdded($errors)
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementCompanyProcessed(
                $importJob,
                count($errors) ? 1 : 0,
                ImportJobRepository::STATUS_ADDED
            )
        ;

        if (!empty($errors)) {
            $importJob->incrementCompanyErrors();
        }
        $importJob->incrementCompanyAdded();
        $importJob->incrementCompanyProcessed();
    }

    public function notifyOfficeSkipped()
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementOfficeProcessed(
                $importJob,
                0,
                ImportJobRepository::STATUS_SKIPPED
            )
        ;

        $importJob->incrementOfficeSkipped();
        $importJob->incrementOfficeProcessed();
    }

    public function notifyOfficeUpdated($errors)
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementOfficeProcessed(
                $importJob,
                count($errors) ? 1 : 0,
                ImportJobRepository::STATUS_UPDATED
            )
        ;

        if (!empty($errors)) {
            $importJob->incrementOfficeErrors();
        }
        $importJob->incrementOfficeUpdated();
        $importJob->incrementOfficeProcessed();
    }

    public function notifyOfficeAdded($errors)
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementOfficeProcessed(
                $importJob,
                count($errors) ? 1 : 0,
                ImportJobRepository::STATUS_ADDED
            )
        ;

        if (!empty($errors)) {
            $importJob->incrementOfficeErrors();
        }
        $importJob->incrementOfficeAdded();
        $importJob->incrementOfficeProcessed();
    }

    public function notifyUserSkipped()
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementUserProcessed(
                $importJob,
                0,
                ImportJobRepository::STATUS_SKIPPED
            )
        ;

        $importJob->incrementUserSkipped();
        $importJob->incrementUserProcessed();
    }

    public function notifyUserUpdated($errors)
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementUserProcessed(
                $importJob,
                count($errors) ? 1 : 0,
                ImportJobRepository::STATUS_UPDATED
            )
        ;

        if (!empty($errors)) {
            $importJob->incrementUserErrors();
        }
        $importJob->incrementUserUpdated();
        $importJob->incrementUserProcessed();
    }

    public function notifyUserAdded($errors)
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementUserProcessed(
                $importJob,
                count($errors) ? 1 : 0,
                ImportJobRepository::STATUS_ADDED
            )
        ;

        if (!empty($errors)) {
            $importJob->incrementUserErrors();
        }
        $importJob->incrementUserAdded();
        $importJob->incrementUserProcessed();
    }

    public function notifyStarted()
    {
        $this->setStatusOn('import');
    }

    public function notifyCompleted($statusMap)
    {
        $errorStatusMap = array_filter($statusMap, function ($status) {
            return ImportStatus::MODE_FAILED === $status;
        });
        if (empty($errorStatusMap)) {
            $this->setStatusDone('import');
        } else {
            $errorMsg = 'Failures appeared on the stages '.implode(', ', array_keys($errorStatusMap));
            $this->setStatusFailed('import', $errorMsg);
        }
    }

    public function notifyDenied(string $reason): void
    {
        $this->setStatusDenied('import', $reason);
    }

    public function setStatusOn($stage)
    {
        $importJob = $this->importContext->getImportJob();
        $stage = $this->camelize($stage);
        $importJob->{'setStatus'.$stage.'On'}();
        $this->importJobRepo->setStatusOn($importJob, $stage);
    }

    public function setStatusDone($stage)
    {
        $importJob = $this->importContext->getImportJob();
        $stage = $this->camelize($stage);
        $importJob->{'setStatus'.$stage.'Done'}();
        $this->importJobRepo->setStatusDone($importJob, $stage);
    }

    public function setStatusFailed($stage, $error = null)
    {
        $importJob = $this->importContext->getImportJob();
        $stage = $this->camelize($stage);
        $importJob->{'setStatus'.$stage.'Failed'}($error);
        $this->importJobRepo->setStatusFailed($importJob, $stage, $error);
    }

    public function setStatusDenied(string $stage, string $reason): void
    {
        $importJob = $this->importContext->getImportJob();
        $stage = $this->camelize($stage);
        $importJob->{'setStatus'.$stage.'Denied'}($reason);
        $this->importJobRepo->setStatusDenied($importJob, $stage, $reason);
    }

    public function isCompanyImportEligible()
    {
        return 0 == $this->importContext->getImportJob()->getCompanyProcessed();
    }

    public function isOfficeImportEligible()
    {
        return 0 == $this->importContext->getImportJob()->getOfficeProcessed();
    }

    public function isUserImportEligible()
    {
        return 0 === $this->importContext->getImportJob()->getUserProcessed();
    }

    public function isPropertyImportEligible()
    {
        return 0 === $this->importContext->getImportJob()->getProcessed();
    }

    public function isCompanyImportCompleted()
    {
        return true === $this->getCompanyImportStatus()[0];
    }

    public function getCompanyImportStatus()
    {
        try {
            if ($this->completenessStrategy->isCompanyImportComplete($this->importContext->getImportJob())) {
                return [true, ImportStatus::MODE_DONE];
            } else {
                return [false, ImportStatus::MODE_ON];
            }
        } catch (BadImportStateException $e) {
            return [true, ImportStatus::MODE_FAILED];
        }
    }

    public function isOfficeImportCompleted()
    {
        return true === $this->getOfficeImportStatus()[0];
    }

    public function getOfficeImportStatus()
    {
        try {
            if ($this->completenessStrategy->isOfficeImportComplete($this->importContext->getImportJob())) {
                return [true, ImportStatus::MODE_DONE];
            } else {
                return [false, ImportStatus::MODE_ON];
            }
        } catch (BadImportStateException $e) {
            return [true, ImportStatus::MODE_FAILED];
        }
    }

    public function isUserImportCompleted()
    {
        return true === $this->getUserImportStatus()[0];
    }

    public function getUserImportStatus()
    {
        try {
            if ($this->completenessStrategy->isUserImportComplete($this->importContext->getImportJob())) {
                return [true, ImportStatus::MODE_DONE];
            } else {
                return [false, ImportStatus::MODE_ON];
            }
        } catch (BadImportStateException $e) {
            return [true, ImportStatus::MODE_FAILED];
        }
    }

    public function isPropertyImportCompleted()
    {
        return true === $this->getPropertyImportStatus()[0];
    }

    public function getPropertyImportStatus()
    {
        try {
            if ($this->completenessStrategy->isPropertyImportComplete($this->importContext->getImportJob())) {
                return [true, ImportStatus::MODE_DONE];
            } else {
                return [false, ImportStatus::MODE_ON];
            }
        } catch (BadImportStateException $e) {
            return [true, ImportStatus::MODE_FAILED];
        }
    }

    public function isCompanyRemovalCompleted()
    {
        return ImportStatus::MODE_UNDEFINED !== $this->getCompanyRemovalStatus() && ImportStatus::MODE_ON !== $this->getCompanyRemovalStatus();
    }

    public function getCompanyRemovalStatus()
    {
        $mode = $this->importContext->getImportJob()->getStatusCompanyRemoval()->getMode();
        if (ImportStatus::MODE_ON !== $mode) {
            return $mode;
        }

        return $this->importJobRepo->getStatus($this->importContext->getImportJob(), 'company_removal');
    }

    public function isOfficeRemovalCompleted()
    {
        return ImportStatus::MODE_UNDEFINED !== $this->getOfficeRemovalStatus() && ImportStatus::MODE_ON !== $this->getOfficeRemovalStatus();
    }

    public function getOfficeRemovalStatus()
    {
        $mode = $this->importContext->getImportJob()->getStatusOfficeRemoval()->getMode();
        if (ImportStatus::MODE_ON !== $mode) {
            return $mode;
        }

        return $this->importJobRepo->getStatus($this->importContext->getImportJob(), 'office_removal');
    }

    public function isUserRemovalCompleted()
    {
        return ImportStatus::MODE_UNDEFINED !== $this->getUserRemovalStatus() && ImportStatus::MODE_ON !== $this->getUserRemovalStatus();
    }

    public function getUserRemovalStatus()
    {
        $mode = $this->importContext->getImportJob()->getStatusUserRemoval()->getMode();
        if (ImportStatus::MODE_ON !== $mode) {
            return $mode;
        }

        return $this->importJobRepo->getStatus($this->importContext->getImportJob(), 'user_removal');
    }

    public function isPropertyRemovalCompleted()
    {
        return ImportStatus::MODE_UNDEFINED !== $this->getPropertyRemovalStatus() && ImportStatus::MODE_ON !== $this->getPropertyRemovalStatus();
    }

    public function getPropertyRemovalStatus()
    {
        $mode = $this->importContext->getImportJob()->getStatusPropertyRemoval()->getMode();
        if (ImportStatus::MODE_ON !== $mode) {
            return $mode;
        }

        return $this->importJobRepo->getStatus($this->importContext->getImportJob(), 'property_removal');
    }

    public function isCompanyRemovalEligible()
    {
        return $this->isCompanyImportCompleted() && !$this->isCompanyRemovalCompleted();
    }

    public function isOfficeRemovalEligible()
    {
        return $this->isOfficeImportCompleted() && !$this->isOfficeRemovalCompleted();
    }

    public function isUserRemovalEligible()
    {
        return $this->isUserImportCompleted() && !$this->isUserRemovalCompleted();
    }

    public function isPropertyRemovalEligible()
    {
        return $this->isPropertyImportCompleted() && !$this->isPropertyRemovalCompleted();
    }

    public function getAssembledStatus()
    {
        if ($this->importContext->getImportJob()->getStatusCompanyProcessing()->isCompleted()) {
            $companyImportStatus = $this->importContext->getImportJob()->getStatusCompanyProcessing()->getMode();
        } else {
            list($isCompanyImportCompleted, $companyImportStatus) = $this->getCompanyImportStatus();
            if (!$isCompanyImportCompleted) {
                return [false, 'Company import is not completed: '.$companyImportStatus]; // return early if any processing is not completed yet
            }
        }

        $companyRemovalStatus = $this->getCompanyRemovalStatus();
        if (
            ImportStatus::MODE_UNDEFINED === $companyRemovalStatus
            || ImportStatus::MODE_ON === $companyRemovalStatus
        ) {
            return [false, 'Company removal is not completed: '.$companyRemovalStatus];
        }

        if ($this->importContext->getImportJob()->getStatusOfficeProcessing()->isCompleted()) {
            $officeImportStatus = $this->importContext->getImportJob()->getStatusOfficeProcessing()->getMode();
        } else {
            list($isOfficeImportCompleted, $officeImportStatus) = $this->getOfficeImportStatus();
            if (!$isOfficeImportCompleted) {
                return [false, 'Office import is not completed: '.$officeImportStatus]; // return early if any processing is not completed yet
            }
        }

        $officeRemovalStatus = $this->getOfficeRemovalStatus();
        if (
            ImportStatus::MODE_UNDEFINED === $officeRemovalStatus
            || ImportStatus::MODE_ON === $officeRemovalStatus
        ) {
            return [false, 'Office removal is not completed: '.$officeRemovalStatus];
        }

        if ($this->importContext->getImportJob()->getStatusUserProcessing()->isCompleted()) {
            $userImportStatus = $this->importContext->getImportJob()->getStatusUserProcessing()->getMode();
        } else {
            list($isUserImportCompleted, $userImportStatus) = $this->getUserImportStatus();
            if (!$isUserImportCompleted) {
                return [false, 'User import is not completed: '.$userImportStatus]; // return early if any processing is not completed yet
            }
        }

        $userRemovalStatus = $this->getUserRemovalStatus();
        if (
            ImportStatus::MODE_UNDEFINED === $userRemovalStatus
            || ImportStatus::MODE_ON === $userRemovalStatus
        ) {
            return [false, 'User removal is not completed: '.$userRemovalStatus];
        }

        if ($this->importContext->getImportJob()->getStatusPropertyProcessing()->isCompleted()) {
            $propertyImportStatus = $this->importContext->getImportJob()->getStatusPropertyProcessing()->getMode();
        } else {
            list($isPropertyImportCompleted, $propertyImportStatus) = $this->getPropertyImportStatus();
            if (!$isPropertyImportCompleted) {
                return [false, 'Property import is not completed: '.$propertyImportStatus];
            }
        }

        $propertyRemovalStatus = $this->getPropertyRemovalStatus();
        if (
            ImportStatus::MODE_UNDEFINED === $propertyRemovalStatus
            || ImportStatus::MODE_ON === $propertyRemovalStatus
        ) {
            return [false, 'Property removal is not completed: '.$propertyRemovalStatus];
        }

        return [
            true,
            [
                'company_processing' => $companyImportStatus,
                'company_removal' => $companyRemovalStatus,
                'office_processing' => $officeImportStatus,
                'office_removal' => $officeRemovalStatus,
                'user_processing' => $userImportStatus,
                'user_removal' => $userRemovalStatus,
                'property_processing' => $propertyImportStatus,
                'property_removal' => $propertyRemovalStatus,
            ],
        ];
    }

    public function tryCompanyImportStart()
    {
        if ($this->isCompanyImportEligible()) {
            $this->setStatusOn('company_processing');
            $this->importEventDispatcher->dispatch(
                ImportEvent::COMPANY_PROCESSING_STARTED,
                new ImportEvent($this->importContext)
            );
            $this->importContext->getImportObserver()->onCompanyProcessingStarted();
        }
    }

    public function tryCompanyImportComplete()
    {
        if ($this->importContext->getImportJob()->getStatusCompanyProcessing()->isCompleted()) {
            $this->debug('TryCompanyImportComplete: already completed');
        }

        list($isCompleted, $mode) = $this->getCompanyImportStatus();
        $this->debug(
            'TryCompanyImportComplete: isCompleted=%s mode=%s',
            $isCompleted ? 'true' : 'false',
            $mode
        );
        if ($isCompleted) {
            if (ImportStatus::MODE_DONE == $mode) {
                $this->setStatusDone('company_processing');
            } elseif (ImportStatus::MODE_FAILED == $mode) {
                $this->setStatusFailed('company_processing');
            }
            $this->importEventDispatcher->dispatch(
                ImportEvent::COMPANY_PROCESSING_COMPLETED,
                new ImportEvent($this->importContext)
            );
            $this->importContext->getImportObserver()->onCompanyProcessingCompleted();
        }
    }

    public function companyRemovalStart()
    {
        $this->setStatusOn('companyRemoval');
        $this->importEventDispatcher->dispatch(ImportEvent::COMPANY_REMOVAL_STARTED, new ImportEvent($this->importContext));
    }

    public function companyRemovalComplete()
    {
        $this->setStatusDone('companyRemoval');
        $this->importEventDispatcher->dispatch(ImportEvent::COMPANY_REMOVAL_COMPLETED, new ImportEvent($this->importContext));
        $this->importContext->getImportObserver()->onCompanyRemovalCompleted();
    }

    public function companyRemovalFail($msg)
    {
        $this->setStatusFailed('companyRemoval', $msg);
        $this->importEventDispatcher->dispatch(ImportEvent::COMPANY_REMOVAL_COMPLETED, new ImportEvent($this->importContext));
        $this->importContext->getImportObserver()->onCompanyRemovalCompleted();
    }

    public function tryOfficeImportStart()
    {
        if ($this->isOfficeImportEligible()) {
            $this->setStatusOn('office_processing');
            $this->importEventDispatcher->dispatch(
                ImportEvent::OFFICE_PROCESSING_STARTED,
                new ImportEvent($this->importContext)
            );
            $this->importContext->getImportObserver()->onOfficeProcessingStarted();
        }
    }

    public function tryOfficeImportComplete()
    {
        if ($this->importContext->getImportJob()->getStatusOfficeProcessing()->isCompleted()) {
            $this->debug('TryOfficeImportComplete: already completed');
        }

        list($isCompleted, $mode) = $this->getOfficeImportStatus();
        $this->debug(
            'TryOfficeImportComplete: isCompleted=%s mode=%s',
            $isCompleted ? 'true' : 'false',
            $mode
        );
        if ($isCompleted) {
            if (ImportStatus::MODE_DONE == $mode) {
                $this->setStatusDone('office_processing');
            } elseif (ImportStatus::MODE_FAILED == $mode) {
                $this->setStatusFailed('office_processing');
            }
            $this->importEventDispatcher->dispatch(
                ImportEvent::OFFICE_PROCESSING_COMPLETED,
                new ImportEvent($this->importContext)
            );
            $this->importContext->getImportObserver()->onOfficeProcessingCompleted();
        }
    }

    public function officeRemovalStart()
    {
        $this->setStatusOn('officeRemoval');
        $this->importEventDispatcher->dispatch(ImportEvent::OFFICE_REMOVAL_STARTED, new ImportEvent($this->importContext));
    }

    public function officeRemovalComplete()
    {
        $this->setStatusDone('officeRemoval');
        $this->importEventDispatcher->dispatch(ImportEvent::OFFICE_REMOVAL_COMPLETED, new ImportEvent($this->importContext));
        $this->importContext->getImportObserver()->onOfficeRemovalCompleted();
    }

    public function officeRemovalFail($msg)
    {
        $this->setStatusFailed('officeRemoval', $msg);
        $this->importEventDispatcher->dispatch(ImportEvent::OFFICE_REMOVAL_COMPLETED, new ImportEvent($this->importContext));
        $this->importContext->getImportObserver()->onOfficeRemovalCompleted();
    }

    public function tryUserImportStart()
    {
        if ($this->isUserImportEligible()) {
            $this->setStatusOn('user_processing');
            $this->importEventDispatcher->dispatch(
                ImportEvent::USER_PROCESSING_STARTED,
                new ImportEvent($this->importContext)
            );
            $this->importContext->getImportObserver()->onUserProcessingStarted();
        }
    }

    public function tryUserImportComplete()
    {
        if ($this->importContext->getImportJob()->getStatusUserProcessing()->isCompleted()) {
            $this->debug('TryUserImportComplete: already completed');
        }

        list($isCompleted, $mode) = $this->getUserImportStatus();
        $this->debug(
            'TryUserImportComplete: isCompleted=%s mode=%s',
            $isCompleted ? 'true' : 'false',
            $mode
        );
        if ($isCompleted) {
            if (ImportStatus::MODE_DONE == $mode) {
                $this->setStatusDone('user_processing');
            } elseif (ImportStatus::MODE_FAILED == $mode) {
                $this->setStatusFailed('user_processing');
            }
            $this->importEventDispatcher->dispatch(
                ImportEvent::USER_PROCESSING_COMPLETED,
                new ImportEvent($this->importContext)
            );
            $this->importContext->getImportObserver()->onUserProcessingCompleted();
        }
    }

    public function userRemovalStart()
    {
        $this->setStatusOn('userRemoval');
        $this->importEventDispatcher->dispatch(ImportEvent::USER_REMOVAL_STARTED, new ImportEvent($this->importContext));
    }

    public function userRemovalComplete()
    {
        $this->setStatusDone('userRemoval');
        $this->importEventDispatcher->dispatch(ImportEvent::USER_REMOVAL_COMPLETED, new ImportEvent($this->importContext));
        $this->importContext->getImportObserver()->onUserRemovalCompleted();
    }

    public function userRemovalFail($msg)
    {
        $this->setStatusFailed('userRemoval', $msg);
        $this->importEventDispatcher->dispatch(ImportEvent::USER_REMOVAL_COMPLETED, new ImportEvent($this->importContext));
        $this->importContext->getImportObserver()->onUserRemovalCompleted();
    }

    public function tryPropertyImportStart()
    {
        if ($this->isPropertyImportEligible()) {
            $this->setStatusOn('property_processing');
            $this->importEventDispatcher->dispatch(
                ImportEvent::PROPERTY_PROCESSING_STARTED,
                new ImportEvent($this->importContext)
            );
        }
    }

    public function tryPropertyImportComplete()
    {
        list($isCompleted, $mode) = $this->getPropertyImportStatus();
        if ($isCompleted) {
            if (ImportStatus::MODE_DONE == $mode) {
                $this->setStatusDone('property_processing');
            } elseif (ImportStatus::MODE_FAILED == $mode) {
                $this->setStatusFailed('property_processing');
            }
            $this->importEventDispatcher->dispatch(
                ImportEvent::PROPERTY_PROCESSING_COMPLETED,
                new ImportEvent($this->importContext)
            );
            $this->importContext->getImportObserver()->onPropertyProcessingCompleted();
        }
    }

    public function propertyRemovalStart()
    {
        $this->setStatusOn('propertyRemoval');
        $this->importEventDispatcher->dispatch(ImportEvent::PROPERTY_REMOVAL_STARTED, new ImportEvent($this->importContext));
    }

    public function propertyRemovalComplete()
    {
        $this->setStatusDone('propertyRemoval');
        $this->importEventDispatcher->dispatch(ImportEvent::PROPERTY_REMOVAL_COMPLETED, new ImportEvent($this->importContext));
        $this->importContext->getImportObserver()->onPropertyRemovalCompleted();
    }

    public function propertyRemovalFail($msg)
    {
        $this->setStatusFailed('propertyRemoval', $msg);
        $this->importEventDispatcher->dispatch(ImportEvent::PROPERTY_REMOVAL_COMPLETED, new ImportEvent($this->importContext));
        $this->importContext->getImportObserver()->onPropertyRemovalCompleted();
    }

    public function isImportStartEligible()
    {
        return true;
    }

    public function tryStart()
    {
        if ($this->isImportStartEligible()) {
            $this->notifyStarted();
            $this->importEventDispatcher->dispatch(ImportEvent::IMPORT_STARTED, new ImportEvent($this->importContext));
        }
    }

    public function tryComplete()
    {
        list($isCompleted, $statusMap) = $this->getAssembledStatus();
        $this->debug(
            'tryComplete: isCompleted=%s assembledStatus=%s',
            $isCompleted ? 'true' : 'false',
            json_encode($statusMap)
        );
        if ($isCompleted) {
            $importJob = $this->importContext->getImportJob();
            $this->lock->executeInLock(
                $importJob->getCompleteLockName(),
                15,
                20,
                function () use ($importJob, $statusMap) {
                    $currentStatus = $this->importJobRepo->getStatus($importJob, 'import');
                    if (in_array($currentStatus, [ImportStatus::MODE_DONE, ImportStatus::MODE_FAILED])) {
                        $this->info(
                            'Job %s has already finished. Do not retrigger',
                            $importJob->getId()
                        );

                        return;
                    }

                    $this->notifyCompleted($statusMap);
                    $this->importEventDispatcher->dispatch(
                        ImportEvent::IMPORT_COMPLETED,
                        new ImportEvent($this->importContext)
                    );
                    $isLockReleased = $this->lock->releaseLock(
                        $importJob->getLockName(),
                        $importJob->getLockValue()
                    );
                    if ($isLockReleased) {
                        $this->info(
                            'Lock %s:%s successfully released for Job %s',
                            $importJob->getLockName(),
                            $importJob->getLockValue(),
                            $importJob->getId()
                        );
                    } else {
                        $this->error(
                            'Failed to release lock %s:%s for Job %s',
                            $importJob->getLockName(),
                            $importJob->getLockValue(),
                            $importJob->getId()
                        );
                    }
                },
                function () use ($importJob) {
                    $this->error('Failed to acquire completion lock for %s', $importJob->getId());
                }
            );
        }
    }

    public function startAndDeny(string $reason): void
    {
        $this->notifyStarted();
        $this->notifyDenied($reason);
        $this->info(
            'Import job %s is denied for reason "%s"',
            $this->importContext->getImportJob()->getId(),
            $reason
        );
    }

    public function setLockValue(string $lockValue): void
    {
        $this->importJobRepo->setLockValue(
            $this->importContext->getImportJob(),
            $lockValue
        );
    }

    public function extendLock(): void
    {
        $importJob = $this->importContext->getImportJob();
        if (!$importJob->getLockValue()) {
            throw new \RuntimeException('No lock value to extend exists');
        }
        $this->lock->extendLock(
            $importJob->getLockName(),
            $importJob->getLockValue(),
            1800,
            300
        );
    }

    private function camelize($stage)
    {
        return strtr(ucwords(strtr($stage, array('_' => ' '))), array(' ' => ''));
    }
}
