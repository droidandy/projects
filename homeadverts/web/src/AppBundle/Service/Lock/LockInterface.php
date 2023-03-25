<?php

namespace AppBundle\Service\Lock;

interface LockInterface
{
    public function executeInLockOrThrow(string $lockName, int $lockTimeout, int $waitTimeout, callable $fn);

    public function executeInLock(
        string $lockName,
        int $lockTimeout,
        int $waitTimeout = null,
        callable $fn,
        callable $onFailureCb = null
    );

    public function acquireLock(string $lockName, int $lockTimeout, int $waitTimeout = null);

    public function releaseLock(string $lockName, string $lockValue): bool;

    public function extendLock(
        string $lockName,
        string $lockValue,
        int $ttlThreshold,
        int $ttlToAdd
    ): bool;
}
