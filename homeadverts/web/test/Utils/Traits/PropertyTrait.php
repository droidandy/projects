<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Storage\File;
use AppBundle\Entity\Property\PropertyVideo3d;
use DateTime;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyLike;
use AppBundle\Entity\Property\PropertyDescription;
use AppBundle\Entity\Property\PropertyPhoto;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Entity\Property\PropertyVideo;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\User\User;

trait PropertyTrait
{
    use FakerAbstractTrait;

    /**
     * @var bool
     */
    private $flush = true;
    /**
     * @var Property[]
     */
    private $properties;
    /**
     * @var callable|null
     */
    private $propertyDataGenerator;

    /**
     * @param User     $user
     * @param Property $property
     * @param DateTime $createdAt
     *
     * @return PropertyLike
     */
    public function newPropertyLikePersistent(User $user, Property $property, DateTime $createdAt = null)
    {
        $like = new PropertyLike();
        $like->setUser($user);
        $like->setLiked($property);

        if ($createdAt) {
            $like->setCreatedAt($createdAt);
        }

        $property->likes->add($like);
        $this->em->persist($like);
        $this->em->flush($like);

        return $like;
    }

    /**
     * @param User $user
     *
     * @return Property
     */
    private function newPropertyToImport(User $user)
    {
        $faker = $this->getFaker();
        $name = $faker->text(40);
        $property = $this->newProperty([
            'user' => $user,
        ]);
        $property->setName($name);

        for ($i = 0; $i <= 20; ++$i) {
            $url = sprintf(
                'https://luxuryaffairs-dev.s3.amazonaws.com/properties/69672/%s-%s.jpeg',
                $i,
                md5($i)
            );
            $photo = new PropertyPhoto();

            $photo->setUrl($url);
            $photo->setHash($i);
            $photo->setSort($i);
            $property->addPhoto($photo);
        }

        return $property;
    }

    /**
     * @param array $propertyData
     *
     * @return Property
     */
    public function newProperty(array $propertyData = [])
    {
        $faker = $this->getFaker();

        if ($this->propertyDataGenerator) {
            $propertyDataGenerator = $this->propertyDataGenerator;
            $propertyData = array_replace_recursive($propertyDataGenerator(), $propertyData);
        }

        $propertyData = array_replace_recursive([
            'id' => $faker->randomNumber(),
            'status' => Property::STATUS_ACTIVE,
            'type' => PropertyTypes::DETACHED,
            'rental' => false,
            'featured' => null,
            'mls_ref' => $faker->uuid,
            'source_guid' => null,
            'source' => 'listhub',
            'source_url' => $faker->url,
            'source_ref' => $faker->uuid,
            'bedrooms' => $faker->numberBetween(1, 10),
            'bathrooms' => $faker->numberBetween(1, 10),
            'currency' => 'USD',
            'price' => $faker->randomNumber(7),
            'price_qualifier' => Property::PRICE_QUALIFIER_NONE,
            'monthly_price' => null,
            'base_monthly_price' => null,
            'period' => null,
            'year_built' => null,
            'gross_living_area' => null,
            'plot_area' => null,
            'address' => [],
            'google_locations' => [],
            'user' => $this->newUser(),
            'user_source_ref' => null,
            'user_source_ref_type' => null,
            'photos' => [],
            'videos' => [],
            'videos3d' => [],
            'descriptions' => [],
            'price_hidden' => false,
            'address_hidden' => false,
            'date_added' => new \DateTime(),
        ], $propertyData);

        if ($propertyData['price_hidden']) {
            $propertyData['price_qualifier'] = Property::PRICE_QUALIFIER_ENQUIRE;
        }
        if ($propertyData['address_hidden']) {
            $propertyData['address']['hidden'] = true;
        }

        $property = new Property();
        $property->setId($propertyData['id']);
        $property->status = $propertyData['status'];
        if (is_string($propertyData['date_added'])) {
            $propertyData['date_added'] = new \DateTime($propertyData['date_added']);
        }
        $property->dateAdded = $propertyData['date_added'];
        $property->type = $propertyData['type'];
        $property->rental = $propertyData['rental'];
        if (is_bool($propertyData['featured'])) {
            $propertyData['featured'] = $propertyData['featured'] ? new \DateTime() : null;
        }
        $property->featured = $propertyData['featured'];
        $property->availability = $propertyData['rental'] ? Property::AVAILABILITY_TO_RENT : Property::AVAILABILITY_FOR_SALE;
        $property->mlsRef = $propertyData['mls_ref'];
        $property->sourceGuid = $propertyData['source_guid'];
        $property->source = $propertyData['source'];
        $property->sourceUrl = $propertyData['source_url'];
        $property->sourceRef = $propertyData['source_ref'];
        $property->bedrooms = $propertyData['bedrooms'];
        $property->bathrooms = $propertyData['bathrooms'];
        $property->address = $this->newAddress($propertyData['address']);
        if ($propertyData['google_locations']) {
            $googleLocations = [];
            foreach ($propertyData['google_locations'] as $googleLocation) {
                $googleLocations[] = $this->newGoogleLocation($googleLocation);
            }
            $property->setGoogleLocations($googleLocations);
        }
        if (is_array($propertyData['user'])) {
            $propertyData['user'] = $this->newUser($propertyData['user']);
        }
        $property->user = $propertyData['user'];
        $property->userSourceRef = $propertyData['user_source_ref'];
        $property->userSourceRefType = $propertyData['user_source_ref_type'];
        $property->price = $propertyData['price'];
        $property->basePrice = $propertyData['price'];
        $property->baseMonthlyPrice = $propertyData['base_monthly_price'];
        $property->priceQualifier = $propertyData['price_qualifier'];
        $property->currency = $propertyData['currency'];
        $property->period = $propertyData['period'];
        $property->yearBuilt = $propertyData['year_built'];
        $property->grossLivingArea = $propertyData['gross_living_area'];
        $property->plotArea = $propertyData['plot_area'];

        if (!empty($propertyData['photos'])) {
            if (true === $propertyData['photos']) {
                $propertyData['photos'] = [
                    'property_photo_url_1', 'property_photo_url_2', 'property_photo_url_3',
                    'property_photo_url_4', 'property_photo_url_5', 'property_photo_url_6',
                    'property_photo_url_7', 'property_photo_url_8', 'property_photo_url_9',
                    'property_photo_url_10',
                ];
            }

            $property->setPhotos($this->getPhotos($propertyData['photos']));

            if (isset($propertyData['primary_photo'])) {
                $property->setPrimaryPhotoDefault($property->getPhotos()[$propertyData['primary_photo']]);
            }
            if (isset($propertyData['primary_photo_manual'])) {
                $property->setPrimaryPhotoManual($property->getPhotos()[$propertyData['primary_photo_manual']]);
            }
        }

        if (!empty($propertyData['videos'])) {
            if (true === $propertyData['videos']) {
                $propertyData['videos'] = [
                    [
                        'type' => 'youtube',
                        'url' => 'youtube_url_1',
                    ],
                ];
            }
            foreach ($this->getVideos($propertyData['videos']) as $video) {
                $property->addVideo($video);
            }
        }
        if (!empty($propertyData['videos3d'])) {
            if (true === $propertyData['videos3d']) {
                $propertyData['videos3d'] = [
                    [
                        'url' => 'matterport',
                    ],
                ];
            }
            foreach ($this->getVideos3d($propertyData['videos3d']) as $video3d) {
                $property->addVideo3d($video3d);
            }
        }
        if (!empty($propertyData['descriptions'])) {
            if (true === $propertyData['descriptions']) {
                $propertyData['descriptions'] = [
                    [
                        'description' => 'text',
                        'locale' => 'en',
                    ],
                ];
            }
            foreach ($this->getDescriptions($propertyData['descriptions']) as $desc) {
                $property->addDescription($desc);
            }
        }

        // BugFix when descriptions are missing
        if ($property->getDescriptions()->count() === 0) {
            $description = $faker->text(2000);
            $propertyDescription = new PropertyDescription();
            $propertyDescription->setDescription($description);
            $propertyDescription->setProperty($property);
            $propertyDescription->locale = 'en';

            $property->getDescriptions()->add($propertyDescription);
        }

        return $property;
    }

    /**
     * @param array $propertyDatasByLocations
     *
     * @return Property[]
     */
    public function createProperties(array $propertyDatasByLocations = [])
    {
        $properties = [];

        foreach ($propertyDatasByLocations as $location => $propertyDatas) {
            if (is_array($propertyDatas)) {
                foreach ($propertyDatas as $propertyData) {
                    $properties[] = $property = $this->newProperty($propertyData);
                    $property->address = $this->createAddressInLocation($location);
                    if ($this->createGoogleLocations) {
                        $property->setGoogleLocations($this->getGoogleLocationsForLocation($location));
                    }
                }
            } elseif (is_int($propertyDatas)) {
                for ($i = 0; $i < $propertyDatas; ++$i) {
                    $properties[] = $property = $this->newProperty();
                    $this->properties[$property->getId()] = $property;
                    $property->address = $this->createAddressInLocation($location);
                    if ($this->createGoogleLocations) {
                        $property->setGoogleLocations($this->getGoogleLocationsForLocation($location));
                    }
                }
            } else {
                throw new \InvalidArgumentException(
                    'Argument array values should be rather array of property data or amount of properties'
                );
            }
        }

        return $properties;
    }

    /**
     * @param array $propertyDatasByLocations
     *
     * @return Property[]
     */
    public function createPropertiesForSale(array $propertyDatasByLocations = [])
    {
        $properties = $this->createProperties($propertyDatasByLocations);
        foreach ($properties as $property) {
            $property->rental = false;
        }

        return $properties;
    }

    /**
     * @param array $propertyDatasByLocations
     *
     * @return Property[]
     */
    public function createPropertiesToRent(array $propertyDatasByLocations = [])
    {
        $properties = $this->createProperties($propertyDatasByLocations);
        foreach ($properties as $property) {
            $property->rental = true;
        }

        return $properties;
    }

    /**
     * @param array  $propertyDatasByLocations
     * @param string $createMethod
     *
     * @return Property[]
     */
    public function createPropertiesPersistent(
        array $propertyDatasByLocations = [],
        $createMethod = 'createProperties'
    ) {
        $em = $this->getEntityManager();
        $properties = $this->$createMethod($propertyDatasByLocations);
        foreach ($properties as $property) {
            $em->persist($property->getUser());
            $em->persist($property);
        }
        if ($this->flush) {
            $em->flush($properties);

            $client = $this->getContainer()->get('es_client');
            $client->indices()->refresh(['index' => 'test_properties']);
        }

        return $properties;
    }

    /**
     * @param array $propertyDatasByLocations
     *
     * @return Property[]
     */
    public function createPropertiesForSalePersistent(array $propertyDatasByLocations = [])
    {
        return $this->createPropertiesPersistent($propertyDatasByLocations, 'createPropertiesForSale');
    }

    /**
     * @param array $propertyDatasByLocations
     *
     * @return Property[]
     */
    public function createPropertiesToRentPersistent(array $propertyDatasByLocations = [])
    {
        return $this->createPropertiesPersistent($propertyDatasByLocations, 'createPropertiesToRent');
    }

    /**
     * @param array $data
     *
     * @return Property
     */
    public function newPropertyPersistent(array $data = [])
    {
        $property = $this->newProperty($data);

        $em = $this->getEntityManager();
        $em->persist($property);
        $em->flush($property);

        return $property;
    }

    /**
     * @param $propertyId
     *
     * @return Property
     */
    public function getProperty($propertyId)
    {
        if (isset($this->properties[$propertyId])) {
            return $this->properties[$propertyId];
        }

        throw new \InvalidArgumentException('There is not property with such id');
    }

    private function getPhotos($photoData)
    {
        $photos = [];
        foreach ($photoData as $photoDataItem) {
            $photos[] = $photo = new PropertyPhoto();
            if (is_array($photoDataItem)) {
                $photo->setUrl($photoDataItem['url']);
                $photo->hash = $photoDataItem['hash'];
                $photo->sourceUrl = isset($photoDataItem['source_url']) ? $photoDataItem['source_url'] : null;
                $photo->sort = isset($photoDataItem['sort']) ? $photoDataItem['sort'] : null;
            } else {
                $photo->setUrl($photoDataItem);
            }
        }

        return new ArrayCollection($photos);
    }

    private function getVideos($videoData)
    {
        $videos = [];
        foreach ($videoData as $videoDataItem) {
            $videos[] = $video = new PropertyVideo();
//            $video->type = $videoDataItem['type'];
            $video->url = $videoDataItem['url'];
        }

        return new ArrayCollection($videos);
    }

    private function getVideos3d($videoData)
    {
        $videos3d = [];
        foreach ($videoData as $video3dDataItem) {
            $videos3d[] = $video3d = new PropertyVideo3d();
//            $video->type = $videoDataItem['type'];
            $video3d->url = $video3dDataItem['url'];
        }

        return new ArrayCollection($videos3d);
    }

    private function getDescriptions($descData)
    {
        $descriptions = [];
        foreach ($descData as $descDataItem) {
            $descriptions[] = $desc = new PropertyDescription();
            $desc->description = $descDataItem['description'];
            $desc->locale = $descDataItem['locale'];
        }

        return new ArrayCollection($descriptions);
    }

    /**
     * @return EntityManager
     */
    abstract public function getEntityManager();

    /**
     * @return ContainerInterface
     */
    abstract public function getContainer();

    /**
     * @param array $userData
     *
     * @return User
     */
    abstract public function newUser(array $userData = []);

    /**
     * @param array $addressData
     *
     * @return Address
     */
    abstract public function newAddress(array $addressData = []);

    /**
     * @param array $googleLocationData
     *
     * @return GoogleLocation
     */
    abstract public function newGoogleLocation(array $googleLocationData = []);
}
