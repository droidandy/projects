<?php

namespace AppBundle\Elastic\Property\Mapping;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyPhoto;
use AppBundle\Entity\Property\PropertyVideo;
use AppBundle\Entity\Property\PropertyVideo3d;
use AppBundle\Elastic\Integration\Mapping\MappingTemplate;
use AppBundle\Entity\User\User;
use Symfony\Component\Console\Helper\ProgressHelper;
use Symfony\Component\Console\Output\OutputInterface;

class PropertyMapping extends MappingTemplate
{
    const TYPE = 'property';

    /**
     * @return PropertyDocumentParser
     */
    public function getDocumentParser()
    {
        return new PropertyDocumentParser($this->getIndex(), $this->getMapping());
    }

    /**
     * @param object $entity
     *
     * @return bool
     */
    public function support($entity)
    {
        return $entity instanceof Property;
    }

    /**
     * @return array
     */
    protected function getProperties()
    {
        return [
            'location' => [
                'type' => 'geo_shape',
            ],
            'point' => [
                'type' => 'geo_point',
            ],
            'userID' => [
                'type' => 'integer',
            ],
            'company' => [
                'type' => 'object',
            ],
            'agent' => [
                'type' => 'object',
            ],
            'address' => [
                'type' => 'keyword',
            ],
            'mlsRef' => [
                'type' => 'keyword',
            ],
            'sourceGuid' => [
                'type' => 'keyword',
            ],
            'source' => [
                'type' => 'keyword',
            ],
            'sourceUrl' => [
                'type' => 'keyword',
            ],
            'sourceRef' => [
                'type' => 'keyword',
            ],
            'zip' => [
                'type' => 'keyword',
            ],
            'country' => [
                'type' => 'keyword',
            ],
            'addressHidden' => [
                'type' => 'boolean',
            ],
            'googleLocations' => [
                'type' => 'object',
                'properties' => [
                    'id' => [
                        'type' => 'long',
                    ],
                    'placeId' => [
                        'type' => 'keyword',
                    ],
                ],
            ],
            'bedrooms' => [
                'type' => 'short',
            ],
            'bathrooms' => [
                'type' => 'short',
            ],
            'price' => [
                'type' => 'long',
            ],
            'priceHidden' => [
                'type' => 'boolean',
            ],
            'basePrice' => [
                'type' => 'integer',
            ],
            'type' => [
                'type' => 'integer',
            ],
            'status' => [
                'type' => 'integer',
            ],
            'availability' => [
                'type' => 'integer',
            ],
            'rental' => [
                'type' => 'boolean',
            ],
            'featured' => [
                'type' => 'boolean',
            ],
            'featuredAt' => [
                'type' => 'date',
            ],
            'likesCount' => [
                'type' => 'integer',
            ],
            'dateAdded' => [
                'type' => 'date',
            ],
            'dateUpdated' => [
                'type' => 'date',
            ],
            'deletedAt' => [
                'type' => 'date',
            ],
        ];
    }

    /**
     * @param Property $property
     *
     * @return array
     */
    protected function doGetDocument($property)
    {
        return [
            'location' => [
                'type' => 'point',
                'coordinates' => [(float) $property->address->longitude, (float) $property->address->latitude],
            ],
            'point' => [
                'lat' => (float) $property->address->latitude,
                'lon' => (float) $property->address->longitude,
            ],
            'status' => $property->status,
            'name' => $property->name,
            'availability' => $property->availability,
            'address1' => $property->address ? $property->address->street : null, // TODO - remove someday
            'address2' => $property->address ? $property->address->aptBldg : null, // TODO - remove someday
            'street' => $property->address ? $property->address->street : null,
            'aptBldg' => $property->address ? $property->address->aptBldg : null,
            'neighbourhood' => $property->address ? $property->address->neighbourhood : null,
            'postcode' => $property->address ? $property->address->zip : null,
            'zip' => $property->address ? $property->address->zip : null,
            'townCity' => $property->address ? $property->address->townCity : null,
            'stateCounty' => $property->address ? $property->address->stateCounty : null,
            'country' => $property->address ? $property->address->country : null,
            'addressHidden' => $property->address ? $property->address->hidden : null,
            'googleLocations' => $this->getGoogleLocations($property),
            'descriptions' => count($property->getDescriptions()),
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'price' => $property->price,
            'priceHidden' => $property->priceQualifier < 0,
            'currency' => $property->currency,
            'basePrice' => $property->basePrice,
            'period' => $property->period,
            'baseMonthlyPrice' => $property->baseMonthlyPrice,
            'type' => $property->type,
            'rental' => $property->rental,
            'yearBuilt' => (int) $property->yearBuilt,
            'grossLivingArea' => (float) $property->grossLivingArea,
            'plotArea' => (float) $property->plotArea,
            'source' => $property->source,
            'sourceUrl' => $property->sourceUrl,
            'sourceRef' => $property->sourceRef,
            'sourceGuid' => $property->sourceGuid,
            'mlsRef' => $property->mlsRef,
            'likesCount' => $property->getLikesCount(),
            'dateAdded' => $property->dateAdded->format('c'),
            'dateUpdated' => date('c'),
            'featured' => (bool) $property->featured,
            'featuredAt' => $property->featured ? $property->featured->format('c') : null,
            'userID' => $property->getUser() ? $property->getUser()->getId() : null,
            'companyId' => $property->company ? $this->getUser($property->company) : null,
            'agent' => $property->getUser() ? $this->getUser($property->getUser()) : null,
            'videos' => $this->getVideos($property),
            'videos3d' => $this->getVideos3d($property),
            'primaryPhotoIndex' => $property->getPrimaryPhotoDefaultIndex(),
            'primaryPhotoManualIndex' => $property->getPrimaryPhotoManualIndex(),
            'description' => $this->getDescription($property),
            'photos' => $this->getPhotos($property),
            'deletedAt' => $property->getDeletedAt() ? $property->getDeletedAt()->format('c') : null,
        ];
    }

    /**
     * @param PropertyPhoto $propertyPhoto
     *
     * @return array
     */
    private function getPhoto(PropertyPhoto $propertyPhoto)
    {
        return [
            'url' => $propertyPhoto->getUrl(),
            'hash' => $propertyPhoto->getHash(),
            'sort' => $propertyPhoto->getSort(),
        ];
    }

    /**
     * @param Property $property
     *
     * @return array
     */
    private function getPhotos(Property $property)
    {
        $photos = [];

        foreach ($property->getPhotos() as $photo) {
            $photos[] = $this->getPhoto($photo);
        }

        return $photos;
    }

    /**
     * @param Property $property
     *
     * @return array
     */
    private function getVideos(Property $property)
    {
        /** @var PropertyVideo $video */
        $videos = [];

        if ($collection = $property->getVideos()) {
            foreach ($collection as $video) {
                $videos[] = [
                    'type' => $video->getType(),
                    'url' => $video->getVideoUrl(),
                ];
            }
        }

        return $videos;
    }

    /**
     * @param Property $property
     *
     * @return array
     */
    private function getVideos3d(Property $property)
    {
        /** @var PropertyVideo3d $video */
        $videos = [];

        if ($collection = $property->getVideos3d()) {
            foreach ($collection as $video) {
                $videos[] = [
                    'url' => $video->url,
                ];
            }
        }

        return $videos;
    }

    /**
     * @param User $user
     *
     * @return array
     */
    private function getUser(User $user)
    {
        return [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'companyName' => $user->getCompanyName(),
            'phone' => $user->phone,
        ];
    }

    private function getGoogleLocations(Property $property)
    {
        $locations = [];
        foreach ($property->getGoogleLocations() as $googleLocation) {
            $locations[] = [
                'id' => $googleLocation->getId(),
                'placeId' => $googleLocation->getPlaceId(),
            ];
        }

        return $locations;
    }

    /**
     * @param Property $property
     *
     * @return string
     */
    private function getDescription(Property $property)
    {
        if ($property->getOriginalDescription()) {
            return $property->getOriginalDescription()->description;
        }

        return '';
    }

    /**
     * @param ProgressHelper|null  $progress
     * @param OutputInterface|null $output
     */
    public function populateFromDB(ProgressHelper $progress = null, OutputInterface $output = null)
    {
        $totalEntities = $this->dbRepo->getEntitiesForDocTotal();
        if ($progress) {
            $progress->start($output, $totalEntities);
        }
        foreach ($this->dbRepo->getEntities() as $row) {
            $entity = $row[0];
            $this->addDocument($entity->getId(), $entity);
            if ($progress) {
                $progress->advance();
            }
            $this->em->detach($entity);
        }
    }
}
