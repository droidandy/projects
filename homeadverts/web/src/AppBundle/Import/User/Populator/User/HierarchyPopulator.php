<?php

namespace AppBundle\Import\User\Populator\User;

use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Service\User\RelationManager;
use AppBundle\Import\User\Populator\PopulatorInterface;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\NonUniqueResultException;

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
     * @var QueueAdapterInterface
     */
    private $queueAdapter;
    /**
     * @var RelationManager
     */
    private $relationManager;
    /**
     * @var ImportContext
     */
    private $importContext;

    /**
     * @param EntityManager         $em
     * @param UserRepository        $userRepo
     * @param QueueAdapterInterface $queueAdapter
     * @param RelationManager       $relationManager
     * @param ImportContext         $importContext
     */
    public function __construct(
        EntityManager $em,
        UserRepository $userRepo,
        QueueAdapterInterface $queueAdapter,
        RelationManager $relationManager,
        ImportContext $importContext
    ) {
        $this->em = $em;
        $this->userRepo = $userRepo;
        $this->queueAdapter = $queueAdapter;
        $this->relationManager = $relationManager;
        $this->importContext = $importContext;
    }

    /**
     * @param User                    $user
     * @param NormalisedUserInterface $normalisedUser
     */
    public function populate(User $user, $normalisedUser)
    {
        if (!$normalisedUser->getOfficeSourceRef()) {
            return;
        }

        if (
            $user->officeSourceRef == $normalisedUser->getOfficeSourceRef()
            && $user->officeSourceRefType == $normalisedUser->getOfficeSourceRefType()
        ) {
            return;
        }

        if (!$user->getId()) {
            $this->em->persist($user);
            $this->em->flush($user);
        }
        try {
            /** @var User $office */
            $office = $this->userRepo->getUserBySourceRef(
                $normalisedUser->getOfficeSourceRef(),
                $normalisedUser->getOfficeSourceRefType()
            );
        } catch (NonUniqueResultException $e) {
            throw new \LogicException('Unable to resolve sourceRef to unique user');
        }

        $user->officeSourceRef = $normalisedUser->getOfficeSourceRef();
        $user->officeSourceRefType = $normalisedUser->getOfficeSourceRefType();

        if (!$office) {
            $this->queueAdapter->enqueueOfficeProcessing(
                $this->importContext->getImportJob(),
                [
                    'ref' => $normalisedUser->getOfficeSourceRef(),
                ]
            );
        } else {
            $this->relationManager->attachAgent(
                $user,
                $office
            );
        }
    }
}
