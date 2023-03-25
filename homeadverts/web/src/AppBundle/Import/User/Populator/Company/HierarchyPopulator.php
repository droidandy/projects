<?php

namespace AppBundle\Import\User\Populator\Company;

use AppBundle\Entity\User\Relation;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\User\Populator\PopulatorInterface;
use AppBundle\Service\User\RelationManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;

class HierarchyPopulator implements PopulatorInterface
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var EntityRepository
     */
    private $relationRepo;
    /**
     * @var RelationManager
     */
    private $relationManager;

    /**
     * @param EntityRepository $relationRepo
     * @param UserRepository   $userRepo
     * @param RelationManager  $relationManager
     */
    public function __construct(
        EntityManager $em,
        EntityRepository $relationRepo,
        UserRepository $userRepo,
        RelationManager $relationManager
    ) {
        $this->em = $em;
        $this->userRepo = $userRepo;
        $this->relationRepo = $relationRepo;
        $this->relationManager = $relationManager;
    }

    /**
     * @param User                       $user
     * @param NormalisedCompanyInterface $normalisedDoc
     */
    public function populate(User $user, $normalisedDoc)
    {
        /** @var User $sir */
        /** @var Relation $relation */
        $isNew = false;
        $sir = $this->userRepo->findOneBy([
            'emailCanonical' => 'sothebysrealestate@luxuryaffairs.co.uk',
        ]);

        if ($sir) {
            if (!$user->getId()) {
                $isNew = true;
                $this->em->persist($user);
                $this->em->flush($user);
            }

            if ($isNew) {
                $this->relationManager->attachCompany($user, $sir);
            } else {
                $relation = $this->relationRepo->findOneBy([
                    'child' => $user->getId(),
                    'parent' => $sir->getId(),
                    'type' => Relation::TYPE_DIVISION,
                ]);
                if (!$relation || $relation->getDeletedAt()) {
                    $this->relationManager->attachCompany($user, $sir);
                }
            }
        }
    }
}
