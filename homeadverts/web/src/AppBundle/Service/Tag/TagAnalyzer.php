<?php

namespace AppBundle\Service\Tag;

use AppBundle\Entity\Social\TagRepository;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Social\TagFollowed;
use AppBundle\Entity\Social\Tag;
use AppBundle\Entity\User\User;

class TagAnalyzer
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var TagRepository
     */
    private $tagRepo;

    /**
     * @param EntityManager   $entityManager
     * @param TagRepository $tagRepo
     */
    public function __construct(EntityManager $entityManager, TagRepository $tagRepo)
    {
        $this->em = $entityManager;
        $this->tagRepo = $tagRepo;
    }


}
