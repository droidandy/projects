<?php

namespace AppBundle\Import\User\Populator\User;

use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;
use AppBundle\Import\User\Populator\PopulatorInterface;

class GenericPopulator implements PopulatorInterface
{
    /**
     * @param User                    $user
     * @param NormalisedUserInterface $normalisedUser
     */
    public function populate(User $user, $normalisedUser)
    {
        $user->name = $normalisedUser->getName();
        $user->companyName = $normalisedUser->getCompanyName();
        $user->companyPhone = $normalisedUser->getCompanyPhone();
        $user->phone = $normalisedUser->getPhone();
        $user->homePageUrl = $normalisedUser->getHomePageUrl();
        $user->setType(User::TYPE_USER);
        $user->setUpdatedAt(new \DateTime());
        $user->setDeletedAt(null);

        foreach ((array) $normalisedUser->getDescriptions() as $desc) {
            $desc = (object) $desc;

            $user->bio = $desc->description;
        }
    }
}
