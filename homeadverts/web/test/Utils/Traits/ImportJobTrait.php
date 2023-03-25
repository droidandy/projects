<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Import\ImportJob;

trait ImportJobTrait
{

    /**
     * @param string $type
     * @return ImportJob
     */
    public function newImportJob(string $type)
    {
        $job = new ImportJob();
        $job->setMethod($type);
        $job->setLockValue($this->faker->uuid);

        return $job;
    }

    /**
     * @param string $type
     * @return ImportJob
     */
    protected function newImportJobPersistent(string $type)
    {
        $job = $this->newImportJob($type);

        $this->em->persist($job);
        $this->em->flush($job);

        return $job;
    }
}
