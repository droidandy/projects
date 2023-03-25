<?php

namespace AppBundle\Import\User\Populator\Office;

use AppBundle\Entity\User\User;
use AppBundle\Import\Email\EmailsInUseListInterface;
use AppBundle\Import\Email\MysqlEmailsInUseList;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\User\Populator\PopulatorInterface;
use AppBundle\Service\Lock\LockInterface;
use FOS\UserBundle\Util\CanonicalizerInterface;

class EmailPopulator implements PopulatorInterface
{
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
     * @param EmailsInUseListInterface $emailsInUseList
     * @param CanonicalizerInterface   $canonicalizer
     * @param ImportContext            $importContext
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
     * @param User                      $user
     * @param NormalisedOfficeInterface $normalisedOffice
     */
    public function populate(User $user, $normalisedOffice)
    {
        $emailAddress = $normalisedOffice->getEmail();
        $leadEmail = $normalisedOffice->getLeadEmail();
        $generatedEmail = $normalisedOffice->getSourceRef().'@'.User::DOMAIN_NAME;
        $sourceRef = $normalisedOffice->getSourceRef();

        $isUsed = $this->emailsInUseList->isInUse($emailAddress);
        $isUsedByMe = $this->emailsInUseList->isInUseBySourceRef($emailAddress, $sourceRef);

        $user->setEmailAndUsername($generatedEmail);
        $user->isEmailGenerated = true;

        if (!$isUsedByMe && !$isUsed) {
            $user->setEmailAndUsername($emailAddress);
            $user->isEmailGenerated = false;
        }

        if ($leadEmail && $user->getLeadEmail() !== $leadEmail) {
            $user->setLeadEmail($leadEmail);
        } elseif (!$leadEmail) {
            $user->setLeadEmail($normalisedOffice->getEmail());
        }
    }
}
