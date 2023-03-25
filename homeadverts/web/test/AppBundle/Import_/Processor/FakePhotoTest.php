<?php

namespace Test\AppBundle\Import_\Processor;

use AppBundle\Entity\ImportJob;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyPhoto;
use AppBundle\Import\Job\Process;
use AppBundle\Import\Media\LHToSIRMigrationPhotoComparisonStrategy;
use AppBundle\Import\Media\PhotoManager;
use AppBundle\Import\NormalisedProperty;
use AppBundle\Import\Processor\FakePhoto;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DependencyInjection\ContainerInterface;

class FakePhotoTest extends \PHPUnit_Framework_TestCase
{
    public function testProcess()
    {
        foreach ($this->getPropertyData() as $propertyData) {
            $photoManager = $this->getPhotoManager();
            $comparisonStrategy = $this->getComparisonStrategy();
            $logger = $this->getLogger();
            $container = $this->getContainer();
            $container
                ->method('get')
                ->withConsecutive(
                    ['ha.import.photo_manager', ContainerInterface::EXCEPTION_ON_INVALID_REFERENCE],
                    ['ha.import.comparison_strategy', ContainerInterface::EXCEPTION_ON_INVALID_REFERENCE],
                    ['monolog.logger.import', ContainerInterface::EXCEPTION_ON_INVALID_REFERENCE]
                )
                ->willReturnOnConsecutiveCalls(
                    $photoManager,
                    $comparisonStrategy,
                    $logger
                )
            ;

            list($normalizedProperty, $property, $expectedStats) = $propertyData;

            $normalizedPhotos = $normalizedProperty->getPhotos();
            $propertyPhotos = $property->getPhotos();
            $photoEqualityMap = [
                [$normalizedPhotos[0], $propertyPhotos[0], true],
                [$normalizedPhotos[0], $propertyPhotos[1], false],
                [$normalizedPhotos[1], $propertyPhotos[0], false],
                [$normalizedPhotos[1], $propertyPhotos[1], false],
            ];
            $shouldBeRemovedPhoto = $propertyPhotos[1];

            $comparisonStrategy
                ->method('isEqual')
                ->willReturnMap($photoEqualityMap)
            ;

            $fakePhoto = $this->getFakePhoto($container, 1, $this->getJob());
            $fakePhoto->process($normalizedProperty, $property);

            $propertyPhotos = $property->getPhotos();
            $this->assertEquals(
                $expectedStats['added'] + $expectedStats['modified'],
                $propertyPhotos->count()
            );

            $this->assertNotContains($shouldBeRemovedPhoto, $propertyPhotos->toArray());
            $this->assertNull($shouldBeRemovedPhoto->getProperty());

            $propertyPhoto = $propertyPhotos->first();
            $this->assertEquals('photo_url_1', $propertyPhoto->getSourceUrl());
            $this->assertEquals('2018/7/09', $propertyPhoto->getModified());
            $this->assertEquals(0, $propertyPhoto->getSort());

            $propertyPhoto = $propertyPhotos->next();
            $this->assertEquals('photo_url_2', $propertyPhoto->getSourceUrl());
            $this->assertEquals('2018/7/09', $propertyPhoto->getModified());
            $this->assertEquals(1, $propertyPhoto->getSort());

            $this->assertEquals(
                $expectedStats,
                $fakePhoto->getStats()
            );
            $this->assertEquals(
                $normalizedProperty->getPrimaryPhoto(),
                $property->getPrimaryPhoto()->getSourceUrl()
            );
        }
    }

    private function getFakePhoto($container, $importJob, $job)
    {
        return new FakePhoto($container, $this->getImportJob(), $job);
    }

    private function getImportJob()
    {
        return $this->getMockBuilder(ImportJob::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getJob()
    {
        return $this->getMockBuilder(Process::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getContainer()
    {
        return $this
            ->getMockBuilder(Container::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getPhotoManager()
    {
        return $this
            ->getMockBuilder(PhotoManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getComparisonStrategy()
    {
        return $this
            ->getMockBuilder(LHToSIRMigrationPhotoComparisonStrategy::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;
    }

    private function getPropertyData()
    {
        return [
            [
                $this->getNormalizedProperty('photo_url_2'),
                $this->getProperty(),
                [
                    'added' => 1,
                    'modified' => 1,
                    'deleted' => 1,
                    'errors' => 0,
                ],
            ],
            [
                $this->getNormalizedProperty('photo_url_1'),
                $this->getProperty(),
                [
                    'added' => 1,
                    'modified' => 1,
                    'deleted' => 1,
                    'errors' => 0,
                ],
            ],
        ];
    }

    private function getNormalizedProperty($primaryPhoto)
    {
        return new NormalisedProperty([
            'sourceName' => 'sothebys',
            'primaryPhoto' => $primaryPhoto,
            'photos' => [
                (object) [
                    'url' => 'photo_url_1',
                    'index' => '1',
                    'modified' => '2018/7/09',
                ],
                (object) [
                    'url' => 'photo_url_2',
                    'index' => '2',
                    'modified' => '2018/7/09',
                ],
            ],
        ]);
    }

    private function getProperty()
    {
        $propertyPhoto1 = new PropertyPhoto();
        $propertyPhoto1->setSourceUrl('lh_url_1');
        $propertyPhoto1->setModified('2016/1/09');
        $propertyPhoto1->setSort(0);

        $propertyPhoto2 = new PropertyPhoto();
        $propertyPhoto2->setSourceUrl('lh_url_3');
        $propertyPhoto2->setModified('2016/1/09');
        $propertyPhoto2->setSort(1);

        $property = new Property();
        $property->id = 1;
        $property->setPrimaryPhotoDefault($propertyPhoto1);
        $property->getPhotos()->add($propertyPhoto1);
        $property->getPhotos()->add($propertyPhoto2);

        return $property;
    }
}
