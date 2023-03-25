<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class PaginationType extends TypeTemplate
{
    const PER_PAGE = 15;
    const PER_MAP = 30;

    /**
     * @return string
     */
    public function getName()
    {
        return 'pagination';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__default' => [
                'from' => 0,
                'size' => self::PER_PAGE,
            ],
            '__required' => false,
            '__normalize' => function ($value) {
                if (!is_numeric($value) && !is_array($value)) {
                    return $value;
                } elseif (is_numeric($value)) {
                    if ($value == -1) {
                        $page = 1;
                        $perPage = self::PER_MAP;
                    } else {
                        $page = $value;
                        $perPage = self::PER_PAGE;
                    }
                } elseif (isset($value['page'])) {
                    $page = $value['page'];
                    $perPage = isset($value['per_page']) ? $value['per_page'] : self::PER_PAGE;
                } elseif (isset($value['p'])) {
                    $page = $value['p'];
                    $perPage = isset($value['per_page']) ? $value['per_page'] : self::PER_PAGE;
                } else {
                    $page = 1;
                    $perPage = self::PER_PAGE;
                }

                return [
                    'from' => ($page - 1) * $perPage,
                    'size' => $perPage,
                ];
            },
        ];
    }
}
