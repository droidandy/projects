<?php

namespace Test\AppBundle\Import_\User;

use AppBundle\Entity\UserRepository;
use AppBundle\Import\User\EmailTypes;
use AppBundle\Import\User\FingerprintStrategy;
use AppBundle\Import\NormalisedUser;
use Faker;
use Test\Utils\Traits\UserTrait;

class FingerprintStrategyTest extends \PHPUnit_Framework_TestCase
{
    use UserTrait;
    /**
     * @var FingerprintStrategy
     */
    private $fingerprintStrategy;
    /**
     * @var UserRepository
     */
    private $userRepo;

    protected function setUp()
    {
        $this->userRepo = $this->getUserRepo();

        $this->fingerprintStrategy = new FingerprintStrategy($this->userRepo);
    }

    public function testGetByFingerprint()
    {
        $normalisedUser = $this->getNormalisedUser();
        $expectedUser = $this->newUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->once())
            ->method('getUserByFingerprint')
            ->with($normalisedUser)
            ->willReturn($expectedUser)
        ;
        $userRepo
            ->expects($this->never())
            ->method('getUserByNameAndAnyEmail')
        ;

        $this->assertSame(
            $expectedUser,
            $this->fingerprintStrategy->getByFingerprint($normalisedUser)
        );
    }

    public function testGetByFinderprintLoosen()
    {
        $normalisedUser = $this->getNormalisedUser();
        $expectedUser = $this->newUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->once())
            ->method('getUserByFingerprint')
            ->with($normalisedUser)
            ->willReturn(null)
        ;
        $userRepo
            ->expects($this->once())
            ->method('getUserByNameAndAnyEmail')
            ->with(
                'username',
                $this->callback(
                    function ($emails) {
                        $this->assertEquals(
                            [
                                'username.lead@email',
                                'username.vanity@email',
                            ],
                            array_values($emails)
                        );

                        return true;
                    }
                )
            )
            ->willReturn($expectedUser)
        ;

        $this->assertSame(
            $expectedUser,
            $this->fingerprintStrategy->getByFingerprint($normalisedUser)
        );
    }

    public function testGetNoSuccess()
    {
        $normalisedUser = $this->getNormalisedUser();

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->once())
            ->method('getUserByFingerprint')
            ->with($normalisedUser)
            ->willReturn(null)
        ;
        $userRepo
            ->expects($this->once())
            ->method('getUserByNameAndAnyEmail')
            ->with(
                'username',
                $this->callback(
                    function ($emails) {
                        $this->assertEquals(
                            [
                                'username.lead@email',
                                'username.vanity@email',
                            ],
                            array_values($emails)
                        );

                        return true;
                    }
                )
            )
            ->willReturn(null)
        ;

        $this->assertNull(
            $this->fingerprintStrategy->getByFingerprint($normalisedUser)
        );
    }

    public function getUserRepo()
    {
        return $this
            ->getMockBuilder(UserRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
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
        $user->allEmails = [
            (object) [
                'type' => EmailTypes::PERSONAL,
                'email' => 'username@email',
            ],
            (object) [
                'type' => EmailTypes::LEAD_ROUTER,
                'email' => 'username.lead@email',
            ],
            (object) [
                'type' => EmailTypes::VANITY,
                'email' => 'username.vanity@email',
            ],
        ];

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
