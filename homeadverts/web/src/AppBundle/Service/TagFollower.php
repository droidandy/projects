<?php

namespace AppBundle\Service;

use AppBundle\Entity\Social\TagRepository;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Social\TagFollowed;
use AppBundle\Entity\Social\Tag;
use AppBundle\Entity\User\User;

class TagFollower
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

    /**
     * @param User  $user
     * @param Tag $tag
     *
     * @return TagFollowed
     */
    public function followTag(User $user, Tag $tag)
    {
        $tagFollowed = new TagFollowed();
        $tagFollowed->user = $user;
        $tagFollowed->tag = $tag;

        $this->em->persist($tagFollowed);

        return $tagFollowed;
    }

    /**
     * @param User  $user
     * @param array $tagIds
     *
     * @return TagFollowed
     */
    public function followOnlySelectedCategories(User $user, array $tagIds)
    {
        $this->tagRepo->deleteAllFollowedTagsForUser($user);

        $tags = $this->em
            ->getRepository('AppBundle\Entity\Social\Tag')
            ->findBy([
                'id' => $tagIds,
            ]);

        /* @var TagFollowed $tagFollowed */
        foreach ($tags as $tag) {
            $this->followTag($user, $tag);
        }
    }
}
