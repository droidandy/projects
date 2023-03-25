<?php

namespace AppBundle\Controller;

use AppBundle\Entity\User\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Social\Article\ArticleStreamRepository;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Entity\Social\Article\ArticleRepository;

class PageController extends Controller
{
    const USER_HELP_EMAIL = 'help@luxuryaffairs.co.uk';
    const PROPERTIES_TOP = 9;
    const ARTICLES_TOP = 6;

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function homepageAction(Request $request)
    {
        /** @var PropertyRepository $propertyRepo */
        /** @var ArticleRepository $repo */
        $page = $request->get('p');
        $articleRepo = $this->get('article_repo_recommended');
        $propertyRepo = $this->get('property_repo');
        $paginator = $this->get('ha.paginator');

        $pageTotal = $paginator->getPageTotal($articleRepo->getTotal() - self::ARTICLES_TOP);
        $articlesTop = $articleRepo->getTeasers(0, self::ARTICLES_TOP);
        $propertiesTop = $propertyRepo->getFeatured(0, self::PROPERTIES_TOP);

        $pagination = [];

        for ($i = 1; $i <= $page; ++$i) {
            $offset = $paginator->getOffset($i);
            $teasersOffset = $offset + (self::ARTICLES_TOP);
            $propertiesOffset = $offset + (self::PROPERTIES_TOP);

            array_push($pagination, [
                'properties' => $propertyRepo->getFeatured($propertiesOffset, 3),
                'featured' => $articleRepo->getFeatured($paginator->getSingleItemOffset($i)),
                'teasers' => $articleRepo->getTeasers($teasersOffset, $paginator->getPageLimit()),
                'cover' => $articleRepo->getJumbo($paginator->getJumboOffset($i)),
            ]);
        }

        return $this->render('AppBundle::page/homepage.html.twig', [
            'cover' => $articleRepo->getCover(3),

            'articlesTop' => $articlesTop,
            'propertiesTop' => $propertiesTop,

            'pagination' => $pagination,
            'pageTotal' => $pageTotal,
            'page' => $page,
        ]);
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function homepagePaginationAction(Request $request)
    {
        /** @var PropertyRepository $propertyRepo */
        /** @var ArticleRepository $articleRepo */
        $page = $request->get('p');
        $articleRepo = $this->get('article_repo_recommended');
        $propertyRepo = $this->get('property_repo');
        $paginator = $this->get('ha.paginator');

        $offset = $paginator->getOffset($page);
        $teasersOffset = $offset + (self::ARTICLES_TOP);
        $pagination = [];

        array_push($pagination, [
            'properties' => $propertyRepo->getFeatured($offset, 3),
            'featured' => $articleRepo->getFeatured($paginator->getSingleItemOffset($page)),
            'teasers' => $articleRepo->getTeasers($teasersOffset, $paginator->getPageLimit()),
            'cover' => $articleRepo->getJumbo($paginator->getJumboOffset($page)),
        ]);

        return $this->render('AppBundle::page/homepage_collection.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function streamAction(Request $request)
    {
        /** @var ArticleStreamRepository $repo */
        /** @var User $user */
        $paginator = $this->get('ha.paginator');
        $user = $this->getUser();

        $repo = $this->get('article_repo_stream');
        $repo->setFollowingIds($user);
        $repo->setTags($user->getStreamTags());

        $page = $request->get('p');
        $pagination = [];

        for ($i = 1; $i <= $page; ++$i) {
            array_push($pagination, [
                'featured' => $repo->getFeatured($paginator->getSingleItemOffset($page)),
                'cover' => $repo->getJumbo($paginator->getJumboOffset($page)),
                'teasers' => $repo->getTeasers($paginator->getOffset($page), $paginator->getPageLimit()),
            ]);
        }

        return $this->render('AppBundle::page/stream.html.twig', [
            'cover' => $repo->getCover(3),

            'pageTotal' => $paginator->getPageTotal($repo->getTotal()),
            'page' => $page,
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function streamPaginationAction(Request $request)
    {
        /** @var ArticleStreamRepository $repo */
        /** @var User $user */
        $paginator = $this->get('ha.paginator');
        $user = $this->getUser();

        $repo = $this->get('article_repo_stream');
        $repo->setFollowingIds($this->getUser());
        $repo->setTags($user->getStreamTags());

        $page = $request->get('p');
        $pagination = [];

        array_push($pagination, [
            'featured' => $repo->getFeatured($paginator->getSingleItemOffset($page)),
            'cover' => $repo->getJumbo($paginator->getJumboOffset($page)),
            'teasers' => $repo->getTeasers($paginator->getOffset($page), $paginator->getPageLimit()),
        ]);

        return $this->render('AppBundle::page/stream_collection.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function latestAction(Request $request)
    {
        /** @var ArticleRepository $repo */
        $paginator = $this->get('ha.paginator');
        $repo = $this->get('article_repo');
        $page = $request->get('p');
        $total = $paginator->getPageTotal($repo->getTotalPublishedArticles());
        $articles = $repo->getPublishedArticles(
            $paginator->getOffset($page),
            $paginator->getPageLimit()
        );

        return $this->render('AppBundle::page/latest.html.twig', [
            'articles' => $articles,
            'page' => $page,
            'pageTotal' => $total,
        ]);
    }

    /**
     * @param Request $request
     * @param string  $token
     *
     * @return Response
     */
    public function helpAction(Request $request, $token)
    {
        $em = $this->get('em');

        $helpUser = $em
            ->getRepository('AppBundle\Entity\User\User')
            ->findBy([
                'email' => self::USER_HELP_EMAIL,
            ]);
        $articles = $em
            ->getRepository('AppBundle\Entity\Social\Article')
            ->findBy([
                'author' => $helpUser,
            ]);

        return $this->render('AppBundle:page:help.html.twig', [
            'token' => $token,
            'articles' => $articles,
        ]);
    }
}
