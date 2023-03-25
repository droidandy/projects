<?php

namespace AppBundle\Import\User\Populator\Office;

use AppBundle\Entity\User\User;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\User\Populator\PopulatorInterface;

class GenericPopulator implements PopulatorInterface
{
    /**
     * @param User                      $user
     * @param NormalisedOfficeInterface $normalisedOffice
     */
    public function populate(User $user, $normalisedOffice)
    {
        $user->name = $normalisedOffice->getName();
        $user->companyName = $normalisedOffice->getCompanyName();
        $user->phone = $normalisedOffice->getPhone();
        $user->phones = $normalisedOffice->getPhones();
        $user->homePageUrl = $normalisedOffice->getHomePageUrl();
        $user->setUpdatedAt(new \DateTime());
        $user->setDeletedAt(null);

        $user->spokenLanguages = $normalisedOffice->getLangs()
            ? array_map(
                function ($lang) {
                    return $lang->name;
                },
                $normalisedOffice->getLangs()
            )
            : null
        ;

        $user->sites = $normalisedOffice->getSites();

        $user->setType(User::TYPE_COMPANY);
    }
}
