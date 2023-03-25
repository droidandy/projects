<?php

namespace AppBundle\Entity\User;

use AppBundle\Entity\Communication\Notification;
use AppBundle\Entity\Location\FollowedLocation;
use AppBundle\Entity\Messenger\Room;
use AppBundle\Entity\Social\TagFollowed;
use AppBundle\Entity\Social\Tag;
use AppBundle\Entity\Traits\GoogleLocationTrait;
use AppBundle\Entity\User\Billing\CreditCard;
use AppBundle\Entity\User\Billing\Subscription;
use AppBundle\Geo\Geocode\UnfoldableInterface;
use AppBundle\Service\Article\Processor\HeadTextSubtitleExtractor;
use Cocur\Slugify\Slugify;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use FOS\UserBundle\Model\User as BaseUser;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use DateTime;
use AppBundle\Entity\Location\Location;
use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Traits\OAuthTokensTrait;
use AppBundle\Validation\Constraint as AppValidation;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\User\UserRepository")
 * @ORM\Table(
 *     name="user",
 *     indexes={
 *          @ORM\Index(name="email_idx", columns={"email"})
 *     }
 * )
 * @ORM\HasLifecycleCallbacks
 * @JMS\ExclusionPolicy("all")
 */
class User extends BaseUser implements UnfoldableInterface
{
    use OAuthTokensTrait, GoogleLocationTrait;

    /** Types */
    const TYPE_USER = 'user';
    const TYPE_TEAM = 'team';
    const TYPE_COMPANY = 'company';

    const TYPE_MAIN_OFFICE = 'main_office';
    const TYPE_MAIN_OFFICE_NAME = 'Main office';
    const TYPE_BRANCH_OFFICE = 'branch_office';
    const TYPE_BRANCH_OFFICE_NAME = 'Branch office';
    const TYPE_SUBDIVISION = 'subdivision';
    const TYPE_SUBDIVISION_NAME = 'Affiliate';

    /** Roles */
    const ROLE_AGENT = 'ROLE_AGENT';
    const ROLE_AGENT_NAME = 'Agent';

    const ROLE_AUTHOR = 'ROLE_AUTHOR';
    const ROLE_AUTHOR_NAME = 'Author';

    const ROLE_OFFICE = 'ROLE_OFFICE';
    const ROLE_OFFICE_NAME = 'Office';

    const ROLE_COMPANY = 'ROLE_COMPANY';
    const ROLE_COMPANY_NAME = 'Company';

    const ROLE_SMM = 'ROLE_SMM';
    const ROLE_CUSTOM = 'ROLE_CUSTOM';
    const ROLE_USER = 'ROLE_USER';
    const ROLE_ADMIN = 'ROLE_ADMIN';

    /** Markets */
    const MARKET_RENTAL = 1;
    const MARKET_SALE = 2;
    const MARKET_ALL = 0;

    const MARKET_SLUG_ALL = 'all';
    const MARKET_SLUG_SALE = 'for-sale';
    const MARKET_SLUG_RENTAL = 'to-rent';

    const MARKET_TITLE_ALL = 'For Sale, To Rent';
    const MARKET_TITLE_SALE = 'For Sale';
    const MARKET_TITLE_RENTAL = 'To Rent';

    /** Settings */
    const IMAGE_PROFILE = 'profileImage';
    const IMAGE_PROFILE_MANUAL = 'profileImageManual';
    const IMAGE_BACKGROUND = 'backgroundImage';

    const SETTINGS_AUTOSHARE_SUFFIX = 'Autoshare';
    const SERVICE_USER = [
        'name' => 'LuxuryAffairs',
        'email' => 'service@luxuryaffairs.co.uk',
        'password' => '1234qwer',
    ];
    const PROFILE_PHOTO = 'user_profile_photo';
    const PROFILE_PHOTO_SMALL = 'user_profile_photo_small_extra';
    const BACKGROUND_PHOTO = 'user_profile_background';
    const DOMAIN_NAME = 'luxuryaffairs.co.uk';

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @JMS\Expose
     * @JMS\Type("integer")
     * @JMS\Groups({"collection","details","message","room","auth"})
     */
    public $id;
    /**
     * @var string
     * @Assert\NotBlank(message="Please select username.")
     */
    protected $username;
    /**
     * @var string
     * @ORM\Column(type="string", length=50)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"details"})
     */
    protected $type = self::TYPE_USER;
    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Please enter your full name.", groups={"bio"})
     * @Assert\Length(
     *     min=1,
     *     max="255",
     *     minMessage="Your name is too short.",
     *     maxMessage="Your name is too long.",
     *     groups={"bio"}
     * )
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details","bio", "auth", "room"})
     */
    public $name;
    /**
     * @var string
     * @Assert\NotNull()
     * @Assert\Email
     * @AppValidation\UniqueUserEmail
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $email;
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $companyName;
    /**
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection", "details"})
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $companyPhone;
    /**
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection", "details"})
     * @ORM\Column(type="string", length=255, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $phone;
    /**
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection", "details"})
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $homePageUrl;
    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Address", columnPrefix = "address_")
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Embeddable\Address")
     * @JMS\Groups({"details"})
     * @JMS\ReadOnly
     */
    public $address;
    /**
     * @var ArrayCollection<Property>
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Property\Property", mappedBy="user")
     * @ORM\OrderBy({"id" = "DESC"})
     */
    public $properties;
    /**
     * @var ArrayCollection<Article>
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Social\Article", mappedBy="author")
     * @ORM\OrderBy({"id" = "DESC"})
     */
    public $articles;
    /**
     * @var ArrayCollection<UserEmail>
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\User\UserEmail", mappedBy="user")
     */
    public $emails;
    /**
     * @ORM\Column(type="boolean")
     */
    public $isEmailGenerated = false;
    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $leadEmail;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $activeAt = null;
    /**
     * @JMS\Exclude
     * @JMS\ReadOnly
     *
     * @var string
     */
    protected $password;
    /**
     * @JMS\Exclude
     * @JMS\ReadOnly
     *
     * @var string
     */
    protected $salt;
    /**
     * Plain password. Used for model validation. Must not be persisted.
     *
     * @var string
     * @Assert\NotBlank(message="Password may not be empty")
     * @Assert\Length(
     *     min=6,
     *     max="255",
     *     minMessage="Your password is too short.",
     *     maxMessage="Your password is too long."
     * )
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection", "details"})
     */
    protected $plainPassword;
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $createdAt;
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $updatedAt;
    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $deletedAt;
    /**
     * @ORM\Column(type="string", length=2, options={"default": ""})
     */
    public $locale = '';
    /**
     * @ORM\Column(type="text", nullable=true)
     */
    public $bio;
    /**
     * @AppValidation\UserSettings(groups={"settings"})
     * @ORM\Column(type="json_array", nullable=true)
     */
    private $settings;
    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    public $phones;
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $mobilePhone;
    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    public $sites;
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $profileImage;
    /**
     * @Assert\Image(groups={"profileImageManual"})
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $profileImageManual;
    /**
     * @Assert\Image(groups={"backgroundImage"})
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $backgroundImage;
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $primaryLanguage;
    /**
     * @ORM\Column(type="json_array", length=255, nullable=true)
     */
    public $spokenLanguages;
    /**
     * This the currency the user wants to see property prices in around the site.
     *
     * @ORM\Column(type="string", length=3, nullable=true)
     */
    public $preferredCurrency;
    /**
     * @ORM\Column(type="boolean")
     */
    public $mailEnquiries = true;
    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    public $forwardEnquiries = '';
    /**
     * @ORM\ManyToMany(targetEntity="User")
     * @ORM\JoinTable(name="user_forward_enquires_user",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="forward_enquires_user_id", referencedColumnName="id")}
     * )
     */
    public $forwardEnquiriesUsers;
    /**
     * When a user is created from a franchise import, stores their user ID
     * from the external system (if available).
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $sourceRef;
    /**
     * Additional source refs.
     *
     * @ORM\OneToMany(targetEntity="SourceRef", mappedBy="user", cascade={"all"})
     */
    public $sourceRefs;
    /**
     * When a user is created from a franchise import, stores their user ID
     * from the external system (if available).
     *
     * @ORM\Column(type="string", length=15, nullable=true)
     */
    public $sourceRefType;
    /**
     * @ORM\Column(name="company_source_ref", type="string", length=255, nullable=true)
     */
    public $companySourceRef;
    /**
     * @ORM\Column(name="company_source_ref_type", type="string", length=15, nullable=true)
     */
    public $companySourceRefType;
    /**
     * @ORM\Column(name="company_office_type", type="string", length=15, nullable=true)
     */
    public $companyOfficeType;
    /**
     * @ORM\Column(name="office_source_ref", type="string", length=255, nullable=true)
     */
    public $officeSourceRef;
    /**
     * @ORM\Column(name="office_source_ref_type", type="string", length=15, nullable=true)
     */
    public $officeSourceRefType;
    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    public $agentCount;
    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    public $affiliateCount;
    /**
     * @ORM\Column(type="integer", nullable=false, options={"default": 0})
     */
    public $propertyCount = 0;
    /**
     * @ORM\Column(type="integer", nullable=false, options={"default": 0})
     */
    public $propertyToRentCount = 0;
    /**
     * @ORM\Column(type="integer", nullable=false, options={"default": 0})
     */
    public $propertyForSaleCount = 0;
    /**
     * @ORM\Column(type="integer", nullable=false, options={"default": 0})
     */
    public $articleCount = 0;
    /**
     * @ORM\Column(type="float", nullable=true)
     */
    protected $searchBoost = 0;

    /**
     * @var UserProfile
     * @ORM\OneToOne(
     *     targetEntity="AppBundle\Entity\User\UserProfile",
     *     mappedBy="user",
     *     orphanRemoval=true,
     *     cascade={"all"}
     * )
     */
    protected $userProfile;
    /**
     * @var TeamProfile
     * @ORM\OneToOne(
     *     targetEntity="AppBundle\Entity\User\TeamProfile",
     *     mappedBy="user",
     *     orphanRemoval=true,
     *     cascade={"all"}
     * )
     */
    protected $teamProfile;
    /**
     * @var CompanyProfile
     * @ORM\OneToOne(
     *     targetEntity="AppBundle\Entity\User\CompanyProfile",
     *     mappedBy="user",
     *     orphanRemoval=true,
     *     cascade={"all"}
     * )
     */
    protected $companyProfile;

    /**
     * @var ArrayCollection<User>|null
     * @ORM\OneToMany(
     *     targetEntity="AppBundle\Entity\User\Relation",
     *     mappedBy="child",
     *     orphanRemoval=true
     * )
     */
    protected $relation;
    /**
     * @var ArrayCollection<Room>
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Messenger\Room", mappedBy="users")
     **/
    public $rooms = [];
    /**
     * @var ArrayCollection<User>
     * @ORM\ManyToMany(targetEntity="User", mappedBy="followings")
     **/
    public $followers;
    /**
     * @var ArrayCollection<User>
     * @ORM\ManyToMany(
     *     targetEntity="User",
     *     inversedBy="followers"
     * )
     * @ORM\JoinTable(
     *     name="user_followers",
     *     joinColumns={
     *          @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     *     },
     *     inverseJoinColumns={
     *          @ORM\JoinColumn(name="following_user_id", referencedColumnName="id")
     *     }
     * )
     */
    public $followings;
    /**
     * @var ArrayCollection<Notification>
     * @ORM\OneToMany(
     *     targetEntity="AppBundle\Entity\Communication\Notification",
     *     mappedBy="owner",
     *     fetch="EXTRA_LAZY"
     * )
     * @ORM\OrderBy({"createdAt"="DESC"})
     */
    public $notifications;
    /**
     * @var ArrayCollection<FollowedLocation>
     * @ORM\OneToMany(
     *     targetEntity="AppBundle\Entity\Location\FollowedLocation",
     *     mappedBy="user",
     *     orphanRemoval=true,
     *     fetch="EXTRA_LAZY"
     * )
     */
    protected $followedLocations;
    /**
     * @var ArrayCollection<TagFollowed>
     * @ORM\OneToMany(
     *     targetEntity="AppBundle\Entity\Social\TagFollowed",
     *     mappedBy="user",
     *     orphanRemoval=true,
     *     fetch="EXTRA_LAZY"
     * )
     */
    protected $tagsFollowed;
    /**
     * @var CreditCard
     * @ORM\OneToOne(
     *     targetEntity="AppBundle\Entity\User\Billing\CreditCard",
     *     mappedBy="user",
     *     orphanRemoval=true,
     *     fetch="EXTRA_LAZY"
     * )
     */
    protected $creditCard;
    /**
     * @var Subscription
     * @ORM\OneToOne(
     *     targetEntity="AppBundle\Entity\User\Billing\Subscription",
     *     mappedBy="user",
     *     orphanRemoval=true,
     *     fetch="EXTRA_LAZY"
     * )
     */
    protected $subscription;

    /**
     * {@inheritdoc}
     */
    public function __construct()
    {
        parent::__construct();

        $this->address = new Address();
        $this->createdAt = new \DateTime();
        $this->forwardEnquiriesUsers = new ArrayCollection();
        $this->sourceRefs = new ArrayCollection();
        $this->followings = new ArrayCollection();
        $this->followers = new ArrayCollection();
        $this->followedLocations = new ArrayCollection();
        $this->tagsFollowed = new ArrayCollection();
        $this->googleLocations = new ArrayCollection();

        $this->setEnabled(true);
        $this->setLocked(false);
    }

    /**
     * @JMS\Type("int")
     * @JMS\Expose
     * @JMS\Groups({"collection","details","message"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("activeAtTimestamp")
     *
     * @return int
     */
    public function getActiveAtTimestamp(): int
    {
        if ($this->activeAt) {
            return sprintf('%s%s', $this->activeAt->getTimestamp(), '000');
        }

        return 0;
    }

    /**
     * @JMS\Type("bool")
     * @JMS\Expose
     * @JMS\Groups({"collection","details","room"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("isOnline")
     *
     * @return false
     */
    public function isOnline(): bool
    {
        return false;
    }

    /**
     * @param int $length
     *
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("intro")
     * @JMS\Groups({"collection", "details"})
     *
     * @return string
     */
    public function getIntro($length = 200)
    {
        return (new HeadTextSubtitleExtractor())
            ->extractIntro($this->bio, $length);
    }

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("bio")
     * @JMS\Groups({"details"})
     *
     * @return string
     */
    public function getBio()
    {
        return $this->bio;
    }

    /**
     * @return string
     */
    public function getProfileImage()
    {
        if ($this->profileImageManual) {
            return $this->profileImageManual;
        }

        if ($this->profileImage) {
            return $this->profileImage;
        }
    }

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("company")
     * @JMS\Groups({"collection","details","message","auth","room"})
     *
     * @return string
     */
    public function getCompanyName()
    {
        $parent = $this->getParentUser();

        if ($parent) {
            return $parent->getCompanyName();
        }
        if ($this->companyName) {
            return $this->companyName;
        }
    }

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("propertiesTop")
     * @JMS\Groups({"details"})
     *
     * @return string
     */
    public function getPropertiesTop()
    {
        if ($this->properties) {
            return $this->properties->slice(0, 3);
        }
    }

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("articlesTop")
     * @JMS\Groups({"details"})
     *
     * @return string
     */
    public function getArticlesTop()
    {
        if ($this->articles) {
            return $this->articles->slice(0, 3);
        }
    }

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("background")
     * @JMS\Groups({"collection","details","auth"})
     *
     * @return string
     */
    public function getBackgroundImage()
    {
        if ($this->backgroundImage) {
            return $this->backgroundImage;
        }

        return '/assets/images/user/background.jpg';
    }

    /**
     * @return string
     */
    public function slug()
    {
        $name = $this->getName();
        $companyName = $this->getCompanyName();

        return (new Slugify())->slugify($name.('' !== trim($companyName) ? '-'.$companyName : ''));
    }

    /**
     * @return int
     */
    public function getFollowersCount()
    {
        return $this->followers->count();
    }

    /**
     * @return int
     */
    public function getFollowingsCount()
    {
        return $this->followings->count();
    }

    /**
     * @return int
     */
    public function getPropertiesCount()
    {
        return $this->propertyForSaleCount + $this->propertyToRentCount;
    }

    /**
     * @return int
     */
    public function getArticleCount()
    {
        return $this->articleCount;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @var int
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type)
    {
        $this->type = $type;
    }

    public function getHierarchyType()
    {
        if (in_array(self::ROLE_COMPANY, $this->roles)) {
            return 'company';
        } elseif (in_array(self::ROLE_OFFICE, $this->roles)) {
            return 'office';
        } elseif (in_array(self::ROLE_AGENT, $this->roles)) {
            return 'agent';
        } else {
            return 'user';
        }
    }

    /**
     * @return UserProfile|null
     */
    public function getUserProfile(): ?UserProfile
    {
        return $this->userProfile;
    }

    /**
     * @param UserProfile|null $userProfile
     */
    public function setUserProfile(UserProfile $userProfile = null)
    {
        $this->userProfile = $userProfile;
    }

    /**
     * @return TeamProfile|null
     */
    public function getTeamProfile(): ?TeamProfile
    {
        return $this->teamProfile;
    }

    /**
     * @param TeamProfile|null $teamProfile
     */
    public function setTeamProfile(TeamProfile $teamProfile = null)
    {
        $this->teamProfile = $teamProfile;
    }

    /**
     * @return CompanyProfile|null
     */
    public function getCompanyProfile(): ?CompanyProfile
    {
        return $this->companyProfile;
    }

    /**
     * @param CompanyProfile|null $companyProfile
     */
    public function setCompanyProfile(CompanyProfile $companyProfile = null)
    {
        $this->companyProfile = $companyProfile;
    }

    /**
     * @return ArrayCollection<User>|null
     */
    public function getRelation()
    {
        return $this->relation;
    }

    /**
     * @return User|null
     */
    public function getParentUser()
    {
        $relation = $this->getRelation();

        if ($relation && $relation->count()) {
            return $relation->first()->getParent();
        }
    }

    /**
     * @param string $name
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $bio
     */
    public function setBio($bio)
    {
        $this->bio = $bio;
    }

    /**
     * @var string
     *
     * @return string
     */
    public function getMetaTitle(): string
    {
        $parent = $this->getParentUser();

        if ($parent) {
            return $this->getName().' - '.$parent->getName();
        }

        return $this->getName();
    }

    /**
     * @param string $email
     */
    public function setEmail($email)
    {
        parent::setEmail($email);

        if (!$this->username) {
            $this->username = $email;
        }
    }

    public function setEmailAndUsername($email)
    {
        parent::setEmail($email);
        parent::setUsername($email);
    }

    /**
     * @param string $email
     */
    public function setLeadEmail($email)
    {
        $this->leadEmail = $email;
    }

    /**
     * @return string|null
     */
    public function getLeadEmail()
    {
        return $this->leadEmail;
    }

    /**
     * @return string|null
     */
    public function getMessageEmail()
    {
        if ($this->getLeadEmail()) {
            return $this->getLeadEmail();
        }

        return $this->getEmail();
    }

    /**
     * @return Address
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @return DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @return \DateTime|null
     */
    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime|null $dateUpdated
     */
    public function setUpdatedAt(\DateTime $dateUpdated = null): void
    {
        $this->updatedAt = $dateUpdated;
    }

    /**
     * @return string
     */
    public function getUserKind()
    {
        switch ($this->type) {
            case self::TYPE_USER:
                return 'Agent';
            case self::TYPE_TEAM:
                return 'Team';
            case self::TYPE_COMPANY:
                return 'Company';
        }

        return 'Agent';
    }

    /**
     * @return string|null
     */
    public function getPreferredCurrency()
    {
        return $this->preferredCurrency;
    }

    /**
     * @return string
     */
    public function getEntityType()
    {
        return 'user';
    }

    /**
     * @return float
     */
    public function getSearchBoost()
    {
        return $this->searchBoost;
    }

    /**
     * @param float $searchBoost
     */
    public function setSearchBoost($searchBoost)
    {
        $this->searchBoost = $searchBoost;
    }

    /**
     * @return array
     */
    public function getForwardEnquiresEmails()
    {
        $emails = [];
        foreach ($this->forwardEnquiriesUsers as $user) {
            $emails[] = $user->getEmail();
        }

        if (trim($this->forwardEnquiries) && $forwardEmails = explode(',', $this->forwardEnquiries)) {
            $forwardEmails = array_map('trim', $forwardEmails);
            $emails = array_merge($emails, $forwardEmails);
        }

        return $emails;
    }

    public function __toString()
    {
        return 'ID '.$this->id.' - '.$this->name.' ('.$this->companyName.')';
    }

    public function isDeleted()
    {
        return (bool) $this->deletedAt;
    }

    /**
     * @return DateTime
     */
    public function getDeletedAt()
    {
        return $this->deletedAt;
    }

    /**
     * @param DateTime $deletedAt
     */
    public function setDeletedAt(DateTime $deletedAt = null)
    {
        $this->deletedAt = $deletedAt;
    }

    /**
     * @return ArrayCollection<User>
     */
    public function getFollowers()
    {
        return $this->followers;
    }

    /**
     * @return ArrayCollection<User>
     */
    public function getFollowings()
    {
        return $this->followings;
    }

    /**
     * @return array
     */
    public function getFollowingIds()
    {
        $ids = [];

        foreach ($this->followings as $user) {
            $ids[] = $user->getId();
        }

        return $ids;
    }

    /**
     * @param UserInterface $follower
     */
    public function followUser(UserInterface $follower)
    {
        $this->getFollowings()->add($follower);
    }

    /**
     * @param UserInterface $follower
     */
    public function unFollowUser(UserInterface $follower)
    {
        $this->getFollowings()->removeElement($follower);
    }

    /**
     * @param UserInterface $user
     *
     * @return bool
     */
    public function isUserFollowing(UserInterface $user)
    {
        return $this->getFollowings()->contains($user);
    }

    /**
     * @return ArrayCollection<FollowedLocation>
     */
    public function getFollowedLocations()
    {
        return $this->followedLocations;
    }

    /**
     * @return ArrayCollection<Location>
     */
    public function getFollowedLocationsCount()
    {
        return $this->getFollowedLocations()->count();
    }

    /**
     * @param Location $location
     *
     * @return bool
     */
    public function isLocationFollowed(Location $location)
    {
        return $this->getFollowedLocationFromLocation($location)
            ? true
            : false;
    }

    /**
     * @param Location $location
     *
     * @return FollowedLocation
     */
    public function getFollowedLocationFromLocation(Location $location)
    {
        foreach ($this->getFollowedLocations() as $followedLocation) {
            if ($followedLocation->getLocation()->getId() == $location->getId()) {
                return $followedLocation;
            }
        }
    }

    /**
     * @return ArrayCollection<TagFollowed>|TagFollowed[]
     */
    public function getTagsFollowed()
    {
        return $this->tagsFollowed;
    }

    /**
     * @return int
     */
    public function getTagsFollowedCount()
    {
        return $this->getTagsFollowed()->count();
    }

    /**
     * @return array|Tag[]
     */
    public function getStreamTags()
    {
        $tags = [];

        /** @var TagFollowed $followedTag */
        foreach ($this->getTagsFollowed() as $followedTag) {
            $tags[] = $followedTag->tag;
        }

        return $tags;
    }

    /**
     * @param Tag $tag
     *
     * @return bool
     */
    public function isTagFollowed(Tag $tag)
    {
        return $this->getTagFollowedFromTag($tag)
            ? true
            : false;
    }

    /**
     * @param Tag $tag
     *
     * @return FollowedLocation
     */
    public function getTagFollowedFromTag(Tag $tag)
    {
        foreach ($this->getTagsFollowed() as $followedTag) {
            if ($followedTag->tag->getId() == $tag->getId()) {
                return $followedTag;
            }
        }
    }

    /**
     * @param string $name
     */
    public function disconnectFromSocialService($name)
    {
        $this->{'set'.ucfirst($name).'Id'}(null);
        $this->{'set'.ucfirst($name).'AccessToken'}(null);

        $this->setAutoshare($name, false);
    }

    /**
     * @return mixed
     */
    public function getSettings()
    {
        return $this->settings;
    }

    /**
     * @param string $key
     *
     * @return bool
     */
    public function getSettingsKey($key)
    {
        if (isset($this->settings[$key])) {
            return $this->settings[$key];
        }
    }

    /**
     * @param string $key
     * @param mixed  $value
     */
    public function setSettingsValue($key, $value)
    {
        $this->settings[$key] = $value;
    }

    /**
     * @param array $settings
     */
    public function setSettings(array $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param $networkName
     *
     * @return bool
     */
    public function isAutoshareEnabled($networkName)
    {
        // Strict boolean casting is needed here,
        // otherwise method returns "NULL" that does not correspond with name

        return (bool) $this->getSettingsKey(
            $this->getAutoshareKey($networkName)
        );
    }

    /**
     * @param string $networkName
     * @param bool   $value
     */
    public function setAutoshare($networkName, $value)
    {
        $this->setSettingsValue(
            $this->getAutoshareKey($networkName),
            $value
        );
    }

    /**
     * @param $networkName
     *
     * @return string
     */
    public function getAutoshareKey($networkName)
    {
        return $networkName.self::SETTINGS_AUTOSHARE_SUFFIX;
    }

    /**
     * @param string $type
     *
     * @return string
     */
    public function getRelativeImagePath($type)
    {
        $relativePath = parse_url($this->{$type})['path'];

        return ltrim($relativePath, '/');
    }

    /**
     * @return mixed
     */
    public function getNotifications()
    {
        return $this->notifications;
    }

    /**
     * @return CreditCard
     */
    public function getCreditCard()
    {
        return $this->creditCard;
    }

    /**
     * @param CreditCard $creditCard
     */
    public function setCreditCard($creditCard)
    {
        $this->creditCard = $creditCard;
    }

    /**
     * @return Subscription
     */
    public function getSubscription()
    {
        return $this->subscription;
    }

    /**
     * @param Subscription $subscription
     */
    public function setSubscription($subscription)
    {
        $this->subscription = $subscription;
    }
}
