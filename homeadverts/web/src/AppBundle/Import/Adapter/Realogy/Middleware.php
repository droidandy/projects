<?php

namespace AppBundle\Import\Adapter\Realogy;

use AppBundle\Import\Adapter\Realogy\Command\CommandInterface;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\RequestInterface;
use GuzzleHttp\Promise;
use Psr\Http\Message\ResponseInterface;

class Middleware
{
    public static $internalHttpHandler = null;

    public static function requestBuilder(callable $requestBuilder)
    {
        return function (callable $handler) use ($requestBuilder) {
            return function (CommandInterface $command, $args) use ($requestBuilder, $handler) {
                return $handler($requestBuilder($command, $args));
            };
        };
    }

    public static function responseParser(callable $responseParser)
    {
        return function (callable $handler) use ($responseParser) {
            return function (RequestInterface $request) use ($responseParser, $handler) {
                return $handler($request)
                    ->then(
                        $responseParser,
                        function ($reason) use ($responseParser) {
                            if ($reason instanceof RequestException && $reason->getResponse()) {
                                return Promise\rejection_for(
                                    new ApiException(
                                        $responseParser($reason->getResponse()),
                                        $reason
                                    )
                                );
                            }

                            return Promise\rejection_for($reason);
                        }
                    )
                ;
            };
        };
    }

    public static function signature($signature)
    {
        return function (callable $handler) use ($signature) {
            return function (RequestInterface $request) use ($signature, $handler) {
                $request = $request->withHeader('Ocp-Apim-Subscription-Key', $signature);

                return $handler($request);
            };
        };
    }

    public static function httpHandler($compiledConfigs)
    {
        return new GuzzleHttpHandler($compiledConfigs, self::$internalHttpHandler);
    }

    public static function responseSaver($folder)
    {
        $saver = function (RequestInterface $request, ResponseInterface $response) use ($folder) {
            $body = $response->getBody();

            if ($body->isSeekable()) {
                $uri = str_replace('/', '_', $request->getUri()->getPath());
                $date = new \DateTime();
                file_put_contents($folder.'/'.$uri.'_'.$date->format('c'), (string) $response->getBody());
            }
        };

        return function (callable $handler) use ($saver) {
            return function (RequestInterface $request) use ($saver, $handler) {
                return $handler($request)
                    ->then(
                        function (ResponseInterface $response) use ($request, $saver) {
                            $saver($request, $response);

                            return $response;
                        },
                        function ($reason) use ($request, $saver) {
                            if ($reason instanceof RequestException && $reason->getResponse()) {
                                $saver($request, $reason->getResponse());
                            }

                            return Promise\rejection_for($reason);
                        }
                    )
                ;
            };
        };
    }
}
