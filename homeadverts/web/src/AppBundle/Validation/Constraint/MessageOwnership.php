<?php

namespace AppBundle\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 * @Target({"PROPERTY", "METHOD", "ANNOTATION"})
 */
class MessageOwnership extends Constraint
{
    /**
     * @var string
     */
    public $message = 'File uploader must be the owner of message';

    /**
     * @return string
     */
    public function validatedBy()
    {
        return 'message_ownership_validator';
    }
}
