<?php

namespace AppBundle\Entity\Import;

use AppBundle\Entity\Embeddable\Status;
use AppBundle\Entity\Traits\IdTrait;
use Doctrine\Common\NotifyPropertyChanged;
use Doctrine\Common\PropertyChangedListener;
use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\Traits\DeprecatedPropertyAccessTrait;
use AppBundle\Entity\Traits\StatusTrait;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Import\ImportJobRepository")
 * @ORM\Table(name="import_job")
 * @ORM\ChangeTrackingPolicy("NOTIFY")
 */
class ImportJob implements NotifyPropertyChanged
{
    use DeprecatedPropertyAccessTrait;
    use StatusTrait;
    use ImportJobCompanyTrait;
    use ImportJobOfficeTrait;

    const MODE_UNDEFINED = 0;
    const MODE_ACTIVE = 1;
    const MODE_DONE = 2;
    const MODE_FAILED = 3;

    const DATA_SYNC_ACTIVE = 'datasync:active';
    const DATA_SYNC_DELTA = 'datasync:delta';
    const DATA_SYNC_FAILED = 'datasync:failed';

    use IdTrait;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    public $method = null;
    /**
     * @ORM\Column(type="datetime",name="date_added")
     */
    protected $dateAdded;
    /**
     * @ORM\Column(type="boolean", name="force_renewal")
     */
    protected $forceRenewal = false;
    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $total = 0;
    /**
     * @ORM\Column(type="integer")
     */
    protected $processed = 0;
    /**
     * @ORM\Column(type="integer")
     */
    protected $skipped = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $updated = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $added = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $errors = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $errorsBedroom = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $errorsMetadata = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $errorsAddress = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $errorsPrice = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $errorsPhotos = 0;

    /**
     * @ORM\Column(type="integer")
     */
    protected $errorsOther = 0;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $removed = null;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $userTotal = 0;

    /**
     * @ORM\Column(type="integer", name="user_processed")
     */
    protected $userProcessed = 0;

    /**
     * @ORM\Column(type="integer", name="user_skipped")
     */
    protected $userSkipped = 0;

    /**
     * @ORM\Column(type="integer", name="user_updated")
     */
    protected $userUpdated = 0;

    /**
     * @ORM\Column(type="integer", name="user_added")
     */
    protected $userAdded = 0;

    /**
     * @ORM\Column(type="integer", name="user_errors")
     */
    protected $userErrors = 0;

    /**
     * @ORM\Column(type="integer", name="user_removed", nullable=true)
     */
    protected $userRemoved;

    /**
     * @ORM\Column(type="string", name="lock_value", nullable=true)
     */
    protected $lockValue;

    /**
     * @var PropertyChangedListener[]
     */
    private $listeners = [];

    /**
     * @var bool
     */
    private $shouldNotify = false;

    public function __construct()
    {
        $this->dateAdded = new \DateTime();
        $this->processed = 0;
        $this->errors = 0;

        $this->statusImport = new Status();
        $this->statusDeploy = new Status();

        $this->statusExtracting = new Status();
        $this->statusCompanyExtracting = new Status();
        $this->statusOfficeExtracting = new Status();

        $this->statusCompanyProcessing = new Status();
        $this->statusOfficeProcessing = new Status();
        $this->statusUserProcessing = new Status();
        $this->statusPropertyProcessing = new Status();

        $this->statusCompanyRemoval = new Status();
        $this->statusOfficeRemoval = new Status();
        $this->statusUserRemoval = new Status();
        $this->statusPropertyRemoval = new Status();
    }

    public function __toString()
    {
        return json_encode($this);
    }

    public function addPropertyChangedListener(PropertyChangedListener $listener)
    {
        $this->listeners[] = $listener;
    }

    protected function onPropertyChanged($propName, $oldValue, $newValue)
    {
        if (!$this->shouldNotify) {
            return;
        }

        foreach ($this->listeners as $listener) {
            $listener->propertyChanged($this, $propName, $oldValue, $newValue);
        }
    }

    public function __call($name, $arguments)
    {
        if ('Notify' != substr($name, -6)) {
            throw new \BadMethodCallException(sprintf('Method "%s" doesn\'t exist in the class "%s"', $name, static::class));
        }
        $method = substr($name, 0, -6);
        if (
            0 !== strpos($method, 'set')
            && 0 !== strpos($method, 'increment')
            && 0 !== strpos($method, 'decrement')
        ) {
            throw new \BadMethodCallException(sprintf('Only set, increment and decrement are supported'));
        }
        if (!method_exists($this, $method)) {
            throw new \BadMethodCallException(sprintf('Method "%s" doesn\'t exist in the class "%s"', $method, static::class));
        }

        $this->shouldNotify = true;
        $this->{$method}(...$arguments);
        $this->shouldNotify = false;
    }

    /**
     * @return mixed
     */
    public function getDateAdded()
    {
        return $this->dateAdded;
    }

    /**
     * @param mixed $dateAdded
     *
     * @return self
     */
    public function setDateAdded($dateAdded)
    {
        $this->onPropertyChanged('dateAdded', $this->dateAdded, $dateAdded);
        $this->dateAdded = $dateAdded;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getMethod()
    {
        return $this->method;
    }

    /**
     * @param string $method
     */
    public function setMethod($method)
    {
        $this->method = $method;
    }

    /**
     * @return mixed
     */
    public function getForceRenewal()
    {
        return $this->forceRenewal;
    }

    /**
     * @param mixed $forceRenewal
     */
    public function setForceRenewal($forceRenewal)
    {
        $this->onPropertyChanged('forceRenewal', $this->forceRenewal, $forceRenewal);
        $this->forceRenewal = $forceRenewal;
    }

    /**
     * @return mixed
     */
    public function getTotal()
    {
        return $this->total;
    }

    /**
     * @param mixed $total
     *
     * @return self
     */
    public function setTotal($total)
    {
        $this->onPropertyChanged('total', $this->total, $total);
        $this->total = $total;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getProcessed()
    {
        return $this->processed;
    }

    /**
     * @param mixed $processed
     *
     * @return self
     */
    public function setProcessed($processed)
    {
        $this->onPropertyChanged('processed', $this->processed, $processed);
        $this->processed = $processed;

        return $this;
    }

    public function incrementProcessed()
    {
        $this->onPropertyChanged('processed', $this->processed, $this->processed + 1);
        ++$this->processed;
    }

    public function decrementProcessed()
    {
        $this->onPropertyChanged('processed', $this->processed, $this->processed - 1);
        --$this->processed;
    }

    /**
     * @return mixed
     */
    public function getSkipped()
    {
        return $this->skipped;
    }

    /**
     * @param mixed $skipped
     *
     * @return self
     */
    public function setSkipped($skipped)
    {
        $this->onPropertyChanged('skipped', $this->skipped, $skipped);
        $this->skipped = $skipped;

        return $this;
    }

    public function incrementSkipped()
    {
        $this->onPropertyChanged('skipped', $this->skipped, $this->skipped + 1);
        ++$this->skipped;
    }

    public function decrementSkipped()
    {
        $this->onPropertyChanged('skipped', $this->skipped, $this->skipped - 1);
        --$this->skipped;
    }

    /**
     * @return mixed
     */
    public function getUpdated()
    {
        return $this->updated;
    }

    /**
     * @param mixed $updated
     *
     * @return self
     */
    public function setUpdated($updated)
    {
        $this->onPropertyChanged('updated', $this->updated, $updated);
        $this->updated = $updated;

        return $this;
    }

    public function incrementUpdated()
    {
        $this->onPropertyChanged('updated', $this->updated, $this->updated + 1);
        ++$this->updated;
    }

    public function decrementUpdated()
    {
        $this->onPropertyChanged('updated', $this->updated, $this->updated - 1);
        --$this->updated;
    }

    /**
     * @return mixed
     */
    public function getAdded()
    {
        return $this->added;
    }

    /**
     * @param mixed $added
     */
    public function setAdded($added)
    {
        $this->onPropertyChanged('added', $this->added, $added);
        $this->added = $added;

        return $this;
    }

    public function incrementAdded()
    {
        $this->onPropertyChanged('added', $this->added, $this->added + 1);
        ++$this->added;
    }

    public function decrementAdded()
    {
        $this->onPropertyChanged('added', $this->added, $this->added - 1);
        --$this->added;
    }

    /**
     * @return mixed
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * @param mixed $errors
     *
     * @return self
     */
    public function setErrors($errors)
    {
        $this->onPropertyChanged('errors', $this->errors, $errors);
        $this->errors = $errors;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getErrorsBedroom()
    {
        return $this->errorsBedroom;
    }

    /**
     * @param mixed $errorsBedroom
     *
     * @return self
     */
    public function setErrorsBedroom($errorsBedroom)
    {
        $this->onPropertyChanged('errorsBedroom', $this->errorsBedroom, $errorsBedroom);
        $this->errorsBedroom = $errorsBedroom;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getErrorsMetadata()
    {
        return $this->errorsMetadata;
    }

    /**
     * @param mixed $errorsMetadata
     *
     * @return self
     */
    public function setErrorsMetadata($errorsMetadata)
    {
        $this->onPropertyChanged('errorsMetadata', $this->errorsMetadata, $errorsMetadata);
        $this->errorsMetadata = $errorsMetadata;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getErrorsAddress()
    {
        return $this->errorsAddress;
    }

    /**
     * @param mixed $errorsAddress
     *
     * @return self
     */
    public function setErrorsAddress($errorsAddress)
    {
        $this->onPropertyChanged('errorsAddress', $this->errorsAddress, $errorsAddress);
        $this->errorsAddress = $errorsAddress;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getErrorsPrice()
    {
        return $this->errorsPrice;
    }

    /**
     * @param mixed $errorsPrice
     *
     * @return self
     */
    public function setErrorsPrice($errorsPrice)
    {
        $this->onPropertyChanged('errorsPrice', $this->errorsPrice, $errorsPrice);
        $this->errorsPrice = $errorsPrice;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getErrorsPhotos()
    {
        return $this->errorsPhotos;
    }

    /**
     * @param mixed $errorsPhotos
     *
     * @return self
     */
    public function setErrorsPhotos($errorsPhotos)
    {
        $this->onPropertyChanged('errorsPhotos', $this->errorsPhotos, $errorsPhotos);
        $this->errorsPhotos = $errorsPhotos;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getErrorsOther()
    {
        return $this->errorsOther;
    }

    /**
     * @param mixed $errorsOther
     *
     * @return self
     */
    public function setErrorsOther($errorsOther)
    {
        $this->onPropertyChanged('errorsOther', $this->errorsOther, $errorsOther);
        $this->errorsOther = $errorsOther;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getRemoved()
    {
        return $this->removed;
    }

    /**
     * @param mixed $removed
     */
    public function setRemoved($removed = null)
    {
        $this->onPropertyChanged('removed', $this->removed, $removed);
        $this->removed = $removed;
    }

    /**
     * @return mixed
     */
    public function getUserTotal()
    {
        return $this->userTotal;
    }

    /**
     * @param mixed $userTotal
     */
    public function setUserTotal($userTotal)
    {
        $this->onPropertyChanged('userTotal', $this->userTotal, $userTotal);
        $this->userTotal = $userTotal;
    }

    /**
     * @return mixed
     */
    public function getUserProcessed()
    {
        return $this->userProcessed;
    }

    /**
     * @param mixed $userProcessed
     */
    public function setUserProcessed($userProcessed)
    {
        $this->onPropertyChanged('userProcessed', $this->userProcessed, $userProcessed);
        $this->userProcessed = $userProcessed;
    }

    public function incrementUserProcessed()
    {
        $this->onPropertyChanged('userProcessed', $this->userProcessed, $this->userProcessed + 1);
        ++$this->userProcessed;
    }

    public function decrementUserProcessed()
    {
        $this->onPropertyChanged('userProcessed', $this->userProcessed, $this->userProcessed - 1);
        --$this->userProcessed;
    }

    /**
     * @return mixed
     */
    public function getUserSkipped()
    {
        return $this->userSkipped;
    }

    /**
     * @param mixed $userSkipped
     */
    public function setUserSkipped($userSkipped)
    {
        $this->onPropertyChanged('userSkipped', $this->userSkipped, $userSkipped);
        $this->userSkipped = $userSkipped;
    }

    public function incrementUserSkipped()
    {
        $this->onPropertyChanged('userSkipped', $this->userSkipped, $this->userSkipped + 1);
        ++$this->userSkipped;
    }

    public function decrementUserSkipped()
    {
        $this->onPropertyChanged('userSkipped', $this->userSkipped, $this->userSkipped - 1);
        --$this->userSkipped;
    }

    /**
     * @return mixed
     */
    public function getUserUpdated()
    {
        return $this->userUpdated;
    }

    /**
     * @param mixed $userUpdated
     */
    public function setUserUpdated($userUpdated)
    {
        $this->onPropertyChanged('userUpdated', $this->userUpdated, $userUpdated);
        $this->userUpdated = $userUpdated;
    }

    public function incrementUserUpdated()
    {
        $this->onPropertyChanged('userUpdated', $this->userUpdated, $this->userUpdated + 1);
        ++$this->userUpdated;
    }

    public function decrementUserUpdated()
    {
        $this->onPropertyChanged('userUpdated', $this->userUpdated, $this->userUpdated - 1);
        --$this->userUpdated;
    }

    /**
     * @return mixed
     */
    public function getUserAdded()
    {
        return $this->userAdded;
    }

    /**
     * @param mixed $userAdded
     */
    public function setUserAdded($userAdded)
    {
        $this->onPropertyChanged('userAdded', $this->userAdded, $userAdded);
        $this->userAdded = $userAdded;
    }

    public function incrementUserAdded()
    {
        $this->onPropertyChanged('userAdded', $this->userAdded, $this->userAdded + 1);
        ++$this->userAdded;
    }

    public function decrementUserAdded()
    {
        $this->onPropertyChanged('userAdded', $this->userAdded, $this->userAdded - 1);
        --$this->userAdded;
    }

    /**
     * @return mixed
     */
    public function getUserErrors()
    {
        return $this->userErrors;
    }

    /**
     * @param mixed $userErrors
     */
    public function setUserErrors($userErrors)
    {
        $this->onPropertyChanged('userErrors', $this->userErrors, $userErrors);
        $this->userErrors = $userErrors;
    }

    public function incrementUserErrors()
    {
        $this->onPropertyChanged('userErrors', $this->userErrors, $this->userErrors + 1);
        ++$this->userErrors;
    }

    public function decrementUserErrors()
    {
        $this->onPropertyChanged('userErrors', $this->userErrors, $this->userErrors - 1);
        --$this->userErrors;
    }

    /**
     * @return mixed
     */
    public function getUserRemoved()
    {
        return $this->userRemoved;
    }

    /**
     * @param mixed $userRemoved
     */
    public function setUserRemoved($userRemoved = null)
    {
        $this->onPropertyChanged('userRemoved', $this->userRemoved, $userRemoved);
        $this->userRemoved = $userRemoved;
    }

    /**
     * @return string
     */
    public function getLockName(): string
    {
        return 'lock:import';
    }

    public function getCompleteLockName(): string
    {
        return 'lock:import_completion:'.$this->getId();
    }

    /**
     * @return string
     */
    public function getLockValue(): string
    {
        return $this->lockValue;
    }

    /**
     * @param string $lockValue
     */
    public function setLockValue(string $lockValue): void
    {
        $this->lockValue = $lockValue;
    }

    public function getLockTimeoutAndWaitTimeout(): array
    {
        if ('active' === $this->getMethod()) {
            return [2 * 60 * 60, 30 * 60];
        }

        return [30 * 60, null];
    }

    /**
     * Determine if the job has finished.
     *
     * @return bool
     */
    public function hasFinished()
    {
        return Status::MODE_DONE === $this->statusPropertyProcessing->getMode()
            || ($this->processed >= ($this->total - 6))
        ;
    }
}
