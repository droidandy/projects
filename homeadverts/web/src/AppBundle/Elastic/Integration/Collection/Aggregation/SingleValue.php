<?php

namespace AppBundle\Elastic\Integration\Collection\Aggregation;

class SingleValue
{
    /**
     * @var string
     */
    private $name;
    /**
     * @var mixed
     */
    private $value;

    /**
     * @param string $name
     * @param array  $aggregation
     */
    public function __construct($name, $aggregation)
    {
        $this->name = $name;
        $this->value = $aggregation['value'];
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }
}
