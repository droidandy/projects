<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class LanguageType extends TypeTemplate
{
    /**
     * @var array
     */
    private $languages = ['en'];

    /**
     * @return string
     */
    public function getName()
    {
        return 'language';
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
                return strtolower($value);
            },
            '__validate' => function ($value) {
                return in_array($value, $this->languages);
            },
        ];
    }
}
