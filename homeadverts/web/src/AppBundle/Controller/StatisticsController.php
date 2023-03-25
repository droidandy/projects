<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class StatisticsController extends Controller
{
    /**
     * @param string $entity
     *
     * @return Response
     */
    public function detailsAction($entity)
    {
        $users = $this->get('ha.user.adjacency_registry')->getAllChildIds(
            $this->getUser()->getId()
        );
        $users[] = $this->getUser()->getId();

        $collection = $this
            ->get($entity.'_repo')
            ->getPublishedForUsers($users);

        return $this->render('AppBundle:statistics:details.html.twig', [
            'type' => $entity,
            'collection' => $collection,
        ]);
    }
}
