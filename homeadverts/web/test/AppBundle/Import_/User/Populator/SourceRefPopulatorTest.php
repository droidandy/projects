<?php

namespace Test\AppBundle\Import_\User\Populator;

use AppBundle\Import\NormalisedUser;
use AppBundle\Import\User\Populator\SourceRefPopulator;
use AppBundle\Entity\User\SourceRef;
use AppBundle\Entity\User\User;

class SourceRefPopulatorTest extends \PHPUnit_Framework_TestCase
{
    public function testProcess()
    {
        $sourceRef1 = $this->getSourceRef('8282ED73-0C02-424B-B0A6-6B407F1C7EE7', 'guid');
        $user = $this->getUser($sourceRef1);
        $sourceRef1->user = $user;
        $normalizedUser = $this->getNormalizedUser();

        $processor = new SourceRefPopulator();
        $processor->populate($user, $normalizedUser);

        $this->assertEquals('3yd-RFGSIR-62598424', $user->sourceRef);

        $sourceRef2 = $this->getSourceRef('3yd-RFGSIR-4604085', 'key');
        $sourceRef2->user = $user;
        $refs = [$sourceRef1, $sourceRef2];
        $this->assertEquals($refs[0], $user->sourceRefs[0]);
        $this->assertEquals($refs[1], $user->sourceRefs[1]);
    }

    public function testProcessEmptyUser()
    {
        $sourceRef1 = $this->getSourceRef('8282ED73-0C02-424B-B0A6-6B407F1C7EE7', 'guid');
        $user = $this->getEmptyUser();
        $sourceRef1->user = $user;
        $normalizedUser = $this->getNormalizedUser();

        $processor = new SourceRefPopulator();
        $processor->populate($user, $normalizedUser);

        $this->assertEquals('3yd-RFGSIR-62598424', $user->sourceRef);
        $this->assertEquals('key', $user->sourceRefType);
        $this->assertEquals(1, $user->sourceRefs->count());
        $this->assertEquals($sourceRef1, $user->sourceRefs[0]);
    }

    public function testProcessNoSourceRef()
    {
        $user = $this->getEmptyUser();
        $normalizedUser = $this->getNormalizedUser();
        $normalizedUser->sourceRef = null;
        $normalizedUser->sourceRefType = null;

        $processor = new SourceRefPopulator();
        $processor->populate($user, $normalizedUser);

        $this->assertNull($user->sourceRef);
        $this->assertNull($user->sourceRefType);

        $user = $this->getEmptyUser();
        $user->sourceRef = '3yd-RFGSIR-4604085';
        $user->sourceRefType = 'key';
        $normalizedUser = $this->getNormalizedUser();
        $normalizedUser->sourceRef = null;
        $normalizedUser->sourceRefType = null;

        $processor->populate($user, $normalizedUser);

        $this->assertNull($user->sourceRef);
        $this->assertNull($user->sourceRefType);
        $this->assertEquals(2, $user->sourceRefs->count());
        $this->assertAttributeEquals('8282ED73-0C02-424B-B0A6-6B407F1C7EE7', 'ref', $user->sourceRefs[0]);
        $this->assertAttributeEquals('guid', 'type', $user->sourceRefs[0]);
        $this->assertAttributeEquals('3yd-RFGSIR-4604085', 'ref', $user->sourceRefs[1]);
        $this->assertAttributeEquals('key', 'type', $user->sourceRefs[1]);
    }

    private function getUser(SourceRef $sourceRef)
    {
        $user = new User();
        $user->sourceRefs->add($sourceRef);
        $user->sourceRef = '3yd-RFGSIR-4604085';
        $user->sourceRefType = 'key';

        return $user;
    }

    private function getEmptyUser()
    {
        $user = new User();
        $user->sourceRef = null;

        return $user;
    }

    private function getSourceRef($ref, $type)
    {
        $sourceRef = new SourceRef();
        $sourceRef->ref = $ref;
        $sourceRef->type = $type;

        return $sourceRef;
    }

    private function getNormalizedUser()
    {
        $user = new NormalisedUser();
        $user->sourceRef = '3yd-RFGSIR-62598424';
        $user->sourceRefType = 'key';
        $user->sourceRefs = [
            (object) ['ref' => '8282ED73-0C02-424B-B0A6-6B407F1C7EE7', 'type' => 'guid'],
        ];

        return $user;
    }
}
