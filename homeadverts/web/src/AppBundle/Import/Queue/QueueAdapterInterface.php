<?php

namespace AppBundle\Import\Queue;

use AppBundle\Entity\Import\ImportJob;

interface QueueAdapterInterface
{
    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueueDeploy(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeueDeploy(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobDeployQueueComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueueCompanyProcessing(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeueCompanyProcessing(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobCompanyProcessingQueueComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueueOfficeProcessing(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeueOfficeProcessing(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobOfficeProcessingQueueComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueueUserProcessing(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeueUserProcessing(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobUserProcessingQueueComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueuePropertyProcessing(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeuePropertyProcessing(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobPropertyProcessingQueueComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueueCompanyRemoval(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeueCompanyRemoval(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobCompanyRemovalQueueComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueueOfficeRemoval(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeueOfficeRemoval(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobOfficeRemovalQueueComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueueUserRemoval(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeueUserRemoval(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobUserRemovalQueueComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     * @param array     $args
     */
    public function enqueuePropertyRemoval(ImportJob $importJob, array $args = []);

    /**
     * @param ImportJob $importJob
     * @param $resqueJobId
     */
    public function dequeuePropertyRemoval(ImportJob $importJob, $resqueJobId);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isJobPropertyRemovalQueueComplete(ImportJob $importJob);
}
