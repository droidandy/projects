<?php

namespace AppBundle\Import\Adapter\Realogy;

use AppBundle\Import\Adapter\Realogy\Command\CommandInterface;
use GuzzleHttp\Psr7;

class RequestBuilder
{
    private $baseUri;

    public function __construct($baseUri)
    {
        $this->baseUri = new Psr7\Uri($baseUri);
    }

    public function __invoke(CommandInterface $command, $args)
    {
        return $this->buildRequest($command, $args);
    }

    private function buildRequest(CommandInterface $command, $args)
    {
        $uri = $this->buildUri($command, $args);

        return new Psr7\Request($command::HTTP_METHOD, $uri);
    }

    private function buildUri(CommandInterface $command, $args)
    {
        if (isset($args['next_link'])) {
            $uri = $this->buildUriFromNextLink($args['next_link']);
        } else {
            $uri = $this->buildUriFromCommand($command, $args);
        }

        return Psr7\UriResolver::resolve($this->baseUri, $uri);
    }

    private function buildUriFromNextLink($nextLink)
    {
        return new Psr7\Uri($nextLink);
    }

    private function buildUriFromCommand(CommandInterface $command, $args)
    {
        $path = $command->getPath();

        $pathParams = $queryParams = $missingKeys = [];
        foreach ($command->getPathParams() as $key) {
            if (isset($args[$key])) {
                $pathParams['{'.$key.'}'] = $args[$key];
            } else {
                $missingKeys[] = $key;
            }
        }
        foreach ($command->getQueryParams() as $key) {
            if (isset($args[$key])) {
                $queryParams[$key] = $args[$key];
            }
        }

        if ($missingKeys) {
            throw new \InvalidArgumentException(sprintf('Keys missing %s', implode(',', $missingKeys)));
        }

        if ($pathParams) {
            $path = strtr($path, $pathParams);
        }

        if ($queryParams) {
            $path .= '?'.Psr7\build_query($queryParams);
        }

        return new Psr7\Uri($path);
    }
}
