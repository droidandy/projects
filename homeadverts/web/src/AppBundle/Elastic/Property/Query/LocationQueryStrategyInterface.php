<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;

interface LocationQueryStrategyInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder);

    /**
     * @param array $location
     *
     * @return array mixed
     */
    public function getLocationFilters($location);
}
