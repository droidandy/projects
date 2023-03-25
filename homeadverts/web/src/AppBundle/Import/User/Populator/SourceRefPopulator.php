<?php

namespace AppBundle\Import\User\Populator;

use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\SourceRef;

class SourceRefPopulator implements PopulatorInterface
{
    /**
     * @param User                                                                          $user
     * @param NormalisedUserInterface|NormalisedPropertyInterface|NormalisedOfficeInterface $normalisedUser
     */
    public function populate(User $user, $normalisedUser)
    {
        $sourceRefs = $normalisedUser->getSourceRefs();

        /** @var SourceRef[] $existingSourceRefs */
        $existingSourceRefs = $user->sourceRefs->toArray();
        foreach ($sourceRefs as $i => $sourceRef) {
            foreach ($existingSourceRefs as $j => $ref) {
                if ($sourceRef->type == $ref->type && $sourceRef->ref == $ref->ref) {
                    unset($sourceRefs[$i]);

                    $existingSourceRefs[$j]->deletedAt = null;
                    unset($existingSourceRefs[$j]);
                }
            }
        }
        foreach ($sourceRefs as $sourceRef) {
            $ref = new SourceRef();
            $ref->ref = $sourceRef->ref;
            $ref->type = $sourceRef->type;
            $ref->user = $user;
            $user->sourceRefs->add($ref);
        }

        foreach ($existingSourceRefs as $existingSourceRef) {
            $existingSourceRef->deletedAt = new \DateTime();
        }

        if ($user->sourceRef !== $normalisedUser->getSourceRef()) {
            if ($user->sourceRef) {
                $ref = new SourceRef();
                $ref->ref = $user->sourceRef;
                $ref->type = $user->sourceRefType;
                $ref->user = $user;
                $ref->deletedAt = new \DateTime();
                $user->sourceRefs->add($ref);
            }

            $user->sourceRef = $normalisedUser->getSourceRef() ?: null;
            $user->sourceRefType = $normalisedUser->getSourceRefType() ?: null;
        }
    }
}
