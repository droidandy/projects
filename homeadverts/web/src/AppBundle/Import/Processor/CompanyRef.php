<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Import\ImportProperty;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Entity\User\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\NonUniqueResultException;

class CompanyRef extends Processor
{
    /**
     * @param NormalisedPropertyInterface $normalisedProperty
     * @param Property                    $property
     */
    public function process(NormalisedPropertyInterface $normalisedProperty, $property)
    {
        if (!$normalisedProperty->getCompanyRef()) {
            return;
        }

        /** @var EntityManager $em */
        $em = $this->app->get('em');
        /** @var UserRepository $userRepo */
        $userRepo = $this->app->get('user_repo');

        $property->companySourceRef = $normalisedProperty->getCompanyRef();
        $property->companySourceRefType = $normalisedProperty->getCompanyRefType();

        try {
            /** @var User $company */
            $company = $userRepo->getUserBySourceRef(
                $normalisedProperty->getUserRef(),
                $normalisedProperty->getUserRefType()
            );
        } catch (NonUniqueResultException $e) {
            $this->addError(ImportProperty::ERROR_USER_REF, 'Unable to resolve property companySourceRef to unique company');

            return;
        }

        if ($company) {
            $property->company = $company;

            return;
        }

        /** @var QueueAdapterInterface $queueAdapter */
        $queueAdapter = $this->app->get('ha.import.queue_adapter');
        $queueAdapter->enqueueOfficeProcessing($this->importJob, [
            'ref' => $normalisedProperty->getCompanyRef(),
        ]);

        $this->setDelayed(true);
    }
}
