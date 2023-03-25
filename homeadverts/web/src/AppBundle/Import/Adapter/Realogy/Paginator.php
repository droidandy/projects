<?php

namespace AppBundle\Import\Adapter\Realogy;

use AppBundle\Import\Adapter\Realogy\Command\CommandInterface;
use GuzzleHttp\Promise;

class Paginator implements \IteratorAggregate
{
    private $client;

    private $command;

    private $args;

    public static function create(DataSyncClient $client, CommandInterface $command, array $args = [])
    {
        return new self($client, $command, $args);
    }

    /**
     * Paginator constructor.
     *
     * @param $client
     */
    public function __construct(DataSyncClient $client, CommandInterface $command, array $args = [])
    {
        $this->client = $client;
        $this->command = $command;
        $this->args = $args;
    }

    public function each(callable $handleResult)
    {
        return Promise\coroutine(function () use ($handleResult) {
            $nextLink = null;
            do {
                $args = $this->resolveArgs($nextLink);
                $result = (yield $this->executeCommand($args));
                $retVal = $handleResult($result);
                if (null !== $retVal) {
                    yield Promise\promise_for($retVal);
                }

                $nextLink = $this->determineNextLink($result);
            } while ($nextLink);
        });
    }

    public function getIterator()
    {
        $nextLink = null;
        do {
            $args = $this->resolveArgs($nextLink);
            yield $result = $this->executeCommand($args)->wait(true);

            $nextLink = $this->determineNextLink($result);
        } while ($nextLink);
    }

    private function executeCommand(array $args = [])
    {
        return $this->client->executeCommand($this->command, $args);
    }

    private function resolveArgs($nextLink)
    {
        if ($nextLink) {
            return array_merge($this->args, [
                'next_link' => $nextLink,
            ]);
        }

        return $this->args;
    }

    private function determineNextLink($result)
    {
        if (!empty($result->nextLink)) {
            return $result->nextLink;
        }

        return null;
    }
}
