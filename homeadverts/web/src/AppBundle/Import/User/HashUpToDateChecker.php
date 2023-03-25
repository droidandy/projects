<?php

namespace AppBundle\Import\User;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;

class HashUpToDateChecker
{
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var Hasher
     */
    private $hasher;

    /**
     * HashUpToDateChecker constructor.
     *
     * @param UserRepository $userRepo
     * @param Hasher         $hasher
     */
    public function __construct(UserRepository $userRepo, Hasher $hasher)
    {
        $this->userRepo = $userRepo;
        $this->hasher = $hasher;
    }

    /**
     * @param User                                                                         $user
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedDoc
     *
     * @return bool
     */
    public function isUpToDate(User $user, $normalisedDoc)
    {
        $hash = $this->hasher->hash($normalisedDoc);

        return $this->userRepo->isHashLatest($user, $hash, $normalisedDoc);
    }
}
