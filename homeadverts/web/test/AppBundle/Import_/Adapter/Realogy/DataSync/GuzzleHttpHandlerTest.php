<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Import\Adapter\Sothebys\DataSync\GuzzleHttpHandler;
use Doctrine\Common\Cache\ArrayCache;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use Monolog\Handler\TestHandler;
use Monolog\Logger;
use Psr\Http\Message\RequestInterface;
use GuzzleHttp\Promise;
use Psr\Http\Message\ResponseInterface;

class GuzzleHttpHandlerTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var TestHandler
     */
    private $testHandler;

    public function testConfigs()
    {
        $guzzleHttpHandler = $this->getGuzzleHttpHandler();

        $reflection = new \ReflectionClass($guzzleHttpHandler);
        $clientReflection = $reflection->getProperty('client');
        $clientReflection->setAccessible(true);

        $guzzleClient = $clientReflection->getValue($guzzleHttpHandler);
        $this->assertInstanceOf(Client::class, $guzzleClient);

        /** @var $handler */
        $handler = $guzzleClient->getConfig('handler');
        $handlerReflection = new \ReflectionClass($handler);
        $findByName = $handlerReflection->getMethod('findByName');
        $findByName->setAccessible(true);

        $findByName = $findByName->getClosure($handler);

        foreach (
            [
                 'oauth_onbefore',
                 'oauth_onfailure',
                 'retry',
                 'log',
             ] as $middlewareName
        ) {
            $middlewareIdx = $findByName($middlewareName);
            $this->assertInternalType('numeric', $middlewareIdx);
        }
    }

    public function testAuthorization()
    {
        $logger = $this->getLogger();
        $handlerCalls = 0;
        $guzzleHttpHandler = new GuzzleHttpHandler(
            [
                'oauth' => [
                    'token_url' => 'https://okta/token/url',
                    'client_id' => 'okta_id',
                    'client_secret' => 'okta_secret',
                    'scope' => 'https://btt.realogyfg.com/datasyncapi',
                    'cache' => $this->getCache(),
                    'cache_prefix' => 'ha_test',
                ],
                'logger' => $logger,
            ],
            function (RequestInterface $request) use (&$handlerCalls) {
                ++$handlerCalls;
                switch ((string) $request->getUri()) {
                    case 'https://okta/token/url':
                        $this->assertEquals('POST', $request->getMethod());
                        $this->assertEquals('Basic '.base64_encode('okta_id:okta_secret'), $request->getHeaderLine('authorization'));
                        $this->assertEquals('application/x-www-form-urlencoded', $request->getHeaderLine('content-type'));
                        $this->assertEquals(
                            'scope=https%3A%2F%2Fbtt.realogyfg.com%2Fdatasyncapi&grant_type=client_credentials',
                            $request->getBody()->__toString()
                        );

                        return Promise\promise_for(
                            new Response(
                                200,
                                [],
                                <<<OKTA_RESPONSE
    {"access_token":"random_token","token_type":"Bearer","expires_in":3600,"scope":"https://btt.realogyfg.com/datasyncapi"}
OKTA_RESPONSE
                            )
                        );
                    case 'https://stg.api.realogyfg.com/datasync/listings/active':
                        $this->assertEquals('Bearer random_token', $request->getHeaderLine('authorization'));

                        return Promise\promise_for(
                            new Response(
                                200,
                                [],
                                '[]'
                            )
                        );
                    default:
                        $this->fail('Unexpected argument exception');
                }
            }
        );

        $response = $guzzleHttpHandler(
            new Request('GET', 'https://stg.api.realogyfg.com/datasync/listings/active')
        )->wait(true);
        $this->assertInstanceOf(ResponseInterface::class, $response);
        $this->assertEquals(
            200,
            $response->getStatusCode()
        );
        $this->assertEquals(
            '[]',
            $response->getBody()
        );
        $this->assertEquals(2, $handlerCalls);

        $this->assertTrue($this->testHandler->hasInfoRecords());
        $this->assertTrue($this->testHandler->hasInfoThatMatches('#stg\.api\.realogyfg\.com.*"GET /datasync/listings/active HTTP/1.1" 200#'));
    }

    private function getGuzzleHttpHandler()
    {
        return new GuzzleHttpHandlerMock([
            'oauth' => [],
            'logger' => $this->getLogger(),
        ]);
    }

    private function getCache()
    {
        return new ArrayCache();
    }

    private function getLogger()
    {
        $this->testHandler = new TestHandler();

        return new Logger('mock', [$this->testHandler]);
    }
}

class GuzzleHttpHandlerMock extends GuzzleHttpHandler
{
    protected function buildOauthMiddleware($oauthConfigs, callable $httpHandler = null)
    {
        return new OAuthMiddlewareMock();
    }
}

class OAuthMiddlewareMock
{
    public function onBefore()
    {
        return function ($handler) {
            return function ($request) use ($handler) {
                return $handler($request);
            };
        };
    }

    public function onFailure($number)
    {
        return function ($handler) {
            return function ($request) use ($handler) {
                return $handler($request);
            };
        };
    }
}
