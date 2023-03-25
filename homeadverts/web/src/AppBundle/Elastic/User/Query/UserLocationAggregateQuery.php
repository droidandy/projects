<?php

namespace AppBundle\Elastic\User\Query;

use AppBundle\Elastic\Integration\Query\AbstractLocationAggregateQueryTemplate;
use AppBundle\Elastic\User\Mapping\UserMapping;

class UserLocationAggregateQuery extends AbstractLocationAggregateQueryTemplate
{
    /**
     * @var string
     */
    private $userType;

    /**
     * @param string $strategy
     * @param string $userType
     */
    public function __construct($strategy = 'place_id', $userType = 'user')
    {
        parent::__construct($strategy);

        $this->userType = $userType;
    }

    protected function getPerLocationAggregations()
    {
        return null;
    }

    /**
     * @return array
     */
    protected function getFilters()
    {
        $filters = [];
        if ('all' !== $this->userType) {
            $filters[] = [
                'term' => [
                    'type' => $this->userType,
                ],
            ];
        }

        $filters[] = [
            'term' => [
                'status' => 1,
            ],
        ];

        return $filters;
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
        return UserMapping::TYPE;
    }
}
