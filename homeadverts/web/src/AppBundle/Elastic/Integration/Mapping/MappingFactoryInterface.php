<?php

namespace AppBundle\Elastic\Integration\Mapping;

interface MappingFactoryInterface
{
    /**
     * @param string $type
     *
     * @return MappingInterface
     *
     * @throws \RuntimeException
     */
    public function get($type);
}
