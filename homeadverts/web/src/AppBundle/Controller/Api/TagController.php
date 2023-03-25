<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Integration\Query\Criteria\ValidationException;

use AppBundle\Entity\User\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\HttpFoundation\JsonResponse;


class TagController extends ApiControllerTemplate
{
    /**
     * @var string
     */
    protected $model = Tag::class;

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function selectAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);

        $this->get('ha_tag.follower')->followOnlySelectedCategories(
            $this->getUser(),
            $payload['ids']
        );

        $this->get('em')->flush();

        return new JsonResponse();
    }

    /**
     * @param Tag $tag
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="tag",
     *     class="AppBundle\Entity\Social\Tag"
     * )
     *
     * @return JsonResponse
     */
    public function followAction(Tag $tag)
    {
        $this->get('ha_tag.follower')->followTag(
            $this->getUser(),
            $tag
        );

        $this->get('em')->flush();

        return new JsonResponse();
    }

    /**
     * @param Tag $tag
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="tag",
     *     class="AppBundle\Entity\Social\Tag"
     * )
     *
     * @return JsonResponse
     */
    public function unFollowAction(Tag $tag)
    {
        $em = $this->get('em');

        /** @var User $user */
        $user = $this->getUser();
        $followedTag = $user->getTagFollowedFromTag($tag);

        $em->remove($followedTag);
        $em->flush($followedTag);

        return new JsonResponse();
    }

    /**
     * @return Response
     */
    public function getCollectionAction()
    {
        $em = $this->get('em');

        $entities = $em->getRepository($this->model)->findBy([
            'private' => false
        ]);

        return new Response($this->serializeEntity(
            $entities,
            ['collection']
        ));
    }

}
