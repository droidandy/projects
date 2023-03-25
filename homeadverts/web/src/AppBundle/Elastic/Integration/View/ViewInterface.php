<?php

namespace AppBundle\Elastic\Integration\View;

interface ViewInterface
{
    /**
     * @param mixed $results
     * @param array $runtimeOptions
     *
     * @return mixed
     */
    public function __invoke($results, $runtimeOptions = []);

    /**
     * @return mixed
     */
    public function getName();
}
