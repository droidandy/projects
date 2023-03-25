<?php

namespace AppBundle\Controller\IndexRouteStrategy;

use Symfony\Component\HttpFoundation\Request;

interface IndexRouteStrategyInterface
{
    /**
     * @param Request $request
     * @param ...$args
     *
     * @return mixed
     */
    public function getRoute(Request $request, ...$args);
}
