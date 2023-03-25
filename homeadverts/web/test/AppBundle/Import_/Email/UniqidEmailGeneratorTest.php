<?php

namespace Test\AppBundle\Import_\Email;

use AppBundle\Import\Email\UniqidEmailGenerator;

class UniqidEmailGeneratorTest extends \PHPUnit_Framework_TestCase
{
    public function testGenerate()
    {
        $generator = new UniqidEmailGenerator();

        $emails = [];
        for ($i = 0; $i < 10; ++$i) {
            $emails[] = $email = $generator->generate();
            $this->assertStringMatchesFormat('%x@homeadverts.com', $email);
        }

        $this->assertCount(10, array_unique($emails));
    }
}
