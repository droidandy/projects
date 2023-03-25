<?php

namespace AppBundle\Elastic\Property\Query\Criteria\Type;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeTemplate;

class PropertyType extends TypeTemplate
{
    /**
     * @var PropertyRepository
     */
    private $propertyRepo;

    /**
     * PropertyType constructor.
     *
     * @param PropertyRepository $propertyRepo
     */
    public function __construct(PropertyRepository $propertyRepo)
    {
        $this->propertyRepo = $propertyRepo;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'property';
    }

    /**
     * @return array
     */
    protected function getDefaults()
    {
        return [
            '__default' => null,
            '__required' => false,
            '__normalize' => function ($property) {
                if (!$property instanceof Property) {
                    $property = $this->propertyRepo->find($property);

                    if (!$property) {
                        return null;
                    }
                }

                return $property;
            },
        ];
    }
}
