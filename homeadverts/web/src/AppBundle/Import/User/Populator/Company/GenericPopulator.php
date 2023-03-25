<?php

namespace AppBundle\Import\User\Populator\Company;

use AppBundle\Entity\User\User;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\User\Populator\PopulatorInterface;

class GenericPopulator implements PopulatorInterface
{
    /**
     * @param User                       $user
     * @param NormalisedCompanyInterface $normalisedUser
     */
    public function populate(User $user, $normalisedCompany)
    {
        $user->name = $normalisedCompany->getCommercialName() ?? $normalisedCompany->getName();
        $user->companyName = 'Sotheby\'s International Realty';
        $user->homePageUrl = $normalisedCompany->getHomePageUrl();
        $user->sites = $normalisedCompany->getSites();
        $user->setUpdatedAt(new \DateTime());
        $user->setDeletedAt(null);

        $user->setType(User::TYPE_COMPANY);
    }
}
