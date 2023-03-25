<?php

namespace AppBundle\Entity\Import;

use AppBundle\Entity\Embeddable\Status;
use Doctrine\ORM\Mapping as ORM;

trait ImportJobOfficeTrait
{
    /**
     * @ORM\Column(type="integer", name="office_total", nullable=true)
     */
    protected $officeTotal = 0;

    /**
     * @ORM\Column(type="integer", name="office_processed", nullable=true)
     */
    protected $officeProcessed = 0;

    /**
     * @ORM\Column(type="integer", name="office_skipped", nullable=true)
     */
    protected $officeSkipped = 0;

    /**
     * @ORM\Column(type="integer", name="office_updated", nullable=true)
     */
    protected $officeUpdated = 0;

    /**
     * @ORM\Column(type="integer", name="office_added", nullable=true)
     */
    protected $officeAdded = 0;

    /**
     * @ORM\Column(type="integer", name="office_errors", nullable=true)
     */
    protected $officeErrors = 0;

    /**
     * @ORM\Column(type="integer", name="office_removed", nullable=true)
     */
    protected $officeRemoved;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_office_extracting_")
     *
     * @var Status
     */
    protected $statusOfficeExtracting;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_office_processing_")
     *
     * @var Status
     */
    protected $statusOfficeProcessing;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_office_removal_")
     *
     * @var Status
     */
    protected $statusOfficeRemoval;

    /**
     * @return mixed
     */
    public function getOfficeTotal()
    {
        return $this->officeTotal;
    }

    /**
     * @param mixed $officeTotal
     */
    public function setOfficeTotal($officeTotal)
    {
        $this->onPropertyChanged('officeTotal', $this->officeTotal, $officeTotal);
        $this->officeTotal = $officeTotal;
    }

    /**
     * @return mixed
     */
    public function getOfficeProcessed()
    {
        return $this->officeProcessed;
    }

    /**
     * @param mixed $officeProcessed
     */
    public function setOfficeProcessed($officeProcessed)
    {
        $this->onPropertyChanged('officeProcessed', $this->officeProcessed, $officeProcessed);
        $this->officeProcessed = $officeProcessed;
    }

    public function incrementOfficeProcessed()
    {
        $this->onPropertyChanged('officeProcessed', $this->officeProcessed, $this->officeProcessed + 1);
        ++$this->officeProcessed;
    }

    public function decrementOfficeProcessed()
    {
        $this->onPropertyChanged('officeProcessed', $this->officeProcessed, $this->officeProcessed - 1);
        --$this->officeProcessed;
    }

    /**
     * @return mixed
     */
    public function getOfficeSkipped()
    {
        return $this->officeSkipped;
    }

    /**
     * @param mixed $officeSkipped
     */
    public function setOfficeSkipped($officeSkipped)
    {
        $this->onPropertyChanged('officeSkipped', $this->officeSkipped, $officeSkipped);
        $this->officeSkipped = $officeSkipped;
    }

    public function incrementOfficeSkipped()
    {
        $this->onPropertyChanged('officeSkipped', $this->officeSkipped, $this->officeSkipped + 1);
        ++$this->officeSkipped;
    }

    public function decrementOfficeSkipped()
    {
        $this->onPropertyChanged('officeSkipped', $this->officeSkipped, $this->officeSkipped - 1);
        --$this->officeSkipped;
    }

    /**
     * @return mixed
     */
    public function getOfficeUpdated()
    {
        return $this->officeUpdated;
    }

    /**
     * @param mixed $officeUpdated
     */
    public function setOfficeUpdated($officeUpdated)
    {
        $this->onPropertyChanged('officeUpdated', $this->officeUpdated, $officeUpdated);
        $this->officeUpdated = $officeUpdated;
    }

    public function incrementOfficeUpdated()
    {
        $this->onPropertyChanged('officeUpdated', $this->officeUpdated, $this->officeUpdated + 1);
        ++$this->officeUpdated;
    }

    public function decrementOfficeUpdated()
    {
        $this->onPropertyChanged('officeUpdated', $this->officeUpdated, $this->officeUpdated - 1);
        --$this->officeUpdated;
    }

    /**
     * @return mixed
     */
    public function getOfficeAdded()
    {
        return $this->officeAdded;
    }

    /**
     * @param mixed $officeAdded
     */
    public function setOfficeAdded($officeAdded)
    {
        $this->onPropertyChanged('officeAdded', $this->officeAdded, $officeAdded);
        $this->officeAdded = $officeAdded;
    }

    public function incrementOfficeAdded()
    {
        $this->onPropertyChanged('officeAdded', $this->officeAdded, $this->officeAdded + 1);
        ++$this->officeAdded;
    }

    public function decrementOfficeAdded()
    {
        $this->onPropertyChanged('officeAdded', $this->officeAdded, $this->officeAdded - 1);
        --$this->officeAdded;
    }

    /**
     * @return mixed
     */
    public function getOfficeErrors()
    {
        return $this->officeErrors;
    }

    /**
     * @param mixed $officeErrors
     */
    public function setOfficeErrors($officeErrors)
    {
        $this->onPropertyChanged('officeErrors', $this->officeErrors, $officeErrors);
        $this->officeErrors = $officeErrors;
    }

    public function incrementOfficeErrors()
    {
        $this->onPropertyChanged('officeErrors', $this->officeErrors, $this->officeErrors + 1);
        ++$this->officeErrors;
    }

    public function decrementOfficeErrors()
    {
        $this->onPropertyChanged('officeErrors', $this->officeErrors, $this->officeErrors - 1);
        --$this->officeErrors;
    }

    /**
     * @return mixed
     */
    public function getOfficeRemoved()
    {
        return $this->officeRemoved;
    }

    /**
     * @param mixed $officeRemoved
     */
    public function setOfficeRemoved($officeRemoved = null)
    {
        $this->onPropertyChanged('officeRemoved', $this->officeRemoved, $officeRemoved);
        $this->officeRemoved = $officeRemoved;
    }

    /**
     * @return Status
     */
    public function getStatusOfficeExtracting()
    {
        return $this->statusOfficeExtracting;
    }

    public function setStatusOfficeExtractingOn()
    {
        $oldMode = $this->statusOfficeExtracting->getMode();
        $oldStartedAt = $this->statusOfficeExtracting->getStartedAt();
        $this->statusOfficeExtracting->setOn();

        $this->onPropertyChanged('statusOfficeExtracting.mode', $oldMode, $this->statusOfficeExtracting->getMode());
        $this->onPropertyChanged('statusOfficeExtracting.startedAt', $oldStartedAt, $this->statusOfficeExtracting->getStartedAt());
    }

    public function setStatusOfficeExtractingDone()
    {
        $oldMode = $this->statusOfficeExtracting->getMode();
        $oldFinishedAt = $this->statusOfficeExtracting->getFinishedAt();
        $this->statusOfficeExtracting->setDone();

        $this->onPropertyChanged('statusOfficeExtracting.mode', $oldMode, $this->statusOfficeExtracting->getMode());
        $this->onPropertyChanged('statusOfficeExtracting.finishedAt', $oldFinishedAt, $this->statusOfficeExtracting->getFinishedAt());
    }

    public function setStatusOfficeExtractingFailed($error)
    {
        $oldMode = $this->statusOfficeExtracting->getMode();
        $oldFinishedAt = $this->statusOfficeExtracting->getFinishedAt();
        $this->statusOfficeExtracting->setFailed($error);

        $this->onPropertyChanged('statusOfficeExtracting.mode', $oldMode, $this->statusOfficeExtracting->getMode());
        $this->onPropertyChanged('statusOfficeExtracting.finishedAt', $oldFinishedAt, $this->statusOfficeExtracting->getFinishedAt());
        $this->onPropertyChanged('statusOfficeExtracting.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusOfficeProcessing()
    {
        return $this->statusOfficeProcessing;
    }

    public function setStatusOfficeProcessingOn()
    {
        $oldMode = $this->statusOfficeProcessing->getMode();
        $oldStartedAt = $this->statusOfficeProcessing->getStartedAt();
        $this->statusOfficeProcessing->setOn();

        $this->onPropertyChanged('statusOfficeProcessing.mode', $oldMode, $this->statusOfficeProcessing->getMode());
        $this->onPropertyChanged('statusOfficeProcessing.startedAt', $oldStartedAt, $this->statusOfficeProcessing->getStartedAt());
    }

    public function setStatusOfficeProcessingDone()
    {
        $oldMode = $this->statusOfficeProcessing->getMode();
        $oldFinishedAt = $this->statusOfficeProcessing->getFinishedAt();
        $this->statusOfficeProcessing->setDone();

        $this->onPropertyChanged('statusOfficeProcessing.mode', $oldMode, $this->statusOfficeProcessing->getMode());
        $this->onPropertyChanged('statusOfficeProcessing.finishedAt', $oldFinishedAt, $this->statusOfficeProcessing->getFinishedAt());
    }

    public function setStatusOfficeProcessingFailed($error)
    {
        $oldMode = $this->statusOfficeProcessing->getMode();
        $oldFinishedAt = $this->statusOfficeProcessing->getFinishedAt();
        $this->statusOfficeProcessing->setFailed($error);

        $this->onPropertyChanged('statusOfficeProcessing.mode', $oldMode, $this->statusOfficeProcessing->getMode());
        $this->onPropertyChanged('statusOfficeProcessing.finishedAt', $oldFinishedAt, $this->statusOfficeProcessing->getFinishedAt());
        $this->onPropertyChanged('statusOfficeProcessing.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusOfficeRemoval()
    {
        return $this->statusOfficeRemoval;
    }

    public function setStatusOfficeRemovalOn()
    {
        $oldMode = $this->statusOfficeRemoval->getMode();
        $oldStartedAt = $this->statusOfficeRemoval->getStartedAt();
        $this->statusOfficeRemoval->setOn();

        $this->onPropertyChanged('statusOfficeRemoval.mode', $oldMode, $this->statusOfficeRemoval->getMode());
        $this->onPropertyChanged('statusOfficeRemoval.startedAt', $oldStartedAt, $this->statusOfficeRemoval->getStartedAt());
    }

    public function setStatusOfficeRemovalDone()
    {
        $oldMode = $this->statusOfficeRemoval->getMode();
        $oldFinishedAt = $this->statusOfficeRemoval->getFinishedAt();
        $this->statusOfficeRemoval->setDone();

        $this->onPropertyChanged('statusOfficeRemoval.mode', $oldMode, $this->statusOfficeRemoval->getMode());
        $this->onPropertyChanged('statusOfficeRemoval.finishedAt', $oldFinishedAt, $this->statusOfficeRemoval->getFinishedAt());
    }

    public function setStatusOfficeRemovalFailed($error)
    {
        $oldMode = $this->statusOfficeRemoval->getMode();
        $oldFinishedAt = $this->statusOfficeRemoval->getFinishedAt();
        $this->statusOfficeRemoval->setFailed($error);

        $this->onPropertyChanged('statusOfficeRemoval.mode', $oldMode, $this->statusOfficeRemoval->getMode());
        $this->onPropertyChanged('statusOfficeRemoval.finishedAt', $oldFinishedAt, $this->statusOfficeRemoval->getFinishedAt());
        $this->onPropertyChanged('statusOfficeRemoval.error', null, $error);
    }
}
