<?php

namespace AppBundle\Validation;

use AppBundle\Entity\Storage\File;
use AppBundle\Validation\Constraint\FileOrigin;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class FileOriginValidator extends ConstraintValidator
{
    /**
     * @param string     $value
     * @param Constraint $constraint
     */
    public function validate($value, Constraint $constraint)
    {
        /* @var FileOrigin $constraint */

        if (!in_array($value, File::ORIGINS)) {
            $this->context
                ->buildViolation($constraint->message)
                ->addViolation()
            ;
        }
    }
}
