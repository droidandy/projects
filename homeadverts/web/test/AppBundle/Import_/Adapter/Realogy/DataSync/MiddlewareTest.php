<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Import\Adapter\Sothebys\DataSync\ApiException;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\CommandInterface;
use AppBundle\Import\Adapter\Sothebys\DataSync\Middleware;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Promise;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\RequestInterface;

class MiddlewareTest extends \PHPUnit_Framework_TestCase
{
    public function testRequestBuilder()
    {
        $handler = function ($request) {
            $this->assertInstanceOf(RequestInterface::class, $request);
        };
        $requestBuilder = function ($command, $args) {
            $this->assertInstanceOf(CommandInterface::class, $command);

            return $this->getRequest();
        };

        $requestBuilderHandler = Middleware::requestBuilder($requestBuilder);
        $requestBuilderHandler = $requestBuilderHandler($handler);

        $requestBuilderHandler($this->getCommand(), []);
    }

    public function testResponseParserSucces()
    {
        $handler = function ($request) {
            $this->assertInstanceOf(RequestInterface::class, $request);

            return Promise\promise_for(new Response(200, [], '{"a":1,"b":"string","c":null}'));
        };
        $responseParser = function ($response) {
            return json_decode($response->getBody());
        };

        $responseParserHandler = Middleware::responseParser($responseParser);
        $responseParserHandler = $responseParserHandler($handler);

        $this->assertEquals(
            (object) [
                'a' => 1,
                'b' => 'string',
                'c' => null,
            ],
            $responseParserHandler($this->getRequest())->wait(true)
        );
    }

    public function testResponseParserHttpFailure()
    {
        $handler = function ($request) {
            $this->assertInstanceOf(RequestInterface::class, $request);

            return Promise\rejection_for(
                new RequestException(
                    'error_message',
                    $request,
                    new Response(400, [], '{"a":1,"b":"string","c":null}')
                )
            );
        };
        $responseParser = function ($response) {
            return json_decode($response->getBody());
        };

        $responseParserHandler = Middleware::responseParser($responseParser);
        $responseParserHandler = $responseParserHandler($handler);

        $responseParserHandler($this->getRequest())
            ->otherwise(function ($reason) {
                $this->assertInstanceOf(ApiException::class, $reason);
                $this->assertEquals(
                    (object) [
                        'a' => 1,
                        'b' => 'string',
                        'c' => null,
                    ],
                    $reason->getParsedResponse()
                );
            })
            ->wait()
        ;
    }

    /**
     * @expectedException \Exception
     * @expectedExceptionMessage error_message
     */
    public function testResponseParserInternalFailure()
    {
        $handler = function ($request) {
            $this->assertInstanceOf(RequestInterface::class, $request);

            return Promise\rejection_for(new \Exception('error_message'));
        };
        $responseParser = function ($response) {
            return json_decode($response->getBody());
        };

        $responseParserHandler = Middleware::responseParser($responseParser);
        $responseParserHandler = $responseParserHandler($handler);

        $responseParserHandler($this->getRequest())->wait(true);
    }

    public function testSignature()
    {
        $handler = function ($request) {
            $this->assertInstanceOf(RequestInterface::class, $request);
            $this->assertEquals('signature_value', $request->getHeaderLine('Ocp-Apim-Subscription-Key'));
        };

        $request = new Request('get', 'uri');
        $this->assertFalse($request->hasHeader('Ocp-Apim-Subscription-Key'));

        $signatureHandler = Middleware::signature('signature_value');
        $signatureHandler = $signatureHandler($handler);

        $signatureHandler($request);
    }

    public function testResponseSaver()
    {
        $tmpDir = __DIR__.'/../../../../../../app/cache/test';
        try {
            $handler = function ($request) {
                return Promise\promise_for(new Response(200, [], '12345'));
            };

            $request = new Request('get', 'uri/path');

            $responseSaver = Middleware::responseSaver($tmpDir);

            $responseSaverHandler = $responseSaver($handler);
            $responseSaverHandler($request)->wait();

            $files = glob($tmpDir.'/datasync-response/*');

            $this->assertEquals('12345', file_get_contents($files[0]));
        } finally {
            foreach (glob($tmpDir.'/datasync-response/*') as $item) {
                unlink($item);
            }
            rmdir($tmpDir.'/datasync-response');
        }
    }

    private function getRequest()
    {
        return $this
            ->getMockBuilder(RequestInterface::class)
            ->getMock()
        ;
    }

    private function getCommand()
    {
        return $this
            ->getMockBuilder(CommandInterface::class)
            ->getMock()
        ;
    }
}
