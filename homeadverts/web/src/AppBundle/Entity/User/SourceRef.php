<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_source_ref")
 */
class SourceRef
{
    const TYPE_KEY = 'key';
    const TYPE_GUID = 'guid';
    const TYPE_MLS = 'mls';
    const TYPE_PERSON_ID = 'person_id';

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    public $id;
    /**
     * @ORM\Column(type="string", length=255)
     */
    public $ref;
    /**
     * @ORM\Column(type="string", length=255)
     */
    public $type;
    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="sourceRefs")
     */
    public $user;
    /**
     * @var \DateTime
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $deletedAt;
}
