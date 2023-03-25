<?php

namespace AppBundle\Import\User\Populator;

use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;

interface PopulatorInterface
{
    /**
     * @param User                                                                         $user
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedDoc
     *
     * @return mixed
     */
    public function populate(User $user, $normalisedDoc);
}
