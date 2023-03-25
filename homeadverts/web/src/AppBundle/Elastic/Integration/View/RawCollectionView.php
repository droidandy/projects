<?php

namespace AppBundle\Elastic\Integration\View;

class RawCollectionView implements ViewInterface
{
    /**
     * @param mixed $results
     * @param array $runtimeOptions
     *
     * @return mixed
     */
    public function __invoke($results, $runtimeOptions = [])
    {
        return $results;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'raw';
    }
}
