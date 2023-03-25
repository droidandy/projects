<?php

namespace AppBundle\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 * @Target({"PROPERTY", "METHOD", "ANNOTATION"})
 */
class FileOrigin extends Constraint
{
    /**
     * @var string
     */
    public $message = 'File origin is wrong';

    /**
     * @return string
     */
    public function validatedBy()
    {
        return 'file_origin_validator';
    }
}
