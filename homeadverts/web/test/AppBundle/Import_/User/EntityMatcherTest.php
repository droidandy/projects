<?php

namespace Test\AppBundle\Import_\User;

use AppBundle\Entity\UserRepository;
use AppBundle\Import\NormalisedUser;
use AppBundle\Import\User\EntityMatcher;
use AppBundle\Import\User\FingerprintStrategy;
use Psr\Log\LoggerInterface;
use Test\Utils\Traits\UserTrait;
use Faker;

class EntityMatcherTest extends \PHPUnit_Framework_TestCase
{
    use UserTrait;
    /**
     * @var EntityMatcher
     */
    private $entityMatcher;
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var FingerprintStrategy
     */
    private $fingerprintStrategy;
    /**
     * @var LoggerInterface
     */
    private $logger;

    protected function setUp()
    {
        $this->userRepo = $this->getUserRepo();
        $this->fingerprintStrategy = $this->getFingerprintStrategy();
        $this->logger = $this->getLogger();

        $this->entityMatcher = new EntityMatcher(
            $this->userRepo,
            $this->fingerprintStrategy,
            $this->logger
        );
    }

    private function getUserRepo()
    {
        return $this
            ->getMockBuilder(UserRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getFingerprintStrategy()
    {
        return $this
            ->getMockBuilder(FingerprintStrategy::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;
    }

    public function testMatchPrimaryRef()
    {
        $normalisedUser = $this->getNormalisedUser();
        $expectedUser = $this->newUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->once())
            ->method('getUserBySourceRef')
            ->with('source_ref', 'source_ref_type')
            ->willReturn($expectedUser)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $fingerprintStrategy */
        $fingerprintStrategy = $this->fingerprintStrategy;
        $fingerprintStrategy
            ->expects($this->never())
            ->method('getByFingerprint')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->never())
            ->method('notice')
        ;

        $user = $this->entityMatcher->matchOrCreate($normalisedUser);

        $this->assertSame($expectedUser, $user);
    }

    public function testMatchVirtualRefs()
    {
        $normalisedUser = $this->getNormalisedUser();
        $expectedUser = $this->newUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->exactly(2))
            ->method('getUserBySourceRef')
            ->withConsecutive(
                ['source_ref', 'source_ref_type'],
                ['virtual_source_ref_1', 'type' => 'source_ref_type_1']
            )
            ->willReturnOnConsecutiveCalls(null, $expectedUser)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $fingerprintStrategy */
        $fingerprintStrategy = $this->fingerprintStrategy;
        $fingerprintStrategy
            ->expects($this->never())
            ->method('getByFingerprint')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->never())
            ->method('notice')
        ;

        $user = $this->entityMatcher->matchOrCreate($normalisedUser);

        $this->assertSame($expectedUser, $user);
    }

    public function testMatchRefs()
    {
        $normalisedUser = $this->getNormalisedUser();
        $expectedUser = $this->newUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->exactly(3))
            ->method('getUserBySourceRef')
            ->withConsecutive(
                ['source_ref', 'source_ref_type'],
                ['virtual_source_ref_1', 'type' => 'source_ref_type_1'],
                ['source_ref_1', 'source_ref_type_1']
            )
            ->willReturnOnConsecutiveCalls(null, null, $expectedUser)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $fingerprintStrategy */
        $fingerprintStrategy = $this->fingerprintStrategy;
        $fingerprintStrategy
            ->expects($this->never())
            ->method('getByFingerprint')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->never())
            ->method('notice')
        ;

        $user = $this->entityMatcher->matchOrCreate($normalisedUser);

        $this->assertSame($expectedUser, $user);
    }

    public function testMatchFingerprint()
    {
        $normalisedUser = $this->getNormalisedUser();
        $expectedUser = $this->newUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->exactly(4))
            ->method('getUserBySourceRef')
            ->withConsecutive(
                ['source_ref', 'source_ref_type'],
                ['virtual_source_ref_1', 'type' => 'source_ref_type_1'],
                ['source_ref_1', 'source_ref_type_1'],
                ['source_ref_2', 'source_ref_type_2']
            )
            ->willReturn(null)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $fingerprintStrategy */
        $fingerprintStrategy = $this->fingerprintStrategy;
        $fingerprintStrategy
            ->method('getByFingerprint')
            ->with($normalisedUser)
            ->willReturn($expectedUser)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->never())
            ->method('notice')
        ;

        $user = $this->entityMatcher->matchOrCreate($normalisedUser);

        $this->assertSame($expectedUser, $user);
    }

    public function testNoMatch()
    {
        $normalisedUser = $this->getNormalisedUser();
        $expectedUser = $this->newUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->exactly(4))
            ->method('getUserBySourceRef')
            ->withConsecutive(
                ['source_ref', 'source_ref_type'],
                ['virtual_source_ref_1', 'type' => 'source_ref_type_1'],
                ['source_ref_1', 'source_ref_type_1'],
                ['source_ref_2', 'source_ref_type_2']
            )
            ->willReturn(null)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $fingerprintStrategy */
        $fingerprintStrategy = $this->fingerprintStrategy;
        $fingerprintStrategy
            ->method('getByFingerprint')
            ->with($normalisedUser)
            ->willReturn(null)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->method('notice')
            ->with('[source_ref_type:source_ref] [username@email] [username] no matching entity found')
        ;

        $user = $this->entityMatcher->matchOrCreate($normalisedUser);

        $this->assertNotSame($expectedUser, $user);
        $this->isInstanceOf($user);
    }

    private function getNormalisedUser()
    {
        list($ref, $refType, $refs, $virtualRefs) = [
            'source_ref',
            'source_ref_type',
            [
                (object) [
                    'ref' => 'source_ref_1',
                    'type' => 'source_ref_type_1',
                ],
                (object) [
                    'ref' => 'source_ref_2',
                    'type' => 'source_ref_type_2',
                ],
            ],
            [
                (object) [
                    'ref' => 'virtual_source_ref_1',
                    'type' => 'source_ref_type_1',
                ],
            ],
        ];

        $user = new NormalisedUser();
        $user->sourceRef = $ref;
        $user->sourceRefType = $refType;
        $user->sourceRefs = $refs;
        $user->virtualSourceRefs = $virtualRefs;
        $user->name = 'username';
        $user->email = 'username@email';

        return $user;
    }

    protected function getFaker()
    {
        return Faker\Factory::create();
    }

    public function getEntityManager()
    {
    }

    public function getContainer()
    {
    }
}
