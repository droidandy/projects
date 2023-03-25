<?php

namespace Test\AppBundle\Elastic\Integration\Collection;

use AppBundle\Elastic\Integration\Collection\Aggregation\Bucket;
use AppBundle\Elastic\Integration\Collection\Aggregation\Filter;
use AppBundle\Elastic\Integration\Collection\Aggregation\SingleValue;
use AppBundle\Elastic\Integration\Collection\Aggregation\Terms;
use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;
use AppBundle\Elastic\Integration\Collection\SearchResults;

class SearchResultsTest extends \PHPUnit_Framework_TestCase
{
    public function testSearchResult()
    {
        $result = [
            'hits' => [
                'total' => 5,
                'hits' => [
                    [
                        '_id' => 1,
                        '_source' => [
                            'prop1' => 'val11',
                            'prop2' => 'val12',
                        ],
                    ],
                    [
                        '_id' => 2,
                        '_source' => [
                            'prop1' => 'val21',
                            'prop2' => 'val22',
                        ],
                    ],
                    [
                        '_id' => 3,
                        '_source' => [
                            'prop1' => 'val31',
                            'prop2' => 'val32',
                        ],
                    ],
                ],
            ],
        ];

        $documentParser = $this->getDocumentParser();
        $documentParser
            ->expects($this->exactly(3))
            ->method('parse')
            ->withConsecutive(
                [$result['hits']['hits'][0]],
                [$result['hits']['hits'][1]],
                [$result['hits']['hits'][2]]
            )
            ->willReturnCallback(function ($hit) {
                $obj = new \stdClass();
                $obj->id = $hit['_id'];
                $obj->prop1 = $hit['_source']['prop1'];
                $obj->prop2 = $hit['_source']['prop2'];

                return $obj;
            })
        ;

        $searchResults = $this->getSearchResults($result, $documentParser);
        $this->assertEquals(5, $searchResults->getTotal());
        $this->assertCount(3, $searchResults);
        foreach ($searchResults as $i => $obj) {
            $this->assertEquals($result['hits']['hits'][$i]['_id'], $obj->id);
            $this->assertEquals($result['hits']['hits'][$i]['_source']['prop1'], $obj->prop1);
            $this->assertEquals($result['hits']['hits'][$i]['_source']['prop2'], $obj->prop2);
        }
    }

    public function testAggregationResult()
    {
        $resultBuckets = [
            [
                'key' => false,
                'key_as_string' => 'false',
                'doc_count' => 4,
            ],
            [
                'key' => true,
                'key_as_string' => 'true',
                'doc_count' => 1,
            ],
        ];

        $result = [
            'hits' => [
                'total' => 5,
                'hits' => [],
            ],
            'aggregations' => [
                'location_filter' => [
                    'doc_count' => 5,
                    'rental_terms' => [
                        'buckets' => $resultBuckets,
                    ],
                    'price_min' => [
                        'value' => 1000000,
                    ],
                ],
            ],
        ];

        $documentParser = $this->getDocumentParser();

        $searchResults = $this->getSearchResults($result, $documentParser);

        $this->assertCount(1, $searchResults->getAggregations());
        foreach ($searchResults->getAggregations() as $name => $aggregation) {
            $this->assertEquals('location', $name);
            $this->assertEquals(5, $aggregation->getDocCount());
            $this->assertInstanceOf(Filter::class, $aggregation);
            foreach ($aggregation->getAggregations() as $subName => $subAggregation) {
                $this->assertContains($subName, ['rental', 'price']);
                if ('rental' == $subName) {
                    $this->assertInstanceOf(Terms::class, $subAggregation);
                    foreach ($subAggregation as $i => $bucket) {
                        $this->assertInstanceOf(Bucket::class, $bucket);
                        $this->assertEquals($resultBuckets[$i]['key'], $bucket->getKey());
                        $this->assertEquals($resultBuckets[$i]['key_as_string'], $bucket->getKeyAsString());
                        $this->assertEquals($resultBuckets[$i]['doc_count'], $bucket->getDocCount());
                    }
                } elseif ('price_min' == $subName) {
                    $this->assertInstanceOf(SingleValue::class, $subAggregation);
                    $this->assertEquals(1000000, $subAggregation->getValue());
                }
            }
        }
    }

    private function getSearchResults(array $result, DocumentParserInterface $documentParser)
    {
        return new SearchResults($result, $documentParser);
    }

    private function getDocumentParser()
    {
        return $this
            ->getMockBuilder(DocumentParserInterface::class)
            ->getMock()
        ;
    }
}
