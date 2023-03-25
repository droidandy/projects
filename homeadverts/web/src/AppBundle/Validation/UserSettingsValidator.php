<?php

namespace AppBundle\Validation;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class UserSettingsValidator extends ConstraintValidator
{
    /**
     * @var array
     */
    private $allowedSettings;

    /**
     * @param array $allowedSettings
     */
    public function __construct(array $allowedSettings)
    {
        $this->allowedSettings = $allowedSettings;
    }

    /**
     * {@inheritdoc}
     */
    public function validate($values, Constraint $constraint)
    {
        if (!$values) {
            return;
        }

        if (!is_array($values)) {
            $this->context
                ->buildViolation('User setting must be array of key/value pairs')
                ->addViolation();
        } else {
            foreach ($values as $key => $value) {
                if (!in_array($key, $this->allowedSettings)) {
                    $this->context
                        ->buildViolation(sprintf(
                            'Property "%s" is not a part of settings',
                            $key
                        ))
                        ->addViolation();
                }

                if (!is_bool($value)) {
                    $this->context
                        ->buildViolation(sprintf(
                            'The "%s" value for the property "%s" is not a boolean type.',
                            $key,
                            $value
                        ))
                        ->addViolation();
                }
            }
        }
    }
}
