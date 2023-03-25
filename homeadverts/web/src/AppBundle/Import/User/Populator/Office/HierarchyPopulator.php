<?php

namespace AppBundle\Import\User\Populator\Office;

use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Import\User\Populator\PopulatorInterface;
use AppBundle\Service\User\RelationManager;
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
     * @param User                      $user
     * @param NormalisedOfficeInterface $normalisedOffice
     */
    public function populate(User $user, $normalisedOffice)
    {
        if (!$normalisedOffice->getCompanySourceRef()) {
            return;
        }

        if (
            $user->companySourceRef == $normalisedOffice->getCompanySourceRef()
            && $user->companySourceRefType == $normalisedOffice->getCompanySourceRefType()
        ) {
            return;
        }

        if (!$user->getId()) {
            $this->em->persist($user);
            $this->em->flush($user);
        }
        try {
            /** @var User $company */
            $company = $this->userRepo->getUserBySourceRef(
                $normalisedOffice->getCompanySourceRef(),
                $normalisedOffice->getCompanySourceRefType()
            );
        } catch (NonUniqueResultException $e) {
            throw new \LogicException('Unable to resolve sourceRef to unique user');
        }

        $user->companySourceRef = $normalisedOffice->getCompanySourceRef();
        $user->companySourceRefType = $normalisedOffice->getCompanySourceRefType();
        $user->companyOfficeType = 'main office' == strtolower($normalisedOffice->getType())
            ? User::TYPE_MAIN_OFFICE
            : User::TYPE_BRANCH_OFFICE
        ;

        if (!$company) {
            $this->queueAdapter->enqueueCompanyProcessing(
                $this->importContext->getImportJob(),
                [
                    'ref' => $normalisedOffice->getCompanySourceRef(),
                ]
            );
        } else {
            $this->relationManager->attachOffice(
                $user,
                $company,
                'main office' == strtolower($normalisedOffice->getType())
                    ? User::TYPE_MAIN_OFFICE
                    : User::TYPE_BRANCH_OFFICE,
                'main office' == strtolower($normalisedOffice->getType())
                    ? User::TYPE_MAIN_OFFICE_NAME
                    : User::TYPE_BRANCH_OFFICE_NAME
            );
        }
    }
}
