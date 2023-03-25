<?php

namespace AppBundle\Request;

use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\Tag;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Search\UserType;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter;

/**
 * @Service
 * @Tag("request.param_converter")
 */
class UserTypeParamConverter implements ParamConverterInterface
{
    /**
     * @var CamelCaseToSnakeCaseNameConverter
     */
    private $nameConverter;

    /**
     * {@inheritdoc}
     */
    public function apply(Request $request, ParamConverter $configuration)
    {
        $name = $configuration->getName();
        $type = new UserType(
            $request->attributes->get(
                $name,
                $request->attributes->get(
                    $this->getNameConverter()->normalize($name)
                )
            )
        );
        $request->attributes->set($name, $type);
    }

    /**
     * {@inheritdoc}
     */
    public function supports(ParamConverter $configuration)
    {
        if (null === $configuration->getClass()) {
            return false;
        }

        return UserType::class === $configuration->getClass();
    }

    private function getNameConverter()
    {
        if (!$this->nameConverter) {
            $this->nameConverter = new CamelCaseToSnakeCaseNameConverter();
        }

        return $this->nameConverter;
    }
}
