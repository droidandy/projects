<?php

namespace AppBundle\Import\Queue;

use AppBundle\Import\Job\CompanyProcess;
use AppBundle\Import\Job\CompanyRemove;
use AppBundle\Import\Job\Deploy;
use AppBundle\Import\Job\OfficeProcess;
use AppBundle\Import\Job\OfficeRemove;
use AppBundle\Import\Job\Process;
use AppBundle\Import\Job\RemoveProperties;
use AppBundle\Import\Job\UserProcess;
use AppBundle\Import\Job\UserRemove;
use AppBundle\Helper\SprintfLoggerTrait;
use AppBundle\Helper\RedisClient;
use AppBundle\Entity\Import\ImportJob;
use Predis\ClientException;
use Predis\ClientInterface;
use Psr\Log\LoggerInterface;

class ResqueQueueAdapter implements QueueAdapterInterface
{
    use SprintfLoggerTrait;

    private const QUEUE_TTL = 7 * 24 * 3600;
    /**
     * @var ClientInterface
     */
    private $client;
    /**
     * @var WorkerStatusChecker
     */
    private $workerStatusChecker;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var RedisClient
     */
    private $redisClient;

    /**
     * @param ClientInterface     $client
     * @param WorkerStatusChecker $workerStatusChecker
     * @param LoggerInterface     $logger
     * @param RedisClient         $redisClient
     */
    public function __construct(
        ClientInterface $client,
        WorkerStatusChecker $workerStatusChecker,
        LoggerInterface $logger,
        RedisClient $redisClient
    ) {
        $this->client = $client;
        $this->workerStatusChecker = $workerStatusChecker;
        $this->logger = $logger;
        $this->redisClient = $redisClient;
    }

    // General
    public function enqueueDeploy(ImportJob $importJob, array $args = [])
    {
        $this->log('Added deploying job for %s', $importJob->getId());

        $this->enqueue(
            'import_download',
            Deploy::class,
            $importJob,
            $args
        );
    }

    public function dequeueDeploy(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_download',
            Deploy::class,
            $importJob,
            $resqueJobId
        );
    }

    public function isJobDeployQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete(
            'import_download',
            Deploy::class,
            $importJob
        );
    }

    // Companies
    public function enqueueCompanyProcessing(ImportJob $importJob, array $args = [])
    {
        $this->enqueue('import_process', CompanyProcess::class, $importJob, $args);
    }

    public function dequeueCompanyProcessing(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_process', CompanyProcess::class, $importJob, $resqueJobId);
    }

    public function isJobCompanyProcessingQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete('import_process', CompanyProcess::class, $importJob);
    }

    // Office
    public function enqueueOfficeProcessing(ImportJob $importJob, array $args = [])
    {
        $this->enqueue('import_process', OfficeProcess::class, $importJob, $args);
    }

    public function dequeueOfficeProcessing(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_process', OfficeProcess::class, $importJob, $resqueJobId);
    }

    public function isJobOfficeProcessingQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete('import_process', OfficeProcess::class, $importJob);
    }

    // Users
    public function enqueueUserProcessing(ImportJob $importJob, array $args = [])
    {
        $this->enqueue('import_process', UserProcess::class, $importJob, $args);
    }

    public function dequeueUserProcessing(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_process', UserProcess::class, $importJob, $resqueJobId);
    }

    public function isJobUserProcessingQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete('import_process', UserProcess::class, $importJob);
    }

    // Properties
    public function enqueuePropertyProcessing(ImportJob $importJob, array $args = [])
    {
        $this->enqueue(
            'import_process',
            Process::class,
            $importJob,
            $args
        );
    }

    public function dequeuePropertyProcessing(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_process', Process::class, $importJob, $resqueJobId);
    }

    public function isJobPropertyProcessingQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete('import_process', Process::class, $importJob);
    }

    // Companies
    public function enqueueCompanyRemoval(ImportJob $importJob, array $args = [])
    {
        $this->enqueue('import_remove', CompanyRemove::class, $importJob, $args);
    }

    public function dequeueCompanyRemoval(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_remove', CompanyRemove::class, $importJob, $resqueJobId);
    }

    public function isJobCompanyRemovalQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete('import_remove', CompanyRemove::class, $importJob);
    }

    // Offices
    public function enqueueOfficeRemoval(ImportJob $importJob, array $args = [])
    {
        $this->enqueue('import_remove', OfficeRemove::class, $importJob, $args);
    }

    public function dequeueOfficeRemoval(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_remove', OfficeRemove::class, $importJob, $resqueJobId);
    }

    public function isJobOfficeRemovalQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete('import_remove', OfficeRemove::class, $importJob);
    }

    // Users
    public function enqueueUserRemoval(ImportJob $importJob, array $args = [])
    {
        $this->enqueue('import_remove', UserRemove::class, $importJob, $args);
    }

    public function dequeueUserRemoval(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_remove', UserRemove::class, $importJob, $resqueJobId);
    }

    public function isJobUserRemovalQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete('import_remove', UserRemove::class, $importJob);
    }

    // Properties
    public function enqueuePropertyRemoval(ImportJob $importJob, array $args = [])
    {
        $this->enqueue('import_remove', RemoveProperties::class, $importJob, $args);
    }

    public function dequeuePropertyRemoval(ImportJob $importJob, $resqueJobId)
    {
        $this->dequeue('import_remove', RemoveProperties::class, $importJob, $resqueJobId);
    }

    public function isJobPropertyRemovalQueueComplete(ImportJob $importJob)
    {
        return $this->isJobQueueComplete('import_remove', RemoveProperties::class, $importJob);
    }

    private function enqueue($queue, $className, ImportJob $importJob, array $args = [])
    {
        $args['jobID'] = $jobId = $importJob->getId();
        $resqueJobId = (string) $this->redisClient->enqueue($queue, $className, $args);

        try {
            $this->client->sadd($queue.$className.$jobId, [$resqueJobId]);
            $this->client->expire($queue.$className.$jobId, self::QUEUE_TTL);
            // Do not let single error crash entire importing
        } catch (ClientException $e) {
            $this->error('REDIS_ERROR: '.$e->getMessage());

            return;
        }
    }

    private function dequeue($queue, $className, ImportJob $importJob, $resqueJobId)
    {
        $jobId = $importJob->getId();
        $this->client->srem($queue.$className.$jobId, $resqueJobId);
    }

    private function isJobQueueComplete($queue, $className, ImportJob $importJob)
    {
        if (
            0 == $this->client->scard($queue.$className.$importJob->getId())
            && $this->workerStatusChecker->countQueueJobsInWorkForImportJob($queue, $className, $importJob) < 4
        ) {
            return true;
        }

        return false;
    }
}
