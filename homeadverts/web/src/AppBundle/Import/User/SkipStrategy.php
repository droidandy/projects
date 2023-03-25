<?php

namespace AppBundle\Import\User;

use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;

class SkipStrategy
{
    /**
     * @var HashUpToDateChecker
     */
    private $upToDateChecker;
    /**
     * @var ImportContext
     */
    private $importContext;

    /**
     * SkipStrategy constructor.
     *
     * @param HashUpToDateChecker $upToDateChecker
     * @param ImportContext       $importContext
     */
    public function __construct(HashUpToDateChecker $upToDateChecker, ImportContext $importContext)
    {
        $this->upToDateChecker = $upToDateChecker;
        $this->importContext = $importContext;
    }

    /**
     * @param User                                                                         $user
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedDoc
     *
     * @return bool|string
     */
    public function shouldBeSkipped(User $user, $normalisedDoc)
    {
        $importJob = $this->importContext->getImportJob();
        if ($importJob->getForceRenewal()) {
            return false;
        }
        // force reprocessing to dedicated cases
        if (
            $normalisedDoc instanceof NormalisedOfficeInterface
            || (
                $normalisedDoc instanceof NormalisedOfficeInterface
                && GoogleLocation::STATUS_PROCESSED !== $user->getGoogleLocationsStatus()
            )
            || (
                $normalisedDoc instanceof NormalisedUserInterface
                && GoogleLocation::STATUS_PROCESSED !== $user->getGoogleLocationsStatus()
            )
        ) {
            return false;
        }
        if ($this->upToDateChecker->isUpToDate($user, $normalisedDoc)) {
            return 'User is up to date';
        }

        return false;
    }
}
