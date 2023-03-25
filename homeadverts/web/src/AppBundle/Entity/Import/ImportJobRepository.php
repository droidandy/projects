<?php

namespace AppBundle\Entity\Import;

use Doctrine\DBAL\Types\Type;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use AppBundle\Entity\Embeddable\Status;

class ImportJobRepository extends EntityRepository
{
    const STATUS_ADDED = 'status_added';
    const STATUS_UPDATED = 'status_updated';
    const STATUS_SKIPPED = 'status_skipped';

    /**
     * Get the most recent jobs for all imports.
     *
     * @return array|false
     */
    public function findAllMostRecent()
    {
        $rsm = new ResultSetMappingBuilder($this->_em);
        $rsm->addRootEntityFromClassMetadata('AppBundle\\Entity\\Import\\ImportJob', 'j');

        $sql = sprintf('SELECT %s FROM import_job j GROUP BY import_id DESC', $rsm->generateSelectClause());

        $query = $this->_em->createNativeQuery($sql, $rsm);

        $result = $query->execute();

        if (is_array($result)) {
            $result = array_reverse($result);
        }

        return $result;
    }

    public function incrementSkipped(ImportJob $job, $error)
    {
        $this->incrementProcessed($job, $error, self::STATUS_SKIPPED);
    }

    public function incrementUpdated(ImportJob $job, $error)
    {
        $this->incrementProcessed($job, $error, self::STATUS_UPDATED);
    }

    public function incrementAdded(ImportJob $job, $error)
    {
        $this->incrementProcessed($job, $error, self::STATUS_ADDED);
    }

    public function incrementProcessed(ImportJob $job, $error, $status)
    {
        if (!$this->isValidStatus($status)) {
            throw new \InvalidArgumentException(sprintf('"%s" is not a valid value for a status', $status));
        }
        $parameters = [
            'id' => $job->getId(),
            'skipped' => self::STATUS_SKIPPED == $status ? 1 : 0,
            'updated' => self::STATUS_UPDATED == $status ? 1 : 0,
            'added' => self::STATUS_ADDED == $status ? 1 : 0,
            'error' => (int) $error,
        ];

        $this->_em
            ->createQuery('
                UPDATE AppBundle\\Entity\\Import\\ImportJob i
                SET
                    i.processed = i.processed + 1,
                    i.skipped = i.skipped + :skipped,
                    i.updated = i.updated + :updated,
                    i.added = i.added + :added,
                    i.errors = i.errors + :error
                WHERE i.id = :id
            ')
            ->setParameters($parameters)
            ->execute()
        ;
    }

    public function addErrors(ImportJob $job, $errors)
    {
        $errors = json_decode($errors, true);

        $this->_em
            ->createQuery('
                UPDATE AppBundle\\Entity\\Import\\ImportJob i
                SET
                    i.errorsBedroom = i.errorsBedroom + :bedrooms,
                    i.errorsMetadata = i.errorsMetadata + :metadata,
                    i.errorsAddress = i.errorsAddress + :address,
                    i.errorsPrice = i.errorsPrice + :price,
                    i.errorsPhotos = i.errorsPhotos + :photos,
                    i.errorsOther = i.errorsOther + :other
                WHERE i.id = :id
            ')
            ->setParameter('bedrooms', isset($errors[ImportProperty::ERROR_BEDROOMS]))
            ->setParameter('metadata', isset($errors[ImportProperty::ERROR_METADATA]))
            ->setParameter('address', isset($errors[ImportProperty::ERROR_ADDRESS]))
            ->setParameter('price', isset($errors[ImportProperty::ERROR_PRICE]))
            ->setParameter('photos', isset($errors[ImportProperty::ERROR_PHOTOS]))
            ->setParameter('other', isset($errors[ImportProperty::ERROR_OTHER]))
            ->setParameter('id', $job->getId())
            ->execute()
        ;
    }

    public function incrementCompanySkipped(ImportJob $job, $error)
    {
        $this->incrementCompanyProcessed($job, $error, self::STATUS_SKIPPED);
    }

    public function incrementCompanyUpdated(ImportJob $job, $error)
    {
        $this->incrementCompanyProcessed($job, $error, self::STATUS_UPDATED);
    }

    public function incrementCompanyAdded(ImportJob $job, $error)
    {
        $this->incrementCompanyProcessed($job, $error, self::STATUS_ADDED);
    }

    public function incrementCompanyProcessed(ImportJob $job, $error, $status)
    {
        $this->incrementEntityProcessed('company', $job, $error, $status);
    }

    public function incrementOfficeSkipped(ImportJob $job, $error)
    {
        $this->incrementOfficeProcessed($job, $error, self::STATUS_SKIPPED);
    }

    public function incrementOfficeUpdated(ImportJob $job, $error)
    {
        $this->incrementOfficeProcessed($job, $error, self::STATUS_UPDATED);
    }

    public function incrementOfficeAdded(ImportJob $job, $error)
    {
        $this->incrementOfficeProcessed($job, $error, self::STATUS_ADDED);
    }

    public function incrementOfficeProcessed(ImportJob $job, $error, $status)
    {
        $this->incrementEntityProcessed('office', $job, $error, $status);
    }

    public function incrementUserSkipped(ImportJob $job, $error)
    {
        $this->incrementUserProcessed($job, $error, self::STATUS_SKIPPED);
    }

    public function incrementUserUpdated(ImportJob $job, $error)
    {
        $this->incrementUserProcessed($job, $error, self::STATUS_UPDATED);
    }

    public function incrementUserAdded(ImportJob $job, $error)
    {
        $this->incrementUserProcessed($job, $error, self::STATUS_ADDED);
    }

    public function incrementUserProcessed(ImportJob $job, $error, $status)
    {
        $this->incrementEntityProcessed('user', $job, $error, $status);
    }

    public function incrementEntityProcessed($prefix, ImportJob $job, $error, $status)
    {
        if (!$this->isValidStatus($status)) {
            throw new \InvalidArgumentException(sprintf('"%s" is not a valid value for a status', $status));
        }
        $parameters = [
            'id' => $job->getId(),
            'skipped' => self::STATUS_SKIPPED == $status ? 1 : 0,
            'updated' => self::STATUS_UPDATED == $status ? 1 : 0,
            'added' => self::STATUS_ADDED == $status ? 1 : 0,
            'error' => (int) $error,
        ];
        $this->_em
            ->createQuery(
                sprintf(
                    '
                        UPDATE AppBundle\\Entity\\Import\\ImportJob i
                        SET
                            i.%1$sProcessed = i.%1$sProcessed + 1,
                            i.%1$sSkipped = i.%1$sSkipped + :skipped,
                            i.%1$sUpdated = i.%1$sUpdated + :updated,
                            i.%1$sAdded = i.%1$sAdded + :added,
                            i.%1$sErrors = i.%1$sErrors + :error
                        WHERE i.id = :id
                    ',
                    $prefix
                )
            )
            ->setParameters($parameters)
            ->execute()
        ;
    }

    public function getStatus(ImportJob $importJob, $stage)
    {
        if (
            !in_array(
                $stage,
                [
                    'import',
                    'company_removal',
                    'office_removal',
                    'user_processing',
                    'user_removal',
                    'property_processing',
                    'property_removal',
                ]
            )
        ) {
            throw new \InvalidArgumentException();
        }

        return (int) $this
            ->_em
            ->getConnection()
            ->fetchColumn(
                'SELECT status_'.$stage.'_mode FROM import_job WHERE id=:id',
                [
                    'id' => $importJob->getId(),
                ]
            )
        ;
    }

    public function setStatusOn(ImportJob $job, $stage)
    {
        $stage = $this->camelize($stage);
        /** @var Status $status */
        $status = $job->{'getStatus'.$stage}();
        $dql = sprintf('UPDATE AppBundle\Entity\Import\ImportJob i 
                    SET i.status%1$s.mode = :mode, i.status%1$s.startedAt = :started_at
                    WHERE i.id = :id', $stage);
        $this
            ->_em
            ->createQuery($dql)
            ->setParameters([
                'mode' => Status::MODE_ON,
                'started_at' => $status->getStartedAt(),
                'id' => $job->getId(),
            ])
            ->execute()
        ;
    }

    public function setStatusDone(ImportJob $job, $stage)
    {
        $stage = $this->camelize($stage);
        /** @var Status $status */
        $status = $job->{'getStatus'.$stage}();
        $dql = sprintf('UPDATE AppBundle\Entity\Import\ImportJob i 
                    SET i.status%1$s.mode = :mode, i.status%1$s.finishedAt = :finished_at
                    WHERE i.id = :id', $stage);
        $this
            ->_em
            ->createQuery($dql)
            ->setParameters([
                'mode' => Status::MODE_DONE,
                'finished_at' => $status->getFinishedAt(),
                'id' => $job->getId(),
            ])
            ->execute()
        ;
    }

    public function setStatusFailed(ImportJob $job, $stage, $error = null)
    {
        $stage = $this->camelize($stage);
        /** @var Status $status */
        $status = $job->{'getStatus'.$stage}();
        $dql = sprintf('UPDATE AppBundle\Entity\Import\ImportJob i 
                    SET i.status%1$s.mode = :mode, i.status%1$s.finishedAt = :finished_at, i.status%1$s.error = :error
                    WHERE i.id = :id', $stage);
        $this
            ->_em
            ->createQuery($dql)
            ->setParameters([
                'mode' => Status::MODE_FAILED,
                'finished_at' => $status->getFinishedAt(),
                'error' => $error,
                'id' => $job->getId(),
            ])
            ->execute()
        ;
    }

    public function setStatusDenied(ImportJob $job, string $stage, string $reason): void
    {
        $stage = $this->camelize($stage);
        /** @var Status $status */
        $status = $job->{'getStatus'.$stage}();
        $dql = sprintf('UPDATE AppBundle\Entity\Import\ImportJob i 
                    SET i.status%1$s.mode = :mode, i.status%1$s.finishedAt = :finished_at, i.status%1$s.error = :reason
                    WHERE i.id = :id', $stage);
        $this
            ->_em
            ->createQuery($dql)
            ->setParameters([
                'mode' => Status::MODE_DENIED,
                'finished_at' => $status->getFinishedAt(),
                'reason' => $reason,
                'id' => $job->getId(),
            ])
            ->execute()
        ;
    }

    public function setLockValue(ImportJob $job, string $lockValue)
    {
        $this
            ->_em
            ->createQuery('
                    UPDATE AppBundle\Entity\Import\ImportJob i 
                    SET i.lockValue = :lock_value
                    WHERE i.id = :id')
            ->setParameters([
                'lock_value' => $lockValue,
                'id' => $job->getId(),
            ])
            ->execute()
        ;
        $job->setLockValue($lockValue);
    }

    /**
     * @param ImportJob $importJob
     *
     * @return ImportJob|mixed
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getPreviousImportJob(ImportJob $importJob)
    {
        $importJob = $this
            ->_em
            ->createQuery(
                'SELECT ij FROM AppBundle\Entity\Import\ImportJob ij 
                    WHERE 
                        ij.dateAdded < :date_added AND ij.statusImport.mode = :mode
                    ORDER BY ij.dateAdded'
            )
            ->setMaxResults(1)
            ->setParameter('date_added', $importJob->getDateAdded())
            ->setParameter('mode', ImportJob::MODE_DONE)
            ->getOneOrNullResult()
        ;

        return $importJob;
    }

    /**
     * @param string    $method
     * @param ImportJob $importJob
     *
     * @return ImportJob|mixed
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getLastImportJobByMethod($method, ImportJob $importJob)
    {
        $importJob = $this
            ->_em
            ->createQuery(
                'SELECT ij FROM AppBundle\Entity\Import\ImportJob ij 
                    WHERE 
                        ij.method = :method AND ij.dateAdded < :date_added AND ij.statusImport.mode = :mode
                    ORDER BY ij.dateAdded'
            )
            ->setMaxResults(1)
            ->setParameter('method', $method)
            ->setParameter('date_added', $importJob->getDateAdded(), Type::DATETIME)
            ->setParameter('mode', ImportJob::MODE_DONE)
            ->getOneOrNullResult()
        ;

        return $importJob;
    }

    /**
     * @param ImportJob $importJob
     *
     * @return \DateTime|null
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getPreviousImportJobStartAt(ImportJob $importJob)
    {
        $conn = $this->_em->getConnection();
        $startedAt = $conn
            ->fetchColumn(
                '
                    SELECT ij.date_added 
                    FROM import_job ij
                    WHERE 
                        ij.date_added < :date_added AND ij.status_import_mode = :mode 
                    ORDER BY ij.date_added DESC LIMIT 1',
                [
                    'date_added' => $importJob->getDateAdded(),
                    'mode' => ImportJob::MODE_DONE,
                ],
                0,
                [
                    'date_added' => Type::DATETIME,
                    'mode' => Type::INTEGER,
                ]
            )
        ;

        return $startedAt ? $conn->convertToPHPValue($startedAt, Type::DATETIME) : null;
    }

    private function isValidStatus($status)
    {
        return in_array($status, $this->getProcessingStatuses());
    }

    private function getProcessingStatuses()
    {
        return [self::STATUS_ADDED, self::STATUS_UPDATED, self::STATUS_SKIPPED];
    }

    private function camelize($stage)
    {
        return strtr(ucwords(strtr($stage, array('_' => ' '))), array(' ' => ''));
    }
}
