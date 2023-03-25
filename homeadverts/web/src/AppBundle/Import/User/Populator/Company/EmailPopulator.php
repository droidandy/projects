<?php

namespace AppBundle\Import\User\Populator\Company;

use AppBundle\Entity\User\User;
use AppBundle\Import\Email\EmailsInUseListInterface;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\User\Populator\PopulatorInterface;
use AppBundle\Service\Lock\LockInterface;

class EmailPopulator implements PopulatorInterface
{
    /**
     * @var EmailsInUseListInterface
     */
    private $emailsInUseList;
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var LockInterface
     */
    private $lock;

    /**
     * @param EmailsInUseListInterface $emailsInUseList
     * @param ImportContext            $importContext
     * @param LockInterface            $lock
     */
    public function __construct(
        EmailsInUseListInterface $emailsInUseList,
        ImportContext $importContext,
        LockInterface $lock
    ) {
        $this->emailsInUseList = $emailsInUseList;
        $this->importContext = $importContext;
        $this->lock = $lock;
    }

    /**
     * @param User                       $user
     * @param NormalisedCompanyInterface $normalisedCompany
     */
    public function populate(User $user, $normalisedCompany)
    {
        $email = $normalisedCompany->getSourceRef().'@'.User::DOMAIN_NAME;
        $user->setEmailAndUsername($email);
        $user->isEmailGenerated = true;

        return true;
    }
}
