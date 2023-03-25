<?php

namespace AppBundle\Elastic\Integration\Query\Criteria;

use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeInterface;
use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeRegistry;
use AppBundle\Elastic\Integration\Query\QueryInterface;

class CriteriaBuilder implements CriteriaBuilderInterface
{
    /**
     * @var array
     */
    private $namespaces = [];
    /**
     * @var array
     */
    private $criteria;
    /**
     * @var array|null
     */
    private $currentCriteria = null;
    /**
     * @var TypeRegistry
     */
    private $typeRegistry;

    /**
     * @param TypeRegistry $typeRegistry
     */
    public function __construct(TypeRegistry $typeRegistry)
    {
        $this->typeRegistry = $typeRegistry;
    }

    /**
     * @param string         $namespace
     * @param QueryInterface $query
     */
    public function fromQuery($namespace, QueryInterface $query)
    {
        $this->enterNamespace($namespace);
        $query->configureCriteria($this);
        $this->leaveNamespace();
    }

    /**
     * @param string               $name
     * @param string|TypeInterface $type
     * @param array                $options
     *
     * @return $this
     */
    public function add($name, $type, $options = [])
    {
        $this->ensureNamespaceIsActive();

        if (is_string($type)) {
            $type = $this->typeRegistry->get($type);
            $type = $type($options);
        } else {
            $type = $type($options);
        }

        $this->currentCriteria[$name] = $type;

        return $this;
    }

    /**
     * @return NamespacedCriteria
     */
    public function getCriteria()
    {
        return new NamespacedCriteria($this->criteria);
    }

    /**
     * @param string $namespace
     */
    private function enterNamespace($namespace)
    {
        $namespace = '__ns__'.$namespace;
        if (in_array($namespace, $this->namespaces)) {
            throw new \LogicException('There is already the active namespace, leave it please before to enter new one');
        }

        array_push($this->namespaces, $namespace);

        $criteria = &$this->criteria;
        foreach ($this->namespaces as $namespace) {
            $criteria = &$criteria[$namespace];
        }

        $this->currentCriteria = &$criteria;
    }

    private function leaveNamespace()
    {
        if (empty($this->namespaces)) {
            throw new \LogicException('No active namespace to leave');
        }

        array_pop($this->namespaces);
        if (empty($this->namespaces)) {
            unset($this->currentCriteria);

            return;
        }

        $criteria = &$this->criteria;
        foreach ($this->namespaces as $namespace) {
            $criteria = &$criteria[$namespace];
        }

        $this->currentCriteria = &$criteria;
    }

    private function ensureNamespaceIsActive()
    {
        if (empty($this->namespaces)) {
            throw new \RuntimeException('Namespace is undefined');
        }
    }
}
