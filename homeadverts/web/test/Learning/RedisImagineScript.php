<?php

namespace Learning;

use Predis\Client;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class RedisImagineScript extends KernelTestCase
{
    /**
     * @var Client
     */
    private $redis;

    protected function setUp()
    {
        self::bootKernel();

        $this->redis = static::$kernel->getContainer()
            ->get('snc_redis.default')
        ;
    }

    public function testChangePrefixes()
    {
        $keys = $this->redis->keys('*liip_imagine_resolver_cache.Liip\\\\ImagineBundle\\\\Imagine\\\\Cache\\\\Resolver\\\\ProxyResolver.gallery_thumb_r*');
        echo 'Total amount of keys = '.count($keys)."\n";
        foreach ($keys as $key) {
            echo 'Key '.$key."\n";
            $value = unserialize($this->redis->get($key));
            echo 'Value '.$value."\n";
            $value = str_replace('properties-homeadverts-com/', '', $value);
            echo 'New value '.$value."\n";
            $value = serialize($value);
            $this->redis->set($key, $value);
        }
    }
}
