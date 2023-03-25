<?php

namespace AppBundle\Elastic\Integration\Query;

use Symfony\Component\Stopwatch\Stopwatch;

interface RequestFactoryInterface
{
    /**
     * @param array        $query
     * @param string|array $types
     *
     * @return RequestInterface
     */
    public function createRequest(array $query, $types);

    /**
     * @return null|Stopwatch
     */
    public function getStopwatch();
}
