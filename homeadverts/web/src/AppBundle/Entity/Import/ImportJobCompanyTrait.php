<?php

namespace AppBundle\Entity\Import;

use AppBundle\Entity\Embeddable\Status;
use Doctrine\ORM\Mapping as ORM;

trait ImportJobCompanyTrait
{
    /**
     * @ORM\Column(type="integer", name="company_total", nullable=true)
     */
    protected $companyTotal = 0;

    /**
     * @ORM\Column(type="integer", name="company_processed", nullable=true)
     */
    protected $companyProcessed = 0;

    /**
     * @ORM\Column(type="integer", name="company_skipped", nullable=true)
     */
    protected $companySkipped = 0;

    /**
     * @ORM\Column(type="integer", name="company_updated", nullable=true)
     */
    protected $companyUpdated = 0;

    /**
     * @ORM\Column(type="integer", name="company_added", nullable=true)
     */
    protected $companyAdded = 0;

    /**
     * @ORM\Column(type="integer", name="company_errors", nullable=true)
     */
    protected $companyErrors = 0;

    /**
     * @ORM\Column(type="integer", name="company_removed", nullable=true)
     */
    protected $companyRemoved;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_company_extracting_")
     *
     * @var Status
     */
    protected $statusCompanyExtracting;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_company_processing_")
     *
     * @var Status
     */
    protected $statusCompanyProcessing;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_company_removal_")
     *
     * @var Status
     */
    protected $statusCompanyRemoval;

    /**
     * @return mixed
     */
    public function getCompanyTotal()
    {
        return $this->companyTotal;
    }

    /**
     * @param mixed $companyTotal
     */
    public function setCompanyTotal($companyTotal)
    {
        $this->onPropertyChanged('companyTotal', $this->companyTotal, $companyTotal);
        $this->companyTotal = $companyTotal;
    }

    /**
     * @return mixed
     */
    public function getCompanyProcessed()
    {
        return $this->companyProcessed;
    }

    /**
     * @param mixed $companyProcessed
     */
    public function setCompanyProcessed($companyProcessed)
    {
        $this->onPropertyChanged('companyProcessed', $this->companyProcessed, $companyProcessed);
        $this->companyProcessed = $companyProcessed;
    }

    public function incrementCompanyProcessed()
    {
        $this->onPropertyChanged('companyProcessed', $this->companyProcessed, $this->companyProcessed + 1);
        ++$this->companyProcessed;
    }

    public function decrementCompanyProcessed()
    {
        $this->onPropertyChanged('companyProcessed', $this->companyProcessed, $this->companyProcessed - 1);
        --$this->companyProcessed;
    }

    /**
     * @return mixed
     */
    public function getCompanySkipped()
    {
        return $this->companySkipped;
    }

    /**
     * @param mixed $companySkipped
     */
    public function setCompanySkipped($companySkipped)
    {
        $this->onPropertyChanged('companySkipped', $this->companySkipped, $companySkipped);
        $this->companySkipped = $companySkipped;
    }

    public function incrementCompanySkipped()
    {
        $this->onPropertyChanged('companySkipped', $this->companySkipped, $this->companySkipped + 1);
        ++$this->companySkipped;
    }

    public function decrementCompanySkipped()
    {
        $this->onPropertyChanged('companySkipped', $this->companySkipped, $this->companySkipped - 1);
        --$this->companySkipped;
    }

    /**
     * @return mixed
     */
    public function getCompanyUpdated()
    {
        return $this->companyUpdated;
    }

    /**
     * @param mixed $companyUpdated
     */
    public function setCompanyUpdated($companyUpdated)
    {
        $this->onPropertyChanged('companyUpdated', $this->companyUpdated, $companyUpdated);
        $this->companyUpdated = $companyUpdated;
    }

    public function incrementCompanyUpdated()
    {
        $this->onPropertyChanged('companyUpdated', $this->companyUpdated, $this->companyUpdated + 1);
        ++$this->companyUpdated;
    }

    public function decrementCompanyUpdated()
    {
        $this->onPropertyChanged('companyUpdated', $this->companyUpdated, $this->companyUpdated - 1);
        --$this->companyUpdated;
    }

    /**
     * @return mixed
     */
    public function getCompanyAdded()
    {
        return $this->companyAdded;
    }

    /**
     * @param mixed $companyAdded
     */
    public function setCompanyAdded($companyAdded)
    {
        $this->onPropertyChanged('companyAdded', $this->companyAdded, $companyAdded);
        $this->companyAdded = $companyAdded;
    }

    public function incrementCompanyAdded()
    {
        $this->onPropertyChanged('companyAdded', $this->companyAdded, $this->companyAdded + 1);
        ++$this->companyAdded;
    }

    public function decrementCompanyAdded()
    {
        $this->onPropertyChanged('companyAdded', $this->companyAdded, $this->companyAdded - 1);
        --$this->companyAdded;
    }

    /**
     * @return mixed
     */
    public function getCompanyErrors()
    {
        return $this->companyErrors;
    }

    /**
     * @param mixed $companyErrors
     */
    public function setCompanyErrors($companyErrors)
    {
        $this->onPropertyChanged('companyErrors', $this->companyErrors, $companyErrors);
        $this->companyErrors = $companyErrors;
    }

    public function incrementCompanyErrors()
    {
        $this->onPropertyChanged('companyErrors', $this->companyErrors, $this->companyErrors + 1);
        ++$this->companyErrors;
    }

    public function decrementCompanyErrors()
    {
        $this->onPropertyChanged('companyErrors', $this->companyErrors, $this->companyErrors - 1);
        --$this->companyErrors;
    }

    /**
     * @return mixed
     */
    public function getCompanyRemoved()
    {
        return $this->companyRemoved;
    }

    /**
     * @param mixed $companyRemoved
     */
    public function setCompanyRemoved($companyRemoved = null)
    {
        $this->onPropertyChanged('companyRemoved', $this->companyRemoved, $companyRemoved);
        $this->companyRemoved = $companyRemoved;
    }

    /**
     * @return Status
     */
    public function getStatusCompanyExtracting()
    {
        return $this->statusCompanyExtracting;
    }

    public function setStatusCompanyExtractingOn()
    {
        $oldMode = $this->statusCompanyExtracting->getMode();
        $oldStartedAt = $this->statusCompanyExtracting->getStartedAt();
        $this->statusCompanyExtracting->setOn();

        $this->onPropertyChanged('statusCompanyExtracting.mode', $oldMode, $this->statusCompanyExtracting->getMode());
        $this->onPropertyChanged('statusCompanyExtracting.startedAt', $oldStartedAt, $this->statusCompanyExtracting->getStartedAt());
    }

    public function setStatusCompanyExtractingDone()
    {
        $oldMode = $this->statusCompanyExtracting->getMode();
        $oldFinishedAt = $this->statusCompanyExtracting->getFinishedAt();
        $this->statusCompanyExtracting->setDone();

        $this->onPropertyChanged('statusCompanyExtracting.mode', $oldMode, $this->statusCompanyExtracting->getMode());
        $this->onPropertyChanged('statusCompanyExtracting.finishedAt', $oldFinishedAt, $this->statusCompanyExtracting->getFinishedAt());
    }

    public function setStatusCompanyExtractingFailed($error)
    {
        $oldMode = $this->statusCompanyExtracting->getMode();
        $oldFinishedAt = $this->statusCompanyExtracting->getFinishedAt();
        $this->statusCompanyExtracting->setFailed($error);

        $this->onPropertyChanged('statusCompanyExtracting.mode', $oldMode, $this->statusCompanyExtracting->getMode());
        $this->onPropertyChanged('statusCompanyExtracting.finishedAt', $oldFinishedAt, $this->statusCompanyExtracting->getFinishedAt());
        $this->onPropertyChanged('statusCompanyExtracting.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusCompanyProcessing()
    {
        return $this->statusCompanyProcessing;
    }

    public function setStatusCompanyProcessingOn()
    {
        $oldMode = $this->statusCompanyProcessing->getMode();
        $oldStartedAt = $this->statusCompanyProcessing->getStartedAt();
        $this->statusCompanyProcessing->setOn();

        $this->onPropertyChanged('statusCompanyProcessing.mode', $oldMode, $this->statusCompanyProcessing->getMode());
        $this->onPropertyChanged('statusCompanyProcessing.startedAt', $oldStartedAt, $this->statusCompanyProcessing->getStartedAt());
    }

    public function setStatusCompanyProcessingDone()
    {
        $oldMode = $this->statusCompanyProcessing->getMode();
        $oldFinishedAt = $this->statusCompanyProcessing->getFinishedAt();
        $this->statusCompanyProcessing->setDone();

        $this->onPropertyChanged('statusCompanyProcessing.mode', $oldMode, $this->statusCompanyProcessing->getMode());
        $this->onPropertyChanged('statusCompanyProcessing.finishedAt', $oldFinishedAt, $this->statusCompanyProcessing->getFinishedAt());
    }

    public function setStatusCompanyProcessingFailed($error)
    {
        $oldMode = $this->statusCompanyProcessing->getMode();
        $oldFinishedAt = $this->statusCompanyProcessing->getFinishedAt();
        $this->statusCompanyProcessing->setFailed($error);

        $this->onPropertyChanged('statusCompanyProcessing.mode', $oldMode, $this->statusCompanyProcessing->getMode());
        $this->onPropertyChanged('statusCompanyProcessing.finishedAt', $oldFinishedAt, $this->statusCompanyProcessing->getFinishedAt());
        $this->onPropertyChanged('statusCompanyProcessing.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusCompanyRemoval()
    {
        return $this->statusCompanyRemoval;
    }

    public function setStatusCompanyRemovalOn()
    {
        $oldMode = $this->statusCompanyRemoval->getMode();
        $oldStartedAt = $this->statusCompanyRemoval->getStartedAt();
        $this->statusCompanyRemoval->setOn();

        $this->onPropertyChanged('statusCompanyRemoval.mode', $oldMode, $this->statusCompanyRemoval->getMode());
        $this->onPropertyChanged('statusCompanyRemoval.startedAt', $oldStartedAt, $this->statusCompanyRemoval->getStartedAt());
    }

    public function setStatusCompanyRemovalDone()
    {
        $oldMode = $this->statusCompanyRemoval->getMode();
        $oldFinishedAt = $this->statusCompanyRemoval->getFinishedAt();
        $this->statusCompanyRemoval->setDone();

        $this->onPropertyChanged('statusCompanyRemoval.mode', $oldMode, $this->statusCompanyRemoval->getMode());
        $this->onPropertyChanged('statusCompanyRemoval.finishedAt', $oldFinishedAt, $this->statusCompanyRemoval->getFinishedAt());
    }

    public function setStatusCompanyRemovalFailed($error)
    {
        $oldMode = $this->statusCompanyRemoval->getMode();
        $oldFinishedAt = $this->statusCompanyRemoval->getFinishedAt();
        $this->statusCompanyRemoval->setFailed($error);

        $this->onPropertyChanged('statusCompanyRemoval.mode', $oldMode, $this->statusCompanyRemoval->getMode());
        $this->onPropertyChanged('statusCompanyRemoval.finishedAt', $oldFinishedAt, $this->statusCompanyRemoval->getFinishedAt());
        $this->onPropertyChanged('statusCompanyRemoval.error', null, $error);
    }
}
