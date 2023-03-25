<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Entity\Social\Tag;

class TagController extends Controller
{
    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="article",
     *     class="AppBundle\Entity\Social\Tag",
     *     options={"mapping": {"name": "name"}}
     * )
     *
     * @param Request $request
     * @param Tag     $tag
     *
     * @return Response
     */
    public function detailsAction(Request $request, Tag $tag)
    {
        $page = $request->get('p');
        $repo = $this->get('article_repo_tag');
        $repo->setTag($tag);

        $paginator = $this->get('ha.paginator');
        $pagination = [];

        for ($i = 1; $i <= $page; ++$i) {
            array_push($pagination, [
                'featured' => $repo->getFeatured($paginator->getSingleItemOffset($page)),
                'cover' => $repo->getJumbo($paginator->getJumboOffset($page)),
                'teasers' => $repo->getTeasers($paginator->getOffset($page), $paginator->getPageLimit()),
            ]);
        }

        return $this->render('AppBundle:tag:details.html.twig', [
            'cover' => $repo->getCover(3),
            'tag' => $tag,

            'pageTotal' => 0,
            'page' => $page,
            'pagination' => $pagination,
        ]);
    }

    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="article",
     *     class="AppBundle\Entity\Social\Tag",
     *     options={"mapping": {"name": "name"}}
     * )
     *
     * @param Request $request
     * @param Tag     $tag
     *
     * @return Response
     */
    public function detailsPaginationAction(Request $request, Tag $tag)
    {
        $page = $request->get('p');
        $repo = $this->get('article_repo_tag');
        $repo->setTag($tag);

        $paginator = $this->get('ha.paginator');
        $pagination = [];

        array_push($pagination, [
            'featured' => $repo->getFeatured($paginator->getSingleItemOffset($page)),
            'cover' => $repo->getJumbo($paginator->getJumboOffset($page)),
            'teasers' => $repo->getTeasers($paginator->getOffset($page), $paginator->getPageLimit()),
        ]);

        return $this->render('AppBundle:article:details_collection.html.twig', [
            'pagination' => $pagination,
        ]);
    }
}
