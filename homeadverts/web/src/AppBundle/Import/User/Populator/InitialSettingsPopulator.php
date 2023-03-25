<?php

namespace AppBundle\Import\User\Populator;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;

class InitialSettingsPopulator implements PopulatorInterface
{
    const INITIAL_ROLE_COMPANY = 'ROLE_COMPANY';
    const INITIAL_ROLE_OFFICE = 'ROLE_OFFICE';
    const INITIAL_ROLE_AGENT = 'ROLE_AGENT';
    const INITIAL_PASSWORD = 'thisdoesntmatterbecausetheaccountisinactive';

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

    /**
     * @param User                                                                         $user
     * @param NormalisedUserInterface|NormalisedCompanyInterface|NormalisedOfficeInterface $normalisedUser
     */
    public function populate(User $user, $normalisedUser)
    {
        if ($this->userRepo->isUserNew($user)) {
            if ($normalisedUser instanceof NormalisedUserInterface) {
                $user->addRole(self::INITIAL_ROLE_AGENT);
            } elseif ($normalisedUser instanceof NormalisedCompanyInterface) {
                $user->addRole(self::INITIAL_ROLE_COMPANY);
            } elseif ($normalisedUser instanceof NormalisedOfficeInterface) {
                $user->addRole(self::INITIAL_ROLE_OFFICE);
            }
            $user->setPlainPassword(self::INITIAL_PASSWORD);
        }
    }
}
