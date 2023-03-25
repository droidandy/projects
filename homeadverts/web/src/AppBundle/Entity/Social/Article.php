<?php

namespace AppBundle\Entity\Social;

use AppBundle\Entity\Messenger\Room;
use AppBundle\Entity\Traits\IdTrait;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use DateTime;
use AppBundle\Entity\Traits\TokenTrait;
use AppBundle\Service\Article\ArticleService;
use AppBundle\Entity\Traits\ImpressionCountTrait;
use AppBundle\Entity\Traits\ShareCountTrait;
use AppBundle\Entity\Traits\ViewCountTrait;
use AppBundle\Service\Article\Publisher\Channel\ChannelPostingResult;
use AppBundle\Service\Article\Publisher\Publisher;
use AppBundle\Service\Article\Processor\HeadTextSubtitleExtractor;
use AppBundle\Serializer\Constructor\UniqueFieldConstructableInterface;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\MetadataTrait;
use AppBundle\Entity\User\User;
use AppBundle\Validation\Constraint as AppValidation;
use AppBundle\Entity\Traits\MessagesTrait;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Social\Article\ArticleRepository")
 * @ORM\Table(
 *     name="ha_article",
 *     indexes={@ORM\Index(name="createdAt_idx", columns={"createdAt"})}
 * )
 * @JMS\ExclusionPolicy("all")
 */
class Article implements UniqueFieldConstructableInterface
{
    const FILTER_THUMBNAIL_SMALL_EXTRA = 'article_small_extra';
    const FILTER_THUMBNAIL_SMALL = 'article_small';
    const FILTER_THUMBNAIL_MEDIUM = 'article_medium';
    const FILTER_THUMBNAIL_LARGE = 'article_large';

    const STATE_PUBLISHED = 'published';
    const STATE_DRAFT = 'draft';
    const READING_SPEED = 100;

    const TOKEN_SALT = '8ed9b';
    const SLOT_COVER = 'cover';
    const SLOT_FEATURED = 'featured';
    const SLOT_COLLECTION = 'collection';
    const SLOT_RECOMMENDED = 'recommended';
    const SLOT_TEASER = 'teaser';

    use MetadataTrait;
    use IdTrait;
    use ViewCountTrait;
    use ImpressionCountTrait;
    use ShareCountTrait;
    use CreatedAtTrait;
    use TokenTrait;
    use MessagesTrait;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @Assert\NotBlank(groups={"publish"})
     * @JMS\Type("string")
     * @JMS\Expose
     * @JMS\Groups({"collection","details", "room"})
     */
    protected $title;
    /**
     * @ORM\Column(type="text", nullable=true)
     * @Assert\NotBlank(groups={"publish"})
     * @AppValidation\ArticleImage(groups={"draft","publish"})
     * @JMS\Type("string")
     * @JMS\Expose
     */
    protected $body;
    /**
     * @var ArrayCollection<AppBundle\Entity\Social\ArticleTag>
     * @ORM\OneToMany(targetEntity="ArticleTag", mappedBy="article", cascade={"ALL"}, orphanRemoval=true)
     * @JMS\Type("ArrayCollection<AppBundle\Entity\Social\ArticleTag>")
     * @JMS\Expose
     * @JMS\Accessor(setter="setTags")
     */
    protected $tags;
    /**
     * @var ArrayCollection<ArticleImage>|ArticleImage[]
     * @ORM\OneToMany(targetEntity="ArticleImage", mappedBy="article", cascade={"all"}, orphanRemoval=true)
     * @JMS\Type("ArrayCollection<AppBundle\Entity\Social\ArticleImage>")
     * @JMS\Expose
     * @JMS\Groups({})
     * @JMS\MaxDepth(3)
     */
    protected $images;
    /**
     * @var ArrayCollection<AppBundle\Entity\Social\ArticleLike>
     * @ORM\OneToMany(
     *     targetEntity="AppBundle\Entity\Social\ArticleLike",
     *     mappedBy="liked",
     *     cascade={"all"},
     *     orphanRemoval=true,
     *     fetch="EXTRA_LAZY"
     * )
     * @JMS\Expose
     * @JMS\Groups({})
     * @JMS\MaxDepth(3)
     * @JMS\ReadOnly
     */
    public $likes;
    /**
     * @var Room
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Messenger\Room", mappedBy="article")
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Messenger\Room")
     * @JMS\Groups({"details"})
     * @JMS\MaxDepth(3)
     * @JMS\ReadOnly
     */
    public $room;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(onDelete="CASCADE", nullable=true)
     */
    protected $assignee;
    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $slug;
    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(onDelete="CASCADE", nullable=false)
     */
    protected $author;
    /**
     * @var int|null
     */
    protected $likesCount = null;
    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @JMS\Type("DateTime")
     * @JMS\Expose
     */
    protected $publishedAt;
    /**
     * @var \DateTime
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $updatedAt;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $subtitle;
    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $description;

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("user")
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Groups({"collection","details"})
     * @JMS\MaxDepth(1)
     *
     * @return User
     */
    public function getUser(): User
    {
        return $this->author;
    }

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("ERT")
     * @JMS\Groups({"details"})
     *
     * @return float
     */
    public function getEstimatedReadingTime()
    {
        return floor($this->getWordCount() / self::READING_SPEED);
    }

    /**
     * @return int
     */
    public function getWordCount()
    {
        return str_word_count(strip_tags($this->getBody()));
    }

    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("publishing_state")
     *
     * @return string
     */
    public function getPublishingState()
    {
        if ($this->getPublishedAt()) {
            return self::STATE_PUBLISHED;
        }

        return self::STATE_DRAFT;
    }

    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->likes = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->createdAt = new \Datetime();

        $this->generateToken();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * @param mixed $slug
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return mixed
     */
    public function getMetaTitle()
    {
        return sprintf(
            '%s - %s',
            $this->getTitle(),
            $this->getAuthor()->getName()
        );
    }

    /**
     * @return mixed
     */
    public function getSubtitle()
    {
        return $this->subtitle;
    }

    /**
     * @param mixed $subtitle
     */
    public function setSubtitle($subtitle)
    {
        $this->subtitle = $subtitle;
    }

    /**
     * @param string $type
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("intro")
     * @JMS\Groups({"collection","details"})
     *
     * @return string
     */
    public function getIntro($type = self::SLOT_COVER)
    {
        switch ($type) {
            case 'autocomplete':
                $length = 100;
                break;
            case self::SLOT_COVER:
                $length = 200;
                break;
            case self::SLOT_COLLECTION:
                $length = 200;
                break;
            case self::SLOT_FEATURED:
                $length = 400;
                break;
            case self::SLOT_TEASER:
                $length = 500;
                break;
        }

        return (new HeadTextSubtitleExtractor())
            ->extractIntro(
                $this->getBody(),
                $length
            );
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * @param mixed $body
     */
    public function setBody($body)
    {
        $this->body = $body;
    }

    /**
     * @return User
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * @param mixed $author
     */
    public function setAuthor($author)
    {
        $this->author = $author;
    }

    /**
     * @return User|null
     */
    public function getAssignee(): ?User
    {
        return $this->assignee;
    }

    /**
     * @param User|null $assignee
     */
    public function setAssignee(User $assignee = null)
    {
        $this->assignee = $assignee;
    }

    /**
     * @return ArrayCollection|ArticleImage[]
     */
    public function getImages()
    {
        return $this->images;
    }

    /**
     * @param ArrayCollection|array $images
     */
    public function setImages($images)
    {
        $this->images = $images;
    }

    /**
     * @return ArticleImage
     */
    public function getPrimaryImage()
    {
        if ($this->images) {
            /** @var ArticleImage $image */
            /** @var ArticleImage $primaryImage */
            $primaryImage = $this->images->first();

            foreach ($this->images as $image) {
                if ($primaryImage->getOrder() > $image->getOrder()) {
                    $primaryImage = $image;
                }
            }

            return $primaryImage;
        }
    }

    /**
     * @return array
     */
    public function getJumboImages()
    {
        if (!$this->getImages()) {
            return [];
        }

        $images = $this->getImages()->toArray();
        usort($images, function ($a, $b) {
            /* @var $a ArticleImage */
            /* @var $b ArticleImage */
            return $a->getOrder() - $b->getOrder();
        });

        return array_slice($images, 0, 3);
    }

    /**
     * @param User $user
     *
     * @return bool
     */
    public function isWrittenByUser(User $user)
    {
        return $this->getAuthor() === $user;
    }

    /**
     * @return ArticleTag[]|ArrayCollection<ArticleTag>
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * @return Tag[]
     */
    public function getPrivateTags()
    {
        $privateTags = [];

        foreach ($this->getTags() as $articleTag) {
            $tag = $articleTag->getTag();

            if ($tag->getPrivate()) {
                $privateTags[] = $tag;
            }
        }

        return $privateTags;
    }

    /**
     * @return bool
     */
    public function isImportedFromProperty()
    {
        foreach ($this->getPrivateTags() as $tag) {
            if (ArticleService::TAG_PROPERTY_PRIVATE === $tag->getName()) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return Tag[]
     */
    public function getPublicTags()
    {
        $tags = [];

        foreach ($this->getTags() as $articleTag) {
            $tag = $articleTag->getTag();

            if (!$tag->getPrivate()) {
                $tags[] = $tag;
            }
        }

        return $tags;
    }

    /**
     * @return array
     */
    public function getEditorTags()
    {
        $tags = [];

        /** @var Tag $rawTag */
        foreach ($this->getPublicTags() as $rawTag) {
            $tags[] = [
                'id' => $rawTag->getId(),
                'displayName' => $rawTag->getDisplayName(),
            ];
        }

        return $tags;
    }

    /**
     * @param ArrayCollection|array|null $tags
     */
    public function setTags($tags)
    {
        $tags = is_array($tags) ? new ArrayCollection($tags) : $tags;

        foreach ($this->tags as $tag) {
            if (is_null($tags) || !$tags->contains($tag)) {
                $tag->setArticle(null);
            }
        }

        /** @var ArticleTag $tag */
        foreach ($tags as $tag) {
            $tag->setArticle($this);
        }

        $this->tags = $tags;
    }

    /**
     * @param string $name
     *
     * @return bool
     */
    public function hasTag($name)
    {
        foreach ($this->tags as $tag) {
            if ($tag->getTag()->getName() == $name) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param ArrayCollection|array|null $tags
     * @param User                       $user
     */
    public function addRawTags($tags, User $user)
    {
        foreach ($tags as $tag) {
            $this->addRawTag($tag, $user);
        }
    }

    /**
     * @param Tag  $tag
     * @param User $user
     */
    public function addRawTag(Tag $tag, User $user)
    {
        foreach ($this->tags as $articleTag) {
            if ($articleTag->getTag() === $tag) {
                return;
            }
        }

        $articleTag = new ArticleTag();
        $articleTag->setArticle($this);
        $articleTag->setTag($tag);
        $articleTag->setUser($user);
        $this->tags->add($articleTag);
    }

    /**
     * @param Tag[] $tags
     */
    public function removeRawTags($tags)
    {
        foreach ($tags as $tag) {
            $this->removeRawTag($tag);
        }
    }

    /**
     * @param Tag $tag
     */
    public function removeRawTag(Tag $tag)
    {
        foreach ($this->tags as $articleTag) {
            if ($articleTag->getTag() === $tag) {
                $this->tags->removeElement($articleTag);
                $articleTag->setArticle(null);

                return;
            }
        }
    }

    /**
     * @param DateTime $date
     */
    public function setUpdatedAt(DateTime $date)
    {
        $this->updatedAt = $date;
    }

    /**
     * @return DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    public function isPublished()
    {
        return null !== $this->publishedAt;
    }

    /**
     * @return mixed
     */
    public function getPublishedAt()
    {
        return $this->publishedAt;
    }

    /**
     * @param mixed $publishedAt
     */
    public function setPublishedAt($publishedAt)
    {
        $this->publishedAt = $publishedAt;
    }

    public function setPublished()
    {
        $this->publishedAt = new \DateTime();
    }

    public function setUnpublished()
    {
        $this->publishedAt = null;
    }

    /**
     * @param int $likesCount
     */
    public function setLikesCount($likesCount)
    {
        $this->likesCount = $likesCount;
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
     * @param $channel
     *
     * @return ChannelPostingResult|false
     */
    public function getChannelPostingResult($channel)
    {
        $postingResult = $this->getMetaValue(
            $this->getChannelResultKeyName($channel)
        );

        if ($postingResult) {
            return $postingResult;
        }

        return new ChannelPostingResult(
            false,
            []
        );
    }

    /**
     * @param string               $channel
     * @param ChannelPostingResult $channelPostingResult
     */
    public function setChannelPostingResult($channel, ChannelPostingResult $channelPostingResult)
    {
        $this->setMetaValue(
            $this->getChannelResultKeyName($channel),
            $channelPostingResult
        );
    }

    /**
     * @param $channel
     *
     * @return ChannelPostingResult|false
     */
    public function isChannelEnabled($channel)
    {
        return $this->getMetaValue($channel);
    }

    /**
     * @param $channel
     *
     * @return string
     */
    private function getChannelResultKeyName($channel)
    {
        return $channel.ChannelPostingResult::CHANNEL_RESULT_SUFFIX;
    }

    /**
     * @ORM\PrePersist
     */
    public function copyChannelsStateFromUser()
    {
        $author = $this->getAuthor();

        $this->setMetadata([
            Publisher::CHANNEL_FACEBOOK => $author->isAutoshareEnabled(Publisher::CHANNEL_FACEBOOK),
            Publisher::CHANNEL_TWITTER => $author->isAutoshareEnabled(Publisher::CHANNEL_TWITTER),
            Publisher::CHANNEL_LINKEDIN => $author->isAutoshareEnabled(Publisher::CHANNEL_LINKEDIN),
        ]);
    }
}
