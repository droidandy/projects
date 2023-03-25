<?php

namespace AppBundle\Service\Lock;

use AppBundle\Helper\SprintfLoggerTrait;
use Predis\ClientInterface;
use Predis\PredisException;
use Psr\Log\LoggerInterface;

class RedisLock implements LockInterface
{
    use SprintfLoggerTrait;
    /**
     * @var LockValueGenerator
     */
    private $lockValueGenerator;
    /**
     * @var ClientInterface
     */
    private $client;
    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(LockValueGenerator $lockValueGenerator, ClientInterface $client, LoggerInterface $logger)
    {
        $this->lockValueGenerator = $lockValueGenerator;
        $this->client = $client;
        $this->logger = $logger;
    }

    public function executeInLockOrThrow(string $lockName, int $lockTimeout, int $waitTimeout = null, callable $fn)
    {
        return $this->executeInLock($lockName, $lockTimeout, $waitTimeout, $fn, function ($lockName) {
            throw new \RuntimeException(sprintf('Failed to acquire the lock %s', $lockName));
        });
    }

    public function executeInLock(
        string $lockName,
        int $lockTimeout,
        int $waitTimeout = null,
        callable $fn,
        callable $onFailureCb = null
    ) {
        $lockValue = $this->acquireLock($lockName, $lockTimeout, $waitTimeout);
        if (false === $lockValue) {
            return $onFailureCb
                ? $onFailureCb($lockName)
                : false
            ;
        }

        try {
            return $fn($lockName, $lockValue);
        } finally {
            $this->releaseLock($lockName, $lockValue);
        }
    }

    /**
     * @param string   $lockName
     * @param int      $lockTimeout
     * @param int|null $waitTimeout
     *
     * @return bool|string
     */
    public function acquireLock(string $lockName, int $lockTimeout, int $waitTimeout = null)
    {
        $uniqueValue = $this->getUniqueValue();
        if ($waitTimeout) {
            $waitEndTime = time() + $waitTimeout;
            $conditionCb = function () use ($waitEndTime) {
                if (time() <= $waitEndTime) {
                    usleep(10000);

                    return true;
                }

                return false;
            };
        } else {
            $conditionCb = function () {
                return false;
            };
        }

        do {
            $status = $this->client->set($lockName, $uniqueValue, 'EX', $lockTimeout, 'NX');
        } while (null === $status && $conditionCb());

        return null !== $status
            ? $uniqueValue
            : false
        ;
    }

    public function releaseLock(string $lockName, string $lockValue): bool
    {
        return $this->executeWithRetrials(
            function () use ($lockName, $lockValue) {
                $this->client->eval(
                    <<<LUA
if redis.call("get",KEYS[1]) == ARGV[1]
then
    return redis.call("del",KEYS[1])
else
    return 0
end
LUA
                    ,
                    1,
                    $lockName,
                    $lockValue
                );

                return true;
            },
            'Unable to release the lock %s',
            $lockName
        );
    }

    public function extendLock(
        string $lockName,
        string $lockValue,
        int $ttlThreshold,
        int $ttlToAdd
    ): bool {
        return $this->executeWithRetrials(
            function () use ($lockName, $lockValue, $ttlThreshold, $ttlToAdd) {
                return (bool) $this->client->eval(
                    <<<LUA
if redis.call("get",KEYS[1]) == ARGV[1]
then
    local ttl = tonumber(redis.call("ttl",KEYS[1]))
    if ttl >= 0 and ttl <= tonumber(ARGV[2])
    then
        return redis.call("expire",KEYS[1],ttl + tonumber(ARGV[3]))
    else
        return 0
    end
else
    return 0
end
LUA
                    ,
                    1,
                    $lockName,
                    $lockValue,
                    $ttlThreshold,
                    $ttlToAdd
                );
            },
            'Unable to extend the lock %s',
            $lockName
        );
    }

    private function executeWithRetrials(callable $fn, ...$failMsg)
    {
        for ($i = 0; $i < 3; ++$i) {
            try {
                return $fn();
            } catch (PredisException $e) {
                $this->error($e->getMessage());
                usleep(10000);
            }
        }

        $this->error(...$failMsg);

        return false;
    }

    private function getUniqueValue(): string
    {
        return $this->lockValueGenerator->getUniqueValue();
    }
}
