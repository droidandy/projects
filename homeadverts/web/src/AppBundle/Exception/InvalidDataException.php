<?php

namespace AppBundle\Exception;

use Symfony\Component\Validator\ConstraintViolationListInterface;

class InvalidDataException extends \RuntimeException
{
    /**
     * @var ConstraintViolationListInterface
     */
    private $list;

    /**
     * @param ConstraintViolationListInterface $list
     */
    public function __construct(ConstraintViolationListInterface $list)
    {
        parent::__construct(sprintf('Validation failed with %d error(s).', count($list)));

        $this->list = $list;
    }

    public function getConstraintViolationList()
    {
        return $this->list;
    }
}
