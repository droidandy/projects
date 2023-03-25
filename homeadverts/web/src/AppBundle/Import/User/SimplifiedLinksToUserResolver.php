<?php

namespace AppBundle\Import\User;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Service\User\RelationManager;

class SimplifiedLinksToUserResolver implements LinksToUserResolverInterface
{
    /**
     * @var PropertyRepository
     */
    private $propertyRepo;
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var RelationManager
     */
    private $relationManager;
    /**
     * @var CountResolver
     */
    private $countResolver;

    /**
     * @param PropertyRepository $propertyRepo
     * @param UserRepository     $userRepo
     */
    public function __construct(
        PropertyRepository $propertyRepo,
        UserRepository $userRepo,
        RelationManager $relationManager,
        CountResolver $countResolver
    ) {
        $this->propertyRepo = $propertyRepo;
        $this->userRepo = $userRepo;
        $this->relationManager = $relationManager;
        $this->countResolver = $countResolver;
    }

    public function resolveLinksToCompany(User $company)
    {
        /** @var User[] $offices */
        $offices = $this->userRepo->getUnresolvedOfficesForCompany($company);
        foreach ($offices as $office) {
            $officeType = $office->companyOfficeType;
            $this->relationManager->attachOffice(
                $office,
                $company,
                $officeType,
                User::TYPE_MAIN_OFFICE == $officeType
                    ? User::TYPE_MAIN_OFFICE_NAME
                    : User::TYPE_BRANCH_OFFICE_NAME
            );
        }
    }

    public function resolveLinksToOffice(User $office)
    {
        /** @var User[] $agents */
        $agents = $this->userRepo->getUnresolvedAgentsForOffice($office);
        foreach ($agents as $agent) {
            $this->relationManager->attachAgent($agent, $office);
        }
        $properties = $this->propertyRepo->getUnresolvedPropertiesForCompany($office);
        foreach ($properties as $property) {
            $property->company = $office;
        }
    }

    public function resolveLinksToUser(User $user)
    {
        $properties = $this->propertyRepo->getUnresolvedPropertiesForUser($user);
        foreach ($properties as $property) {
            $property->user = $user;
            $property->userSourceRef = $user->sourceRef;
            $property->userSourceRefType = $user->sourceRefType;
            /*
             * Mark the property ACTIVE in the case it was INCOMPLETE
             * It is safe at the moment while only UserRef mark properties as INCOMPLETE
             * MUST be changed to analysis on ProcessorResponses to define a new property status
             * INVALID properties should stay INVALID
             */
            if (Property::STATUS_INCOMPLETE == $property->status) {
                $property->status = Property::STATUS_ACTIVE;
                $this->countResolver->onPropertyAdded($property);
            }
        }
    }
}
