<?php

namespace AppBundle\Entity\Import;

use AppBundle\Entity\Traits\IdTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="import_user",indexes={@ORM\Index(name="hash_lookup_iu_idx",columns={"hash","job_id"})})
 */
class ImportUser
{
    use IdTrait;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Import\ImportJob")
     */
    public $job;
    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(onDelete="SET NULL")
     */
    public $user;
    /**
     * @ORM\Column(type="string", length=40, nullable=true)
     */
    public $hash;
    /**
     * @ORM\Column(type="string", name="user_source_ref", nullable=true)
     */
    public $sourceRef;
    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    public $errors;
    /**
     * @ORM\Column(type="boolean")
     */
    public $skipped = false;
    /**
     * @ORM\Column(type="datetime",name="date")
     */
    public $date;
}
