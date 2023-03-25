<?php

namespace AppBundle\Elastic\Integration\Query\Criteria;

use AppBundle\Elastic\Integration\Query\QueryInterface;

interface CriteriaBuilderInterface
{
    /**
     * @param $namespace
     * @param QueryInterface $query
     */
    public function fromQuery($namespace, QueryInterface $query);

    /**
     * @param $name
     * @param $type
     * @param array $options
     *
     * @return self
     */
    public function add($name, $type, $options = []);

    /**
     * @return CriteriaInterface
     */
    public function getCriteria();
}
