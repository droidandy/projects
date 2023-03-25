<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyPhoto;
use AppBundle\Import\Job\PrepareThumbnails;
use AppBundle\Import\Job\RemoveImages;
use AppBundle\Import\Media\MediaException;
use AppBundle\Import\Media\PhotoComparisonStrategyInterface;
use AppBundle\Import\Media\PhotoManager;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Helper\RedisClient;

class FakePhotoHandler
{
    /**
     * @var PhotoManager
     */
    private $photoManager;
    /**
     * @var callable
     */
    private $logger;
    /**
     * @var PhotoComparisonStrategyInterface
     */
    private $comparisonStrategy;
    /**
     * @var CollectionMerger
     */
    private $collectionMerger;
    /**
     * @var RedisClient
     */
    private $redisClient;

    private $photoPool = [
        'added' => [],
        'removed' => [],
    ];

    private $photoBuffer = [];

    /**
     * @param PhotoManager                     $photoManager
     * @param PhotoComparisonStrategyInterface $comparisonStrategy
     * @param callable                         $logger
     * @param RedisClient                      $redisClient
     */
    public function __construct(
        PhotoManager $photoManager,
        PhotoComparisonStrategyInterface $comparisonStrategy,
        callable $logger,
        RedisClient $redisClient
    ) {
        $this->photoManager = $photoManager;
        $this->comparisonStrategy = $comparisonStrategy;
        $this->logger = $logger;
        $this->redisClient = $redisClient;

        $this->collectionMerger = new CollectionMerger(
            [$this, 'createPhoto'],
            function ($photo, $propertyPhoto) {
                return $this->updateMetadata($propertyPhoto, $photo);
            },
            function ($photo, $existingPhoto) {
                return $this->comparisonStrategy->isEqual($photo, $existingPhoto);
            }
        );
    }

    public function handle(NormalisedPropertyInterface $normalisedProperty, Property $property, callable $addError = null)
    {
        $addError = $addError ? $addError : function () {
        };

        $this->photoBuffer = [];
        $this->bufferPhotoDiff($normalisedProperty, $property);

        $stats = [
            'added' => 0,
            'modified' => 0,
            'deleted' => 0,
            'errors' => 0,
        ];

        $normalisedPrimaryPhoto = $normalisedProperty->getPrimaryPhoto();
        $normalizedPhotos = $normalisedProperty->getPhotos();
        $this->log('Processing %s photos', count($normalizedPhotos));

        list($propertyPhotos, $propertyPhotosRemoved) = $this
            ->collectionMerger
            ->merge(
                $normalizedPhotos,
                $property->getPhotos(),
                function (PropertyPhoto $propertyPhoto) use ($property, &$stats, $addError, $normalisedPrimaryPhoto) {
                    $this->handleAdd($propertyPhoto, $normalisedPrimaryPhoto, $property, $addError, $stats);
                },
                function (PropertyPhoto $propertyPhoto) use ($property, &$stats, $normalisedPrimaryPhoto) {
                    ++$stats['modified'];

                    if ($propertyPhoto->getSourceUrl() == $normalisedPrimaryPhoto) {
                        $property->setPrimaryPhotoDefault($propertyPhoto);
                    }
                },
                function (PropertyPhoto $propertyPhoto) use ($property, &$stats) {
                    $property->removePhoto($propertyPhoto);
                    $this->addToRemovedPool($propertyPhoto);
                    ++$stats['deleted'];
                }
            )
        ;

        $this->log(
            'added %s / modified %s / deleted %s / errors %s',
            $stats['added'],
            $stats['modified'],
            $stats['deleted'],
            $stats['errors']
        );
        $this->logPhotoDiff($stats);

        $this->purgePools();
        $this->scheduleForEsUpdate($property);

        return $stats;
    }

    public function createPhoto($photo)
    {
        $propertyPhoto = new PropertyPhoto();

        return $this->updateMetadata($propertyPhoto, $photo);
    }

    private function updateMetadata(PropertyPhoto $propertyPhoto, $photo)
    {
        $propertyPhoto->sort = $photo->index - 1;
        $propertyPhoto->sourceUrl = $photo->url;
        $propertyPhoto->modified = $photo->modified;

        return $propertyPhoto;
    }

    private function addToAddedPool(PropertyPhoto $photo)
    {
        $this->photoPool['added'][] = [
            'path' => parse_url($photo->url)['path'],
            'force' => false,
        ];
    }

    private function addToRemovedPool(PropertyPhoto $photo)
    {
        $this->photoPool['removed'][] = $photo->url;
    }

    private function purgePools()
    {
        if (!empty($this->photoPool['added'])) {
            $this->redisClient->enqueue(
                'thumb_process',
                PrepareThumbnails::class,
                ['images' => $this->photoPool['added']]
            );

            $this->photoPool['added'] = [];
        }
        foreach ($this->photoPool['removed'] as $path) {
            \Resque::enqueue(
                'photo_remove',
                RemoveImages::class,
                [
                    'images' => [
                        ['path' => $path],
                    ],
                ]
            );
            $this->photoPool['removed'] = [];
        }
    }

    private function scheduleForEsUpdate(Property $property)
    {
        $this->log('Scheduled for update %s', $property);
        //force extra update, hack due to sync between ES and SQL
        $property->dateUpdated = new \DateTime();
    }

    private function handleAdd(
        PropertyPhoto $propertyPhoto,
        $normalisedPrimaryPhoto,
        Property $property,
        callable $addError,
        &$stats
    ) {
        $propertyPhoto->setProperty($property);
        try {
            $this->photoManager->process($propertyPhoto);

            $property->addPhoto($propertyPhoto);
            $this->addToAddedPool($propertyPhoto);
            ++$stats['added'];

            if ($propertyPhoto->getSourceUrl() == $normalisedPrimaryPhoto) {
                $property->setPrimaryPhotoDefault($propertyPhoto);
            }
        } catch (MediaException $e) {
            $addError($e->getMessage());
            $this->error('Photo error: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            ++$stats['errors'];
        }
    }

    private function log($msg, ...$args)
    {
        $logger = $this->logger;

        $logger('log', $msg, ...$args);
    }

    private function notice($msg, ...$args)
    {
        $logger = $this->logger;

        $logger('notice', $msg, ...$args);
    }

    private function error($msg, ...$args)
    {
        $logger = $this->logger;

        $logger('error', $msg, ...$args);
    }

    private function bufferPhotoDiff(NormalisedPropertyInterface $normalisedProperty, Property $property)
    {
        $this->photoBuffer = [
            'normalised_property' => [
                'primary_photo' => $normalisedProperty->getPrimaryPhoto(),
                'photos' => array_map(
                    function ($photo) {
                        return [$photo->index, $photo->url];
                    },
                    $normalisedProperty->getPhotos()
                ),
            ],
            'property' => [
                'primary_photo' => $property->getPrimaryPhoto()
                    ? $property->getPrimaryPhoto()->getSourceUrl()
                    : null,
                'photos' => array_map(
                    function (PropertyPhoto $photo) {
                        return [$photo->getSort(), $photo->getSourceUrl()];
                    },
                    $property->getPhotos()->toArray()
                ),
            ],
        ];
    }

    private function logPhotoDiff($stats)
    {
        if ($stats['added'] > 0) {
            $this->log('debug', json_encode($this->photoBuffer, JSON_PRETTY_PRINT));
        }

        $this->photoBuffer = [];
    }
}
