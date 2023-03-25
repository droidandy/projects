<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;

trait AddressTrait
{
    use FakerAbstractTrait;

    public function newAddress(array $addressData = [])
    {
        $faker = $this->getFaker();

        $addressData = array_replace_recursive([
            'street' => $faker->streetAddress,
            'apt_bldg' => $faker->buildingNumber,
            'neighbourhood' => '',
            'town_city' => $faker->city,
            'state_county' => 'NY',
            'country' => $faker->countryCode,
            'zip' => $faker->postcode,
            'coords' => [],
            'hidden' => false,
        ], $addressData);

        $address = new Address(
            $addressData['street'],
            $addressData['apt_bldg'],
            $addressData['town_city'],
            $addressData['state_county'],
            $addressData['country'],
            $addressData['zip']
        );
        if ($addressData['coords']) {
            $address->setCoords(new Coords($addressData['coords']['lat'], $addressData['coords']['lng']));
        }
        $address->hidden = $addressData['hidden'];
        $address->neighbourhood = $addressData['neighbourhood'];

        return $address;
    }
}
