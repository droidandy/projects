<?php

namespace Test\AppBundle\Elastic\Integration\Collection;

use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;
use AppBundle\Elastic\Integration\Collection\SearchResults;

class SearchCollectionTest extends \PHPUnit_Framework_TestCase
{
    public function testTraversabilitySubset()
    {
        $searchResult = $this->getResponseSubset();
        $documentParser = $this->getDocumentParser();
        $searchCollection = $this->getSearchCollection($searchResult, $documentParser);

        $documentParser
            ->expects($this->exactly(3))
            ->method('parse')
            ->willReturnCallback(function ($el) {
                $class = new \stdClass();
                $class->prop1 = $el['prop1'];
                $class->prop2 = $el['prop2'];

                return $class;
            })
        ;

        $this->assertEquals(5, $searchCollection->getTotal());
        $this->assertEquals(3, $searchCollection->count());
        foreach ($searchCollection as $i => $item) {
            $this->assertInstanceOf(\stdClass::class, $item);
            $this->assertEquals($searchResult['hits']['hits'][$i]['prop1'], $item->prop1);
            $this->assertEquals($searchResult['hits']['hits'][$i]['prop2'], $item->prop2);
        }
        // Test that subsequent requests to parsed items do not trgger reparsing
        $searchCollection->rewind();
        $this->assertEquals('val11', $searchCollection->current()->prop1);
        $searchCollection->next();
        $this->assertEquals('val12', $searchCollection->current()->prop1);
        $searchCollection->next();
        $this->assertEquals('val13', $searchCollection->current()->prop1);
        $searchCollection->next();
    }

    public function testTraversabilitySet()
    {
        $searchResult = $this->getResponseSet();
        $documentParser = $this->getDocumentParser();
        $searchCollection = $this->getSearchCollection($searchResult, $documentParser);

        $documentParser
            ->expects($this->exactly(3))
            ->method('parse')
            ->willReturnCallback(function ($doc) {
                $obj = new \stdClass();
                $obj->prop1 = $doc['prop1'];
                $obj->prop2 = $doc['prop2'];

                return $obj;
            })
        ;

        $this->assertEquals(3, $searchCollection->getTotal());
        $this->assertCount(3, $searchCollection);
        foreach ($searchCollection as $i => $item) {
            $this->assertInstanceOf(\stdClass::class, $item);
            $this->assertEquals($searchResult['hits']['hits'][$i]['prop1'], $item->prop1);
            $this->assertEquals($searchResult['hits']['hits'][$i]['prop2'], $item->prop2);
        }
        // Test that subsequent requests to parsed items do not trgger reparsing
        $searchCollection->rewind();
        $this->assertEquals('val11', $searchCollection->current()->prop1);
        $searchCollection->next();
        $this->assertEquals('val12', $searchCollection->current()->prop1);
        $searchCollection->next();
        $this->assertEquals('val13', $searchCollection->current()->prop1);
        $searchCollection->next();
    }

    private function getSearchCollection(array $searchResult, DocumentParserInterface $documentParser)
    {
        return new SearchResults($searchResult, $documentParser);
    }

    private function getDocumentParser()
    {
        return $this
            ->getMockBuilder(DocumentParserInterface::class)
            ->getMock()
        ;
    }

    private function getResponseSubset()
    {
        return [
            'hits' => [
                'total' => 5,
                'hits' => [
                    [
                        'prop1' => 'val11',
                        'prop2' => 'val21',
                    ],
                    [
                        'prop1' => 'val12',
                        'prop2' => 'val22',
                    ],
                    [
                        'prop1' => 'val13',
                        'prop2' => 'val23',
                    ],
                ],
            ],
        ];
    }

    private function getResponseSet()
    {
        return [
            'hits' => [
                'total' => 3,
                'hits' => [
                    [
                        'prop1' => 'val11',
                        'prop2' => 'val21',
                    ],
                    [
                        'prop1' => 'val12',
                        'prop2' => 'val22',
                    ],
                    [
                        'prop1' => 'val13',
                        'prop2' => 'val23',
                    ],
                ],
            ],
        ];
    }
}
