<?php

namespace Test\AppBundle\Import_\Processor;

use AppBundle\Entity\ImportJob;
use AppBundle\Entity\ImportProperty;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Job\Process;
use AppBundle\Import\NormalisedProperty;
use AppBundle\Import\Processor\Processor;
use AppBundle\Import\Processor\UserRef;
use AppBundle\Import\Queue\QueueAdapterInterface;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\User\User;
use Symfony\Component\DependencyInjection\ContainerInterface;

class UserRefTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var QueueAdapterInterface
     */
    private $queueAdapter;
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var UserRef
     */
    private $userRef;

    protected function setUp()
    {
        $this->em = $this->getEm();
        $this->userRepo = $this->getUserRepo();
        $this->queueAdapter = $this->getQueueAdapter();

        $this->importJob = $this->getImportJob();

        $container = $this->getContainer();
        $container
            ->method('get')
            ->will($this->returnValueMap([
                ['em', 1, $this->em],
                ['user_repo', 1, $this->userRepo],
                ['ha.import.queue_adapter', 1, $this->queueAdapter],
            ]))
        ;

        $this->userRef = new UserRef($container, $this->importJob, $this->getJob());
    }

    public function testProcessDefaultUserId()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->never())
            ->method('getReference')
        ;

        $normalisedProperty = $this->getNormalisedProperty([]);
        $property = $this->getProperty();

        $this->userRef->process($normalisedProperty, $property);

        $this->assertEquals(Processor::STATUS_FAILED, $this->userRef->getStatus());
        $this->assertSame(
            [
                ImportProperty::ERROR_USER_REF => ['Neither user_id nor user_ref defined'],
            ],
            $this->userRef->getErrors()
        );
    }

    public function testProcessCustomUserId()
    {
        $user = $this->getUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->once())
            ->method('getReference')
            ->with(User::class, 5)
            ->willReturn($user)
        ;

        $normalisedProperty = $this->getNormalisedProperty([
            'userId' => 5,
        ]);
        $property = $this->getProperty();

        $this->userRef->process($normalisedProperty, $property);

        $this->assertEquals(Processor::STATUS_SUCCESS, $this->userRef->getStatus());
        $this->assertSame($user, $property->getUser());
    }

    public function testProcessUserRefInDB()
    {
        $user = $this->getUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->once())
            ->method('getReference')
            ->with(User::class, 15)
            ->willReturn($user)
        ;


        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->once())
            ->method('findBySourceRef')
            ->with('abc', 2)
            ->willReturn(15)
        ;

        $normalisedProperty = $this->getNormalisedProperty([
            'userRef' => 'abc',
        ]);
        $property = $this->getProperty();

        $this->userRef->process($normalisedProperty, $property);

        $this->assertEquals(Processor::STATUS_SUCCESS, $this->userRef->getStatus());
        $this->assertSame($user, $property->getUser());
    }

    public function testProcessUserRefNotInDB()
    {
        $user = $this->getUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->never())
            ->method('getReference')
        ;


        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->once())
            ->method('findBySourceRef')
            ->with('abc', 2)
            ->willReturn(false)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $queueAdapter */
        $queueAdapter = $this->queueAdapter;
        $queueAdapter
            ->expects($this->once())
            ->method('enqueueUserProcessing')
            ->with(
                $this->importJob,
                [
                    'ref' => 'abc',
                ]
            )
        ;

        $normalisedProperty = $this->getNormalisedProperty([
            'userRef' => 'abc',
        ]);
        $property = $this->getProperty();

        $this->userRef->process($normalisedProperty, $property);

        $this->assertEquals(Processor::STATUS_DELAYED, $this->userRef->getStatus());
        $this->assertSame('abc', $property->getUserSourceRef());
    }

    public function getNormalisedProperty($data = [])
    {
        return new NormalisedProperty($data);
    }

    public function getProperty()
    {
        return new Property();
    }

    public function getUser()
    {
        return new User();
    }

    private function getContainer()
    {
        return $this
            ->getMockBuilder(ContainerInterface::class)
            ->getMock()
        ;
    }

    private function getJob()
    {
        return $this
            ->getMockBuilder(Process::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getImportJob()
    {
        return $this
            ->getMockBuilder(ImportJob::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getEm()
    {
        return $this
            ->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getUserRepo()
    {
        return $this
            ->getMockBuilder(UserRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getQueueAdapter()
    {
        return $this
            ->getMockBuilder(QueueAdapterInterface::class)
            ->getMock()
        ;
    }
}
