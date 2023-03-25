<?php

namespace Test\AppBundle\Elastic\Integration\Collection;

use AppBundle\Elastic\Integration\Collection\SuggestionResults;
use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;

class SuggestionResultsTest extends \PHPUnit_Framework_TestCase
{
    public function testTraversability()
    {
        $suggestResult = $this->getSuggestResultSubset();

        $objectParser = $this->getObjectParser();
        $objectParser
            ->expects($this->exactly(3))
            ->method('parse')
            ->willReturnCallback(function ($doc) {
                $obj = new \stdClass();
                $obj->text = $doc['text'];
                $obj->suggest = $doc['suggest'];

                return $obj;
            })
        ;

        $suggestResults = $this->getSuggestCollection($suggestResult, $objectParser);

        $this->assertCount(1, $suggestResults);

        $suggestion = $suggestResults['field_suggest'];
        $this->assertEquals('field_suggest', $suggestion->getName());
        $this->assertEquals('Suggest term', $suggestion->getPrefix());
        $this->assertCount(3, $suggestion);
        foreach ($suggestion as $i => $item) {
            $this->assertEquals($suggestResult['field_suggest'][0]['options'][$i]['text'], $item->text);
            $this->assertEquals($suggestResult['field_suggest'][0]['options'][$i]['suggest'], $item->suggest);
        }
        //check no excessive parsing applied
        $suggestion->rewind();
        $this->assertEquals('Suggest term for Alice', $suggestion->current()->text);
        $suggestion->next();
        $this->assertEquals('Suggest term for Bob', $suggestion->current()->text);
        $suggestion->next();
        $this->assertEquals('Suggest term for Charlie', $suggestion->current()->text);
        $suggestion->next();
    }

    private function getSuggestCollection($suggestResult, $objectParser)
    {
        return new SuggestionResults($suggestResult, $objectParser);
    }

    private function getObjectParser()
    {
        return $this->getMockBuilder(DocumentParserInterface::class)
            ->getMock()
        ;
    }

    private function getSuggestResultSubset()
    {
        return [
            'field_suggest' => [
                [
                    'text' => 'Suggest term',
                    'options' => [
                        [
                            'text' => 'Suggest term for Alice',
                            'suggest' => ['Suggest term for Alice', 'Not a suggest term for Alice'],
                        ],
                        [
                            'text' => 'Suggest term for Bob',
                            'suggest' => ['Suggest term for Bob', 'Not a suggest term for Bob'],
                        ],
                        [
                            'text' => 'Suggest term for Charlie',
                            'suggest' => ['Suggest term for Charlie', 'Not a suggest term for Charlie'],
                        ],
                    ],
                ],
            ],
        ];
    }
}
