<?php

namespace AppBundle\Import\User\Populator;

use AppBundle\Entity\Import\ImportCompany;
use AppBundle\Entity\Import\ImportOffice;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\User\Hasher;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Import\ImportUser;
use AppBundle\Entity\User\User;

class ImportUserTracker
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var Hasher
     */
    private $hasher;

    /**
     * ImportUserTracker constructor.
     *
     * @param EntityManager $em
     * @param ImportContext $importContext
     * @param Hasher        $hasher
     */
    public function __construct(EntityManager $em, ImportContext $importContext, Hasher $hasher)
    {
        $this->em = $em;
        $this->importContext = $importContext;
        $this->hasher = $hasher;
    }

    public function notifyCompanySkipped(User $user, NormalisedCompanyInterface $normalisedCompany)
    {
        $this->addImportCompany($user, $normalisedCompany, null, true);
    }

    public function notifyCompanyProcessed(User $user, NormalisedCompanyInterface $normalisedCompany, $errors)
    {
        $this->addImportCompany(
            $user,
            $normalisedCompany,
            $errors
        );
    }

    public function notifyOfficeSkipped(User $user, NormalisedOfficeInterface $normalisedOffice)
    {
        $this->addImportOffice($user, $normalisedOffice, null, true);
    }

    public function notifyOfficeProcessed(User $user, NormalisedOfficeInterface $normalisedOffice, $errors)
    {
        $this->addImportOffice(
            $user,
            $normalisedOffice,
            $errors
        );
    }

    public function notifyUserSkipped(User $user, NormalisedUserInterface $normalisedUser)
    {
        $this->addImportUser($user, $normalisedUser, null, true);
    }

    public function notifyUserProcessed(User $user, NormalisedUserInterface $normalisedUser, $errors)
    {
        $this->addImportUser(
            $user,
            $normalisedUser,
            $errors
        );
    }

    private function addImportCompany(
        User $user,
        NormalisedCompanyInterface $normalisedCompany,
        $errors = null,
        $skipped = false
    ) {
        $importCompany = new ImportCompany();
        $importCompany->job = $this->importContext->getImportJob();
        $importCompany->user = $user;
        $importCompany->sourceRef = $user->sourceRef;
        $importCompany->hash = $this->hasher->hash($normalisedCompany);
        $importCompany->date = new \DateTime();
        $importCompany->errors = $errors;
        $importCompany->skipped = $skipped;

        $this->em->persist($importCompany);
    }

    private function addImportOffice(
        User $user,
        NormalisedOfficeInterface $normalisedOffice,
        $errors = null,
        $skipped = false
    ) {
        $importOffice = new ImportOffice();
        $importOffice->job = $this->importContext->getImportJob();
        $importOffice->user = $user;
        $importOffice->sourceRef = $user->sourceRef;
        $importOffice->hash = $this->hasher->hash($normalisedOffice);
        $importOffice->date = new \DateTime();
        $importOffice->errors = $errors;
        $importOffice->skipped = $skipped;

        $this->em->persist($importOffice);
    }

    private function addImportUser(
        User $user,
        NormalisedUserInterface $normalisedUser,
        $errors = null,
        $skipped = false
    ) {
        $importUser = new ImportUser();
        $importUser->job = $this->importContext->getImportJob();
        $importUser->user = $user;
        $importUser->sourceRef = $user->sourceRef;
        $importUser->hash = $this->hasher->hash($normalisedUser);
        $importUser->date = new \DateTime();
        $importUser->errors = $errors;
        $importUser->skipped = $skipped;

        $this->em->persist($importUser);
    }
}
