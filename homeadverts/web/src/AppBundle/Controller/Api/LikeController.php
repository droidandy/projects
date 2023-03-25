<?php

namespace AppBundle\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use LogicException;
use AppBundle\Entity\Domain\AbstractLike;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Property\Property;

class LikeController extends Controller
{
    /**
     * @param string $key
     * @param mixed  $entity
     * @param int    $id
     *
     * @return JsonResponse
     */
    public function removeAction($key, $entity, $id)
    {
        $instance = $this->getLikedInstance($key, $id, $entity);

        /** @var UserRepository $repo */
        $repo = $this->get('user_repo');
        $user = $this->getUser();
        $like = $repo->getLikeByUser($user, $instance);

        $em = $this->get('em');
        $em->remove($like);

        // Remove notification
        if ($instance instanceof Article) {
            $this->get('ha_notificator')->articleLikeRemoved($user, $instance);
        }
        if ($instance instanceof Property) {
            $this->get('ha_notificator')->propertyLikeRemoved($user, $instance);
        }

        $em->flush();

        return new JsonResponse();
    }

    /**
     * @param string $key
     * @param mixed  $entity
     * @param int    $id
     *
     * @return JsonResponse
     */
    public function addAction($key, $entity, $id)
    {
        $instance = $this->getLikedInstance($key, $id, $entity);

        /** @var UserRepository $repo */
        $repo = $this->get('user_repo');
        $user = $this->getUser();

        if ($repo->isLikedByUser($user, $instance)) {
            throw new LogicException('It has already liked by you');
        }

        $this->addLike($user, $instance);

        return new JsonResponse();
    }

    /**
     * @param User             $user
     * @param Property|Article $instance
     */
    private function addLike(User $user, $instance)
    {
        $className = get_class($instance).'Like';

        /** @var AbstractLike $like */
        $like = new $className();
        $like->setUser($user);
        $like->setLiked($instance);

        $instance->likes->add($like);

        $em = $this->get('em');
        $em->persist($instance);

        // Add notification
        if ($instance instanceof Article) {
            $this->get('ha_notificator')->articleLiked($user, $instance);
        }
        if ($instance instanceof Property) {
            $this->get('ha_notificator')->propertyLiked($user, $instance);
        }

        $em->flush();
    }

    /**
     * @param string $key
     * @param int    $id
     * @param string $entity
     *
     * @throws NotFoundHttpException
     *
     * @return Property|Article
     */
    private function getLikedInstance($key, $id, $entity)
    {
        /** @var Article|Property $instance */
        $instance = $this->get('em')
            ->getRepository($entity)
            ->findOneBy([$key => $id]);

        if (!$instance) {
            throw new NotFoundHttpException();
        }

        return $instance;
    }
}
