<?php

namespace AppBundle\Import\Email;

use AppBundle\Import\User\EmailTypes;

class EmailSorter
{
    const SIGNUP_TYPES_ORDERED = [
        EmailTypes::PERSONAL,
        EmailTypes::VANITY,
        EmailTypes::BUSINESS,
    ];

    const LEAD_TYPES_ORDERED = [
        EmailTypes::LEAD_ROUTER,
        EmailTypes::PERSONAL,
    ];

    public function getSignupEmailsOrdered($emails)
    {
        return $this->getEmailsOrdered($emails, self::SIGNUP_TYPES_ORDERED);
    }

    public function getLeadEmailsOrdered($emails)
    {
        return $this->getEmailsOrdered($emails, self::LEAD_TYPES_ORDERED);
    }

    private function getEmailsOrdered($emails, $typesOrdered)
    {
        $emailsOrdered = [];
        foreach ($emails as $email) {
            if (!in_array($email->type, $typesOrdered)) {
                continue;
            } else {
                $idx = array_search($email->type, $typesOrdered);
                $emailsOrdered[$idx] = $email->email;
            }
        }
        ksort($emailsOrdered);

        return array_values(array_unique($emailsOrdered));
    }
}
