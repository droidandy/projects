<?php

namespace AppBundle\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 * @Target({"PROPERTY", "METHOD", "ANNOTATION"})
 */
class UserSettings extends Constraint
{
    public $message = 'The settings are not valid';

    public function validatedBy()
    {
        return 'user_settings_validator';
    }
}
