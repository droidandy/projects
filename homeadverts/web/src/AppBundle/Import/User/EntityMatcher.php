<?php

namespace AppBundle\Import\User;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Helper\SprintfLoggerTrait;
use AppBundle\Entity\User\User;
use Psr\Log\LoggerInterface;

class EntityMatcher
{
    use SprintfLoggerTrait;
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var FingerprintStrategy
     */
    private $fingerprintStrategy;
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @param UserRepository      $userRepo
     * @param FingerprintStrategy $fingerprintStrategy
     * @param LoggerInterface     $logger
     */
    public function __construct(
        UserRepository $userRepo,
        FingerprintStrategy $fingerprintStrategy,
        LoggerInterface $logger
    ) {
        $this->userRepo = $userRepo;
        $this->fingerprintStrategy = $fingerprintStrategy;
        $this->logger = $logger;
    }

    /**
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedDoc
     *
     * @return User
     */
    public function matchOrCreate($normalisedDoc)
    {
        /** @var User $user */
        $user = $this->userRepo->getUserBySourceRef($normalisedDoc->getSourceRef(), $normalisedDoc->getSourceRefType());
        if ($user) {
            if ($user->getName() !== $normalisedDoc->getName()) {
                $this->notice(
                    '[%s:%s] %s doesn\'t match current name %s',
                    $normalisedDoc->getSourceRefType(),
                    $normalisedDoc->getSourceRef(),
                    (
                        !$normalisedDoc instanceof NormalisedCompanyInterface
                            ? $normalisedDoc->getEmail()
                            : 'COMPANY'
                    ).' '.$normalisedDoc->getName(),
                    $user->getName()
                );
            }

            return $user;
        }

        $this->notice(
            '[%s:%s] %s no matching entity found',
            $normalisedDoc->getSourceRefType(),
            $normalisedDoc->getSourceRef(),
            (
                !$normalisedDoc instanceof NormalisedCompanyInterface
                    ? $normalisedDoc->getEmail()
                    : 'COMPANY'
            ).' '.$normalisedDoc->getName()
        );

        return new User();
    }
}
