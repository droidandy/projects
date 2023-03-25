<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

abstract class TypeTemplate implements TypeInterface
{
    /**
     * @param array $options
     *
     * @return array
     */
    public function __invoke(array $options = [])
    {
        return array_replace_recursive($this->getDefaults(), $options);
    }

    /**
     * @return array
     */
    abstract protected function getDefaults();
}
