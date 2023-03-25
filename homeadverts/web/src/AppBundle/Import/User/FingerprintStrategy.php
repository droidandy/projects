<?php

namespace AppBundle\Import\User;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;

class FingerprintStrategy
{
    /**
     * @var UserRepository
     */
    private $userRepo;

    /**
     * @param UserRepository $userRepo
     */
    public function __construct(UserRepository $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function getByFingerprint(NormalisedUserInterface $normalisedUser)
    {
        $user = $this->userRepo->getUserByFingerprint($normalisedUser);
        if ($user) {
            return $user;
        }

        $user = $this->getUserByFingerprintLoosen($normalisedUser);
        if ($user) {
            return $user;
        }

        return null;
    }

    private function getUserByFingerprintLoosen(NormalisedUserInterface $normalisedUser)
    {
        $email = $normalisedUser->getEmail();

        return $this
            ->userRepo
            ->getUserByNameAndAnyEmail(
                $normalisedUser->getName(),
                array_filter(
                    array_map(
                        function ($email) {
                            return $email->email;
                        },
                        $normalisedUser->getAllEmails()
                    ),
                    function ($e) use ($email) {
                        return $e !== $email;
                    }
                )
            )
        ;
    }
}
