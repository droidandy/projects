<?php

namespace AppBundle\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 * @Target({"PROPERTY", "METHOD", "ANNOTATION"})
 */
class UniqueUserEmail extends Constraint
{
    /**
     * @var string
     */
    public $message = 'This email is already in use';

    /**
     * @return string
     */
    public function validatedBy()
    {
        return 'unique_user_email_validator';
    }
}
