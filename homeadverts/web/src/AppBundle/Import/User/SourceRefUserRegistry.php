<?php

namespace AppBundle\Import\User;

use AppBundle\Entity\User\UserRepository;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\User\User;

class SourceRefUserRegistry
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
     * @var RedisSourceRefIdMap
     */
    private $sourceRefIdMap;

    /**
     * SourceRefUserRegistry constructor.
     *
     * @param EntityManager       $em
     * @param UserRepository      $userRepo
     * @param RedisSourceRefIdMap $sourceRefIdMap
     */
    public function __construct(EntityManager $em, UserRepository $userRepo, RedisSourceRefIdMap $sourceRefIdMap)
    {
        $this->em = $em;
        $this->userRepo = $userRepo;
        $this->sourceRefIdMap = $sourceRefIdMap;
    }

    public function getUserId($sourceRef, $sourceRefType)
    {
        if ($user = $this->getUser($sourceRef, $sourceRefType)) {
            return $user->getId();
        }

        return null;
    }

    public function getUser($sourceRef, $sourceRefType)
    {
        if ($id = $this->sourceRefIdMap->get($sourceRef)) {
            return $this->em->getReference(User::class, $id);
        } elseif ($user = $this->userRepo->getUserBySourceRef($sourceRef, $sourceRefType)) {
            return $user;
        }

        return null;
    }

    public function add($sourceRef, $userOrUserId)
    {
        $this->sourceRefIdMap->set($sourceRef, $this->getId($userOrUserId));
    }

    private function getId($userOrUserId)
    {
        if ($userOrUserId instanceof User) {
            return $userOrUserId->getId();
        } else {
            return $userOrUserId;
        }
    }
}
