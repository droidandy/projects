<?php

namespace AppBundle\Validation;

use AppBundle\Entity\Messenger\Message;
use AppBundle\Validation\Constraint\MessageOwnership;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class MessageOwnershipValidator extends ConstraintValidator
{
    /**
     * @param Message    $message
     * @param Constraint $constraint
     */
    public function validate($message, Constraint $constraint)
    {
        /* @var MessageOwnership $constraint */
        if ((null !== $message) && ($message->user !== $this->context->getRoot()->user)) {
            $this->context
                ->buildViolation($constraint->message)
                ->addViolation();
        }
    }
}
