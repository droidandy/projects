<?php

namespace AppBundle\Entity\Traits;

use AppBundle\Entity\Embeddable\Status;
use Doctrine\ORM\Mapping as ORM;

trait StatusTrait
{
    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_import_")
     *
     * @var Status
     */
    protected $statusImport;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_deploy_")
     *
     * @var Status
     */
    protected $statusDeploy;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_extracting_")
     *
     * @var Status
     */
    protected $statusExtracting;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_user_processing_")
     *
     * @var Status
     */
    protected $statusUserProcessing;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_property_processing_")
     *
     * @var Status
     */
    protected $statusPropertyProcessing;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_user_removal_")
     *
     * @var Status
     */
    protected $statusUserRemoval;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Status", columnPrefix="status_removal_")
     *
     * @var Status
     */
    protected $statusPropertyRemoval;

    /**
     * @return Status
     */
    public function getStatusImport()
    {
        return $this->statusImport;
    }

    public function setStatusImportOn()
    {
        $oldMode = $this->statusImport->getMode();
        $oldStartedAt = $this->statusImport->getStartedAt();
        $this->statusImport->setOn();

        $this->onPropertyChanged('statusImport.mode', $oldMode, $this->statusImport->getMode());
        $this->onPropertyChanged('statusImport.startedAt', $oldStartedAt, $this->statusImport->getStartedAt());
    }

    public function setStatusImportDone()
    {
        $oldMode = $this->statusImport->getMode();
        $oldFinishedAt = $this->statusImport->getFinishedAt();
        $this->statusImport->setDone();

        $this->onPropertyChanged('statusImport.mode', $oldMode, $this->statusImport->getMode());
        $this->onPropertyChanged('statusImport.finishedAt', $oldFinishedAt, $this->statusImport->getFinishedAt());
    }

    public function setStatusImportFailed($error)
    {
        $oldMode = $this->statusImport->getMode();
        $oldFinishedAt = $this->statusImport->getFinishedAt();
        $this->statusImport->setFailed($error);

        $this->onPropertyChanged('statusImport.mode', $oldMode, $this->statusImport->getMode());
        $this->onPropertyChanged('statusImport.finishedAt', $oldFinishedAt, $this->statusImport->getFinishedAt());
        $this->onPropertyChanged('statusImport.error', null, $error);
    }

    public function setStatusImportDenied(string $reason): void
    {
        $oldMode = $this->statusImport->getMode();
        $oldFinishedAt = $this->statusImport->getFinishedAt();
        $this->statusImport->setDenied($reason);

        $this->onPropertyChanged('statusImport.mode', $oldMode, $this->statusImport->getMode());
        $this->onPropertyChanged('statusImport.finishedAt', $oldFinishedAt, $this->statusImport->getFinishedAt());
        $this->onPropertyChanged('statusImport.error', null, $reason);
    }

    /**
     * @return Status
     */
    public function getStatusDeploy()
    {
        return $this->statusDeploy;
    }

    public function setStatusDeployOn()
    {
        $oldMode = $this->statusDeploy->getMode();
        $oldStartedAt = $this->statusDeploy->getStartedAt();
        $this->statusDeploy->setOn();

        $this->onPropertyChanged('statusDeploy.mode', $oldMode, $this->statusDeploy->getMode());
        $this->onPropertyChanged('statusDeploy.startedAt', $oldStartedAt, $this->statusDeploy->getStartedAt());
    }

    public function setStatusDeployDone()
    {
        $oldMode = $this->statusDeploy->getMode();
        $oldFinishedAt = $this->statusDeploy->getFinishedAt();
        $this->statusDeploy->setDone();

        $this->onPropertyChanged('statusDeploy.mode', $oldMode, $this->statusDeploy->getMode());
        $this->onPropertyChanged('statusDeploy.finishedAt', $oldFinishedAt, $this->statusDeploy->getFinishedAt());
    }

    public function setStatusDeployFailed($error)
    {
        $oldMode = $this->statusDeploy->getMode();
        $oldFinishedAt = $this->statusDeploy->getFinishedAt();
        $this->statusDeploy->setFailed($error);

        $this->onPropertyChanged('statusDeploy.mode', $oldMode, $this->statusDeploy->getMode());
        $this->onPropertyChanged('statusDeploy.finishedAt', $oldFinishedAt, $this->statusDeploy->getFinishedAt());
        $this->onPropertyChanged('statusDeploy.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusExtracting()
    {
        return $this->statusExtracting;
    }

    public function setStatusExtractingOn()
    {
        $oldMode = $this->statusExtracting->getMode();
        $oldStartedAt = $this->statusExtracting->getStartedAt();
        $this->statusExtracting->setOn();

        $this->onPropertyChanged('statusExtracting.mode', $oldMode, $this->statusExtracting->getMode());
        $this->onPropertyChanged('statusExtracting.startedAt', $oldStartedAt, $this->statusExtracting->getStartedAt());
    }

    public function setStatusExtractingDone()
    {
        $oldMode = $this->statusExtracting->getMode();
        $oldFinishedAt = $this->statusExtracting->getFinishedAt();
        $this->statusExtracting->setDone();

        $this->onPropertyChanged('statusExtracting.mode', $oldMode, $this->statusExtracting->getMode());
        $this->onPropertyChanged('statusExtracting.finishedAt', $oldFinishedAt, $this->statusExtracting->getFinishedAt());
    }

    public function setStatusExtractingFailed($error)
    {
        $oldMode = $this->statusExtracting->getMode();
        $oldFinishedAt = $this->statusExtracting->getFinishedAt();
        $this->statusExtracting->setFailed($error);

        $this->onPropertyChanged('statusExtracting.mode', $oldMode, $this->statusExtracting->getMode());
        $this->onPropertyChanged('statusExtracting.finishedAt', $oldFinishedAt, $this->statusExtracting->getFinishedAt());
        $this->onPropertyChanged('statusExtracting.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusUserProcessing()
    {
        return $this->statusUserProcessing;
    }

    public function setStatusUserProcessingOn()
    {
        $oldMode = $this->statusUserProcessing->getMode();
        $oldStartedAt = $this->statusUserProcessing->getStartedAt();
        $this->statusUserProcessing->setOn();

        $this->onPropertyChanged('statusUserProcessing.mode', $oldMode, $this->statusUserProcessing->getMode());
        $this->onPropertyChanged('statusUserProcessing.startedAt', $oldStartedAt, $this->statusUserProcessing->getStartedAt());
    }

    public function setStatusUserProcessingDone()
    {
        $oldMode = $this->statusUserProcessing->getMode();
        $oldFinishedAt = $this->statusUserProcessing->getFinishedAt();
        $this->statusUserProcessing->setDone();

        $this->onPropertyChanged('statusUserProcessing.mode', $oldMode, $this->statusUserProcessing->getMode());
        $this->onPropertyChanged('statusUserProcessing.finishedAt', $oldFinishedAt, $this->statusUserProcessing->getFinishedAt());
    }

    public function setStatusUserProcessingFailed($error)
    {
        $oldMode = $this->statusUserProcessing->getMode();
        $oldFinishedAt = $this->statusUserProcessing->getFinishedAt();
        $this->statusUserProcessing->setFailed($error);

        $this->onPropertyChanged('statusUserProcessing.mode', $oldMode, $this->statusUserProcessing->getMode());
        $this->onPropertyChanged('statusUserProcessing.finishedAt', $oldFinishedAt, $this->statusUserProcessing->getFinishedAt());
        $this->onPropertyChanged('statusUserProcessing.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusPropertyProcessing()
    {
        return $this->statusPropertyProcessing;
    }

    public function setStatusPropertyProcessingOn()
    {
        $oldMode = $this->statusPropertyProcessing->getMode();
        $oldStartedAt = $this->statusPropertyProcessing->getStartedAt();
        $this->statusPropertyProcessing->setOn();

        $this->onPropertyChanged('statusPropertyProcessing.mode', $oldMode, $this->statusPropertyProcessing->getMode());
        $this->onPropertyChanged('statusPropertyProcessing.startedAt', $oldStartedAt, $this->statusPropertyProcessing->getStartedAt());
    }

    public function setStatusPropertyProcessingDone()
    {
        $oldMode = $this->statusPropertyProcessing->getMode();
        $oldFinishedAt = $this->statusPropertyProcessing->getFinishedAt();
        $this->statusPropertyProcessing->setDone();

        $this->onPropertyChanged('statusPropertyProcessing.mode', $oldMode, $this->statusPropertyProcessing->getMode());
        $this->onPropertyChanged('statusPropertyProcessing.finishedAt', $oldFinishedAt, $this->statusPropertyProcessing->getFinishedAt());
    }

    public function setStatusPropertyProcessingFailed($error)
    {
        $oldMode = $this->statusPropertyProcessing->getMode();
        $oldFinishedAt = $this->statusPropertyProcessing->getFinishedAt();
        $this->statusPropertyProcessing->setFailed($error);

        $this->onPropertyChanged('statusPropertyProcessing.mode', $oldMode, $this->statusPropertyProcessing->getMode());
        $this->onPropertyChanged('statusPropertyProcessing.finishedAt', $oldFinishedAt, $this->statusPropertyProcessing->getFinishedAt());
        $this->onPropertyChanged('statusPropertyProcessing.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusUserRemoval()
    {
        return $this->statusUserRemoval;
    }

    public function setStatusUserRemovalOn()
    {
        $oldMode = $this->statusUserRemoval->getMode();
        $oldStartedAt = $this->statusUserRemoval->getStartedAt();
        $this->statusUserRemoval->setOn();

        $this->onPropertyChanged('statusUserRemoval.mode', $oldMode, $this->statusUserRemoval->getMode());
        $this->onPropertyChanged('statusUserRemoval.startedAt', $oldStartedAt, $this->statusUserRemoval->getStartedAt());
    }

    public function setStatusUserRemovalDone()
    {
        $oldMode = $this->statusUserRemoval->getMode();
        $oldFinishedAt = $this->statusUserRemoval->getFinishedAt();
        $this->statusUserRemoval->setDone();

        $this->onPropertyChanged('statusUserRemoval.mode', $oldMode, $this->statusUserRemoval->getMode());
        $this->onPropertyChanged('statusUserRemoval.finishedAt', $oldFinishedAt, $this->statusUserRemoval->getFinishedAt());
    }

    public function setStatusUserRemovalFailed($error)
    {
        $oldMode = $this->statusUserRemoval->getMode();
        $oldFinishedAt = $this->statusUserRemoval->getFinishedAt();
        $this->statusUserRemoval->setFailed($error);

        $this->onPropertyChanged('statusUserRemoval.mode', $oldMode, $this->statusUserRemoval->getMode());
        $this->onPropertyChanged('statusUserRemoval.finishedAt', $oldFinishedAt, $this->statusUserRemoval->getFinishedAt());
        $this->onPropertyChanged('statusUserRemoval.error', null, $error);
    }

    /**
     * @return Status
     */
    public function getStatusPropertyRemoval()
    {
        return $this->statusPropertyRemoval;
    }

    public function setStatusPropertyRemovalOn()
    {
        $oldMode = $this->statusPropertyRemoval->getMode();
        $oldStartedAt = $this->statusPropertyRemoval->getStartedAt();
        $this->statusPropertyRemoval->setOn();

        $this->onPropertyChanged('statusPropertyRemoval.mode', $oldMode, $this->statusPropertyRemoval->getMode());
        $this->onPropertyChanged('statusPropertyRemoval.startedAt', $oldStartedAt, $this->statusPropertyRemoval->getStartedAt());
    }

    public function setStatusPropertyRemovalDone()
    {
        $oldMode = $this->statusPropertyRemoval->getMode();
        $oldFinishedAt = $this->statusPropertyRemoval->getFinishedAt();
        $this->statusPropertyRemoval->setDone();

        $this->onPropertyChanged('statusPropertyRemoval.mode', $oldMode, $this->statusPropertyRemoval->getMode());
        $this->onPropertyChanged('statusPropertyRemoval.finishedAt', $oldFinishedAt, $this->statusPropertyRemoval->getFinishedAt());
    }

    public function setStatusPropertyRemovalFailed($error)
    {
        $oldMode = $this->statusPropertyRemoval->getMode();
        $oldFinishedAt = $this->statusPropertyRemoval->getFinishedAt();
        $this->statusPropertyRemoval->setFailed($error);

        $this->onPropertyChanged('statusPropertyRemoval.mode', $oldMode, $this->statusPropertyRemoval->getMode());
        $this->onPropertyChanged('statusPropertyRemoval.finishedAt', $oldFinishedAt, $this->statusPropertyRemoval->getFinishedAt());
        $this->onPropertyChanged('statusPropertyRemoval.error', null, $error);
    }
}
