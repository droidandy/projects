<?php

namespace AppBundle\Import\Adapter\Realogy;

use GuzzleHttp\Exception\RequestException;

class ApiException extends \RuntimeException
{
    /**
     * @var RequestException
     */
    private $requestException;
    /**
     * @var object
     */
    private $parsedResponse;

    public function __construct($parsedResponse, RequestException $requestException)
    {
        $this->parsedResponse = $parsedResponse;
        $this->requestException = $requestException;

        parent::__construct(
            $requestException->getMessage(),
            $requestException->getCode(),
            $requestException->getPrevious()
        );
    }

    public function getParsedResponse()
    {
        return $this->parsedResponse;
    }

    public function getHttpCode()
    {
        if (!$this->requestException->getResponse()) {
            return 500;
        }

        return $this->requestException->getResponse()->getStatusCode();
    }

    public function getRequestException()
    {
        return $this->requestException;
    }
}
