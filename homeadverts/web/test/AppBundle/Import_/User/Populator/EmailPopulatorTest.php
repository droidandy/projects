<?php

namespace Test\AppBundle\Import_\Email;

use AppBundle\Import\ImportContext;
use AppBundle\Import\User\EmailTypes;
use AppBundle\Import\User\Populator\EmailPopulator;
use AppBundle\Import\Email\EmailSorter;
use AppBundle\Import\Email\EmailsInUseListInterface;
use AppBundle\Import\Email\UniqidEmailGenerator;
use AppBundle\Import\NormalisedUser;
use AppBundle\Service\Lock\LockInterface;
use FOS\UserBundle\Util\CanonicalizerInterface;
use AppBundle\Entity\User\User;

class EmailPopulatorTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var LockInterface
     */
    private $lock;

    protected function setUp()
    {
        $this->importContext = $this
            ->getMockBuilder(ImportContext::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $this->lock = $this
            ->getMockBuilder(LockInterface::class)
            ->getMock()
        ;
    }

    public function testPopulateBlankUser()
    {
        $user = new User();
        $normalisedUser = new NormalisedUser();
        $normalisedUser->allEmails = [
            [
                'email' => 'alice.business@homeadverts.com',
                'type' => EmailTypes::BUSINESS,
            ],
            [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
            [
                'email' => 'Alice.Vanity@homeadverts.com',
                'type' => EmailTypes::VANITY,
            ],
            [
                'email' => 'Alice.personal@homeadverts.com',
                'type' => EmailTypes::PERSONAL,
            ],
        ];

        $emailSorter = $this->getEmailSorter();
        $emailSorter
            ->expects($this->once())
            ->method('getSignupEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'Alice.personal@homeadverts.com', 'Alice.Vanity@homeadverts.com', 'alice.business@homeadverts.com',
            ])
        ;
        $emailSorter
            ->expects($this->once())
            ->method('getLeadEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.lead_router@homeadverts.com', 'Alice.personal@homeadverts.com',
            ])
        ;

        $emailList = $this->getEmailList();
        $emailList
            ->expects($this->once())
            ->method('isInUse')
            ->with('Alice.personal@homeadverts.com')
            ->willReturn(false)
        ;
        $emailList
            ->expects($this->once())
            ->method('addInUse')
            ->with('Alice.personal@homeadverts.com')
        ;

        $emailGenerator = $this->getEmailGenerator();
        $emailGenerator
            ->expects($this->never())
            ->method('generate')
        ;

        $canonicalizer = $this->getCanonicalizer();

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->expects($this->once())
            ->method('addOnSuccessCb')
            ->with($this->isType('callable'))
            ->willReturnCallback(
                function ($cb) {
                    return $cb();
                }
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $lock */
        $lock = $this->lock;
        $lock
            ->expects($this->once())
            ->method('executeInLock')
            ->with('alice.personal@homeadverts.com', 3, 3, $this->isType('callable'))
            ->willReturnCallback(function ($lockName, $lockTtl, $timeout, $cb) {
                return $cb();
            })
        ;

        $emailPopulator = $this->getEmailPopulator($canonicalizer, $emailSorter, $emailGenerator, $emailList);
        $emailPopulator->populate($user, $normalisedUser);

        $this->assertEquals('Alice.personal@homeadverts.com', $user->getEmail());
        $this->assertEquals('alice.lead_router@homeadverts.com', $user->getLeadEmail());
        $this->assertFalse($user->getEmailGenerated());
    }

    public function testPopulateBlankUserAndSomeEmailsInUse()
    {
        $user = new User();
        $normalisedUser = new NormalisedUser();
        $normalisedUser->allEmails = [
            [
                'email' => 'alice.business@homeadverts.com',
                'type' => EmailTypes::BUSINESS,
            ],
            [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
            [
                'email' => 'Alice.Vanity@homeadverts.com',
                'type' => EmailTypes::VANITY,
            ],
            [
                'email' => 'alice.personal@homeadverts.com',
                'type' => EmailTypes::PERSONAL,
            ],
        ];

        $emailSorter = $this->getEmailSorter();
        $emailSorter
            ->expects($this->once())
            ->method('getSignupEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.personal@homeadverts.com', 'Alice.Vanity@homeadverts.com', 'alice.business@homeadverts.com',
            ])
        ;
        $emailSorter
            ->expects($this->once())
            ->method('getLeadEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.lead_router@homeadverts.com', 'Alice.personal@homeadverts.com',
            ])
        ;

        $emailList = $this->getEmailList();
        $emailList
            ->expects($this->exactly(2))
            ->method('isInUse')
            ->withConsecutive(
                ['alice.personal@homeadverts.com'],
                ['Alice.Vanity@homeadverts.com']
            )
            ->willReturnOnConsecutiveCalls(true, false)
        ;
        $emailList
            ->expects($this->once())
            ->method('addInUse')
            ->with('Alice.Vanity@homeadverts.com')
        ;

        $emailGenerator = $this->getEmailGenerator();
        $emailGenerator
            ->expects($this->never())
            ->method('generate')
        ;

        $canonicalizer = $this->getCanonicalizer();

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->expects($this->once())
            ->method('addOnSuccessCb')
            ->with($this->isType('callable'))
            ->willReturnCallback(
                function ($cb) {
                    return $cb();
                }
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $lock */
        $lock = $this->lock;
        $lock
            ->expects($this->exactly(2))
            ->method('executeInLock')
            ->withConsecutive(
                ['alice.personal@homeadverts.com', 3, 3, $this->isType('callable')],
                ['alice.vanity@homeadverts.com', 3, 3, $this->isType('callable')]
            )
            ->willReturnCallback(function ($lockName, $lockTtl, $timeout, $cb) {
                return $cb();
            })
        ;

        $emailPopulator = $this->getEmailPopulator($canonicalizer, $emailSorter, $emailGenerator, $emailList);
        $emailPopulator->populate($user, $normalisedUser);

        $this->assertEquals('Alice.Vanity@homeadverts.com', $user->getEmail());
        $this->assertEquals('alice.lead_router@homeadverts.com', $user->getLeadEmail());
        $this->assertFalse($user->getEmailGenerated());
    }

    public function testPopulateBlankUserAndAllEmailsInUse()
    {
        $user = new User();
        $normalisedUser = new NormalisedUser();
        $normalisedUser->allEmails = [
            [
                'email' => 'alice.business@homeadverts.com',
                'type' => EmailTypes::BUSINESS,
            ],
            [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
            [
                'email' => 'Alice.Vanity@homeadverts.com',
                'type' => EmailTypes::VANITY,
            ],
            [
                'email' => 'alice.personal@homeadverts.com',
                'type' => EmailTypes::PERSONAL,
            ],
        ];

        $emailSorter = $this->getEmailSorter();
        $emailSorter
            ->expects($this->once())
            ->method('getSignupEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.personal@homeadverts.com', 'Alice.Vanity@homeadverts.com', 'alice.business@homeadverts.com',
            ])
        ;
        $emailSorter
            ->expects($this->once())
            ->method('getLeadEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.lead_router@homeadverts.com', 'Alice.personal@homeadverts.com',
            ])
        ;

        $emailList = $this->getEmailList();
        $emailList
            ->expects($this->exactly(3))
            ->method('isInUse')
            ->withConsecutive(
                ['alice.personal@homeadverts.com'],
                ['Alice.Vanity@homeadverts.com'],
                ['alice.business@homeadverts.com']
            )
            ->willReturnOnConsecutiveCalls(true, true, true)
        ;
        $emailList
            ->expects($this->never())
            ->method('addInUse')
        ;

        $emailGenerator = $this->getEmailGenerator();
        $emailGenerator
            ->expects($this->once())
            ->method('generate')
            ->willReturn('generated@homeadverts.com')
        ;

        $canonicalizer = $this->getCanonicalizer();

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->expects($this->never())
            ->method('addOnSuccessCb')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $lock */
        $lock = $this->lock;
        $lock
            ->expects($this->exactly(3))
            ->method('executeInLock')
            ->withConsecutive(
                ['alice.personal@homeadverts.com', 3, 3, $this->isType('callable')],
                ['alice.vanity@homeadverts.com', 3, 3, $this->isType('callable')],
                ['alice.business@homeadverts.com', 3, 3, $this->isType('callable')]
            )
            ->willReturnCallback(function ($lockName, $lockTtl, $timeout, $cb) {
                return $cb();
            })
        ;

        $emailPopulator = $this->getEmailPopulator($canonicalizer, $emailSorter, $emailGenerator, $emailList);
        $emailPopulator->populate($user, $normalisedUser);

        $this->assertEquals('generated@homeadverts.com', $user->getEmail());
        $this->assertEquals('alice.lead_router@homeadverts.com', $user->getLeadEmail());
        $this->assertTrue($user->getEmailGenerated());
    }

    public function testPopulateBlankUserAndNoEmails()
    {
        $user = new User();
        $normalisedUser = new NormalisedUser();
        $normalisedUser->allEmails = [
            [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
        ];

        $emailSorter = $this->getEmailSorter();
        $emailSorter
            ->expects($this->once())
            ->method('getSignupEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([])
        ;
        $emailSorter
            ->expects($this->once())
            ->method('getLeadEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.lead_router@homeadverts.com',
            ])
        ;

        $emailList = $this->getEmailList();
        $emailList
            ->expects($this->never())
            ->method('isInUse')
        ;
        $emailList
            ->expects($this->never())
            ->method('addInUse')
        ;

        $emailGenerator = $this->getEmailGenerator();
        $emailGenerator
            ->expects($this->once())
            ->method('generate')
            ->willReturn('generated@homeadverts.com')
        ;

        $canonicalizer = $this->getCanonicalizer();

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->expects($this->never())
            ->method('addOnSuccessCb')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $lock */
        $lock = $this->lock;
        $lock
            ->expects($this->never())
            ->method('executeInLock')
        ;

        $emailPopulator = $this->getEmailPopulator($canonicalizer, $emailSorter, $emailGenerator, $emailList);
        $emailPopulator->populate($user, $normalisedUser);

        $this->assertEquals('generated@homeadverts.com', $user->getEmail());
        $this->assertEquals('alice.lead_router@homeadverts.com', $user->getLeadEmail());
        $this->assertTrue($user->getEmailGenerated());
    }

    public function testPopulateStuffedUser()
    {
        $user = new User();
        $user->setEmail('alice.PERsonal@homeadverts.com');
        $user->setEmailCanonical('alice.personal@homeadverts.com');
        $normalisedUser = new NormalisedUser();
        $normalisedUser->allEmails = [
            [
                'email' => 'alice.business@homeadverts.com',
                'type' => EmailTypes::BUSINESS,
            ],
            [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
            [
                'email' => 'Alice.Vanity@homeadverts.com',
                'type' => EmailTypes::VANITY,
            ],
            [
                'email' => 'alice.Personal@homeadverts.com',
                'type' => EmailTypes::PERSONAL,
            ],
        ];

        $emailSorter = $this->getEmailSorter();
        $emailSorter
            ->expects($this->once())
            ->method('getSignupEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.PERsonal@homeadverts.com', 'Alice.Vanity@homeadverts.com', 'alice.business@homeadverts.com',
            ])
        ;
        $emailSorter
            ->expects($this->once())
            ->method('getLeadEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.lead_router@homeadverts.com', 'alice.PERsonal@homeadverts.com',
            ])
        ;

        $emailList = $this->getEmailList();
        $emailList
            ->expects($this->never())
            ->method('isInUse')
        ;
        $emailList
            ->expects($this->never())
            ->method('addInUse')
        ;

        $emailGenerator = $this->getEmailGenerator();
        $emailGenerator
            ->expects($this->never())
            ->method('generate')
        ;

        $canonicalizer = $this->getCanonicalizer();

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->expects($this->never())
            ->method('addOnSuccessCb')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $lock */
        $lock = $this->lock;
        $lock
            ->expects($this->never())
            ->method('executeInLock')
        ;

        $emailPopulator = $this->getEmailPopulator($canonicalizer, $emailSorter, $emailGenerator, $emailList);
        $emailPopulator->populate($user, $normalisedUser);

        $this->assertEquals('alice.PERsonal@homeadverts.com', $user->getEmail());
        $this->assertEquals('alice.lead_router@homeadverts.com', $user->getLeadEmail());
        $this->assertFalse($user->getEmailGenerated());
    }

    public function testPopulateStuffedUserWithEmailMismatch()
    {
        $user = new User();
        $user->setEmail('oldemail@homeadverts.com');
        $user->setEmailCanonical('oldemail@homeadverts.com');
        $normalisedUser = new NormalisedUser();
        $normalisedUser->allEmails = [
            [
                'email' => 'alice.business@homeadverts.com',
                'type' => EmailTypes::BUSINESS,
            ],
            [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
            [
                'email' => 'Alice.Vanity@homeadverts.com',
                'type' => EmailTypes::VANITY,
            ],
            [
                'email' => 'alice.personal@homeadverts.com',
                'type' => EmailTypes::PERSONAL,
            ],
        ];

        $emailSorter = $this->getEmailSorter();
        $emailSorter
            ->expects($this->once())
            ->method('getSignupEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.personal@homeadverts.com', 'Alice.Vanity@homeadverts.com', 'alice.business@homeadverts.com',
            ])
        ;
        $emailSorter
            ->expects($this->once())
            ->method('getLeadEmailsOrdered')
            ->with($normalisedUser->allEmails)
            ->willReturn([
                'alice.lead_router@homeadverts.com', 'alice.PERsonal@homeadverts.com',
            ])
        ;

        $emailList = $this->getEmailList();
        $emailList
            ->expects($this->exactly(3))
            ->method('isInUse')
            ->withConsecutive(
                ['alice.personal@homeadverts.com'],
                ['Alice.Vanity@homeadverts.com'],
                ['alice.business@homeadverts.com']
            )
            ->willReturnOnConsecutiveCalls(true, true, true)
        ;
        $emailList
            ->expects($this->never())
            ->method('addInUse')
        ;

        $emailGenerator = $this->getEmailGenerator();
        $emailGenerator
            ->expects($this->once())
            ->method('generate')
            ->willReturn('generated@homeadverts.com')
        ;

        $canonicalizer = $this->getCanonicalizer();

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->expects($this->never())
            ->method('addOnSuccessCb')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $lock */
        $lock = $this->lock;
        $lock
            ->expects($this->exactly(3))
            ->method('executeInLock')
            ->withConsecutive(
                ['alice.personal@homeadverts.com', 3, 3, $this->isType('callable')],
                ['alice.vanity@homeadverts.com', 3, 3, $this->isType('callable')],
                ['alice.business@homeadverts.com', 3, 3, $this->isType('callable')]
            )
            ->willReturnCallback(function ($lockName, $lockTtl, $timeout, $cb) {
                return $cb();
            })
        ;

        $emailPopulator = $this->getEmailPopulator($canonicalizer, $emailSorter, $emailGenerator, $emailList);
        $emailPopulator->populate($user, $normalisedUser);

        $this->assertEquals('generated@homeadverts.com', $user->getEmail());
        $this->assertEquals('alice.lead_router@homeadverts.com', $user->getLeadEmail());
        $this->assertTrue($user->getEmailGenerated());
    }

    private function getEmailPopulator($canonicalizer, $emailSorter, $emailGenerator, $emailList)
    {
        return new EmailPopulator(
            $canonicalizer,
            $emailSorter,
            $emailGenerator,
            $emailList,
            $this->importContext,
            $this->lock
        );
    }

    private function getCanonicalizer()
    {
        $canonicalizer = $this->getMockBuilder(CanonicalizerInterface::class)
            ->getMock()
        ;

        $canonicalizer
            ->expects($this->any())
            ->method('canonicalize')
            ->willReturnCallback(function ($arg) {
                return strtolower($arg);
            })
        ;

        return $canonicalizer;
    }

    private function getEmailSorter()
    {
        return $this->getMockBuilder(EmailSorter::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getEmailGenerator()
    {
        return $this->getMockBuilder(UniqidEmailGenerator::class)
            ->getMock()
        ;
    }

    private function getEmailList()
    {
        return $this->getMockBuilder(EmailsInUseListInterface::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
