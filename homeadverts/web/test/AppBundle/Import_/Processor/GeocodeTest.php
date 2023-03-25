<?php

namespace Test\AppBundle\Import_\Processor;

use AppBundle\Embeddable\Coords;
use AppBundle\Import\Job\Process;
use AppBundle\Import\NormalisedProperty;
use AppBundle\Import\Processor\Geocode;
use Doctrine\ORM\EntityManager;
use HA\SearchBundle\Entity\Property;
use Symfony\Component\DependencyInjection\ContainerInterface;

class GeocodeTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var ContainerInterface
     */
    private $container;
    /**
     * @var Process
     */
    private $job;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var Geocode
     */
    private $geocode;
    /**
     * @var array
     */
    private $addressData = [
        [
            'db' => [
                'country' => 'US',
                'townCity' => 'Larchmont',
                'neighborhood' => null,
                'stateCounty' => 'NY',
                'street' => '60 Park Avenue',
                'aptBldg' => null,
                'zip' => '10538',
                'hidden' => false,
                'coords' => ['lat' => '40.9181788', 'lng' => '-73.7463367'],
            ],
            'sir' => [
                'country_iso_code' => 'US',
                'city' => 'Larchmont',
                'neighborhood_name' => '',
                'state_iso_code' => 'NY',
                'address1' => '60 Park Avenue',
                'address2' => '',
                'address3' => '',
                'postal_code' => '10538',
                'show_address' => 'Y',
                'latitude' => '40.918030000',
                'longitude' => '-73.746401000',
            ],
        ],
        [
            'db' => [
                'country' => 'FR',
                'townCity' => 'DINARD',
                'neighborhood' => null,
                'stateCounty' => 'E',
                'street' => '',
                'aptBldg' => null,
                'zip' => '35800',
                'hidden' => true,
                'coords' => ['lat' => '48.6330240', 'lng' => '-2.0551250'],
            ],
            'sir' => [
                'country_iso_code' => 'FR',
                'city' => 'DINARD',
                'neighborhood_name' => '',
                'state_iso_code' => 'E',
                'address1' => '',
                'address2' => '',
                'address3' => '',
                'postal_code' => '35800',
                'show_address' => 'Y',
                'latitude' => '48.636906700',
                'longitude' => '-2.068133400',
            ],
        ],
        [
            'db' => [
                'country' => 'US',
                'townCity' => 'Bradford',
                'neighborhood' => null,
                'stateCounty' => 'NH',
                'street' => '72 West Main',
                'aptBldg' => null,
                'zip' => '03221',
                'hidden' => false,
                'coords' => ['lat' => '43.2413836', 'lng' => '-71.9756990'],
            ],
            'sir' => [
                'country_iso_code' => 'US',
                'city' => 'Bradford',
                'neighborhood_name' => '',
                'state_iso_code' => 'NH',
                'address1' => '72 West Main',
                'address2' => '',
                'address3' => '',
                'postal_code' => '03221',
                'show_address' => 'Y',
                'latitude' => '43.269694000',
                'longitude' => '-71.960822000',
            ],
        ],
    ];

    protected function setUp()
    {
        $this->container = $this->getServiceContainer();
        $this->job = $this->getJob();
        $this->em = $this->getEntityManager();
        $this->geocode = $this->getGeocode($this->container, $this->job);
    }

    public function testProcessWithoutCall()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $container */
        $container = $this->container;
        $container
            ->expects($this->any())
            ->method('get')
            ->with('em')
            ->willReturn($this->em)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->any())
            ->method('contains')
            ->with($this->isInstanceOf(Property::class))
            ->willReturn(true)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $job */
        $job = $this->job;
        $job
            ->expects($this->never())
            ->method('log')
        ;

        foreach ($this->addressData as $addressData) {
            $normalisedProperty = $this->getNormalisedProperty($addressData['sir']);
            $property = $this->getProperty($addressData['db']);

            $this->geocode->process($normalisedProperty, $property);
        }
    }

    private function getProperty($addressData)
    {
        $property = new Property();
        $property
            ->address
            ->setStreet($addressData['street'])
            ->setAptBldg($addressData['aptBldg'])
            ->setNeighbourhood($addressData['neighborhood'])
            ->setCountry($addressData['country'])
            ->setStateCounty($addressData['stateCounty'])
            ->setTownCity($addressData['townCity'])
            ->setZip($addressData['zip'])
            ->setHidden($addressData['hidden'])
            ->setCoords(new Coords($addressData['coords']['lat'], $addressData['coords']['lng']))
        ;

        return $property;
    }

    private function getNormalisedProperty($addressData)
    {
        return new NormalisedProperty([
            'street' => $addressData['address1'],
            'aptBldg' => $this->prepareAptBldg($addressData['address2'], $addressData['address3']),
            'townCity' => !empty($addressData['city']) ? $addressData['city'] : null,
            'neighbourhood' => !empty($addressData['neighborhood_name']) ? $addressData['neighborhood_name'] : null,
            'stateCounty' => !empty($addressData['state_iso_code']) ? $addressData['state_iso_code'] : null,
            'country' => $addressData['country_iso_code'],
            'zip' => !empty($addressData['postal_code']) ? $addressData['postal_code'] : null,
            'addressHidden' => 'Y' == $addressData['show_address'] ? false : true,
            'latitude' => null,  // We can't trust Listhub latlngs
            'longitude' => null, // We can't trust Listhub latlngs
            'latitudeFallback' => $addressData['latitude'], // We can't trust Listhub latlngs
            'longitudeFallback' => $addressData['longitude'], // We can't trust Listhub latlngs
        ]);
    }

    private function prepareAptBldg($address2, $address3)
    {
        $address = [];
        if ($address2) {
            $address[] = $address2;
        }
        if ($address3) {
            $address[] = $address3;
        }

        return count($address) ? join(' ', $address) : null;
    }

    private function getServiceContainer()
    {
        return $this->getMockForAbstractClass(ContainerInterface::class);
    }

    private function getEntityManager()
    {
        return $this
            ->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getJob()
    {
        return $this
            ->getMockBuilder(Process::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getGeocode($container, $job)
    {
        return new Geocode($container, 1, $job);
    }
}
