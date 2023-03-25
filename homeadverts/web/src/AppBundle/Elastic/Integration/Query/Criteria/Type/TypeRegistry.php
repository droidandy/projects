<?php

namespace AppBundle\Elastic\Integration\Query\Criteria\Type;

class TypeRegistry
{
    /**
     * @var TypeInterface[]
     */
    private $types;

    /**
     * TypeRegistry constructor.
     *
     * @param TypeInterface[] $types
     */
    public function __construct(array $types)
    {
        $this->types = $types;
    }

    public function get($name)
    {
        if (!isset($this->types[$name])) {
            throw new \InvalidArgumentException(sprintf('The type "%s" in undefined', $name));
        }

        if ($name !== $this->types[$name]->getName()) {
            throw new \InvalidArgumentException(sprintf(
                'The request type "%s" doesn\'t match the actual "%s" type of the class',
                $name,
                $this->types[$name]->getName()
            ));
        }

        return $this->types[$name];
    }
}
