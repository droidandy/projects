<?php

namespace AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Query\AbstractLocationAggregateQueryTemplate;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;

class PropertyLocationAggregateQuery extends AbstractLocationAggregateQueryTemplate
{
    /**
     * @return array
     */
    protected function getPerLocationAggregations()
    {
        return [
            'rental' => [
                'terms' => [
                    'field' => 'rental',
                ],
            ],
        ];
    }

    /**
     * @return array
     */
    protected function getFilters()
    {
        return [
            'term' => [
                'status' => Property::STATUS_ACTIVE,
            ],
        ];
    }

    /**
     * @return array|null
     */
    protected function getMustNot()
    {
        return [
            'exists' => [
                'field' => 'deletedAt',
            ],
        ];
    }

    /**
     * @return string
     */
    public function getTypes()
    {
        return PropertyMapping::TYPE;
    }
}
