<?php

namespace AppBundle\Elastic\Integration\View;

class ViewRegistry
{
    /**
     * @var ViewInterface[]
     */
    private $views;

    /**
     * @param array $views
     */
    public function __construct(array $views)
    {
        $this->views = $views;
    }

    /**
     * @param $name
     *
     * @return ViewInterface
     */
    public function get($name)
    {
        if (!isset($this->views[$name])) {
            throw new \InvalidArgumentException(sprintf('The view %s doesn\'t exist', $name));
        }

        if ($name !== $this->views[$name]->getName()) {
            throw new \InvalidArgumentException(sprintf('The view name %s doesn\'t match the actual %s view name', $name, $this->views[$name]->getName()));
        }

        return $this->views[$name];
    }
}
