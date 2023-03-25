<?php

namespace AppBundle\Import\User\Populator;

use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;

class EnquiryPopulator implements PopulatorInterface
{
    /**
     * @var ImportContext
     */
    private $importContext;

    /**
     * EnquiryPopulator constructor.
     *
     * @param ImportContext $importContext
     */
    public function __construct(ImportContext $importContext)
    {
        $this->importContext = $importContext;
    }

    /**
     * @param User                    $user
     * @param NormalisedUserInterface $normalisedUser
     */
    public function populate(User $user, $normalisedUser)
    {
        // todo: implement missing
//        if ($masterUser = $this->importContext->getMasterUser()) {
//            $user->forwardEnquiriesUsers->add($masterUser);
//        }
    }
}
