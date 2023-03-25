<?php

namespace AppBundle\Import\Job;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Queue\ImportJobTracker;
use AppBundle\Import\User\EntityMatcher;
use AppBundle\Import\User\ErrorTypes;
use AppBundle\Import\User\NormalizedToDBUserTransformer;
use AppBundle\Import\User\Populator\ImportUserTracker;
use AppBundle\Import\User\SkipStrategy;
use AppBundle\Import\User\SourceRefUserRegistry;
use AppBundle\Import\User\SyncException;
use AppBundle\Helper\SprintfLoggerTrait;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\User\User;
use Monolog\Logger;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;

class UserImporter
{
    use SprintfLoggerTrait;

    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var EntityMatcher
     */
    private $userMatcher;
    /**
     * @var Logger
     */
    private $logger;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var NormalizedToDBUserTransformer
     */
    private $transformer;
    /**
     * @var SkipStrategy
     */
    private $skipStrategy;
    /**
     * @var ImportJobTracker
     */
    private $importJobTracker;
    /**
     * @var ImportUserTracker
     */
    private $importUserTracker;
    /**
     * @var SourceRefUserRegistry
     */
    private $sourceRefUserRegistry;
    /**
     * @var array
     */
    private $errors = [];
    /**
     * @var bool
     */
    private $modeAdding;

    /**
     * UserImporter constructor.
     *
     * @param UserRepository                $userRepo
     * @param Logger                        $logger
     * @param EntityManager                 $em
     * @param NormalizedToDBUserTransformer $transformer
     */
    public function __construct(
        UserRepository $userRepo,
        EntityMatcher $entityMatcher,
        Logger $logger,
        EntityManager $em,
        NormalizedToDBUserTransformer $transformer,
        SkipStrategy $skipStrategy,
        ImportJobTracker $importJobTracker,
        ImportUserTracker $importUserTracker,
        SourceRefUserRegistry $sourceRefUserRegistry
    ) {
        $this->userRepo = $userRepo;
        $this->userMatcher = $entityMatcher;
        $this->logger = $logger;
        $this->em = $em;
        $this->transformer = $transformer;
        $this->skipStrategy = $skipStrategy;
        $this->importJobTracker = $importJobTracker;
        $this->importUserTracker = $importUserTracker;
        $this->sourceRefUserRegistry = $sourceRefUserRegistry;
    }

    /**
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedUser
     *
     * @return array
     */
    public function fetchUser($normalisedUser)
    {
        $this->modeAdding = null;
        $user = $this->userMatcher->matchOrCreate($normalisedUser);
        $isNew = null === $user->getId() ? false : true;

//        if ($msg = $this->skipStrategy->shouldBeSkipped($user, $normalisedUser)) {
//            $this->log('Skipping user %s. %s', $normalisedUser ? $normalisedUser->getSourceRef() : 'NULL', $msg);
//            $this->userSkipped($user, $normalisedUser);
//
//            return [$user, $isNew];
//        }

        $this->persistFromNormalised($user, $normalisedUser);
        $this->userProcessed($user, $normalisedUser);
        $this->errors = [];
        $this->modeAdding = null;

        return [$user, $isNew];
    }

    /**
     * @param User                                                                         $user
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedUser
     */
    private function persistFromNormalised(User $user, $normalisedUser)
    {
        if ($this->userRepo->isUserNew($user)) {
            $this->modeAdding = true;
            $this->log('Creating user %s', $normalisedUser ? $normalisedUser->getSourceRef() : 'NULL');
        } else {
            $this->modeAdding = false;
            $this->log('Updating user %s', $normalisedUser ? $normalisedUser->getSourceRef() : 'NULL');
            $this->logger->debug('Source user data', (array) $user);
        }

        try {
            $this->transformer->persistFromNormalised($user, $normalisedUser);
        } catch (SyncException $e) {
            $this->errors[ErrorTypes::ERRORS_SYNC] = $e->getMessages();
        }

        $this->logger->debug('Creating user', (array) $user);
        $this->logger->debug('Normalised user', (array) $normalisedUser);
        $this->em->persist($user);
    }

    /**
     * @param User                                                                         $user
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedUser
     */
    private function userSkipped(User $user, $normalisedUser)
    {
        if ($normalisedUser instanceof NormalisedUserInterface) {
            $this->importJobTracker->notifyUserSkipped();
            $this->importUserTracker->notifyUserSkipped($user, $normalisedUser);
            $this->sourceRefUserRegistry->add($user->sourceRef, $user);
        } elseif ($normalisedUser instanceof NormalisedCompanyInterface) {
            $this->importJobTracker->notifyCompanySkipped();
            $this->importUserTracker->notifyCompanySkipped($user, $normalisedUser);
        } elseif ($normalisedUser instanceof NormalisedOfficeInterface) {
            $this->importJobTracker->notifyOfficeSkipped();
            $this->importUserTracker->notifyOfficeSkipped($user, $normalisedUser);
        }
    }

    /**
     * @param User                                                                         $user
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedUser
     */
    private function userProcessed(User $user, $normalisedUser)
    {
        if ($normalisedUser instanceof NormalisedUserInterface) {
            if ($this->modeAdding) {
                $this->importJobTracker->notifyUserAdded($this->errors);
            } else {
                $this->importJobTracker->notifyUserUpdated($this->errors);
            }
            $this->importUserTracker->notifyUserProcessed($user, $normalisedUser, $this->errors);
            $this->sourceRefUserRegistry->add($user->sourceRef, $user);
        } elseif ($normalisedUser instanceof NormalisedCompanyInterface) {
            if ($this->modeAdding) {
                $this->importJobTracker->notifyCompanyAdded($this->errors);
            } else {
                $this->importJobTracker->notifyCompanyUpdated($this->errors);
            }
            $this->importUserTracker->notifyCompanyProcessed($user, $normalisedUser, $this->errors);
        } elseif ($normalisedUser instanceof NormalisedOfficeInterface) {
            if ($this->modeAdding) {
                $this->importJobTracker->notifyOfficeAdded($this->errors);
            } else {
                $this->importJobTracker->notifyOfficeUpdated($this->errors);
            }
            $this->importUserTracker->notifyOfficeProcessed($user, $normalisedUser, $this->errors);
        }
    }
}
