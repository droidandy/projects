<?php

namespace AppBundle\Service\Article;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use AppBundle\Entity\Storage\File;
use AppBundle\Entity\Social\Tag;
use AppBundle\Service\Article\Processor\StateAwareChainProcessor;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\User\User;
use AppBundle\Exception\InvalidDataException;
use AppBundle\Service\Article\Import\PageImporter;
use AppBundle\Service\Article\Import\PropertyImporter;

class ArticleService
{
    const CATEGORY_REAL_ESTATE = 'real-estate';
    const TAG_PROPERTY_PRIVATE = 'property';

    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var PropertyImporter
     */
    private $propertyImporter;
    /**
     * @var PageImporter
     */
    private $pageImporter;
    /**
     * @var ValidatorInterface
     */
    private $validator;
    /**
     * @var StateAwareChainProcessor
     */
    private $processor;

    /**
     * @param EntityManager            $entityManager
     * @param PropertyImporter         $propertyImporter
     * @param PageImporter             $pageImporter
     * @param ValidatorInterface       $validator
     * @param StateAwareChainProcessor $processor
     */
    public function __construct(
        EntityManager $entityManager,
        PropertyImporter $propertyImporter,
        PageImporter $pageImporter,
        ValidatorInterface $validator,
        StateAwareChainProcessor $processor
    ) {
        $this->em = $entityManager;
        $this->propertyImporter = $propertyImporter;
        $this->pageImporter = $pageImporter;
        $this->validator = $validator;
        $this->processor = $processor;
    }

    /**
     * @param string $url
     * @param User   $user
     *
     * @return Article
     */
    public function buildArticleFromUrl($url, User $user)
    {
        $data = $this->pageImporter->import($url);

        $article = $this->newArticle(
            $user,
            $data['title'],
            $data['body'],
            $data['images']
        );

        return $article;
    }

    /**
     * @param Property $property
     * @param User     $user
     * @param bool     $setPublished
     *
     * @return Article
     */
    public function buildArticleFromProperty(Property $property, User $user, $setPublished = false)
    {
        $data = $this->propertyImporter->import($property);

        $propertyTag = $this
            ->em
            ->getRepository(Tag::class)
            ->findOneBy([
                'name' => self::TAG_PROPERTY_PRIVATE,
                'private' => true,
            ]);

        $article = new Article();
        $article->setTitle($data['title']);
        $article->setBody($data['body']);
        $article->setAuthor($user);
        $article->addRawTag($propertyTag, $user);

        if ($setPublished) {
            $article->setPublished();
        }

        return $this->validateAndSaveArticle($article);
    }

    /**
     * @param User   $user
     * @param string $title
     * @param string $body
     * @param File[] $images
     *
     * @return Article
     */
    public function newArticle(User $user, $title = null, $body = null, array $images = [])
    {
        $article = new Article();
        $article->setTitle($title);
        $article->setBody($body);
        $article->setAuthor($user);

        $this->validateAndSaveArticle($article);

        return $article;
    }

    /**
     * @param Article $article
     *
     * @return Article
     */
    public function validateAndSaveArticle(Article $article)
    {
        $violations = $this
            ->validator
            ->validate(
                $article,
                null,
                [
                    $article->getPublishingState(),
                ]
            );

        if ($violations->count()) {
            throw new InvalidDataException($violations);
        }

        $this->processor->process($article);
        $this->em->persist($article);
        $this->em->flush();

        return $article;
    }
}
