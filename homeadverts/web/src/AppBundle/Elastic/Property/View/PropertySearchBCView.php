<?php

namespace AppBundle\Elastic\Property\View;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyVideo;
use AppBundle\Elastic\Integration\View\ViewInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use AppBundle\Localisation\AddressTranslator;
use AppBundle\Service\File\ImageHelper;
use AppBundle\Entity\User\User;

// todo: To be removed, this file is not used.

class PropertySearchBCView implements ViewInterface
{
    const FILTER_THUMBNAIL_MEDIUM = 'property_medium';
    const FILTER_CAROUSEL = 'property_large';

    /**
     * @var ImageHelper
     */
    protected $imageHelper;
    /**
     * @var CacheManager
     */
    protected $cacheManager;
    /**
     * @var AddressTranslator
     */
    protected $addressTranslator;
    /**
     * @var User
     */
    protected $user;
    /**
     * @var
     */
    protected $context;
    /**
     * @var TokenStorage
     */
    protected $tokenStorage;

    /**
     * ResultsDecorator constructor.
     *
     * @param \AppBundle\Helper\ImageHelper $imageHelper
     * @param CacheManager                  $cacheManager
     * @param AddressTranslator             $addressTranslator
     * @param TokenStorage                  $tokenStorage
     */
    public function __construct(
        ImageHelper $imageHelper,
        CacheManager $cacheManager,
        AddressTranslator $addressTranslator,
        TokenStorage $tokenStorage
    ) {
        $this->imageHelper = $imageHelper;
        $this->cacheManager = $cacheManager;
        $this->addressTranslator = $addressTranslator;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'search_property';
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
        $propertyIds = [];

        if (!count($results)) {
            return $properties;
        }

        $this->user = $this->getUser();

        /**
         * @var
         * @var Property $property
         */
        foreach ($results as $index => $property) {
            $propertyDoc = [
                '_id' => $property->getId(),
                '_source' => [
                    'bedrooms' => $property->getBedrooms(),
                    'bathrooms' => $property->getBathrooms(),
                    'source' => $property->getSource(),
                    'sourceRef' => $property->getSourceRef(),
                    'currency' => $property->getCurrency(),
                    'price' => $property->getPrice(),
                    'period' => $property->getPeriod(),
                    'priceHidden' => $property->priceHidden(),
                    'type' => $property->getType(),
                    'country' => $property->getAddress()->getCountry(),
                    'stateCounty' => $property->getAddress()->getStateCounty(),
                    'townCity' => $property->getAddress()->getTownCity(),
                ],
            ];

            $propertyDoc['address'] = $this->addressTranslator->translate($property->getAddress());

            $propertyDoc['_source']['thumbnail'] = $this->getThumbnail($property->getPhotos());
            $propertyDoc['_source']['photos'] = $this->getCarouselPhotos($property->getPhotos());
            $propertyDoc['_source']['videos'] = $this->getVideos($property->getVideos());

            //organise the properties by their id in our new array
            $properties[$property->getId()] = $propertyDoc;
            $propertyIds[] = $property->getId();
        }

        return array_values($properties);
    }

    /**
     * Return the user from the container.
     *
     * @return User|bool
     */
    private function getUser()
    {
        $token = $this->tokenStorage->getToken();
        if (!$token) {
            return false;
        }

        $user = $token->getUser();
        if (!$user) {
            return false;
        }

        return $user instanceof User ? $user : false;
    }

    /**
     * @param array|ArrayCollection $photos
     *
     * @return string
     *
     * @throws \Exception
     */
    private function getThumbnail($photos)
    {
        if (isset($photos[0])) {
            return $this->cacheManager->getBrowserPath(
                $this->imageHelper->getImagePath($photos[0]->getUrl()),
                Property::FILTER_THUMBNAIL_MEDIUM
            );
        }
    }

    /**
     * @param array|ArrayCollection $photos
     *
     * @return array
     */
    private function getCarouselPhotos($photos)
    {
        // todo: Outdated & Duplicated with PropertyService::buildCarousel
        $carousel = [];
        $preloadedKeys = [0, 1, 2, count($photos) - 1];

        foreach ($photos as $k => $photo) {
            $image = $this->cacheManager->getBrowserPath(
                $this->imageHelper->getImagePath($photo->getUrl()),
                'property_large'
            );

            if (in_array($k, $preloadedKeys)) {
                $carousel[] = [
                    'url' => $image,
                    'lazyload' => $image,
                ];
            } else {
                $carousel[] = [
                    'url' => '#',
                    'lazyload' => $image,
                ];
            }
        }

        return $carousel;
    }

    /**
     * @param array|ArrayCollection $videos
     *
     * @return array
     */
    private function getVideos($videos)
    {
        $videoDocs = [];

        /** @var PropertyVideo $video */
        foreach ($videos as $video) {
            $videoDocs[] = [
                'type' => $video->getType(),
                'url' => $video->getVideoUrl(),
            ];
        }

        return $videoDocs;
    }
}
