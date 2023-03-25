<?php

namespace Test\AppBundle\Import_\Email;

use AppBundle\Entity\UserRepository;
use AppBundle\Import\Email\RedisEmailsInUseList;
use Predis\Client;

class RedisEmailsInUseListTest extends \PHPUnit_Framework_TestCase
{
    public function testIsEmailInUseFromScratch()
    {
        $emails = [
            'alice@homeadverts.com',
            'bob@homeadverts.com',
            'eve@homeadverts.com',
        ];

        $userRepo = $this->getUserRepo($emails);
        $userRepo
            ->expects($this->once())
            ->method('getAllSignupEmails')
        ;

        $redisClient = $this->getRedisClient($emails);
        $redisClient
            ->expects($this->once())
            ->method('expire')
        ;
        $redisClient
            ->expects($this->once())
            ->method('sadd')
            ->with(RedisEmailsInUseList::EMAILS_IN_USE, $emails)
        ;
        $redisClient
            ->expects($this->once())
            ->method('exists')
            ->with(RedisEmailsInUseList::EMAILS_IN_USE)
            ->willReturn(false)
        ;
        $redisClient
            ->expects($this->exactly(4))
            ->method('sismember')
            ->withConsecutive(
                [RedisEmailsInUseList::EMAILS_IN_USE, 'alice@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'bob@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'eve@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'newemail@homeadverts.com']
            )
            ->willReturnMap([
                [RedisEmailsInUseList::EMAILS_IN_USE, 'alice@homeadverts.com', true],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'bob@homeadverts.com', true],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'eve@homeadverts.com', true],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'newemail@homeadverts.com', false],
            ])
        ;

        $emailList = $this->getEmailList($redisClient, $userRepo);

        $this->assertTrue($emailList->isInUse('alice@homeadverts.com'));
        $this->assertTrue($emailList->isInUse('bob@homeadverts.com'));
        $this->assertTrue($emailList->isInUse('eve@homeadverts.com'));

        $this->assertFalse($emailList->isInUse('newemail@homeadverts.com'));
    }

    public function testNoEmails()
    {
        $emails = [];

        $userRepo = $this->getUserRepo($emails);
        $userRepo
            ->expects($this->once())
            ->method('getAllSignupEmails')
        ;

        $redisClient = $this->getRedisClient($emails);
        $redisClient
            ->expects($this->once())
            ->method('expire')
        ;
        $redisClient
            ->expects($this->once())
            ->method('sadd')
            ->with(RedisEmailsInUseList::EMAILS_IN_USE, $emails)
        ;
        $redisClient
            ->expects($this->once())
            ->method('exists')
            ->with(RedisEmailsInUseList::EMAILS_IN_USE)
            ->willReturn(false)
        ;
        $redisClient
            ->expects($this->exactly(4))
            ->method('sismember')
            ->withConsecutive(
                [RedisEmailsInUseList::EMAILS_IN_USE, 'alice@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'bob@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'eve@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'newemail@homeadverts.com']
            )
            ->willReturnMap([
                [RedisEmailsInUseList::EMAILS_IN_USE, 'alice@homeadverts.com', false],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'bob@homeadverts.com', false],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'eve@homeadverts.com', false],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'newemail@homeadverts.com', false],
            ])
        ;

        $emailList = $this->getEmailList($redisClient, $userRepo);

        $this->assertFalse($emailList->isInUse('alice@homeadverts.com'));
        $this->assertFalse($emailList->isInUse('bob@homeadverts.com'));
        $this->assertFalse($emailList->isInUse('eve@homeadverts.com'));

        $this->assertFalse($emailList->isInUse('newemail@homeadverts.com'));
    }

    public function testIsEmailInUseRedisSetup()
    {
        $emails = [
            'alice@homeadverts.com',
            'bob@homeadverts.com',
            'eve@homeadverts.com',
        ];

        $userRepo = $this->getUserRepo($emails);
        $userRepo
            ->expects($this->never())
            ->method('getAllSignupEmails')
        ;

        $redisClient = $this->getRedisClient($emails);
        $redisClient
            ->expects($this->never())
            ->method('expire')
        ;
        $redisClient
            ->expects($this->never())
            ->method('sadd')
            ->with(RedisEmailsInUseList::EMAILS_IN_USE, $emails)
        ;
        $redisClient
            ->expects($this->once())
            ->method('exists')
            ->with(RedisEmailsInUseList::EMAILS_IN_USE)
            ->willReturn(true)
        ;
        $redisClient
            ->expects($this->exactly(4))
            ->method('sismember')
            ->withConsecutive(
                [RedisEmailsInUseList::EMAILS_IN_USE, 'alice@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'bob@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'eve@homeadverts.com'],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'newemail@homeadverts.com']
            )
            ->willReturnMap([
                [RedisEmailsInUseList::EMAILS_IN_USE, 'alice@homeadverts.com', true],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'bob@homeadverts.com', true],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'eve@homeadverts.com', true],
                [RedisEmailsInUseList::EMAILS_IN_USE, 'newemail@homeadverts.com', false],
            ])
        ;

        $emailList = $this->getEmailList($redisClient, $userRepo);

        $this->assertTrue($emailList->isInUse('alice@homeadverts.com'));
        $this->assertTrue($emailList->isInUse('bob@homeadverts.com'));
        $this->assertTrue($emailList->isInUse('eve@homeadverts.com'));

        $this->assertFalse($emailList->isInUse('newemail@homeadverts.com'));
    }

    public function testAddInUseFromScratch()
    {
        $emails = [
            'alice@homeadverts.com',
            'bob@homeadverts.com',
            'eve@homeadverts.com',
        ];

        $userRepo = $this->getUserRepo($emails);
        $userRepo
            ->expects($this->once())
            ->method('getAllSignupEmails')
        ;

        $redisClient = $this->getRedisClient($emails);
        $redisClient
            ->expects($this->once())
            ->method('expire')
        ;
        $redisClient
            ->expects($this->once())
            ->method('exists')
            ->with(RedisEmailsInUseList::EMAILS_IN_USE)
            ->willReturn(false)
        ;
        $redisClient
            ->expects($this->exactly(2))
            ->method('sadd')
            ->withConsecutive(
                [RedisEmailsInUseList::EMAILS_IN_USE, $emails],
                [RedisEmailsInUseList::EMAILS_IN_USE, ['newone@homeadverts.com']]
            )
        ;

        $emailList = $this->getEmailList($redisClient, $userRepo);

        $emailList->addInUse('newone@homeadverts.com');
    }

    private function getEmailList($redisClient, $userRepo)
    {
        return new RedisEmailsInUseList($redisClient, $userRepo);
    }

    private function getRedisClient($emails)
    {
        $client = $this
            ->getMockBuilder(Client::class)
            ->disableOriginalConstructor()
            ->setMethods(['expire', 'sadd', 'exists', 'sismember'])
            ->getMock()
        ;
        $client
            ->method('expire')
            ->with(RedisEmailsInUseList::EMAILS_IN_USE, RedisEmailsInUseList::TTL)
        ;

        return $client;
    }

    private function getUserRepo($emails)
    {
        $userRepo = $this
            ->getMockBuilder(UserRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $userRepo
            ->method('getAllSignupEmails')
            ->willReturn($emails)
        ;

        return $userRepo;
    }
}
