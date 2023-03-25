<?php

namespace Test\AppBundle\Import_\Email;

use AppBundle\Import\User\EmailTypes;
use AppBundle\Import\Email\EmailSorter;

class EmailSorterTest extends \PHPUnit_Framework_TestCase
{
    public function testGetSingupEmailsOrdered()
    {
        $emailSorter = new EmailSorter();

        $emailsToProcess = [
            (object) [
                'email' => 'alice.business@homeadverts.com',
                'type' => EmailTypes::BUSINESS,
            ],
            (object) [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            (object) [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
            (object) [
                'email' => 'alice.vanity@homeadverts.com',
                'type' => EmailTypes::VANITY,
            ],
            (object) [
                'email' => 'alice.personal@homeadverts.com',
                'type' => EmailTypes::PERSONAL,
            ],
        ];

        $this->assertEquals(
            [
                'alice.personal@homeadverts.com',
                'alice.vanity@homeadverts.com',
                'alice.business@homeadverts.com',
            ],
            $emailSorter->getSignupEmailsOrdered($emailsToProcess)
        );
        $this->assertEquals(
            [
                'alice.lead_router@homeadverts.com',
                'alice.personal@homeadverts.com',
            ],
            $emailSorter->getLeadEmailsOrdered($emailsToProcess)
        );

        $emailsWithDuplicates = [
            (object) [
                'email' => 'alice.personal@homeadverts.com',
                'type' => EmailTypes::PERSONAL,
            ],
            (object) [
                'email' => 'alice.business_and_vanity@homeadverts.com',
                'type' => EmailTypes::BUSINESS,
            ],
            (object) [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            (object) [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
            (object) [
                'email' => 'alice.business_and_vanity@homeadverts.com',
                'type' => EmailTypes::VANITY,
            ],
        ];

        $this->assertEquals(
            [
                'alice.personal@homeadverts.com',
                'alice.business_and_vanity@homeadverts.com',
            ],
            $emailSorter->getSignupEmailsOrdered($emailsWithDuplicates)
        );

        $emailsOnlyPersonalAndBusiness = [
            (object) [
                'email' => 'alice.business@homeadverts.com',
                'type' => EmailTypes::BUSINESS,
            ],
            (object) [
                'email' => 'alice.personal@homeadverts.com',
                'type' => EmailTypes::PERSONAL,
            ],
        ];

        $this->assertEquals(
            [
                'alice.personal@homeadverts.com',
                'alice.business@homeadverts.com',
            ],
            $emailSorter->getSignupEmailsOrdered($emailsOnlyPersonalAndBusiness)
        );
        $this->assertEquals(
            [
                'alice.personal@homeadverts.com',
            ],
            $emailSorter->getLeadEmailsOrdered($emailsOnlyPersonalAndBusiness)
        );

        $emailsOnlyLeadAndUnknown = [
            (object) [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
            (object) [
                'email' => 'alice.lead_router@homeadverts.com',
                'type' => EmailTypes::LEAD_ROUTER,
            ],
        ];

        $this->assertEmpty($emailSorter->getSignupEmailsOrdered($emailsOnlyLeadAndUnknown));
        $this->assertEquals(
            [
                'alice.lead_router@homeadverts.com',
            ],
            $emailSorter->getLeadEmailsOrdered($emailsOnlyLeadAndUnknown)
        );

        $emailsOnlyUnknown = [
            (object) [
                'email' => 'alice.gateway@homeadverts.com',
                'type' => 'unknown',
            ],
        ];

        $this->assertEmpty(
            $emailSorter->getSignupEmailsOrdered($emailsOnlyUnknown)
        );
        $this->assertEmpty(
            $emailSorter->getLeadEmailsOrdered($emailsOnlyUnknown)
        );
    }
}
