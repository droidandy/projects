<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Import\ImportProperty;
use AppBundle\Entity\Property\Property;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Entity\User\User;
use Doctrine\ORM\NonUniqueResultException;

class UserRef extends Processor
{
    /**
     * @param NormalisedPropertyInterface $normalisedProperty
     * @param Property                    $property
     */
    public function process(NormalisedPropertyInterface $normalisedProperty, $property)
    {
        if (!$normalisedProperty->getUserId() && !$normalisedProperty->getUserRef()) {
            $this->addError(ImportProperty::ERROR_USER_REF, 'Neither user_id nor user_ref defined');

            return;
        }

        $em = $this->app->get('em');

        if ($normalisedProperty->getUserId()) {
            $user = $em->getReference(User::class, $normalisedProperty->getUserId());

            $property->user = $user;
            $property->userSourceRef = $normalisedProperty->getUserRef();
            $property->userSourceRefType = $normalisedProperty->getUserRefType();

            return;
        }

        $userRepo = $this->app->get('user_repo');
        try {
            /** @var User $user */
            $user = $userRepo->getUserBySourceRef(
                $normalisedProperty->getUserRef(),
                $normalisedProperty->getUserRefType()
            );
        } catch (NonUniqueResultException $e) {
            throw new \LogicException('Unable to resolve property userSourceRef to unique user');
        }

        if ($user) {
            $property->user = $user;
            $property->userSourceRef = $normalisedProperty->getUserRef();
            $property->userSourceRefType = $normalisedProperty->getUserRefType();

            return;
        }

        $property->userSourceRef = $normalisedProperty->getUserRef();
        $property->userSourceRefType = $normalisedProperty->getUserRefType();

        /** @var QueueAdapterInterface $queueAdapter */
        $queueAdapter = $this->app->get('ha.import.queue_adapter');
        $queueAdapter->enqueueUserProcessing($this->importJob, [
            'ref' => $normalisedProperty->getUserRef(),
        ]);

        $this->setDelayed(true);
    }
}
