<?php

namespace AppBundle\Entity\Property;

use AppBundle\Entity\Messenger\Room;
use AppBundle\Helper\StringUtils;
use Cocur\Slugify\Slugify;
use Doctrine\Common\Collections\ArrayCollection;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use AppBundle\Entity\Traits\ViewCountTrait;
use AppBundle\Entity\Traits\ImpressionCountTrait;
use AppBundle\Entity\Traits\ShareCountTrait;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Traits\GoogleLocationTrait;
use AppBundle\Geo\Geocode\UnfoldableInterface;
use AppBundle\Service\Article\Processor\HeadTextSubtitleExtractor;
use AppBundle\Entity\Traits\MessagesTrait;

/**
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity
 * @ORM\Table(
 *     name="property",
 *     indexes={
 *          @ORM\Index(name="ref_idx", columns={"sourceRef"}),
 *          @ORM\Index(name="featured_idx", columns={"featured"})
 *     }
 * )
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Property\PropertyRepository")
 * @JMS\ExclusionPolicy("all")
 */
class Property implements UnfoldableInterface
{
    use IdTrait;
    use GoogleLocationTrait;
    use ViewCountTrait;
    use ImpressionCountTrait;
    use ShareCountTrait;
    use MessagesTrait;

    const FILTER_THUMBNAIL_SMALL_EXTRA = 'property_small_extra';
    const FILTER_THUMBNAIL_SMALL = 'property_small';
    const FILTER_THUMBNAIL_MEDIUM = 'property_medium';
    const FILTER_THUMBNAIL_LARGE = 'property_large';

    const PERIOD_DAY = 1;
    const PERIOD_WEEK = 2;
    const PERIOD_MONTH = 3;
    const PERIOD_YEAR = 4;
    const PERIOD_SEASONAL = 5;

    const STATUS_DELETED = -100;
    const STATUS_INVALID = -10;
    const STATUS_INCOMPLETE = 0;
    const STATUS_INACTIVE = 50;
    const STATUS_ACTIVE = 100;
    const STATUS_ERROR = 1000;

    const AVAILABILITY_ON_MARKET = 50;
    const AVAILABILITY_FOR_SALE = 100;
    const AVAILABILITY_TO_RENT = 110;
    const AVAILABILITY_FOR_AUCTION = 200;
    const AVAILABILITY_UNDER_OFFER = 300;
    const AVAILABILITY_SOLD_STC = 400;
    const AVAILABILITY_LET_AGREED = 410;
    const AVAILABILITY_SOLD = 500;
    const AVAILABILITY_RENTED = 510;
    const AVAILABILITY_RESERVED = 600;

    const PRICE_QUALIFIER_ENQUIRE = -100;
    const PRICE_QUALIFIER_NONE = 0;
    const PRICE_QUALIFIER_GUIDE_PRICE = 100;
    const PRICE_QUALIFIER_OFFERS_IN_REGION = 200;

    //universal point of reference for property market strings
    const MARKET_RENTAL = 'to-rent';
    const MARKET_SALE = 'for-sale';
    const MARKET_ALL = 'all';

    const AREA_FEET_SQ = 'sqft';
    const AREA_METRE_SQ = 'sqm';
    const AREA_ACRE_SQ = 'acres';

    const MEDIA_ALL = 'all';
    const MEDIA_VIDEO = 'video';
    const MEDIA_3D = '3d';

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(name="user", referencedColumnName="id", nullable=true)
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     * @JMS\MaxDepth(2)
     */
    public $user;
    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(name="team_id", referencedColumnName="id", nullable=true)
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Groups({"details"})
     * @JMS\ReadOnly()
     * @JMS\MaxDepth(2)
     */
    public $team;
    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(name="company_id", referencedColumnName="id", nullable=true)
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Groups({})
     * @JMS\ReadOnly()
     * @JMS\MaxDepth(2)
     */
    public $company;
    /**
     * @ORM\Column(type="smallint", nullable=true)
     * @JMS\Expose
     * @JMS\Type("int")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $bedrooms;
    /**
     * @ORM\Column(type="smallint", nullable=true)
     * @JMS\Expose
     * @JMS\Type("int")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $bathrooms;
    /**
     * @ORM\Column(type="smallint", nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $halfBathrooms;
    /**
     * @ORM\Column(type="smallint", nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $threeQuarterBathrooms;
    /**
     * @ORM\Column(type="bigint", options={"unsigned":true}, nullable=true)
     * @JMS\Expose
     * @JMS\Type("int")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $price;
    /**
     * @ORM\Column(type="string", length=3, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $currency;
    /**
     * @ORM\Column(type="decimal", precision=15, scale=2, nullable=true)
     * @JMS\Expose
     * @JMS\Type("float")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $grossLivingArea; // Known as interior size
    /**
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $grossLivingAreaUnit; // interior unit of measurement
    /**
     * @ORM\Column(type="decimal", precision=15, scale=2, nullable=true)
     * @JMS\Expose
     * @JMS\Type("float")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $plotArea; // Known as exterior size
    /**
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Expose
     * @JMS\Type("float")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $plotAreaUnit; // exterior unit of measurement
    /**
     * @ORM\Column(type="integer", nullable=true)
     * @JMS\Expose
     * @JMS\Type("int")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $yearBuilt;
    /**
     * @ORM\OneToMany(targetEntity="PropertyPhoto", mappedBy="property", cascade={"ALL"}, orphanRemoval=true)
     * @ORM\OrderBy({"sort" = "ASC"})
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Property\PropertyPhoto")
     * @JMS\Groups({})
     * @JMS\ReadOnly()
     */
    protected $photos;
    /**
     * @var PropertyPhoto
     * @ORM\OneToOne(targetEntity="PropertyPhoto", cascade={"ALL"})
     * @ORM\JoinColumn(name="primary_photo_id", referencedColumnName="id", onDelete="SET NULL")
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Property\PropertyPhoto")
     * @JMS\Groups({})
     * @JMS\ReadOnly()
     */
    protected $primaryPhoto = null;
    /**
     * @var PropertyPhoto
     * @ORM\OneToOne(targetEntity="PropertyPhoto", cascade={"ALL"})
     * @ORM\JoinColumn(name="primary_photo_manual_id", referencedColumnName="id", onDelete="SET NULL")
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Property\PropertyPhoto")
     * @JMS\Groups({})
     * @JMS\ReadOnly()
     */
    protected $primaryPhotoManual = null;
    /**
     * @ORM\OneToMany(targetEntity="PropertyVideo", mappedBy="property", cascade={"ALL"}, orphanRemoval=true)
     * @ORM\OrderBy({"sort" = "ASC"})
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Property\PropertyVideo")
     * @JMS\Groups({})
     * @JMS\ReadOnly()
     */
    protected $videos;
    /**
     * @ORM\OneToMany(
     *     targetEntity="PropertyVideo3d",
     *     mappedBy="property",
     *     cascade={"ALL"},
     *     orphanRemoval=true
     *     )
     * @ORM\OrderBy({"sort" = "ASC"})
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Property\PropertyVideo3d")
     * @JMS\Groups({})
     * @JMS\ReadOnly()
     */
    protected $videos3d;
    /**
     * @var Room
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Messenger\Room", mappedBy="property")
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Messenger\Room")
     * @JMS\Groups({"details"})
     * @JMS\MaxDepth(3)
     * @JMS\ReadOnly
     */
    public $room;
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $source;
    /**
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $sourceRef;
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $mlsRef;
    /**
     * @ORM\Column(type="string", length=1023, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $sourceUrl;
    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Address", columnPrefix = "address_")
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Embeddable\Address")
     * @JMS\Groups({"collection","details","message"})
     * @JMS\ReadOnly
     */
    public $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $sourceGuid;
    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $userSourceRef;
    /**
     * @var string
     * @ORM\Column(type="string", length=15, nullable=true)
     */
    public $userSourceRefType;
    /**
     * @var string
     * @ORM\Column(name="company_source_ref", type="string", length=255, nullable=true)
     */
    public $companySourceRef;
    /**
     * @var string
     * @ORM\Column(name="company_source_ref_type", type="string", length=15, nullable=true)
     */
    public $companySourceRefType;

    /**
     * @var string
     * @ORM\Column(type="string", nullable=true)
     */
    public $name;
    /**
     * @var \DateTime
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $featured = null;
    /**
     * @ORM\Column(type="integer")
     */
    public $status = self::STATUS_INCOMPLETE;
    /**
     * @ORM\Column(type="integer")
     */
    public $availability;
    /**
     * @ORM\Column(type="smallint", options={"unsigned":false})
     */
    public $type;
    /**
     * @ORM\Column(type="boolean")
     */
    public $rental = false;
    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    public $priceQualifier = self::PRICE_QUALIFIER_NONE;
    /**
     * @ORM\Column(type="integer", options={"unsigned":true}, nullable=true)
     */
    public $minimumDays;
    /**
     * @ORM\Column(type="integer", nullable=true, options={"unsigned":true})
     */
    public $basePrice;
    /**
     * @ORM\Column(type="string", nullable=true, length=10)
     */
    public $period;
    /**
     * @ORM\Column(type="integer", nullable=true, options={"unsigned":true})
     */
    public $baseMonthlyPrice;
    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     */
    public $dateAdded;
    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    public $addedBy;
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $dateUpdated;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    public $updatedBy;

    /**
     * @var DateTime|null
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $deletedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $expirationDate;
    /**
     * @ORM\Column(type="array", nullable=true)
     */
    public $misc;
    /**
     * @var PropertyDescription[]
     * @ORM\OneToMany(targetEntity="PropertyDescription", mappedBy="property", cascade={"ALL"})
     */
    protected $descriptions;
    /**
     * @var ArrayCollection<PropertyLike>
     * @ORM\OneToMany(
     *     targetEntity="AppBundle\Entity\Property\PropertyLike",
     *     mappedBy="liked",
     *     cascade={"all"},
     *     orphanRemoval=true,
     *     fetch="EXTRA_LAZY"
     * )
     */
    public $likes;
    /**
     * @var int
     */
    protected $likesCount = null;
    /**
     * If set, leads will go to this address instead of the account address.
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $leadEmail;

    /**
     * @return array
     */
    public static function getMediaTypes()
    {
        return [self::MEDIA_ALL, self::MEDIA_VIDEO, self::MEDIA_3D];
    }

    /**
     * @param string $market
     * @return int
     */
    public static function marketToAvailability(string $market):int
    {
        if ($market === 'to-rent') {
            return Property::AVAILABILITY_TO_RENT;
        }

        return Property::AVAILABILITY_FOR_SALE;
    }

    public function __construct($id = null)
    {
        $this->id = $id;
        $this->photos = new ArrayCollection();
        $this->videos = new ArrayCollection();
        $this->videos3d = new ArrayCollection();
        $this->descriptions = new ArrayCollection();
        $this->address = new Address();
        $this->likes = new ArrayCollection();
        $this->googleLocations = new ArrayCollection();
    }

    /**
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details","message", "room"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("title")
     *
     * @return string
     */
    public function getTitle()
    {
        $title = $this->getName();

        if ($title) {
            return $title;
        }

        return $this->getAddressLine();
    }

    /**
     * @param int $length
     *
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("intro")
     * @JMS\Groups({"collection","details","message"})
     *
     * @return string
     */
    public function getIntro($length = 200)
    {
        $this->getOriginalDescription();

        return (new HeadTextSubtitleExtractor())
            ->extractIntro(
                $this->getOriginalDescription()->description,
                $length
            );
    }

    /**
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details","message"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("addressLine")
     *
     * @param bool $withCountry
     *
     * @return string
     */
    public function getAddressLine(bool $withCountry = true): string
    {
        $address = '';

        if ($this->getAddress()->isHidden()) {
            $address .= $this->getAddress()->getTownCity();
        } else {
            $address .= $this->getAddress()->getAptBldgAndStreet().', ';
            $address .= $this->getAddress()->getZip();
        }

        if ($withCountry) {
            $address = sprintf(
                '%s, %s, ',
                $this->getAddress()->getCountryName(),
                $this->getAddress()->getStateCounty()
            );
        }

        return $address;
    }

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("likesCount")
     * @JMS\Groups({"collection","details","message"})
     *
     * @return int
     */
    public function getLikesCount(): int
    {
        return $this->likes->count();
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param array|Property $property
     *
     * @return string
     */
    public function getSlug()
    {
        $stack = implode(' ', [
            $this->getTitle(),
            PropertyTypes::getById($this->type),
            $this->market(),
            $this->address->getCountryName(),
        ]);

        return (new Slugify(Slugify::MODEARRAY))->slugify($stack);
    }

    /**
     * @return \DateTime
     */
    public function getFeatured()
    {
        return $this->featured;
    }

    /**
     * @param mixed $featured
     */
    public function setFeatured($featured)
    {
        $this->featured = $featured;
    }

    /**
     * @return string
     */
    public function getEntityType()
    {
        return 'property';
    }

    /**
     * @return ArrayCollection|PropertyPhoto[]
     */
    public function getPhotos()
    {
        return $this->photos;
    }

    /**
     * Circularly shifts property photos.
     *
     * @return ArrayCollection|PropertyPhoto[]
     */
    public function getPhotosOrdered()
    {
        $index = $this->getPrimaryPhotoIndex();
        $photos = $this->getUniquePhotos();

        $orderedPhotos = array_merge(
            array_slice($photos, $index, count($photos)),
            array_slice($photos, 0, $index)
        );

        return $orderedPhotos;
    }

    /**
     * @param ArrayCollection $photos
     */
    public function setPhotos(ArrayCollection $photos)
    {
        $this->photos = $photos;
        $this
            ->photos
            ->map(function (PropertyPhoto $propertyPhoto) {
                $propertyPhoto->setProperty($this);
            });
    }

    /**
     * @return PropertyPhoto
     */
    public function getPrimaryPhoto()
    {
        if ($this->primaryPhotoManual) {
            return $this->primaryPhotoManual;
        }

        if ($this->primaryPhoto) {
            return $this->primaryPhoto;
        }

        return $this->photos->first() ?: null;
    }

    /**
     * @param PropertyPhoto $primaryPhoto
     */
    public function setPrimaryPhotoDefault(PropertyPhoto $primaryPhoto = null)
    {
        $this->primaryPhoto = $primaryPhoto;
    }

    /**
     * @return PropertyPhoto
     */
    public function getPrimaryPhotoDefault()
    {
        return $this->primaryPhoto;
    }

    /**
     * @return PropertyPhoto
     */
    public function getPrimaryPhotoManual()
    {
        return $this->primaryPhotoManual;
    }

    /**
     * @param PropertyPhoto $primaryPhotoManual
     */
    public function setPrimaryPhotoManual(PropertyPhoto $primaryPhotoManual = null)
    {
        $this->primaryPhotoManual = $primaryPhotoManual;
    }

    public function getVideos()
    {
        return $this->videos;
    }

    /**
     * @param ArrayCollection $videos
     */
    public function setVideos(ArrayCollection $videos)
    {
        $this->videos = $videos;
    }

    public function getVideos3d()
    {
        return $this->videos3d;
    }

    /**
     * @param ArrayCollection $videos3d
     */
    public function setVideos3d(ArrayCollection $videos3d)
    {
        $this->videos3d = $videos3d;
    }

    public function addVideo3d(PropertyVideo3d $propertyVideo3d)
    {
        $this->videos3d->add($propertyVideo3d);

        $propertyVideo3d->property = $this;
    }

    public function getDescriptions()
    {
        return $this->descriptions;
    }

    /**
     * @return PropertyDescription|bool|mixed
     */
    public function getOriginalDescription()
    {
        // First try and get the english non-automatically translated version
        foreach ($this->descriptions as $desc) {
            if ('en' === $desc->getLocale()) {
                return $desc;
            }
        }

        // Otherwise just get the first non-automatically translated version
        foreach ($this->descriptions as $desc) {
            return $desc;
        }

        return false;
    }

    public function getDescriptionBlocks()
    {
        $util = new StringUtils();

        return $util->getDescriptionBlocks(
            $this->getIntro(),
            $this->getOriginalDescription()->description
        );
    }

    /**
     * @param string $locale
     *
     * @return PropertyDescription|false
     */
    public function getDescriptionForLocale($locale)
    {
        foreach ($this->descriptions as $desc) {
            if ($desc->locale === $locale) {
                return $desc;
            }
        }

        return false;
    }

    public function addDescription(PropertyDescription $description)
    {
        $this->descriptions->add($description);

        $description->property = $this;
    }

    public function removeDescription(PropertyDescription $description)
    {
        $this->descriptions->removeElement($description);
    }

    public function addPhoto(PropertyPhoto $photo)
    {
        $this->photos->add($photo);

        $photo->setProperty($this);
    }

    public function removePhoto(PropertyPhoto $photo)
    {
        $this->photos->removeElement($photo);
        $photo->setProperty(null);

        if ($photo === $this->primaryPhoto) {
            $this->primaryPhoto = null;
        }

        if ($photo === $this->primaryPhotoManual) {
            $this->primaryPhotoManual = null;
        }
    }

    /**
     * @param User $user
     *
     * @return bool
     */
    public function isUserAllowedToEdit(User $user)
    {
        if ($user->hasRole('ROLE_ADMIN') || $this->getUser()->getId() == $user->getId()) {
            return true;
        }

        return false;
    }

    /**
     * @param array $photo
     *
     * @return bool
     */
    public function isPhotoPrimary(array $photo)
    {
        if (!$this->getPrimaryPhoto()) {
            return false;
        }

        return $this->getPrimaryPhoto()->getId() == $photo['id'];
    }

    /**
     * This method is a hack that only returns photos with unique hashes.
     *
     * Really the root of the problem should be fixed in the importer.
     *
     * @return array
     */
    private function getUniquePhotos()
    {
        $hashes = [];
        $photos = iterator_to_array($this->getPhotos());

        return array_filter($photos, function ($photo) use (&$hashes) {
            /** @var PropertyPhoto $photo */
            if (in_array($photo->getHash(), $hashes)) {
                return false;
            }

            $hashes[] = $photo->getHash();

            return true;
        });
    }

    /**
     * @return int
     */
    private function getPrimaryPhotoIndex()
    {
        $primaryPhoto = $this->getPrimaryPhoto();

        if (!$primaryPhoto) {
            return 0;
        }

        $index = array_search($primaryPhoto, $this->getUniquePhotos());

        if (false === $index) {
            $index = 0;
        }

        return $index;
    }

    public function getPrimaryPhotoDefaultIndex()
    {
        if (!$this->primaryPhoto) {
            return null;
        }

        return array_search($this->primaryPhoto, $this->getPhotos()->toArray());
    }

    public function getPrimaryPhotoManualIndex()
    {
        if (!$this->primaryPhotoManual) {
            return null;
        }

        return array_search($this->primaryPhotoManual, $this->getPhotos()->toArray());
    }

    /**
     * @return PropertyVideo|null
     */
    public function getPrimaryVideo()
    {
        $videos = $this->getVideos();

        if ($videos->count()) {
            return $videos->first();
        }
    }

    public function addVideo(PropertyVideo $video)
    {
        $this->videos->add($video);

        $video->property = $this;
    }

    public function removeVideo(PropertyVideo $video)
    {
        $this->videos->removeElement($video);
    }

    /**
     * @return PropertyVideo3d|null
     */
    public function getPrimaryVideo3d()
    {
        $videos3d = $this->getVideos3d();

        if ($videos3d->count()) {
            return $videos3d->first();
        }
    }

    /**
     * Helper method to return a useful string for rental type / market type.
     *
     * @return string
     */
    public function market()
    {
        return true === $this->rental ? self::MARKET_RENTAL : self::MARKET_SALE;
    }

    /**
     * @return \AppBundle\Entity\Embeddable\Address
     */
    public function getAddress()
    {
        return $this->address;
    }

    public function __toString()
    {
        return (string) 'ID '.$this->id.' - '.$this->address->street.', '.$this->address->country;
    }

    /**
     * @return mixed
     */
    public function getLeadEmail()
    {
        return $this->leadEmail;
    }

    /**
     * @param string $leadEmail
     *
     * @return self
     */
    public function setLeadEmail($leadEmail)
    {
        $this->leadEmail = $leadEmail;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param int $availability
     */
    public function setAvailability($availability)
    {
        $this->availability = $availability;
    }

    /**
     * @return mixed
     */
    public function getAvailability()
    {
        return $this->availability;
    }

    /**
     * @return mixed
     */
    public function getSource()
    {
        return $this->source;
    }

    /**
     * @param int $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param User $user
     *
     * @return User
     */
    public function setUser(User $user)
    {
        return $this->user = $user;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return string
     */
    public function getUserSourceRef()
    {
        return $this->userSourceRef;
    }

    /**
     * @return string
     */
    public function getUserSourceRefType()
    {
        return $this->userSourceRefType;
    }

    /**
     * @return mixed
     */
    public function getRental()
    {
        return $this->rental;
    }

    /**
     * @return mixed
     */
    public function getBedrooms()
    {
        return $this->bedrooms;
    }

    /**
     * @return mixed
     */
    public function getBathrooms()
    {
        return $this->bathrooms;
    }

    /**
     * @return mixed
     */
    public function getHalfBathrooms()
    {
        return $this->halfBathrooms;
    }

    /**
     * @return mixed
     */
    public function getThreeQuarterBathrooms()
    {
        return $this->threeQuarterBathrooms;
    }

    /**
     * @return mixed
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @return mixed
     */
    public function getPriceQualifier()
    {
        return $this->priceQualifier;
    }

    public function priceHidden()
    {
        return $this->priceQualifier < 0;
    }

    /**
     * @return mixed
     */
    public function getMinimumDays()
    {
        return $this->minimumDays;
    }

    /**
     * @return mixed
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * @return mixed
     */
    public function getBasePrice()
    {
        return $this->basePrice;
    }

    /**
     * @return mixed
     */
    public function getPeriod()
    {
        return $this->period;
    }

    /**
     * @return mixed
     */
    public function getBaseMonthlyPrice()
    {
        return $this->baseMonthlyPrice;
    }

    /**
     * @param DateTime $date
     */
    public function setDateAdded(DateTime $date)
    {
        $this->dateAdded = $date;
    }

    /**
     * @return mixed
     */
    public function getDateAdded()
    {
        return $this->dateAdded;
    }

    /**
     * @return mixed
     */
    public function getAddedBy()
    {
        return $this->addedBy;
    }

    /**
     * @return DateTime|null
     */
    public function getDateUpdated()
    {
        return $this->dateUpdated;
    }

    /**
     * @return mixed
     */
    public function getUpdatedBy()
    {
        return $this->updatedBy;
    }

    /**
     * @return DateTime|null
     */
    public function getDeletedAt(): ?DateTime
    {
        return $this->deletedAt;
    }

    /**
     * @param DateTime|null $deletedAt
     */
    public function setDeletedAt(?DateTime $deletedAt): void
    {
        $this->deletedAt = $deletedAt;
    }

    /**
     * @return mixed
     */
    public function getYearBuilt()
    {
        return $this->yearBuilt;
    }

    /**
     * @return mixed
     */
    public function getExpirationDate(\DateTime $expirationDate)
    {
        return $this->expirationDate;
    }

    /**
     * @return mixed
     */
    public function getGrossLivingArea()
    {
        return $this->grossLivingArea;
    }

    /**
     * @return mixed
     */
    public function getGrossLivingAreaUnit()
    {
        return $this->grossLivingAreaUnit;
    }

    /**
     * @return mixed
     */
    public function getPlotArea()
    {
        return $this->plotArea;
    }

    /**
     * @return mixed
     */
    public function getPlotAreaUnit()
    {
        return $this->plotAreaUnit;
    }

    /**
     * @return mixed
     */
    public function getSourceRef()
    {
        return $this->sourceRef;
    }

    /**
     * @return mixed
     */
    public function getMlsRef()
    {
        return $this->mlsRef;
    }

    /**
     * @return mixed
     */
    public function getSourceGuid()
    {
        return $this->sourceGuid;
    }

    /**
     * @return mixed
     */
    public function getSourceUrl()
    {
        return $this->sourceUrl;
    }

    public function getMisc()
    {
        return $this->misc;
    }

    public function setMisc(array $misc = null)
    {
        $this->misc = $misc;
    }

    /**
     * @return ArrayCollection<PropertyLike>|PropertyLike[]
     */
    public function setLikes(ArrayCollection $likes)
    {
        $this->likes = $likes;
    }

    /**
     * @return int
     */
    public function isPriceHidden()
    {
        return $this->priceQualifier < 0;
    }
}
