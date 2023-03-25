<?php

namespace AppBundle\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class StatisticsController extends ApiControllerTemplate
{
    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function postDisplayEventAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);

        $event = $this->get('ha_statistics')->addDisplayEventNowFromRequest(
            $request,
            $payload,
            $this->getUser()
        );
        $this->get('em')->flush($event);

        return new JsonResponse();
    }

    /**
     * @param int $id
     *
     * @return Response
     */
    public function getArticleStatisticsAction($id)
    {
        $data = $this->get('ha_statistics')->getArticleStatistics($id);

        return new Response($this->serializeEntity($data));
    }

    /**
     * @param int $id
     *
     * @return Response
     */
    public function getPropertyStatisticsAction($id)
    {
        $data = $this->get('ha_statistics')->getPropertyStatistics($id);

        return new Response($this->serializeEntity($data));
    }
}
