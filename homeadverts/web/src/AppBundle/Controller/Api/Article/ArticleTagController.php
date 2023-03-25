<?php

namespace AppBundle\Controller\Api\Article;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Tag;

class ArticleTagController extends Controller
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
    public function addTagsAction(Article $article, Request $request)
    {
        $tagIds = $this->prepareTags($request);

        $em = $this->get('doctrine')->getManager();
        $tags = $em->getRepository(Tag::class)->findBy([
            'id' => $tagIds,
            'private' => 0,
        ]);

        $article->addRawTags($tags, $this->getUser());
        $em->persist($article);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
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
    public function removeTagsAction(Article $article, Request $request)
    {
        $tagIds = $this->prepareTags($request);

        $em = $this->get('doctrine')->getManager();
        $tags = $em->getRepository(Tag::class)->findBy([
            'id' => $tagIds,
            'private' => 0,
        ]);

        $article->removeRawTags($tags);
        $em->persist($article);
        $em->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    private function prepareTags(Request $request)
    {
        $tagIds = json_decode($request->getContent(), true)['tag_ids'];

        if (empty($tagIds)) {
            throw new BadRequestHttpException('Tag ids should not be empty');
        }

        foreach ($tagIds as &$tagId) {
            $tagId = (int) $tagId;
            if (!is_int($tagId)) {
                throw new BadRequestHttpException('Tag ids should be integers');
            }
        }

        return $tagIds;
    }
}
