<?php

namespace AppBundle\Entity\Import;

use AppBundle\Entity\Traits\CreatedAtTrait;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Entity\Traits\IdTrait;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\MappedSuperclass
 * @JMS\ExclusionPolicy("all")
 * @ORM\Table(name="import_ledger")
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Import\ImportLedgerRepository")
 */
class ImportLedger
{
    use IdTrait;
    use CreatedAtTrait;

    /**
     * @var string
     * @Assert\NotNull()
     * @ORM\Column(type="string")
     */
    public $type;
    /**
     * @var string
     * @Assert\NotNull()
     * @ORM\Column(type="string")
     */
    public $refId;
}
