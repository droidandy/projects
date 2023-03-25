<?php

namespace AppBundle\Controller\Api\Property;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Property\Comment;
use AppBundle\Controller\Api\ApiControllerTemplate;

class CommentController extends ApiControllerTemplate
{
    /**
     * @var string
     */
    protected $model = Comment::class;

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function newAction(Request $request)
    {
        $em = $this->get('em');

        $comment = $this->buildInstanceFromPayload($request->getContent());
        $comment->setUser($this->getUser());
        $em->persist($comment);

        $this->get('ha_notificator')->propertyCommented(
            $this->getUser(),
            $comment
        );

        $em->flush();

        return new JsonResponse();
    }
}
