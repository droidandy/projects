<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

use AppBundle\Elastic\Integration\SeedGeneratorInterface;

class SortType extends TypeTemplate
{
    /**
     * @var SeedGeneratorInterface
     */
    private $seedGenerator;

    /**
     * SortType constructor.
     *
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
        return 'sort';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__default' => null,
            '__required' => false,
            '__normalize' => function ($value) {
                $keys = array_keys($value);
                if (in_array('rand', $keys)) {
                    return [
                        'random' => true,
                        'seed' => $this->seedGenerator->getSeed(),
                    ];
                } else {
                    foreach ($value as $key => $dir) {
                        $value[$key] = strtolower($dir);
                    }

                    return $value;
                }
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
