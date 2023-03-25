<?php

namespace Test\AppBundle\Service\Article;

use AppBundle\Service\Article\ArticleService;
use AppBundle\Service\Article\Import\PropertyImporter;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class ArticleServiceTest extends AbstractTestCase
{
    use UserTrait;
    use PropertyTrait;
    use GoogleLocationTrait;
    use AddressTrait;
    use TagTrait;
    use ArticleTrait;
    use FileTrait;

    protected $rollbackTransactions = true;

    public function testBuildArticleFromProperty()
    {
        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyToImport($user);
        $tagProperty = $this->newTagPersistent([
            'name' => ArticleService::TAG_PROPERTY_PRIVATE,
            'user' => $user,
            'private' => true,
        ]);

        // Run
        $article = $this
            ->getContainer()
            ->get('ha.article.service')
            ->buildArticleFromProperty($property, $user);

        $meta = unserialize($article->getPrimaryImage()->getFile()->metadata);

        // Verify
        $this->assertEquals(
            'https://luxuryaffairs-dev.s3.amazonaws.com/properties/69672/0-cfcd208495d565ef66e7dff9f98764da.jpeg',
            $meta['ObjectURL']
        );
        $this->assertEquals(
            ArticleService::TAG_PROPERTY_PRIVATE,
            $article->getPrivateTags()[0]->getName()
        );

        $this->assertNull($article->getPublishedAt());
        $this->assertNotNull($article->getToken());
        $this->assertEquals([], $article->getPublicTags());
        $this->assertEquals($property->getTitle(), $property->getTitle());
        $this->assertEquals(

            PropertyImporter::IMAGE_GALLERY_LIMIT,
            substr_count(
                $article->getBody(),
                'luxuryaffairs-dev.s3.amazonaws.com'
            )
        );
        $this->assertEquals(
            PropertyImporter::IMAGE_GALLERY_LIMIT,
            count($article->getImages()));
    }

    public function testBuildArticleFromPropertyAndPublish()
    {
        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyToImport($user);
        $tagProperty = $this->newTagPersistent([
            'name' => ArticleService::TAG_PROPERTY_PRIVATE,
            'user' => $user,
            'private' => true,
        ]);

        // Run
        $article = $this
            ->getContainer()
            ->get('ha.article.service')
            ->buildArticleFromProperty($property, $user, true);

        $meta = unserialize($article->getPrimaryImage()->getFile()->metadata);

        // Verify
        $this->assertEquals(
            'https://luxuryaffairs-dev.s3.amazonaws.com/properties/69672/0-cfcd208495d565ef66e7dff9f98764da.jpeg',
            $meta['ObjectURL']
        );
        $this->assertEquals(
            ArticleService::TAG_PROPERTY_PRIVATE,
            $article->getPrivateTags()[0]->getName()
        );

        $this->assertNotNull($article->getPublishedAt());
        $this->assertNotNull($article->getToken());
        $this->assertEquals([], $article->getPublicTags());
        $this->assertEquals($property->getTitle(), $property->getTitle());
        $this->assertEquals(
            PropertyImporter::IMAGE_GALLERY_LIMIT,
            substr_count(
                $article->getBody(),
                'luxuryaffairs-dev.s3.amazonaws.com'
            )
        );
        $this->assertEquals(
            PropertyImporter::IMAGE_GALLERY_LIMIT,
            count($article->getImages())
        );
    }

    public function testValidateAndSaveArticleUpdateMainImage()
    {
        $articleService = $this->getContainer()->get('ha.article.service');
        $user = $this->newUserPersistent();
        $images = [
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
        ];

        $body = $this->putImagesIntoText($this->faker->text, $images, $images[0]);
        $article = $articleService->newArticle(
            $user,
            $this->faker->word,
            $body
        );

        $this->assertEquals(count($images), $article->getImages()->count());
        $this->assertEquals($images[0]->getId(), $article->getPrimaryImage()->getFile()->getId());

        // Update Main image
        $body = $this->putImagesIntoText($this->faker->text, $images, $images[3]);
        $article->setBody($body);
        $updatedArticle = $articleService->validateAndSaveArticle($article);
        $this->assertEquals($images[3]->getId(), $updatedArticle->getPrimaryImage()->getFile()->getId());
    }
}
