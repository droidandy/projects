<?php

namespace AppBundle\Service\File;

use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Imagine\Gmagick\Imagine;
use Imagine\Image\ImagineInterface;
use AppBundle\Entity\User\User;

class ImageHelper
{
    /**
     * @var CacheManager
     */
    protected $cacheManager;
    /**
     * @var string
     */
    protected $cdnPath;

    /**
     * @param string       $cdnPath
     * @param CacheManager $cacheManager
     */
    public function __construct($cdnPath, CacheManager $cacheManager)
    {
        $this->cdnPath = $cdnPath;
        $this->cacheManager = $cacheManager;
    }

    /**
     * @return ImagineInterface
     */
    public function getImagine()
    {
        if (extension_loaded('gmagick')) {
            return new Imagine();
        }
        if (extension_loaded('imagick')) {
            return new \Imagine\Imagick\Imagine();
        }

        return new \Imagine\Gd\Imagine();
    }

    /**
     * @param $image
     *
     * @return string
     *
     * @throws \Exception
     */
    public function getImagePath($image)
    {
        $p = parse_url($image);

        if (!isset($p['path'])) {
            throw new \Exception('Url is malformed');
        }

        return ltrim($p['path'], '/');
    }



    /**
     * Work out which profile image to use for an agent user.
     *
     * @param array|User $user
     * @param string $filter
     *
     * @return string
     */
    public function userProfileImage($user, $filter = User::PROFILE_PHOTO)
    {
        $image = $this->getProfileImage($user);

        if ($image) {
            return $this->cacheManager->getBrowserPath(
                $this->getImagePath($image),
                $filter
            );
        }

        return $this->getPlaceholderImage($user);
    }

    /**
     * @param User $user
     *
     * @return string|false
     */
    public function userBackgroundImage(User $user)
    {
        if ($user->backgroundImage) {
            return $this->cacheManager->getBrowserPath(
                $this->getImagePath($user->backgroundImage),
                User::BACKGROUND_PHOTO
            );
        }
    }

    /**
     * @param $user
     *
     * @return string|false
     */
    public function getProfileImage($user)
    {
        if ($user instanceof User) {
            return $user->getProfileImage();
        }

        if (is_array($user)) {
            if (isset($user[User::IMAGE_PROFILE_MANUAL])) {
                return $user[User::IMAGE_PROFILE_MANUAL];
            }

            if (isset($user[User::IMAGE_PROFILE])) {
                return $user[User::IMAGE_PROFILE];
            }
        }
    }

    /**
     * @param User $user
     *
     * @return string
     */
    private function getPlaceholderImage(User $user): string
    {
        if ($user->sourceRef) {
            return '/assets/images/sir-logo.jpg';
        }

        return '/assets/images/logo/placeholder.png';
    }

    /**
     * @param $image
     *
     * @return string
     *
     * @throws \Exception
     */
    public function getCdnImagePath($image)
    {
        return $this->cdnPath.'/'.$this->getImagePath($image);
    }
}
