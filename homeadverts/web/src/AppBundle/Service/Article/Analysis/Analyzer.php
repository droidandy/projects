<?php

namespace AppBundle\Service\Article\Analysis;

use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Tag;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\User\User;

class Analyzer
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var
     */
    private $client;

    /**
     * @param AnalyzerClientInterface $client
     * @param EntityManager           $entityManager
     */
    public function __construct(AnalyzerClientInterface $client, EntityManager $entityManager)
    {
        $this->client = $client;
        $this->em = $entityManager;
    }

    /**
     * @param Article $article
     *
     * @return array
     */
    public function analyze(Article $article)
    {
        $tagNames = $this->client->getTags($article->getBody());

        return [
            'tags' => $this->buildTags($tagNames, $article->getAuthor()),
        ];
    }

    /**
     * @param array $tags
     * @param User  $user
     *
     * @return array
     */
    public function buildTags(array $tagNames, User $user)
    {
        $result = [];

        foreach ($tagNames as $name) {
            $tag = $this->em->getRepository(Tag::class)->findOneBy([
                'displayName' => $name,
            ]);

            if (!$tag) {
                $tag = new Tag();
                $tag->setDisplayName($name);
                $tag->user  = $user;
                $tag->setPrivate(false);

                $this->em->persist($tag);
                $this->em->flush($tag);
            }

            $result[] = [
                'id' => $tag->getId(),
                'displayName' => $tag->getDisplayName(),
            ];
        }

        return $result;
    }
}
