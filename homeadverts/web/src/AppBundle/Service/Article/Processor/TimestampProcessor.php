<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Entity\Social\Article;
use Doctrine\ORM\EntityManager;

class TimestampProcessor implements ProcessorInterface
{
    const CHANGE_MEANINGFUL_FIELDS = [
        'title',
        'subtitle',
        'description',
        'body',
    ];

    /**
     * @var EntityManager
     */
    private $em;

    /**
     * TimestampProcessor constructor.
     *
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    /**
     * {@inheritdoc}
     */
    public function process(Article $article)
    {
        $uow = $this->em->getUnitOfWork();
        $metadata = $this->em->getClassMetadata(Article::class);
        $originalData = $uow->getOriginalEntityData($article);

        if (!$originalData) {
            return false;
        }

        foreach (self::CHANGE_MEANINGFUL_FIELDS as $field) {
            if ($metadata->reflFields[$field] !== $originalData[$field]) {
                $article->setUpdatedAt(new \DateTime());
                break;
            }
        }
    }
}
