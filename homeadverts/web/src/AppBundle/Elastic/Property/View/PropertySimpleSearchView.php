<?php

namespace AppBundle\Elastic\Property\View;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\View\ViewInterface;
use Symfony\Component\Routing\RouterInterface;

class PropertySimpleSearchView implements ViewInterface
{
    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * @param RouterInterface $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'property_simple_search';
    }

    /**
     * @param mixed $results
     * @param array $runtimeOptions
     *
     * @return array
     */
    public function __invoke($results, $runtimeOptions = [])
    {
        $properties = [];
        $items = [];

        if (count($results)) {
            /*
             * @var Property
             */
            foreach ($results as $index => $property) {
                $property->address = $property->getAddress();

                //organise the properties by their id in our new array
                $properties[$property->getId()] = $property;
            }

            $items = array_map(function (Property $property) {
                $address = $property->address->getShortAddress();

                return [
                    'id' => $property->getId(),
                    'zip' => $property->address->getZip(),
                    'mls' => $property->getMlsRef(),
                    'ref' => $property->getSourceRef(),
                    'guid' => $property->getSourceGuid(),
                    'agent' => [
                        'details' => [
                            'name' => $property->getUser()->getName(),
                            'companyName' => $property->getUser()->getCompanyName(),
                            'phone' => $property->getUser()->phone,
                        ],
                        'url' => $this->router->generate('ha_user_profile', [
                            'id' => $property->getUser()->getId(),
                            'slug' => $property->getUser()->slug(),
                        ], true),
                    ],
                    'address' => $address,
                    'url' => $this->router->generate('property_details', [
                        'id' => $property->getId(),
                        'slug' => $property->getSlug(),
                    ], true),
                ];
            }, $properties);
        }

        return [
            'items' => $items,
            'total' => $results->getTotal(),
        ];
    }
}
