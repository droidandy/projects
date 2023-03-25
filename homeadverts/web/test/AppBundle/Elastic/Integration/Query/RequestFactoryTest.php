<?php

namespace Test\AppBundle\Elastic\Integration\Query;

use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;
use AppBundle\Elastic\Integration\Query\Request;
use AppBundle\Elastic\Integration\Query\RequestFactory;

class RequestFactoryTest extends \PHPUnit_Framework_TestCase
{
    public function testCreateRequest()
    {
        $requestFactory = $this->getRequestFactory($this->getDocumentParser());

        $request = $requestFactory->createRequest(['query' => []], 'test_type');

        $this->assertInstanceOf(Request::class, $request);
        $this->assertEquals(['query' => []], $request->getBody());

        $refl = new \ReflectionObject($request);

        $typeProp = $refl->getProperty('type');
        $typeProp->setAccessible(true);
        $this->assertEquals('test_type', $typeProp->getValue($request));

        $collProp = $refl->getProperty('collection');
        $collProp->setAccessible(true);
        $this->assertInstanceOf(SearchResults::class, $collProp->getValue($request)(['hits' => ['total' => 0, 'hits' => []]]));
    }

    private function getRequestFactory($objectParser)
    {
        return new RequestFactory($objectParser);
    }

    private function getDocumentParser()
    {
        return $this->getMockBuilder(DocumentParserInterface::class)
            ->getMock()
        ;
    }
}
