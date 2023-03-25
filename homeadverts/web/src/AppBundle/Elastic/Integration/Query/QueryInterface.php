<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;

interface QueryInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder);

    /**
     * @param array                   $criteria
     * @param RequestFactoryInterface $requestFactory
     *
     * @return RequestInterface
     */
    public function build(array $criteria, RequestFactoryInterface $requestFactory);

    /**
     * @return array|string
     */
    public function getTypes();
}
