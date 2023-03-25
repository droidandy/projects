<?php

namespace AppBundle\Import\User\Populator\Office;

use AppBundle\Entity\User\User;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\User\Populator\PopulatorInterface;

class DescriptionPopulator implements PopulatorInterface
{
    /**
     * @param User                      $user
     * @param NormalisedOfficeInterface $normalisedOffice
     */
    public function populate(User $user, $normalisedOffice)
    {
        foreach ((array) $normalisedOffice->getDescriptions() as $desc) {
            $user->bio = $desc->description;
        }
    }
}
