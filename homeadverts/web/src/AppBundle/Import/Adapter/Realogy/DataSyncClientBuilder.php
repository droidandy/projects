<?php

namespace AppBundle\Import\Adapter\Realogy;

use AppBundle\Import\Adapter\Realogy\Command\CommandInterface;
use Psr\Http\Message\ResponseInterface;

class DataSyncClientBuilder
{
    private static $configs = [
        'api_endpoint' => [
            'default' => 'https://stg.api.realogyfg.com/datasync/',
        ],
        'signature' => [
            'required' => true,
        ],
        'oauth' => [
            'required' => true,
        ],
    ];

    public static function build(
        array $configs = [],
        callable $signatureMiddleware,
        callable $responseParser,
        callable $requestBuilder,
        callable $httpHandler = null,
        callable $responseSaver = null
    ) {
        $compiledConfigs = $malformedConfigs = [];
        foreach (self::$configs as $key => $configDef) {
            if (!isset($configs[$key])) {
                if (isset($configDef['default'])) {
                    $compiledConfigs[$key] = $configDef['default'];
                } else {
                    $malformedConfigs[$key] = 'Missing required value';
                }
            } else {
                $compiledConfigs[$key] = $configs[$key];
            }
        }

        if (!empty($malformedConfigs)) {
            throw new \InvalidArgumentException(json_encode($malformedConfigs));
        }

        $handlerStack = new HandlerStack(
            $httpHandler
                ? $httpHandler($compiledConfigs)
                : self::getHttpHandler($compiledConfigs)
        );

        if ($responseSaver) {
            $handlerStack->push($responseSaver($configs['response_saver_folder']));
        }

        $handlerStack->push($signatureMiddleware($compiledConfigs['signature']));
        $handlerStack->push($responseParser(function (ResponseInterface $response) {
            return json_decode($response->getBody());
        }));
        $handlerStack->push($requestBuilder(new RequestBuilder($compiledConfigs['api_endpoint'])));

        return new DataSyncClient(
            $handlerStack,
            function (DataSyncClient $dataSyncClient, CommandInterface $command, $args = []) {
                return new Paginator($dataSyncClient, $command, $args);
            }
        );
    }

    private static function getHttpHandler($compiledConfigs)
    {
        return new GuzzleHttpHandler($compiledConfigs);
    }
}
