<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClient;
use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClientBuilder;
use AppBundle\Import\Adapter\Sothebys\DataSync\RequestBuilder;
use GuzzleHttp\Psr7\Response;

class DataSyncClientBuilderTest extends \PHPUnit_Framework_TestCase
{
    public function testBuild()
    {
        $dataSyncClient = DataSyncClientBuilder::build(
            [
                'signature' => '123456',
                'oauth' => [
                    'token_url' => 'okta',
                    'client_id' => 'okta_id',
                    'client_secret' => 'okta_secret',
                    'scope' => 'datasync',
                ],
            ],
            [Middleware::class, 'signature'],
            [Middleware::class, 'responseParser'],
            [Middleware::class, 'requestBuilder'],
            function ($compiledConfigs) {
                $this->assertEquals(
                    [
                        'api_endpoint' => 'https://stg.api.realogyfg.com/datasync/',
                        'signature' => '123456',
                        'oauth' => [
                            'token_url' => 'okta',
                            'client_id' => 'okta_id',
                            'client_secret' => 'okta_secret',
                            'scope' => 'datasync',
                        ],
                    ],
                    $compiledConfigs
                );

                return function () {
                };
            }
        );
        $introspection = Middleware::$introspection;

        $this->assertInstanceOf(DataSyncClient::class, $dataSyncClient);

        $this->assertEquals('123456', $introspection['signature']);
        $this->assertEquals(
            (object) [
                'a' => 1,
                'b' => 'c',
            ],
            $introspection['response_parser'](new Response(200, [], '{"a":1,"b":"c"}'))
        );
        $this->assertInstanceOf(RequestBuilder::class, $introspection['request_builder']);

        $refl = new \ReflectionObject($introspection['request_builder']);
        $baseUri = $refl->getProperty('baseUri');
        $baseUri->setAccessible(true);

        $this->assertEquals(
            'https://stg.api.realogyfg.com/datasync/',
            (string) $baseUri->getValue($introspection['request_builder'])
        );
    }
}

class Middleware
{
    public static $introspection;

    public static function signature($signature)
    {
        self::$introspection['signature'] = $signature;

        return function () {
        };
    }

    public static function responseParser($parser)
    {
        self::$introspection['response_parser'] = $parser;

        return function () {
        };
    }

    public static function requestBuilder($requestBuilder)
    {
        self::$introspection['request_builder'] = $requestBuilder;

        return function () {
        };
    }
}
