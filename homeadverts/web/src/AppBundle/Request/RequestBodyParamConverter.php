<?php

namespace AppBundle\Request;

use JMS\Serializer\Exception\RuntimeException;
use JMS\Serializer\SerializerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;

class RequestBodyParamConverter implements ParamConverterInterface
{
    /**
     * @var string
     */
    private $requestType;
    /**
     * @var SerializerInterface
     */
    private $serializer;
    /**
     * @var ValidatorInterface
     */
    private $validator;
    /**
     * @var string
     */
    private $validationErrorsArgument;

    /**
     * @param string              $requestType
     * @param SerializerInterface $serializer
     * @param ValidatorInterface  $validator
     * @param string              $validationErrorsArgument
     */
    public function __construct(
        $requestType,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        $validationErrorsArgument
    ) {
        $this->requestType = $requestType;
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->validationErrorsArgument = $validationErrorsArgument;
    }

    /**
     * @param Request        $request
     * @param ParamConverter $configuration
     */
    public function apply(Request $request, ParamConverter $configuration)
    {
        $this->validateRequest($request);
        $object = $this->deserialize($request, $configuration);
        $violationList = $this->validateResult($object);

        $request->attributes->set(
            $this->validationErrorsArgument,
            $violationList
        );
        $request->attributes->set(
            $configuration->getName(),
            $object
        );
    }

    /**
     * @param ParamConverter $configuration
     *
     * @return bool
     */
    public function supports(ParamConverter $configuration)
    {
        return null !== $configuration->getClass();
    }

    /**
     * @param Request $request
     */
    private function validateRequest(Request $request)
    {
        if ($request->getContentType() != $this->requestType) {
            throw new BadRequestHttpException();
        }
    }

    /**
     * @param Request        $request
     * @param ParamConverter $configuration
     *
     * @return array|\JMS\Serializer\scalar|object
     */
    private function deserialize(Request $request, ParamConverter $configuration)
    {
        try {
            $object = $this->serializer->deserialize(
                $request->getContent(),
                $configuration->getClass(),
                $this->requestType
            );
        } catch (RuntimeException $e) {
            $this->throwException($e->getMessage());
        }

        return $object;
    }

    /**
     * @param $object
     *
     * @return ConstraintViolationListInterface
     */
    private function validateResult($object)
    {
        return $this->validator->validate($object);
    }

    /**
     * @param $message
     * @param ...$params
     */
    private function throwException($message, ...$params)
    {
        throw new BadRequestHttpException(sprintf($message, ...$params));
    }
}
