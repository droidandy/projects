<?php

namespace AppBundle\Elastic\Integration\Query\Criteria;

interface CriteriaInterface
{
    /**
     * @param array|null $data
     *
     * @return array
     */
    public function resolve($data);
}
