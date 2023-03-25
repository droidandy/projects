<?php

namespace Test\HA\SearchBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyPhoto;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Class PropertyTest.
 */
class PropertyTest extends KernelTestCase
{
    public function testGetInlineCarousel10vs0()
    {
        $mock = $this->mockPropertyWithPhotos(10, 0);
        $carousel = $mock->getPhotosOrdered();

        $this->assertEquals($carousel[0]->getSort(), 0);
        $this->assertEquals($carousel[1]->getSort(), 1);
        $this->assertEquals($carousel[2]->getSort(), 2);
        $this->assertEquals($carousel[3]->getSort(), 3);
        $this->assertEquals($carousel[4]->getSort(), 4);
        $this->assertEquals($carousel[5]->getSort(), 5);
        $this->assertEquals($carousel[6]->getSort(), 6);
        $this->assertEquals($carousel[7]->getSort(), 7);
        $this->assertEquals($carousel[8]->getSort(), 8);
        $this->assertEquals($carousel[9]->getSort(), 9);
    }

    public function testGetInlineCarousel10vs5()
    {
        $mock = $this->mockPropertyWithPhotos(10, 5);
        $carousel = $mock->getPhotosOrdered();

        $this->assertEquals($carousel[0]->getSort(), 5);
        $this->assertEquals($carousel[1]->getSort(), 6);
        $this->assertEquals($carousel[2]->getSort(), 7);
        $this->assertEquals($carousel[3]->getSort(), 8);
        $this->assertEquals($carousel[4]->getSort(), 9);
        $this->assertEquals($carousel[5]->getSort(), 0);
        $this->assertEquals($carousel[6]->getSort(), 1);
        $this->assertEquals($carousel[7]->getSort(), 2);
        $this->assertEquals($carousel[8]->getSort(), 3);
        $this->assertEquals($carousel[9]->getSort(), 4);
    }

    public function testGetInlineCarousel10vs8()
    {
        $mock = $this->mockPropertyWithPhotos(10, 8);
        $carousel = $mock->getPhotosOrdered();

        $this->assertEquals($carousel[0]->getSort(), 8);
        $this->assertEquals($carousel[1]->getSort(), 9);
        $this->assertEquals($carousel[2]->getSort(), 0);
        $this->assertEquals($carousel[3]->getSort(), 1);
        $this->assertEquals($carousel[4]->getSort(), 2);
        $this->assertEquals($carousel[5]->getSort(), 3);
        $this->assertEquals($carousel[6]->getSort(), 4);
        $this->assertEquals($carousel[7]->getSort(), 5);
        $this->assertEquals($carousel[8]->getSort(), 6);
        $this->assertEquals($carousel[9]->getSort(), 7);
    }

    public function testGetInlineCarousel10vs9()
    {
        $mock = $this->mockPropertyWithPhotos(10, 9);
        $carousel = $mock->getPhotosOrdered();

        $this->assertEquals($carousel[0]->getSort(), 9);
        $this->assertEquals($carousel[1]->getSort(), 0);
        $this->assertEquals($carousel[2]->getSort(), 1);
        $this->assertEquals($carousel[3]->getSort(), 2);
        $this->assertEquals($carousel[4]->getSort(), 3);
        $this->assertEquals($carousel[5]->getSort(), 4);
        $this->assertEquals($carousel[6]->getSort(), 5);
        $this->assertEquals($carousel[7]->getSort(), 6);
        $this->assertEquals($carousel[8]->getSort(), 7);
        $this->assertEquals($carousel[9]->getSort(), 8);
    }

    private function mockPropertyWithPhotos($total, $primaryIndex)
    {
        $property = new Property();
        $photos = new ArrayCollection();

        for ($i = 0; $i < $total; ++$i) {
            $photo = new PropertyPhoto();
            $photo->setSort($i);
            $photo->setUrl($i);
            $photo->setSourceUrl($i);
            $photo->setProperty($property);
            $photo->hash = $i;
            $photos[] = $photo;

            if ($primaryIndex == $i) {
                $primaryPhoto = $photo;
            }
        }

        $property->setPrimaryPhotoManual($primaryPhoto);
        $property->setPhotos($photos);

        return $property;
    }
}
