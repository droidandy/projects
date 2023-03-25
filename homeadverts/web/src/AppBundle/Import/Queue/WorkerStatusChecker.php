<?php

namespace AppBundle\Import\Queue;

use AppBundle\Entity\Import\ImportJob;

class WorkerStatusChecker
{
    const DEAD_JOB_TIME_THRESHOLD = 300;
    /**
     * @var \Resque_Worker[]
     */
    private $workers = null;

    public function isQueueInWork($queue)
    {
        return 0 === $this->countQueueJobsInWork($queue);
    }

    public function countQueueJobsInWork($queue)
    {
        $jobsInWork = 0;
        foreach ($this->getWorkers() as $worker) {
            $job = $worker->job();
            if (empty($job)) {
                continue;
            }
            if (!$this->isAlive($job)) {
                continue;
            }
            if ($job['queue'] !== $queue) {
                continue;
            }
            ++$jobsInWork;
        }

        return $jobsInWork;
    }

    public function countQueueJobsInWorkForImportJob($queue, $className, ImportJob $importJob)
    {
        $jobsInWork = 0;
        foreach ($this->getWorkers() as $worker) {
            $job = $worker->job();
            if (empty($job)) {
                continue;
            }
            if (!$this->isAlive($job)) {
                continue;
            }
            if ($job['queue'] !== $queue) {
                continue;
            }
            if ($job['payload']['args'][0]['jobID'] !== $importJob->getId()) {
                continue;
            }
            if ($job['payload']['class'] !== $className) {
                continue;
            }
            ++$jobsInWork;
        }

        return $jobsInWork;
    }

    private function getWorkers()
    {
        if (null === $this->workers) {
            $this->workers = \Resque_Worker::all();
        }

        return $this->workers;
    }

    private function isAlive(array $job)
    {
        return time() - strtotime($job['run_at']) < self::DEAD_JOB_TIME_THRESHOLD;
    }
}
