<?php

namespace AppBundle\Entity\Import;

use AppBundle\Entity\Traits\IdTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Import\ImportPropertyRepository")
 * @ORM\Table(name="import_property",indexes={
 *     @ORM\Index(name="hash_lookup_ip_idx",columns={"hash","job_id"})
 * })
 */
class ImportProperty
{
    const ERROR_METADATA = 100;
    const ERROR_FEATURES = 200;
    const ERROR_DESCRIPTION = 300;
    const ERROR_ADDRESS = 400;
    const ERROR_PRICE = 500;
    const ERROR_PHOTOS = 600;
    const ERROR_BEDROOMS = 700;
    const ERROR_OTHER = 800;
    const ERROR_BUSINESS_RULES = 900;
    const ERROR_USER_REF = 1000;

    use IdTrait;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Import\ImportJob")
     */
    public $job;
    /**
     * @ORM\Column(type="integer", name="property_id", nullable=true)
     */
    public $property;
    /**
     * @ORM\Column(type="string", length=40, nullable=true)
     */
    public $hash;
    /**
     * @ORM\Column(type="string", name="source_ref", nullable=true)
     */
    public $sourceRef;
    /**
     * @ORM\Column(type="text", nullable=true)
     */
    public $errors;
    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    public $processorResults;
    /**
     * @ORM\Column(type="datetime",name="date")
     */
    public $date;
}
