<?php

namespace Test\Utils\Traits;

use Faker;
use AppBundle\Entity\Social\Tag;
use AppBundle\Entity\User\User;

trait TagTrait
{
    /**
     * @var bool
     */
    private $flush = true;
    /**
     * @var Tag[]
     */
    private $tags = [];

    /**
     * @var array
     *
     * @return Tag
     */
    public function newTag(array $data = [])
    {
        $data = array_replace([
            'name' => $this->getFaker()->text(15),
            'private' => false,
            'user' => null,
        ], $data);

        $tag = new Tag();

        $tag->setDisplayName($data['name']);
        $tag->setPrivate($data['private']);
        $tag->user = $data['user'];

        return $tag;
    }

    /**
     * @param array $tagData
     *
     * @return Tag
     */
    public function createOrFetchTag(array $tagData = [])
    {
        if (isset($tagData['displayName'])) {
            if (!isset($this->tags[$tagData['displayName']])) {
                $this->tags[$tagData['displayName']] = $this->newTag($tagData);
            }

            return $this->tags[$tagData['displayName']];
        }

        return $this->newTag($tagData);
    }

    /**
     * @param array|int $tagDataOrCount
     *
     * @return Tag[]
     */
    public function createTags($tagDataOrCount)
    {
        $tags = [];
        if (is_array($tagDataOrCount)) {
            foreach ($tagDataOrCount as $tagData) {
                $tags[] = $this->createOrFetchTag($tagData);
            }
        } elseif (is_int($tagDataOrCount)) {
            for ($i = 0; $i < $tagDataOrCount; ++$i) {
                $tags[] = $this->createOrFetchTag();
            }
        }

        return $tags;
    }

    /**
     * @param int    $count
     * @param string $term
     * @param bool   $relevance
     *
     * @return Tag[]
     */
    public function createTagsWithTerm($count, $term, $relevance = false)
    {
        $tagData = [];
        for ($i = 1; $i <= $count; ++$i) {
            if ($relevance) {
                $displayName = str_repeat($term.' ', $count - $i + 2).$i;
            } else {
                $displayName = $term.' '.$i;
            }
            $tagData[] = [
                'displayName' => $displayName,
            ];
        }

        return $this->createTags($tagData);
    }

    /**
     * @param int $count
     *
     * @return Tag[]
     */
    public function createTagsNonsearchable($count)
    {
        $tagData = [];
        for ($i = 1; $i <= $count; ++$i) {
            $tagData[] = [
                'displayName' => '---'.$i,
            ];
        }

        return $this->createTags($tagData);
    }

    /**
     * @param array  $arguments
     * @param string $createMethod
     *
     * @return Tag[]
     */
    public function createTagsPersistent(array $arguments = [], $createMethod = 'createTags')
    {
        $em = $this->getEntityManager();
        $tags = $this->$createMethod(...$arguments);
        foreach ($tags as $tag) {
            $em->persist($tag->user);
            $em->persist($tag);
        }

        if ($this->flush) {
            $em->flush($tag);

            $client = $this->getContainer()->get('es_client');
            $client->indices()->refresh(['index' => 'test_tags']);
        }

        return $tags;
    }

    /**
     * @param int    $count
     * @param string $term
     * @param bool   $relevance
     *
     * @return Tag[]
     */
    public function createTagsWithTermPersistent($count, $term, $relevance = false)
    {
        return $this->createTagsPersistent([$count, $term, $relevance], 'createTagsWithTerm');
    }

    /**
     * @param int $count
     *
     * @return Tag[]
     */
    public function createTagsNonsearchablePersistent($count)
    {
        return $this->createTagsPersistent([$count], 'createTagsNonsearchable');
    }

    /**
     * @param array $data
     *
     * @return Tag
     */
    protected function newTagPersistent(array $data = [])
    {
        $tag = $this->newTag($data);

        $this->em->persist($tag);
        $this->em->flush($tag);

        return $tag;
    }

    /**
     * @param User $user
     *
     * @return Tag
     */
    protected function newRandomTagPersistent(User $user)
    {
        return $this->newTagPersistent([
            'name' => $this->getFaker()->word.$this->getFaker()->numberBetween(),
            'user' => $user,
            'private' => false,
        ]);
    }

    /**
     * @return array
     */
    protected function buildTagData()
    {
        $tag = [
            'displayName' => $this->getFaker()->numberBetween(0, 9999999),
            'private' => false,
        ];

        return $tag;
    }

    /**
     * @return Faker\Generator
     */
    abstract protected function getFaker();
}
