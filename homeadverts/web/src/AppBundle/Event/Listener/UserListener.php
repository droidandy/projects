<?php

namespace AppBundle\Event\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\AccessToken;

class UserListener
{
    /**
     * @var ContainerInterface
     */
    private $sc;
    /**
     * @var bool
     */
    private $test = false;

    /**
     * @param ContainerInterface $sc
     * @param bool               $test
     */
    public function __construct(ContainerInterface $sc, $test = false)
    {
        $this->sc = $sc;
        $this->test = $test;
    }

    /**
     * @param LifecycleEventArgs $args
     */
    public function postPersist(LifecycleEventArgs $args)
    {
        if ($this->test) {
            return;
        }

        $user = $args->getEntity();

        // todo: for security purposes, uncomment later
//
//        if ($user instanceof User && !$user->sourceRef) {
//            $this->issueAccessToken($user);
//
//            if ($user->getEmail() !== User::SERVICE_USER['email']) {
//                $this->sc->get('app.room_finder')->createOnBoardingRoom($user);
//            }
//
//        }
    }

    /**
     * @param User $user
     */
    private function issueAccessToken(User $user)
    {
        $em = $this->sc->get('em');

        $accessToken = new AccessToken($user);
        $em->persist($accessToken);
        $em->flush($accessToken);

        $this->sc
            ->get('ha.mailer')
            ->sendNewAccountEmail(
                $user,
                $accessToken
            )
        ;
    }
}
