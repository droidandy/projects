<?php

namespace AppBundle\Elastic\Integration\Query\Criteria;

use Throwable;

class ValidationException extends \Exception
{
    /**
     * @var array
     */
    private $errors;

    public function __construct($errors, $message = '', $code = 0, Throwable $previous = null)
    {
        $this->errors = $errors;
        parent::__construct($message, $code, $previous);
    }

    /**
     * @return array
     */
    public function getErrors()
    {
        return $this->errors;
    }
}
