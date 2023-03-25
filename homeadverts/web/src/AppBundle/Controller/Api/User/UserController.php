<?php

namespace AppBundle\Controller\Api\User;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use AppBundle\Controller\Api\ApiControllerTemplate;
use AppBundle\Entity\User\User;

class UserController extends ApiControllerTemplate
{
    /**
     * @var string
     */
    protected $model = User::class;

    /**
     * @param Request $request
     * @param User $user
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="user",
     *     class="AppBundle\Entity\User\User",
     * )
     *
     * @return Response
     */
    public function feedAction(Request $request, User $user): Response
    {
        $page = $request->get('p');
        $feed = $this->get('em')
            ->getRepository(User::class)
            ->getUserFeed($user, $page);

        return new Response($this->serializeEntity(
            $feed,
            ['collection']
        ));
    }

    /**
     * @param User $following
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="following",
     *     class="AppBundle\Entity\User\User",
     * )
     *
     * @return JsonResponse
     */
    public function followUserAction(User $following)
    {
        $em = $this->get('em');
        $user = $this->getUser();

        $user->followUser($following);
        $this->get('em')->persist($user);

        // Add notification
        $this->get('ha_notificator')->userFollowingUser(
            $this->getUser(),
            $following
        );

        $em->flush($user);

        return new JsonResponse();
    }

    /**
     * @param User $following
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="user",
     *     class="AppBundle\Entity\User\User"
     * )
     *
     * @return JsonResponse
     */
    public function unFollowUserAction(User $following)
    {
        $em = $this->get('em');
        $user = $this->getUser();

        $user->unFollowUser($following);
        $em->persist($user);

        // Remove notification
        $this->get('ha_notificator')->userFollowingUserRemoved(
            $this->getUser(),
            $following
        );

        $em->flush();

        return new JsonResponse();
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function loginAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);

        $this->get('ha.user_manager')->login(
            $payload['email'],
            $payload['password']
        );

        return new JsonResponse();
    }

    /**
     * @return JsonResponse
     */
    public function newPasswordAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);
        $email = $payload['email'];

        $plainPassword = $this
            ->get('ha.user_manager')
            ->setNewPassword($email);
        $this
            ->get('ha.mailer')
            ->sendNewPasswordEmail($email, $plainPassword);

        return new JsonResponse();
    }

    /**
     * @return mixed
     */
    public function meAction()
    {
        return new Response($this->serializeEntity(
            $this->getUser(),
            ['auth']
        ));
    }

    /**
     * @return mixed
     */
    protected function postPreProcessor()
    {
        $request = $this->get('request');

        if (!$request->headers->get('x-user-agreement')) {
            throw new BadRequestHttpException('Terms of use must be accepted.');
        }
    }
}
