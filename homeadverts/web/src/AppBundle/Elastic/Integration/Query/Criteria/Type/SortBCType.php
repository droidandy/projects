<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\SeedGeneratorInterface;

class SortBCType extends TypeTemplate
{
    /**
     * @var SeedGeneratorInterface
     */
    private $seedGenerator;

    /**
     * @param SeedGeneratorInterface $seedGenerator
     */
    public function __construct(SeedGeneratorInterface $seedGenerator)
    {
        $this->seedGenerator = $seedGenerator;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'sort_bc';
    }

    /**
     * @return array
     */
    public function getDefaults()
    {
        return [
            '__default' => null,
            '__required' => false,
            '__normalize' => function ($value) {
                if ('rand:rand' == $value) {
                    return [
                        'random' => true,
                        'seed' => $this->seedGenerator->getSeed(),
                    ];
                }

                list($field, $direction) = explode(':', $value, 2);

                return [
                    $field => $direction,
                ];
            },
            '__validate' => function ($value) {
                if (isset($value['random'])) {
                    return true;
                }

                foreach ($value as $dir) {
                    if (!in_array($dir, ['asc', 'desc'])) {
                        return false;
                    }
                }

                return true;
            },
        ];
    }
}
