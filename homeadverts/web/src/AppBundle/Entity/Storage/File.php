<?php

namespace AppBundle\Entity\Storage;

use AppBundle\Entity\Messenger\Message;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\UpdatedAtTrait;
use AppBundle\Validation\Constraint as AppValidation;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use JMS\Serializer\Annotation as JMS;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="ha_file")
 * @ORM\HasLifecycleCallbacks
 * @JMS\ExclusionPolicy("all")
 */
class File
{
    const SHA256 = 'sha256';

    use CreatedAtTrait;
    use UpdatedAtTrait;
    use IdTrait;

    /**
     * @var array
     */
    const ORIGINS = [
        'article',
        'articleImport',
        'propertyImport',
        'message',
    ];

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(onDelete="CASCADE")
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Groups({"collection","details"})
     */
    public $user;

    // Allow the access to the file only if the user is inside related room.
    /**
     * @var Message
     * @AppValidation\MessageOwnership()
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Messenger\Message", inversedBy="files")
     * @JMS\Type("AppBundle\Entity\Messenger\Message")
     * @JMS\Expose
     * @JMS\Groups({"collection","details"})
     */
    public $message = null;
    /**
     * @Assert\NotBlank()
     * @AppValidation\FileOrigin()
     * @ORM\Column(type="string")
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $origin;
    /**
     * @Assert\NotBlank()
     * @ORM\Column(type="string")
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $mimeType;
    /**
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $urlSmall;
    /**
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $urlMedium;
    /**
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $urlLarge;
    /**
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $url;
    /**
     * @ORM\Column(type="text")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     */
    public $source;
    /**
     * @Assert\NotBlank()
     * @ORM\Column(type="integer")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Groups({"collection","details"})
     */
    public $size;
    /**
     * @Assert\NotBlank()
     * @ORM\Column(type="string")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Groups({"collection","details"})
     */
    public $ext;
    /**
     * @Assert\NotBlank()
     * @ORM\Column(type="string", unique=true)
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Groups({"collection","details"})
     */
    public $hash;
    /**
     * @ORM\Column(type="array")
     */
    public $metadata;
    /**
     * @var UploadedFile
     * @Assert\File(
     *     maxSize = "20M",
     *     mimeTypes = {"image/webp", "image/jpeg", "image/png", "image/gif", "image/bmp", "image"}
     * )
     */
    public $fileInfo;

    /**
     * @return string
     */
    public function getUrl()
    {
        $url = $this->url;

        if (!$url) {
            $url = $this->metadata['ObjectURL'];
        }

        return $url;
    }

    /**
     * @return string
     */
    public function getNameOnStorage()
    {
        return substr($this->hash, 0, 2).'/'.
            substr($this->hash, 2, 2).'/'.
            substr($this->hash, 4).'.'.
            $this->ext;
    }

    /**
     * @param string $path
     *
     * @return string
     */
    public static function calculateHash($path)
    {
        return hash_file(self::SHA256, $path);
    }

    /**
     * @param string $url
     *
     * @return string
     */
    public static function getHashFromPath($url)
    {
        // in $url contains uploaded image
        if (strpos($url, 'media')) {
            return self::getHashImage($url);
        }

        // an image of a property
        return self::getHashPropertyPhoto($url);
    }

    /**
     * @param string $image
     *
     * @return string
     */
    public static function getHashPropertyPhoto($url)
    {
        $parts = explode('-', parse_url($url)['path']);
        $path = array_pop($parts);
        $path = substr($path, 0, strrpos($path, '.'));

        return $path;
    }

    /**
     * @param string $image
     *
     * @return string
     */
    public static function getHashImage($url)
    {
        $parts = explode('/', parse_url($url)['path']);
        $path = array_pop($parts);
        $path = array_pop($parts).$path;
        $path = array_pop($parts).$path;
        $path = substr($path, 0, strrpos($path, '.'));

        return $path;
    }

    /**
     * @param $uploadedFile $fileInfo
     * @param string $source
     */
    public function setFileInfo(UploadedFile $uploadedFile, string $source = null): void
    {
        // Mime type is always application/octet-stream
        // https://stackoverflow.com/questions/27268058/cant-upload-image-with-mime-type-application-octet-stream-in-symfony2
        $this->fileInfo = $uploadedFile;

        $this->size = $uploadedFile->getSize();
        $this->ext = $uploadedFile->guessExtension();
        $this->source = $uploadedFile->getClientOriginalName();
        $this->hash = self::calculateHash($uploadedFile);
        $this->mimeType = $uploadedFile->getMimeType();

        if ($source) {
            $this->source = $source;
        }
    }
}
