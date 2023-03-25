<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;

class CompositeQuery implements QueryInterface
{
    /**
     * @var QueryInterface[]
     */
    private $queries;

    /**
     * CompositeQuery constructor.
     *
     * @param QueryInterface[] $queries
     */
    public function __construct(array $queries)
    {
        $this->queries = $queries;
    }

    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        foreach ($this->queries as $name => $query) {
            $criteriaBuilder->fromQuery($name, $query);
        }
    }

    /**
     * @param array                   $criteria
     * @param RequestFactoryInterface $requestFactory
     *
     * @return CompositeRequest
     */
    public function build(array $criteria, RequestFactoryInterface $requestFactory)
    {
        $requests = [];
        foreach ($this->queries as $name => $query) {
            $requests[$name] = $query->build($criteria[$name], $requestFactory);
        }

        return new CompositeRequest($requests, $requestFactory->getStopwatch());
    }

    /**
     * @throws \LogicException
     */
    public function getTypes()
    {
        throw new \LogicException('Composite can\'t belong to any type');
    }
}
