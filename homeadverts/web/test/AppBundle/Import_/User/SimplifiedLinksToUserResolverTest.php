<?php

namespace Test\AppBundle\Import_\User;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Import\User\SimplifiedLinksToUserResolver;
use AppBundle\Entity\User\User;

class SimplifiedLinksToUserResolverTest extends \PHPUnit_Framework_TestCase
{
    public function testResolveLinksToUser()
    {
        $user = new User();
        $user->sourceRef = 'abc';
        $user->sourceRefType = 'guid';

        $properties = [
            $this->getProperty(Property::STATUS_INCOMPLETE),
            $this->getProperty(Property::STATUS_INCOMPLETE),
            $this->getProperty(Property::STATUS_INCOMPLETE),
            $this->getProperty(Property::STATUS_INVALID),
        ];

        $propertyRepo = $this->getPropertyRepo();
        $propertyRepo
            ->expects($this->once())
            ->method('getUnresolvedPropertiesForUser')
            ->willReturn($properties)
        ;

        $resolver = new SimplifiedLinksToUserResolver($propertyRepo);
        $resolver->resolveLinksToUser($user);

        for ($i = 0; $i < 3; ++$i) {
            $this->assertEquals(Property::STATUS_ACTIVE, $properties[$i]->status);
            $this->assertEquals('abc', $properties[$i]->userSourceRef);
            $this->assertEquals('guid', $properties[$i]->userSourceRefType);
        }

        $this->assertEquals(Property::STATUS_INVALID, $properties[3]->status);
        $this->assertEquals('abc', $properties[3]->userSourceRef);
        $this->assertEquals('guid', $properties[3]->userSourceRefType);
    }

    private function getPropertyRepo()
    {
        return $this
            ->getMockBuilder(PropertyRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getProperty($status)
    {
        $property = new Property();
        $property->status = $status;

        return $property;
    }
}
