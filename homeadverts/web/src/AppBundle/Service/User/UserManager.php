<?php

namespace AppBundle\Service\User;

use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\Form\Exception\LogicException;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\Encoder\EncoderFactoryInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\AnonymousToken;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Doctrine\ORM\EntityManager;
use Doctrine\Common\Persistence\ObjectManager;
use FOS\UserBundle\Doctrine\UserManager as FosUserManager;
use FOS\UserBundle\Util\CanonicalizerInterface;
use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use DateTime;
use AppBundle\Service\File\ResizerUploader;
use AppBundle\Entity\User\AccessToken;
use AppBundle\Entity\User\User;

class UserManager extends FosUserManager
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @var Session
     */
    private $session;

    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var ResizerUploader
     */
    private $resizerUploader;

    /**
     * @param TokenStorageInterface   $tokenStorage
     * @param Session                 $session
     * @param EncoderFactoryInterface $encoderFactory
     * @param CanonicalizerInterface  $usernameCanonicalizer
     * @param CanonicalizerInterface  $emailCanonicalizer
     * @param ObjectManager           $om
     * @param string                  $userModelClass
     * @param EntityManager           $em
     * @param ResizerUploader         $resizerUploader
     * @param $bucketPattern
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        Session $session,
        EncoderFactoryInterface $encoderFactory,
        CanonicalizerInterface $usernameCanonicalizer,
        CanonicalizerInterface $emailCanonicalizer,
        ObjectManager $om,
        $userModelClass,
        EntityManager $em,
        ResizerUploader $resizerUploader,
        $bucketPattern
    ) {
        parent::__construct($encoderFactory, $usernameCanonicalizer, $emailCanonicalizer, $om, $userModelClass);

        $this->tokenStorage = $tokenStorage;
        $this->session = $session;
        $this->em = $em;
        $this->resizerUploader = $resizerUploader;
        $this->bucketPattern = $bucketPattern;
    }

    /**
     * @param UserResponseInterface $response
     *
     * @return User
     */
    public function findUserByOauthResponse(UserResponseInterface $response)
    {
        $oauthField = User::getOauthFieldName($response);

        return $this->findUserBy([
            'email' => $response->getEmail(),
            $oauthField => $response->getUsername(),
        ]);
    }

    /**
     * @param User $user
     * @param $path
     * @param $type
     */
    public function replaceImageFromPath(User $user, $path, $type)
    {
        $oldImage = $user->getRelativeImagePath($type);

        $this->uploadImageFromPath($user, $type, $path);

        if ($oldImage) {
            $this->deleteFromStorage($oldImage);
        }
    }

    /**
     * @param User $user
     * @param File $file
     * @param $type
     */
    public function replaceImage(User $user, File $file, $type)
    {
        $oldImage = $user->getRelativeImagePath($type);

        $this->uploadProfilePhoto($user, $file, $type);

        if ($oldImage) {
            $this->deleteFromStorage($oldImage);
        }
    }

    /**
     * @param User   $user
     * @param string $type
     */
    public function deleteImage(User $user, $type)
    {
        $image = $user->getRelativeImagePath($type);

        if ($image) {
            $this->deleteFromStorage($image);
        }

        $user->{$type} = '';
    }

    /**
     * @param User   $user
     * @param File   $file
     * @param string $type
     */
    public function uploadProfilePhoto(User $user, File $file, $type)
    {
        $this->resizerUploader->process(
            $file,
            [],
            $this->getImageUploadPath($user),
            false
        );

        $user->{$type} = $this->resizerUploader->getS3OriginalImage();
    }

    /**
     * @param User   $user
     * @param string $type
     * @param string $path
     */
    public function uploadImageFromPath(User $user, $type, $path)
    {
        $profilePictureTemp = sprintf(
            '%s/%s.jpg',
            sys_get_temp_dir(),
            $user->getEmail()
        );
        copy($path, $profilePictureTemp);

        $file = new File($profilePictureTemp);
        $this->uploadProfilePhoto($user, $file, $type);
    }

    public function logoutCurrentUser()
    {
        $token = new AnonymousToken(null, new User());
        $this->tokenStorage->setToken($token);
        $this->session->invalidate();
    }

    /**
     * @param string $token
     * @param string $type
     *
     * @return AccessToken|false
     */
    public function getAccessToken($token, $type)
    {
        return $this->em
            ->createQueryBuilder()
            ->select('a')
            ->from(AccessToken::class, 'a')
            ->where('a.token = :token')->setParameter('token', $token)
            ->andWhere('a.type = :type')->setParameter('type', $type)
            ->andWhere('a.consumedAt IS NULL')
            ->andWhere('a.expirationDate > :expiationDate')->setParameter('expiationDate', new DateTime())
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string $email
     *
     * @return string
     */
    public function setNewPassword($email)
    {
        $user = $this->findUserByEmail($email);

        $newPlainPassword = md5(
            sprintf(
            '%s%s%s',
            $user->getEmail(),
            $user->getSalt(),
            time()
        )
        );

        $user->setPlainPassword($newPlainPassword);
        $this->updateUser($user, true);

        return $newPlainPassword;
    }

    /**
     * @param AccessToken $token
     */
    public function setAccessTokenConsumed(AccessToken $token)
    {
        $token->setConsumedAt(new DateTime());
        $this->em->persist($token);
        $this->em->flush($token);
    }

    /**
     * @param User $user
     */
    public function setLastSeenNow(User $user)
    {
        $user->activeAt = new DateTime();
        $this->em->persist($user);
        $this->em->flush($user);
    }

    /**
     * {@inheritdoc}
     */
    public function softDeleteUser(User $user)
    {
        $suffix = '_'.md5($user->getId());
        $user->setUsername($user->getUsername().$suffix);
        $user->setUsernameCanonical($user->getUsernameCanonical().$suffix);
        $user->setEmail($user->getEmail().$suffix);
        $user->setEmailCanonical($user->getEmailCanonical().$suffix);
        $user->setDeletedAt(new DateTime());

        $this->em->persist($user);
        $this->em->flush($user);
    }

    /**
     * @param int $userId
     *
     * @return User $user
     */
    public function findUserById($userId)
    {
        $user = $this->findUserBy(['id' => $userId]);

        if (!$user) {
            throw new LogicException("User doesn't exist");
        }

        return $user;
    }

    /**
     * @param $email string
     * @param $password string
     *
     * @throws UnprocessableEntityHttpException
     */
    public function login($email, $password)
    {
        $user = $this->findUserByEmail($email);

        if (false === $this->checkUserPassword($user, $password)) {
            throw new UnprocessableEntityHttpException('The credentials are wrong');
        }

        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $this->tokenStorage->setToken($token);
        $this->session->set('_security_main', serialize($token));
    }

    /**
     * @param $email string
     * @param $password string
     *
     * @throws UnprocessableEntityHttpException
     *
     * @return User
     */
    public function findUserByEmail($email)
    {
        $user = $this->findUserByThroughEnabled($email);

        if (false === ($user instanceof User)) {
            throw new UnprocessableEntityHttpException('A user with such Email doesn\'t exists');
        }

        return $user;
    }

    /**
     * @param $email string
     *
     * @return User|UserInterface
     */
    public function findUserByThroughEnabled($email)
    {
        return $this->findUserBy([
            'email' => $email,
            'enabled' => true,
            'locked' => false,
        ]);
    }

    /**
     * @return User|UserInterface
     */
    public function createServiceUser()
    {
        $user = $this->findUserByThroughEnabled(User::SERVICE_USER['email']);

        if (!$user) {
            $user = new User();
            $user->setEmail(User::SERVICE_USER['email']);
            $user->setName(User::SERVICE_USER['name']);
            $user->setPlainPassword(User::SERVICE_USER['password']);
            $user->setEnabled(true);
            $user->setLocked(false);

            $this->em->persist($user);
            $this->em->flush();
        }

        return $user;
    }

    /**
     * @param User   $user
     * @param string $password
     *
     * @return bool $isValid
     */
    private function checkUserPassword(User $user, $password)
    {
        return $this->encoderFactory
            ->getEncoder($user)
            ->isPasswordValid(
                $user->getPassword(),
                $password,
                $user->getSalt()
            );
    }

    /**
     * @param $pathPrefix
     */
    private function deleteFromStorage($pathPrefix)
    {
        // Remove image from S3
        $thumbnailPrefix = User::PROFILE_PHOTO.'/'.$pathPrefix;

        foreach ([$pathPrefix, $thumbnailPrefix] as $path) {
            $this->resizerUploader->delete($path);
        }
    }

    /**
     * @param User $user
     *
     * @return string
     */
    private function getImageUploadPath(User $user)
    {
        $prefix = sprintf($this->bucketPattern, $user->getId());

        return ltrim($prefix, '/');
    }
}
