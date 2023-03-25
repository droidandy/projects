<?php

namespace AppBundle\Import\Adapter\Realogy;

class HandlerStack
{
    private $handlers = [];

    public function __construct(callable $httpHandler)
    {
        $this->handlers[] = $httpHandler;
    }

    public function resolve()
    {
        $handler = $this->handlers[0];

        foreach (array_slice($this->handlers, 1) as $handlerFactory) {
            $handler = $handlerFactory($handler);
        }

        return $handler;
    }

    public function push(callable $handlerFactory)
    {
        array_push($this->handlers, $handlerFactory);
    }

    public function __invoke(...$args)
    {
        $handler = $this->resolve();

        return $handler(...$args);
    }
}
