<?php

namespace AppBundle\Import\Job;

use AppBundle\Entity\Import\ImportJob;
use Predis\Client;

class ExecutionTimeTracker
{
    /**
     * @var Client
     */
    private $client;

    /**
     * ExecutionTimeTracker constructor.
     *
     * @param Client    $client
     * @param ImportJob $importJob
     */
    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function setImportStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'import_started');
    }

    public function setDeployStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'deploy_started');
    }

    public function setDeployCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'deploy_completed');
    }

    public function setExtractingStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'extracting_started');
    }

    public function setExtractingCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'extracting_completed');
    }

    public function setCompanyExtractingStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'company_extracting_started');
    }

    public function setCompanyExtractingCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'company_extracting_completed');
    }

    public function setOfficeExtractingStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'office_extracting_started');
    }

    public function setOfficeExtractingCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'office_extracting_completed');
    }

    public function setProcessingStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'processing_started');
    }

    public function setProcessingCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'processing_completed');
    }

    public function setCompanyProcessingStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'company_processing_started');
    }

    public function setCompanyProcessingCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'company_processing_completed');
    }

    public function setOfficeProcessingStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'office_processing_started');
    }

    public function setOfficeProcessingCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'office_processing_completed');
    }

    public function setUserProcessingStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'user_processing_started');
    }

    public function setUserProcessingCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'user_processing_completed');
    }

    public function setPropertyProcessingStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'property_processing_started');
    }

    public function setPropertyProcessingCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'property_processing_completed');
    }

    public function setCompanyRemovalStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'company_removal_started');
    }

    public function setCompanyRemovalCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'company_removal_completed');
    }

    public function setOfficeRemovalStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'office_removal_started');
    }

    public function setOfficeRemovalCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'office_removal_completed');
    }

    public function setUserRemovalStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'user_removal_started');
    }

    public function setUserRemovalCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'user_removal_completed');
    }

    public function setPropertyRemovalStarted(ImportJob $importJob)
    {
        $this->setTimeNoOverride($importJob, 'property_removal_started');
    }

    public function setPropertyRemovalCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'property_removal_completed');
    }

    public function setImportCompleted(ImportJob $importJob)
    {
        $this->setTimeOverride($importJob, 'import_completed');
    }

    public function getAggregatedStat(ImportJob $importJob)
    {
        $stats = $this->getAggregate($importJob);

        return [
            'deploy_time' => gmdate('H:i:s', $stats['deploy_completed'] - $stats['deploy_started']),
            'extracting_time' => gmdate('H:i:s', $stats['extracting_completed'] - $stats['extracting_started']),
            'company_extracting_time' => gmdate('H:i:s', $stats['company_extracting_completed'] - $stats['company_extracting_started']),
            'office_extracting_time' => gmdate('H:i:s', $stats['office_extracting_completed'] - $stats['office_extracting_started']),
            'processing_time' => gmdate('H:i:s', $stats['processing_completed'] - $stats['processing_started']),
            'company_processing_time' => gmdate('H:i:s', $stats['company_processing_completed'] - $stats['company_processing_started']),
            'office_processing_time' => gmdate('H:i:s', $stats['office_processing_completed'] - $stats['office_processing_started']),
            'user_processing_time' => gmdate('H:i:s', $stats['user_processing_completed'] - $stats['user_processing_started']),
            'property_processing_time' => gmdate('H:i:s', $stats['property_processing_completed'] - $stats['property_processing_started']),
            'company_removal_time' => gmdate('H:i:s', $stats['company_removal_completed'] - $stats['company_removal_started']),
            'office_removal_time' => gmdate('H:i:s', $stats['office_removal_completed'] - $stats['office_removal_started']),
            'user_removal_time' => gmdate('H:i:s', $stats['user_removal_completed'] - $stats['user_removal_started']),
            'property_removal_time' => gmdate('H:i:s', $stats['property_removal_completed'] - $stats['property_removal_started']),
            'total_time' => gmdate('H:i:s', $stats['import_completed'] - $stats['import_started']),
        ];
    }

    private function setTimeOverride(ImportJob $importJob, $key)
    {
        $this->setTime('hset', $importJob, $key);
    }

    private function setTimeNoOverride(ImportJob $importJob, $key)
    {
        $this->setTime('hsetnx', $importJob, $key);
    }

    private function setTime($method, ImportJob $importJob, $key)
    {
        $this->client->{$method}('import_job_stats.'.$importJob->getId(), $key, $this->time());
    }

    private function getAggregate(ImportJob $importJob)
    {
        return $this->client->hgetall('import_job_stats.'.$importJob->getId());
    }

    private function time()
    {
        return time();
    }
}
