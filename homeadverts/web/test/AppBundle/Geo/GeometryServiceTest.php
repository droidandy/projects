<?php

namespace Test\AppBundle\Geo;

use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Location\Location;
use AppBundle\Geo\GeometryService;
use Guzzle\Http\Client;
use Guzzle\Http\Exception\BadResponseException;
use Guzzle\Http\Message\Request;
use Guzzle\Http\Message\Response;

class GeometryServiceTest extends \PHPUnit_Framework_TestCase
{
    private $nyCountyGeom;

    protected function setUp()
    {
        $this->nyCountyGeom = json_decode(file_get_contents(__DIR__.'/../../fixtures/geo/ny_county.geojson'), true);
    }

    public function testGetGeometry()
    {
        $response = $this->getResponse();
        $response->expects($this->once())
            ->method('json')
            ->willReturn([
                'name' => 'New York County',
                'geom' => $this->nyCountyGeom,
            ])
        ;
        $response->expects($this->never())
            ->method('getStatusCode')
        ;
        $request = $this->getRequest();
        $request
            ->expects($this->once())
            ->method('send')
            ->willReturn($response)
        ;
        $httpClient = $this->getHttpClient();
        $httpClient
            ->expects($this->once())
            ->method('get')
            ->with('url/geometry', null, [
                'query' => [
                    'location' => [
                        'name' => 'New York County',
                        'type' => 'administrative_area_level_2',
                        'hierarchy' => [
                            [
                                'name' => 'US',
                                'type' => 'country',
                            ],
                        ],
                        'coords' => [
                            'lat' => 40.7830603,
                            'long' => -73.9712488,
                        ],
                    ],
                ],
            ])
            ->willReturn($request)
        ;

        $geometryService = $this->getGeometryService($httpClient);
        $geometryGeoJSON = $geometryService->getGeometry($this->getNewYorkCountyLocation('New York County', 40.7830603, -73.9712488));

        $this->assertEquals($this->nyCountyGeom, $geometryGeoJSON);
    }

    public function testGetGeometryNull()
    {
        $response = $this->getResponse();
        $response->expects($this->never())
            ->method('json')
            ->willReturn([])
        ;
        $response->expects($this->once())
            ->method('getStatusCode')
            ->willReturn(404)
        ;
        $exception = $this->getException();
        $exception
            ->expects($this->once())
            ->method('getResponse')
            ->willReturn($response)
        ;
        $request = $this->getRequest();
        $request
            ->expects($this->once())
            ->method('send')
            ->willThrowException($exception)
        ;
        $httpClient = $this->getHttpClient();
        $httpClient
            ->expects($this->once())
            ->method('get')
            ->with('url/geometry', null, [
                'query' => [
                    'location' => [
                        'name' => 'Ney Yowk County',
                        'type' => 'administrative_area_level_2',
                        'hierarchy' => [
                            [
                                'name' => 'US',
                                'type' => 'country',
                            ],
                        ],
                        'coords' => [
                            'lat' => 140.7830603,
                            'long' => -373.9712488,
                        ],
                    ],
                ],
            ])
            ->willReturn($request)
        ;

        $geometryService = $this->getGeometryService($httpClient);
        $geometryGeoJSON = $geometryService->getGeometry($this->getNewYorkCountyLocation('Ney Yowk County', 140.7830603, -373.9712488));

        $this->assertEquals(null, $geometryGeoJSON);
    }

    private function getGeometryService($httpClient)
    {
        $geometryService = new GeometryService($httpClient, 'url');

        return $geometryService;
    }

    private function getHttpClient()
    {
        return $this->getMockBuilder(Client::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getRequest()
    {
        return $this->getMockBuilder(Request::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getResponse()
    {
        return $this->getMockBuilder(Response::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getException()
    {
        return $this->getMockBuilder(BadResponseException::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getNewYorkCountyLocation($name, $lat, $long)
    {
        $coords = new Coords($lat, $long);
        $location = new Location(
            'c4ef912e6c5e94e2dd4d7ec1fbe63bfc78ddcdee',
            $coords,
            12359.97,
            'US',
            ['administrative_area_level_2', 'political'],
            null,
            null,
            'New York County, NY, United States',
            'New York County, NY, USA',
            'new-york-county-ny-united-states',
            'en',
            [$name, 'New York', 'United States'],
            'ChIJOwE7_GTtwokRFq0uOwLSE9g'
        );

        return $location;
    }
}
