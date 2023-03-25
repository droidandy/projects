<?php

namespace Test\AppBundle\Search;

use AppBundle\Search\FacetParser;

class FacetParserTest extends \PHPUnit_Framework_TestCase
{
    public function testParsing()
    {
        $parser = new FacetParser();
        $facets = 'detatched/2-bed/4-bath/from-100000';

        $this->assertSame(
            array(
                'type' => 'detatched',
                'bedrooms' => '2',
                'bathrooms' => '5',
            ),
            $parser->parse('detatched/2-bed/5-bath')
        );

        // dont allow a facet twice
        $this->assertFalse($parser->parse('detatched/2-bed/5-bed/3-bathroom'));
        $this->assertFalse($parser->parse('detatched/2-bed/orange/3-bathroom'));
    }

    public function testBuilding()
    {
        $parser = new FacetParser();
        $args = array(
            'type' => 'detatched',
            'bedrooms' => '2',
            'bathrooms' => '5',
        );
        $this->assertSame('detatched/2-bed/5-bath', $parser->build($args));

        $args = array(
            'type' => 'detatched',
            'bedrooms' => '2',
            'bathrooms' => '5',
            'jeff' => 1,
        );
        $this->assertFalse($parser->build($args));
    }
}
