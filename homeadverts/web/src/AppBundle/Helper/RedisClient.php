<?php

declare(strict_types=1);

namespace AppBundle\Helper;

use Resque;
use Resque_Redis;

class RedisClient
{
    /**
     * @var string
     */
    const REDIS_PORT = 6379;
    /**
     * @var string
     */
    private $host;
    /**
     * @var Resque_Redis
     */
    private $client;
    /**
     * @var Resque_Redis
     */
    private $prevClient;

    /**
     * @param string $host
     */
    public function __construct(string $host)
    {
        $this->host = $host;
    }

    /**
     * @param string $name
     * @param string $class
     * @param array  $args
     *
     * @return string|bool
     */
    public function enqueue(string $name, string $class, array $args)
    {
        $this->setBackend();
        $id = Resque::enqueue($name, $class, $args);
        $this->resetBackend();

        return $id;
    }

    /**
     * @param string $name
     *
     * @return string|bool
     */
    public function dequeue(string $name)
    {
        $this->setBackend();
        $counter = Resque::dequeue($name);
        $this->resetBackend();

        return $counter;
    }

    /**
     * Set backend for Resque but not change static state.
     */
    private function setBackend(): void
    {
        if (!$this->client) {
            $this->client = new Resque_Redis(sprintf(
                '%s:%s',
                $this->host,
                self::REDIS_PORT
            ));
        }

        $this->prevClient = Resque::$redis;
        Resque::$redis = $this->client;
    }

    /**
     * Reset static variable.
     */
    private function resetBackend(): void
    {
        Resque::$redis = $this->prevClient;
    }
}
