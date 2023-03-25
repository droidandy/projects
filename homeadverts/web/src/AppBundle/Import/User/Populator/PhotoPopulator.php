<?php

namespace AppBundle\Import\User\Populator;

use AppBundle\Import\Media\AvatarManager;
use AppBundle\Import\Media\AvatarManagerInterface;
use AppBundle\Import\Media\MediaException;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;

class PhotoPopulator implements PopulatorInterface
{
    /**
     * @var AvatarManager
     */
    private $avatarManager;

    /**
     * @param AvatarManagerInterface $avatarManager
     */
    public function __construct(AvatarManagerInterface $avatarManager)
    {
        $this->avatarManager = $avatarManager;
    }

    /**
     * @param User                    $user
     * @param NormalisedUserInterface $normalisedUser
     *
     * @throws PopulateException
     */
    public function populate(User $user, $normalisedUser)
    {
        if ($normalisedUser->getAvatarUrl()) {
            $user->profileImage = $normalisedUser->getAvatarUrl();
            try {
                $this->avatarManager->process($user);
            } catch (MediaException $e) {
                throw new PopulateException($e->getMessage(), $e->getCode(), $e);
            }
        }
    }
}
