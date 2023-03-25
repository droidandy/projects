<?php

namespace AppBundle\Controller;

use AppBundle\Elastic\Integration\Query\Criteria\Type\PaginationType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Article\ArticleRepository;

class ArticleController extends Controller
{
    /**
     * @return Response
     */
    public function importAction()
    {
        return $this->render('AppBundle:article:import.html.twig');
    }

    /**
     * @return RedirectResponse
     */
    public function newAction()
    {
        $article = $this
            ->get('ha.article.service')
            ->newArticle($this->getUser());

        return $this->redirectToRoute('ha_article_edit', [
            'token' => $article->getToken(),
        ]);
    }

    /**
     * @return Response
     */
    public function editAction($token)
    {
        $article = $this->get('article_repo')->findOneBy([
            'token' => $token,
            'author' => $this->getUser(),
        ]);

        if (!$article) {
            return new Response(null, 404);
        }

        $categories = $this->get('em')->getRepository('AppBundle\Entity\Social\Tag')->findAll();

        return $this->render(
            'AppBundle:article:edit.html.twig',
            [
                'article' => $article,
                'categories' => $categories,
            ]
        );
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
     *
     * @return Response
     */
    public function detailsAction(Article $article)
    {
        /** @var ArticleRepository $repo */
        $repo = $this->get('article_repo');
        $relatedArticles = $repo->getPublishedArticles(
            0,
            3,
            [],
            [$article->getId()]
        );

        return $this->render('AppBundle::article/details.html.twig', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }

    /**
     * @param Request $request
     * @param string  $term
     *
     * @return Response
     */
    public function searchAction(Request $request, $term)
    {
        $page = $request->get('p');
        $query = $request->get('filters');
        $paging = [
            'page' => $page,
            'per_page' => PaginationType::PER_PAGE,
        ];

        if ($page > 1) {
            $paging = [
                'page' => 1,
                'per_page' => $page * PaginationType::PER_PAGE,
            ];
        }

        $search = $this
            ->get('ha.article.article_search_repo')
            ->findArticlesByTerm(
                $term,
                $query,
                $paging
            );

        return $this->render('AppBundle::article/search/results.html.twig', [
            'term' => $term,
            'search' => $search,
        ]);
    }

    /**
     * @param Request $request
     * @param string  $term
     *
     * @return Response
     */
    public function searchPaginationAction(Request $request, $term)
    {
        $query = $request->get('filters');

        $search = $this
            ->get('ha.article.article_search_repo')
            ->findArticlesByTerm(
                $term,
                $query,
                [
                    'page' => $request->get('p'),
                    'per_page' => PaginationType::PER_PAGE,
                ]
            );

        return $this->render('AppBundle::article/search/collection.html.twig', [
            'search' => $search,
        ]);
    }
}
