<?php

namespace AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;
use AppBundle\Elastic\Integration\Collection\SearchResults;
use Symfony\Component\Stopwatch\Stopwatch;

class RequestFactory implements RequestFactoryInterface
{
    /**
     * @var DocumentParserInterface
     */
    private $documentParser;
    /**
     * @var Stopwatch|null
     */
    private $stopwatch;

    /**
     * RequestFactory constructor.
     *
     * @param DocumentParserInterface $documentParser
     * @param Stopwatch|null          $stopwatch
     */
    public function __construct(DocumentParserInterface $documentParser, Stopwatch $stopwatch = null)
    {
        $this->documentParser = $documentParser;
        $this->stopwatch = $stopwatch;
    }

    /**
     * @param array        $query
     * @param array|string $types
     *
     * @return Request
     */
    public function createRequest(array $query, $types)
    {
        $query = $this->decorateAggregationNames($query);

        return new Request(
            $query,
            $types,
            function ($result) {
                return new SearchResults($result, $this->documentParser);
            },
            $this->stopwatch
        );
    }

    /**
     * @return null|Stopwatch
     */
    public function getStopwatch()
    {
        return $this->stopwatch;
    }

    /**
     * @param array $query
     *
     * @return array
     */
    private function decorateAggregationNames(array $query)
    {
        if (!empty($query['aggregations'])) {
            $key = 'aggregations';
        } elseif (!empty($query['aggs'])) {
            $key = 'aggs';
        } else {
            return $query;
        }

        $aggregations = [];
        foreach ($query[$key] as $name => $aggregation) {
            switch (true) {
                case array_key_exists('filter', $aggregation):
                    $suffix = 'filter';
                    $aggregation = $this->decorateAggregationNames($aggregation);
                    break;
                case array_key_exists('terms', $aggregation):
                    $suffix = 'terms';
                    $aggregation = $this->decorateAggregationNames($aggregation);
                    break;
                case array_key_exists('avg', $aggregation):
                    $suffix = 'avg';
                    break;
                case array_key_exists('min', $aggregation):
                    $suffix = 'min';
                    break;
                case array_key_exists('max', $aggregation):
                    $suffix = 'max';
                    break;
                default:
                    throw new \InvalidArgumentException('Unsupported aggregation');
            }
            $aggregations[$name.'_'.$suffix] = $aggregation;
        }

        $query[$key] = $aggregations;

        return $query;
    }
}
