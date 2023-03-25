<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\CommandInterface;
use AppBundle\Import\Adapter\Sothebys\DataSync\RequestBuilder;
use Psr\Http\Message\RequestInterface;

class RequestBuilderTest extends \PHPUnit_Framework_TestCase
{
    private $requestBuilder;

    protected function setUp()
    {
        $this->requestBuilder = new RequestBuilder('https://stg.api.realogyfg.com/datasync/');
    }

    public function testBuildFromCommand()
    {
        $requestBuilder = $this->requestBuilder;

        $request = $requestBuilder(new ApiCommand(), ['id' => 1, 'countryCode' => 'US']);

        $this->assertInstanceOf(RequestInterface::class, $request);
        $this->assertEquals('GET', $request->getMethod());
        $this->assertEquals(
            'https://stg.api.realogyfg.com/datasync/api_command/1?countryCode=US',
            (string) $request->getUri()
        );
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage Keys missing id
     */
    public function testBuildFromCommandFailureOnMissingPathParam()
    {
        $requestBuilder = $this->requestBuilder;

        $requestBuilder(new ApiCommand(), ['countryCode' => 'US']);
    }

    public function testBuildFromNextLink()
    {
        $requestBuilder = $this->requestBuilder;

        $request = $requestBuilder(
            new ApiCommand(),
            [
                'id' => 1,
                'countryCode' => 'US',
                'next_link' => 'api_command/1?cursor=10000&countryCode=US',
            ]
        );

        $this->assertInstanceOf(RequestInterface::class, $request);
        $this->assertEquals('GET', $request->getMethod());
        $this->assertEquals(
            'https://stg.api.realogyfg.com/datasync/api_command/1?cursor=10000&countryCode=US',
            (string) $request->getUri()
        );
    }
}

class ApiCommand implements CommandInterface
{
    public function getPath()
    {
        return 'api_command/{id}';
    }

    public function getPathParams()
    {
        return ['id'];
    }

    public function getQueryParams()
    {
        return ['limit', 'countryCode'];
    }
}
