<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Mapping\MappingFactoryInterface;
use GuzzleHttp\Ring\Future\FutureArrayInterface;

interface RequestInterface
{
    /**
     * @param MappingFactoryInterface $mappingFactory
     *
     * @return FutureArrayInterface
     */
    public function execute(MappingFactoryInterface $mappingFactory);

    /**
     * @return array
     */
    public function getBody();
}
