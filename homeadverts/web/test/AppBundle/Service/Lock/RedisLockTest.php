<?php

namespace Test\AppBundle\Service\Lock;

use AppBundle\Service\Lock\LockValueGenerator;
use AppBundle\Service\Lock\RedisLock;
use Predis\ClientInterface;
use Predis\Response\ServerException;
use Psr\Log\LoggerInterface;

class RedisLockTest extends \PHPUnit_Framework_TestCase
{
    const LOCK_NAME = 'lock_name';
    const LOCK_UNIQUE_VALUE = 'lock_unique_value';

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
    /**
     * @var RedisLock
     */
    private $lock;

    protected function setUp()
    {
        $this->lockValueGenerator = $this
            ->getMockBuilder(LockValueGenerator::class)
            ->getMock()
        ;
        $this->client = $this
            ->getMockBuilder(ClientInterface::class)
            ->setMethods(['set', 'eval'])
            ->getMockForAbstractClass()
        ;
        $this->logger = $this
            ->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;

        $this->lock = new RedisLock(
            $this->lockValueGenerator,
            $this->client,
            $this->logger
        );
    }


    public function testExecuteInLockFullSuccessfulScenario()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $lockValueGenerator */
        $lockValueGenerator = $this->lockValueGenerator;
        $lockValueGenerator
            ->expects($this->once())
            ->method('getUniqueValue')
            ->willReturn(self::LOCK_UNIQUE_VALUE)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $client
            ->expects($this->once())
            ->method('set')
            ->with(
                self::LOCK_NAME,
                self::LOCK_UNIQUE_VALUE,
                'EX',
                600,
                'NX'
            )
            ->willReturn('OK')
        ;
        $client
            ->expects($this->exactly(2))
            ->method('eval')
            ->withConsecutive(
                [
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
                    self::LOCK_NAME,
                    self::LOCK_UNIQUE_VALUE,
                    300,
                    60
                ],
                [
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
                    self::LOCK_NAME,
                    self::LOCK_UNIQUE_VALUE
                ]
            )
            ->willReturnOnConsecutiveCalls(1, 1)
        ;

        $this->assertEquals(
            'executed_in_lock',
            $this->lock->executeInLock(
                self::LOCK_NAME,
                600,
                null,
                function ($lockName, $lockValue) {
                    $this->lock->extendLock($lockName, $lockValue, 300, 60);

                    return 'executed_in_lock';
                }
            )
        );
    }

    public function testReleaseLock()
    {
        $this->doTestReleaseLock(
            1,
            function () {
                return 1;
            },
            true
        );
    }

    public function testReleaseLockOnRetrials()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(2))
            ->method('error')
            ->with('Connection went bad')
        ;
        $retrialCount = 0;

        $this->doTestReleaseLock(
            3,
            function () use (&$retrialCount) {
                if ($retrialCount < 2) {
                    ++$retrialCount;

                    throw new ServerException('Connection went bad');
                }

                return 1;
            },
            true
        );
    }

    public function testReleaseLockFailureAfterRetrials()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(4))
            ->method('error')
            ->withConsecutive(
                ['Connection went bad'],
                ['Connection went bad'],
                ['Connection went bad'],
                [sprintf('Unable to release the lock %s', self::LOCK_NAME)]
            )
        ;
        $retrialCount = 0;

        $this->doTestReleaseLock(
            3,
            function () use (&$retrialCount) {
                throw new ServerException('Connection went bad');
            },
            false
        );
    }

    private function doTestReleaseLock(int $nbOfIterations, callable $returnCb, bool $expectedValue)
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $client
            ->expects($this->exactly($nbOfIterations))
            ->method('eval')
            ->with(
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
                self::LOCK_NAME,
                self::LOCK_UNIQUE_VALUE
            )
            ->willReturnCallback($returnCb)
        ;

        $this->assertEquals(
            $expectedValue,
            $this->lock->releaseLock(self::LOCK_NAME, self::LOCK_UNIQUE_VALUE)
        );
    }

    public function testExtendLockSuccess()
    {
        $this->doTestExtendLock(
            1,
            function () {
                return 1;
            },
            true
        );
    }

    public function testExtendLockSuccessOnRetrials()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(2))
            ->method('error')
            ->with('Connection went bad')
        ;
        $retrialCount = 0;

        $this->doTestExtendLock(
            3,
            function () use (&$retrialCount) {
                if ($retrialCount < 2) {
                    ++$retrialCount;

                    throw new ServerException('Connection went bad');
                }

                return 1;
            },
            true
        );
    }

    public function testExtendLockFailureAfterRetrials()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(4))
            ->method('error')
            ->withConsecutive(
                ['Connection went bad'],
                ['Connection went bad'],
                ['Connection went bad'],
                [sprintf('Unable to extend the lock %s', self::LOCK_NAME)]
            )
        ;
        $retrialCount = 0;

        $this->doTestExtendLock(
            3,
            function () use (&$retrialCount) {
                throw new ServerException('Connection went bad');
            },
            false
        );
    }

    public function testExtendLockFailure()
    {
        $this->doTestExtendLock(
            1,
            function () {
                return 0;
            },
            false
        );
    }

    private function doTestExtendLock(int $nbOfIterations, callable $returnCb, bool $expectedValue)
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $client
            ->expects($this->exactly($nbOfIterations))
            ->method('eval')
            ->with(
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
                self::LOCK_NAME,
                self::LOCK_UNIQUE_VALUE,
                300,
                60
            )
            ->willReturnCallback($returnCb)
        ;

        $this->assertEquals(
            $expectedValue,
            $this->lock->extendLock(self::LOCK_NAME, self::LOCK_UNIQUE_VALUE, 300, 60)
        );
    }

    public function testExecuteInLockOrThrow()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $lockValueGenerator */
        $lockValueGenerator = $this->lockValueGenerator;
        $lockValueGenerator
            ->expects($this->once())
            ->method('getUniqueValue')
            ->willReturn(self::LOCK_UNIQUE_VALUE)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $client
            ->expects($this->once())
            ->method('set')
            ->with(
                self::LOCK_NAME,
                self::LOCK_UNIQUE_VALUE,
                'EX',
                600,
                'NX'
            )
            ->willReturn(null)
        ;

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage(sprintf('Failed to acquire the lock %s', self::LOCK_NAME));

        $this->lock->executeInLockOrThrow(
            self::LOCK_NAME,
            600,
            null,
            function () {
                $this->fail('Should not be executed cause lock wasn\'t acquired');
            }
        );
    }

    public function testAcquireLockNoTimeoutSuccess()
    {
        $this->doTestAcquireLockNoTimeout('OK', self::LOCK_UNIQUE_VALUE);
    }

    public function testAcquireLockNoTimeoutFailure()
    {
        $this->doTestAcquireLockNoTimeout(null, false);
    }

    private function doTestAcquireLockNoTimeout($clientResponse, $expectedValue)
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $lockValueGenerator */
        $lockValueGenerator = $this->lockValueGenerator;
        $lockValueGenerator
            ->expects($this->once())
            ->method('getUniqueValue')
            ->willReturn(self::LOCK_UNIQUE_VALUE)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $client
            ->expects($this->once())
            ->method('set')
            ->with(
                self::LOCK_NAME,
                self::LOCK_UNIQUE_VALUE,
                'EX',
                10,
                'NX'
            )
            ->willReturn($clientResponse)
        ;

        $this->assertEquals(
            $expectedValue,
            $this->lock->acquireLock(self::LOCK_NAME, 10, null)
        );
    }

    public function testAcquireLockWithTimeoutSuccess()
    {
        $startTime = $this->doTestAcquireLockWithTimeout(
            function () {
                return 'OK';
            },
            self::LOCK_UNIQUE_VALUE
        );
        $this->assertLessThan(1, microtime(true) - $startTime);
    }

    public function testAcquireLockWithTimeoutSuccessAfterDelay()
    {
        $startTime = $this->doTestAcquireLockWithTimeout(
            function () {
                if (microtime(true) - $this->getStartTime() < 0.5) {
                    $status =  null;
                } else {
                    $status = 'OK';
                }
                usleep(10000);

                return $status;
            },
            self::LOCK_UNIQUE_VALUE
        );
        $this->assertLessThan(1, microtime(true) - $startTime);
    }

    public function testAcquireLockWithTimeoutFailureOnWaiting()
    {
        $startTime = $this->doTestAcquireLockWithTimeout(
            function () {
                usleep(10000);

                return null;
            },
            false
        );
        $this->assertGreaterThan(1, microtime(true) - $startTime);
    }

    private function doTestAcquireLockWithTimeout(callable $returnCallback, $expectedValue)
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $lockValueGenerator */
        $lockValueGenerator = $this->lockValueGenerator;
        $lockValueGenerator
            ->expects($this->once())
            ->method('getUniqueValue')
            ->willReturn(self::LOCK_UNIQUE_VALUE)
        ;

        $startTime = microtime(true);
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $client
            ->method('set')
            ->with(
                self::LOCK_NAME,
                self::LOCK_UNIQUE_VALUE,
                'EX',
                2,
                'NX'
            )
            ->willReturnCallback($returnCallback)
        ;

        $this->assertEquals(
            $expectedValue,
            $this->lock->acquireLock(self::LOCK_NAME, 2, 1)
        );

        return $startTime;
    }

    private function getStartTime()
    {
        static $startTime;

        if (!$startTime) {
            $startTime = microtime(true);
        }

        return $startTime;
    }
}
