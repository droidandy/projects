<?php

namespace AppBundle\Controller\Api\Article;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Controller\Api\ApiControllerTemplate;
use AppBundle\Exception\InvalidDataException;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Property\Property;

class ArticleController extends ApiControllerTemplate
{
    /**
     * @var string
     */
    protected $model = Article::class;

    /**
     * @param string $token
     *
     * @return Response
     */
    public function editAction(string $token)
    {
        $article = $this
            ->get('article_repo')
            ->findOneBy([
                'token' => $token,
                'author' => $this->getUser(),
            ]);

        if (!$article) {
            return new Response(null, 404);
        }

        return new Response($this->serializeEntity($article, ['details']));
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function importUrlAction(Request $request)
    {
        $url = json_decode($request->getContent())->url;
        $article = $this
            ->get('ha.article.service')
            ->buildArticleFromUrl(
                $url,
                $this->getUser()
            );

        $response = new JsonResponse(null, 201);
        $response->headers->set(
            'Location',
            $this->generateUrl(
                'ha_article_edit',
                [
                    'token' => $article->getToken(),
                ]
            )
        );

        return $response;
    }

    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="property",
     *     class="AppBundle\Entity\Property\Property"
     * )
     *
     * @param Property $property
     *
     * @return JsonResponse
     */
    public function importPropertyAction(Property $property)
    {
        $article = $this
            ->get('ha.article.service')
            ->buildArticleFromProperty(
                $property,
                $this->getUser()
            );

        $response = new JsonResponse(null, 201);
        $response->headers->set(
            'Location',
            $this->generateUrl(
                'ha_article_edit',
                [
                    'token' => $article->getToken(),
                ]
            )
        );

        return $response;
    }

    /**
     * @param $token
     *
     * @return JsonResponse
     */
    public function deleteAction($token)
    {
        $article = $this
            ->get('article_repo')
            ->findOneBy([
                'token' => $token,
            ]);

        if (!$article) {
            return new JsonResponse(null, 404);
        }

        $em = $this->get('em');
        $em->remove($article);
        $em->flush($article);

        return new JsonResponse();
    }

    /**
     * @param Article $article
     * @param Request $request
     *
     * @return Response
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="article",
     *     class="AppBundle\Entity\Social\Article",
     *     options={"mapping": {"token": "token"}}
     * )
     */
    public function saveAction(Article $article, Request $request)
    {
        /** @var Article $article */
        $serializer = $this->get('jms_serializer');
        $article = $serializer->deserialize(
            $request->getContent(),
            Article::class,
            'json'
        );

        $article = $this
            ->get('ha.article.service')
            ->validateAndSaveArticle($article);

        return new Response($serializer->serialize($article, 'json'));
    }

    /**
     * @param Article $article
     *
     * @return Response
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="article",
     *     class="AppBundle\Entity\Social\Article",
     *     options={"mapping": {"token": "token"}}
     * )
     */
    public function analyzeAction(Article $article)
    {
        $meta = $this
            ->get('ha_article.analyser')
            ->analyze($article);

        return new JsonResponse($meta['tags']);
    }

    /**
     * @param Article $article
     *
     * @return Response
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="article",
     *     class="AppBundle\Entity\Social\Article",
     *     options={"mapping": {"token": "token"}}
     * )
     */
    public function publishAction(Article $article)
    {
        /** @var Article $article */
        $serializer = $this->get('jms_serializer');
        $validator = $this->get('validator');
        $em = $this->get('doctrine')->getManager();

        if (!$article->isPublished()) {
            $article->setPublished();

            $this->get('ha.article.processor')->process($article);
            $this->get('ha.article.publisher')->publish($article);

            $violations = $validator->validate(
                $article,
                null,
                [$article->getPublishingState()]
            );

            if ($violations->count()) {
                throw new InvalidDataException($violations);
            }

            $em->persist($article);
            $em->flush();

            $this->get('ha.user.count_resolver')->onArticlePublished($article);
        }

        return new Response($serializer->serialize($article, 'json'));
    }
}
