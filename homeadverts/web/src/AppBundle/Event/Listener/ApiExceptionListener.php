<?php

namespace AppBundle\Event\Listener;

use AppBundle\Exception\InvalidDataException as ValidationFailedException;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Validator\ConstraintViolation;

class ApiExceptionListener
{
    /**
     * @param GetResponseForExceptionEvent $event
     *
     * @return string
     */
    private function getRequestType(GetResponseForExceptionEvent $event)
    {
        $contentType = $event
            ->getRequest()
            ->headers
            ->get('Content-Type');

        if (preg_match('/application\/json/', $contentType)) {
            return 'api';
        }

        return 'web';
    }

    /**
     * @param GetResponseForExceptionEvent $event
     */
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $response = $this->exceptionEventProcessor($event);

        if ('api' === $this->getRequestType($event)) {
            $event->setResponse($response);
        }
    }

    /**
     * Set response vars and generate response.
     *
     * @param string $code
     * @param string $message
     * @param array  $headers
     *
     * @return JsonResponse $response
     */
    private function createResponse($code, $message, $headers = [])
    {
        return new JsonResponse(
            [
                'code' => $code,
                'message' => $message,
            ],
            $code,
            $headers
        );
    }

    /**
     * Set response vars and generate response with errors.
     *
     * @param mixed $errors
     * @param array $headersw
     *
     * @return JsonResponse $response
     */
    private function createErrorsResponse($errors, $headers = [])
    {
        return new JsonResponse(
            [
                'code' => Response::HTTP_BAD_REQUEST,
                'errors' => $errors,
            ],
            Response::HTTP_BAD_REQUEST,
            $headers
        );
    }

    /**
     * Do error processing by error type.
     * "responseException" will be used, if the error did not match any of mentioned.
     *
     * @param GetResponseForExceptionEvent $event
     *
     * @return JsonResponse $response
     */
    private function exceptionEventProcessor(GetResponseForExceptionEvent $event)
    {
        $exception = $event->getException();
        $response = null;

        switch (true) {
            case $exception instanceof ValidationFailedException:
                $response = $this->responseAPIValidationFailedException($exception);
                break;

            case $exception instanceof HttpExceptionInterface:
                $response = $this->responseHttpException($exception);
                break;

            case $exception instanceof Exception:
                $response = $this->responseException($exception);
                break;
        }

        return $response;
    }

    /**
     * Response for NotFoundHttpException (Route was not found).
     *
     * @param NotFoundHttpException $exception
     *
     * @return JsonResponse
     */
    private function responseHttpException(HttpExceptionInterface $exception)
    {
        return $this->createResponse(
            $exception->getStatusCode(),
            $exception->getMessage(),
            $exception->getHeaders()
        );
    }

    /**
     * Response for ValidationFailedException.
     *
     * @param ValidationFailedException $exception
     *
     * @return JsonResponse
     */
    private function responseAPIValidationFailedException(ValidationFailedException $exception)
    {
        /**
         * @var ConstraintViolation
         */
        $violations = $exception->getConstraintViolationList();
        $errors = array();

        foreach ($violations as $violation) {
            $errors[$violation->getPropertyPath()] = $violation->getMessage();
        }

        return $this->createErrorsResponse($errors);
    }

    /**
     * Response for Exception.
     *
     * @param Exception $exception
     *
     * @return JsonResponse
     */
    private function responseException(Exception $exception)
    {
        if (method_exists($exception, 'getStatusCode')) {
            $code = $exception->getStatusCode();
        } else {
            $code = $exception->getCode();
        }

        // Any type of exception that we are not expecting gives a 500
        if (!array_key_exists($code, Response::$statusTexts)) {
            $code = 500;
        }

        /*
         * Status codes < 100 and > 600 comes from exceptions not related with http exceptions.
         * You should not mask these codes. You should display $exception->getMessage() and debug
         * exception.
         */

        return $this->createResponse(
            $code,
            $exception->getMessage()
        );
    }
}
