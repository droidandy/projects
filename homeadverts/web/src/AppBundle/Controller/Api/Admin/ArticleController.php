<?php

namespace AppBundle\Controller\Api\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Exception\LogicException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Tag;

class ArticleController extends Controller
{
    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="article",
     *     class="AppBundle\Entity\Social\Article",
     *     options={"mapping": {"token": "token"}}
     * )
     *
     * @param Article $article
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function addTagAction(Article $article, Request $request)
    {
        $tag = $this->getTagFromRequest($request);
        $article->addRawTag($tag, $this->getUser());

        $em = $this->get('em');
        $em->persist($article);
        $em->flush();

        return new JsonResponse('', Response::HTTP_NO_CONTENT);
    }

    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="article",
     *     class="AppBundle\Entity\Social\Article",
     *     options={"mapping": {"token": "token"}}
     * )
     *
     * @param Article $article
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function removeTagAction(Article $article, Request $request)
    {
        $tag = $this->getTagFromRequest($request);
        $article->removeRawTag($tag);

        $em = $this->get('em');
        $em->persist($article);
        $em->flush();

        return new JsonResponse('', Response::HTTP_NO_CONTENT);
    }

    /**
     * @param Request $request
     *
     * @throws LogicException
     *
     * @return Tag
     */
    private function getTagFromRequest(Request $request)
    {
        $em = $this->get('em');
        $payload = json_decode($request->getContent(), true);
        $tag = $em->getRepository(Tag::class)->findOneBy([
            'name' => $payload['tag'],
            'private' => true,
        ]);

        if (!$tag) {
            throw new LogicException(
                sprintf("%s doesn't exists", $payload['tag'])
            );
        }

        return $tag;
    }
}
