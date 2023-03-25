<?php

namespace AppBundle\Elastic\Integration;

use AppBundle\Elastic\Integration\Mapping\MappingFactoryInterface;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\Request;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\View\ViewRegistry;
use Symfony\Component\Stopwatch\Stopwatch;

class SearchHandler
{
    /**
     * @var MappingFactoryInterface
     */
    private $mappingFactory;
    /**
     * @var CriteriaBuilderInterface
     */
    private $criteriaBuilder;
    /**
     * @var ViewRegistry
     */
    private $viewRegistry;
    /**
     * @var RequestFactoryInterface
     */
    private $requestFactory;
    /**
     * @var Stopwatch|null
     */
    private $stopwatch;

    /**
     * @param MappingFactoryInterface  $mappingFactory
     * @param CriteriaBuilderInterface $criteriaBuilder
     * @param ViewRegistry             $viewRegistry
     * @param RequestFactoryInterface  $requestFactory
     * @param Stopwatch|null           $stopwatch
     */
    public function __construct(
        MappingFactoryInterface $mappingFactory,
        CriteriaBuilderInterface $criteriaBuilder,
        ViewRegistry $viewRegistry,
        RequestFactoryInterface $requestFactory,
        Stopwatch $stopwatch = null
    ) {
        $this->mappingFactory = $mappingFactory;
        $this->criteriaBuilder = $criteriaBuilder;
        $this->viewRegistry = $viewRegistry;
        $this->requestFactory = $requestFactory;
        $this->stopwatch = $stopwatch;
    }

    /**
     * @param QueryInterface $query
     * @param $queryCriteria
     * @param $view
     *
     * @return mixed
     */
    public function execute(QueryInterface $query, $queryCriteria, $view)
    {
        $criteriaBuilder = clone $this->criteriaBuilder;
        $criteriaBuilder->fromQuery('root', $query);
        $criteria = $criteriaBuilder->getCriteria();

        if ($this->stopwatch) {
            $this->stopwatch->start('criteria_resolve', 'search');
        }
        $resolvedCriteria = $criteria->resolve($queryCriteria);
        if ($this->stopwatch) {
            $this->stopwatch->stop('criteria_resolve');
        }

        if ($this->stopwatch) {
            $this->stopwatch->start('criteria_build', 'search');
        }
        /** @var Request $request */
        $request = $query->build($resolvedCriteria['root'], $this->requestFactory);
        if ($this->stopwatch) {
            $this->stopwatch->stop('criteria_build');
        }

        $response = $request->execute($this->mappingFactory);

        $view = $this->resolveView($view);

        return $view($response->wait(true), [
            'criteria' => $queryCriteria,
            'resolved_criteria' => $resolvedCriteria['root'],
        ]);
    }

    /**
     * @param callable|string $view
     *
     * @return callable
     */
    private function resolveView($view)
    {
        if (!is_callable($view)) {
            $view = $this->viewRegistry->get($view);
        }

        return $view;
    }
}
