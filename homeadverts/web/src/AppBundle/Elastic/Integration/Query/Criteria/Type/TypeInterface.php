<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

interface TypeInterface
{
    /**
     * @param array $options
     *
     * @return array
     */
    public function __invoke(array $options = []);

    /**
     * @return string
     */
    public function getName();
}
