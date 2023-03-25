<?php

namespace AppBundle\Import\User;

use Predis\Client;

class RedisSourceRefIdMap
{
    const TTL = 10 * 60 * 60;
    /**
     * @var Client
     */
    private $client;
    /**
     * @var string
     */
    private $name;
    /**
     * @var bool
     */
    private $initialized = false;

    /**
     * RedisSourceRefIdMap constructor.
     *
     * @param Client $client
     */
    public function __construct($name, Client $client)
    {
        $this->name = $name;
        $this->client = $client;
    }

    public function set($sourceRef, $id)
    {
        $this->initialize();
        $this->client->hset($this->name, $sourceRef, $id);
    }

    public function get($sourceRef)
    {
        $this->initialize();

        return $this->client->hget($this->name, $sourceRef);
    }

    private function initialize()
    {
        if (true === $this->initialized) {
            return;
        }

        if (!$this->client->exists($this->name)) {
            $this->client->expire($this->name, self::TTL);
        }

        $this->initialized = true;
    }
}
