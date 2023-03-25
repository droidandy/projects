<?php

namespace Test\AppBundle\Import_;

use AppBundle\Import\NormalisedUser;
use AppBundle\Import\SourceRefProcessor;
use AppBundle\Entity\User\SourceRef;
use AppBundle\Entity\User\User;

class SourceRefProcessorTest extends \PHPUnit_Framework_TestCase
{
    public function testProcess()
    {
        $sourceRef1 = $this->getSourceRef('8282ED73-0C02-424B-B0A6-6B407F1C7EE7', 'guid');
        $user = $this->getUser($sourceRef1);
        $sourceRef1->user = $user;
        $normalizedUser = $this->getNormalizedUser();
        $processor = new SourceRefProcessor();
        $processor->process($user, $normalizedUser);
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
        $processor = new SourceRefProcessor();
        $processor->process($user, $normalizedUser);
        $this->assertEquals('3yd-RFGSIR-62598424', $user->sourceRef);
        $this->assertEquals(1, $user->sourceRefs->count());
        $this->assertEquals($sourceRef1, $user->sourceRefs[0]);
    }

    private function getUser(SourceRef $sourceRef)
    {
        $user = new User();
        $user->sourceRefs->add($sourceRef);
        $user->sourceRef = '3yd-RFGSIR-4604085';

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
        $user->sourceRefs = [
            (object) ['ref' => '8282ED73-0C02-424B-B0A6-6B407F1C7EE7', 'type' => 'guid'],
        ];

        return $user;
    }
}
