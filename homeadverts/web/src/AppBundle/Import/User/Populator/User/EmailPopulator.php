<?php

namespace AppBundle\Import\User\Populator\User;

use AppBundle\Import\Email\EmailSorter;
use AppBundle\Import\Email\EmailsInUseListInterface;
use AppBundle\Import\Email\MysqlEmailsInUseList;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Service\Lock\LockInterface;
use AppBundle\Entity\User\User;
use AppBundle\Import\User\Populator\PopulatorInterface;
use FOS\UserBundle\Util\CanonicalizerInterface;

class EmailPopulator implements PopulatorInterface
{
    /**
     * @var CanonicalizerInterface
     */
    private $canonicalizer;
    /**
     * @var EmailSorter
     */
    private $emailSorter;
    /**
     * @var MysqlEmailsInUseList
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
     * @param CanonicalizerInterface   $canonicalizer
     * @param EmailSorter              $emailSorter
     * @param EmailsInUseListInterface $emailsInUseList
     * @param ImportContext            $importContext
     * @param LockInterface            $lock
     */
    public function __construct(
        CanonicalizerInterface $canonicalizer,
        EmailSorter $emailSorter,
        EmailsInUseListInterface $emailsInUseList,
        ImportContext $importContext,
        LockInterface $lock
    ) {
        $this->canonicalizer = $canonicalizer;
        $this->emailSorter = $emailSorter;
        $this->emailsInUseList = $emailsInUseList;
        $this->importContext = $importContext;
        $this->lock = $lock;
    }

    /**
     * @param User                    $user
     * @param NormalisedUserInterface $normalisedUser
     */
    public function populate(User $user, $normalisedUser)
    {
        $leadEmails = $this->emailSorter->getLeadEmailsOrdered($normalisedUser->getAllEmails());
        $emailAddress = $normalisedUser->getEmail();
        $generatedEmail = $normalisedUser->getSourceRef().'@'.User::DOMAIN_NAME;
        $sourceRef = $normalisedUser->getSourceRef();

        $isUsed = $this->emailsInUseList->isInUse($emailAddress);
        $isUsedByMe = $this->emailsInUseList->isInUseBySourceRef($emailAddress, $sourceRef);

        $user->setEmailAndUsername($generatedEmail);
        $user->isEmailGenerated = true;

        if (!$isUsedByMe && !$isUsed) {
            $user->setEmailAndUsername($emailAddress);
            $user->isEmailGenerated = false;
        }

        if (!empty($leadEmails)) {
            $user->setLeadEmail($leadEmails[0]);
        }
    }
}
