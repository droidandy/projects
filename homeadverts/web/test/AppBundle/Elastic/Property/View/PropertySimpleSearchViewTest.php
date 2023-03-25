<?php

namespace AppBundle\Elastic\Property\View;

use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;
use AppBundle\Localisation\AddressTranslator;
use Symfony\Component\Routing\Router;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\RandomizeTrait;
use Test\Utils\Traits\UserTrait;

class PropertySimpleSearchViewTest extends \PHPUnit_Framework_TestCase
{
    use GoogleLocationTrait, RandomizeTrait, AddressTrait, UserTrait, PropertyTrait;

    public function testInvoke()
    {
        $addressTranslator = $this->getAddressTranslator();
        $addressTranslator
            ->expects($this->exactly(3))
            ->method('translate')
            ->willReturnArgument(0)
        ;
        $router = $this->getRouter();
        $router
            ->expects($this->exactly(6))
            ->method('generate')
            ->willReturnOnConsecutiveCalls(
                'directory_url1',
                'property_details_url1',
                'directory_url2',
                'property_details_url2',
                'directory_url3',
                'property_details_url3'
            )
        ;
        $view = new PropertySimpleSearchView($addressTranslator, $router);

        $results = [
            'hits' => [
                'total' => 10,
                'hits' => [
                    [1],
                    [2],
                    [3],
                ],
            ],
        ];

        $docParser = $this->getDocParser();
        $docParser
            ->expects($this->exactly(3))
            ->method('parse')
            ->withConsecutive(
                [[1]],
                [[2]],
                [[3]]
            )
            ->willReturnOnConsecutiveCalls(
                $this->getTestProperty(1, 'mls1', 'sourceRef1', 'sourceGuid1'),
                $this->getTestProperty(2, 'mls2', 'sourceRef2', 'sourceGuid2'),
                $this->getTestProperty(3, 'mls3', 'sourceRef3', 'sourceGuid3')
            )
        ;

        $searchResults = $this->getSearchResults($results, $docParser);

        $data = $view($searchResults);

        $this->assertEquals(10, $data['total']);
        $this->assertEquals(3, count($data['items']));
        foreach ([
            1 => [
                'id' => 1,
                'zip' => 'zip',
                'mls' => 'mls1',
                'ref' => 'sourceRef1',
                'guid' => 'sourceGuid1',
                'agent' => [
                    'details' => [
                        'name' => 'name',
                        'companyName' => 'company_name',
                        'phone' => '123456789',
                    ],
                    'url' => 'directory_url1',
                ],
                'address' => 'town_city state_county zip',
                'url' => 'property_details_url1',
            ],
            2 => [
                'id' => 2,
                'zip' => 'zip',
                'mls' => 'mls2',
                'ref' => 'sourceRef2',
                'guid' => 'sourceGuid2',
                'agent' => [
                    'details' => [
                        'name' => 'name',
                        'companyName' => 'company_name',
                        'phone' => '123456789',
                    ],
                    'url' => 'directory_url2',
                ],
                'address' => 'town_city state_county zip',
                'url' => 'property_details_url2',
            ],
            3 => [
                'id' => 3,
                'zip' => 'zip',
                'mls' => 'mls3',
                'ref' => 'sourceRef3',
                'guid' => 'sourceGuid3',
                'agent' => [
                    'details' => [
                        'name' => 'name',
                        'companyName' => 'company_name',
                        'phone' => '123456789',
                    ],
                    'url' => 'directory_url3',
                ],
                'address' => 'town_city state_county zip',
                'url' => 'property_details_url3',
            ],
         ] as $i => $item) {
            $this->assertEquals($item, $data['items'][$i]);
        }
    }

    private function getAddressTranslator()
    {
        return $this->getMockBuilder(AddressTranslator::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getRouter()
    {
        return $this->getMockBuilder(Router::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getSearchResults($result, $docParser)
    {
        return new SearchResults($result, $docParser);
    }

    private function getDocParser()
    {
        return $this->getMockBuilder(DocumentParserInterface::class)
            ->getMock()
        ;
    }

    private function getTestProperty($id, $mlsRef, $sourceRef, $sourceGuid)
    {
        return $this->newProperty([
            'address' => [
                'street' => 'street',
                'apt_bldg' => 'apt_bldg',
                'town_city' => 'town_city',
                'state_county' => 'state_county',
                'country' => 'US',
                'zip' => 'zip',
            ],
            'user' => [
                'id' => 1,
                'name' => 'name',
                'company_name' => 'company_name',
                'phone' => '123456789',
            ],
            'id' => $id,
            'type' => PropertyTypes::DETACHED,
            'rental' => false,
            'mls_ref' => $mlsRef,
            'source_ref' => $sourceRef,
            'source_guid' => $sourceGuid,
        ]);
    }

    protected function doSetUp()
    {
    }

    protected function doTearDown()
    {
    }

    public function getEntityManager()
    {
    }

    public function getContainer()
    {
    }
}
