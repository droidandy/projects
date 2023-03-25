<?php

namespace AppBundle\Validation;

use AppBundle\Service\User\UserManager;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class UniqueUserEmailValidator extends ConstraintValidator
{
    /**
     * @var UserManager
     */
    private $um;

    /**
     * @param UserManager $um
     */
    public function __construct(UserManager $um)
    {
        $this->um = $um;
    }

    /**
     * @param string     $value
     * @param Constraint $constraint
     */
    public function validate($value, Constraint $constraint)
    {
        if (null === $value) {
            return;
        }
        $user = $this->um->findUserBy([
            'email' => $value,
            'deletedAt' => null,
        ]);

        if ($user) {
            $this->context
                ->buildViolation($constraint->message)
                ->setParameter('%email%', $value)
                ->addViolation()
            ;
        }
    }
}
