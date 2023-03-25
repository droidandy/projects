<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;

interface LocationQueryStrategyInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder);

    /**
     * @param string   $field
     * @param Location $location
     *
     * @return array
     */
    public function locationQuery($field, Location $location);
}
