<?php

namespace Test\AppBundle\Service\Article\Processor;

use AppBundle\Entity\Social\ArticleImage;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class ImageProcessorTest extends AbstractTestCase
{
    use TagTrait;
    use ArticleTrait;
    use FileTrait;
    use UserTrait;
    use AddressTrait;
    use GoogleLocationTrait;
    use LocationTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testProcessArticleWithoutImages()
    {
        $processor = $this->getContainer()->get('ha.article.image_processor');
        $user = $this->newUser();
        $article = $this->newArticle([
            'user' => $user,
        ]);

        // Verify
        $this->assertEquals(0, $article->getImages()->count());
        $processor->process($article);

        // Verify
        $this->assertEquals(0, $article->getImages()->count());
    }

    public function testProcessArticleWithImagesChangeMain()
    {
        $processor = $this->getContainer()->get('ha.article.image_processor');
        $user = $this->newUserPersistent();
        $images = [
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
        ];
        $article = $this->newArticle([
            'user' => $user,
            'images' => $images,
        ]);

        $processor->process($article);
        $this->em->persist($article);
        $this->em->flush($article);

        $this->assertEquals(4, $article->getImages()->count());
        $this->assertEquals(0, $article->getImages()[0]->getOrder());
        $this->assertEquals($images[0]->hash, $article->getImages()[0]->getFile()->hash);
        $this->assertEquals($images[1]->hash, $article->getImages()[1]->getFile()->hash);
        $this->assertEquals($images[2]->hash, $article->getImages()[2]->getFile()->hash);
        $this->assertEquals($images[3]->hash, $article->getImages()[3]->getFile()->hash);

        // Change main image
        $bodyNew = $this->putImagesIntoText($this->faker->text, $images, $images[2]);
        $article->setBody($bodyNew);

        $processor->process($article);
        $this->em->persist($article);
        $this->em->flush($article);

        // Verify
        $this->assertEquals(4, $article->getImages()->count());
        $this->assertEquals(0, $article->getImages()[2]->getOrder());

        $primaryImage = $this->em
            ->getRepository(ArticleImage::class)
            ->find($article->getImages()[2]->getId());

        $this->assertEquals(0, $primaryImage->getOrder());
        $this->assertEquals($article->getPrimaryImage()->getId(), $primaryImage->getId());
    }

    public function testProcessArticleImagesAdd()
    {
        $processor = $this->getContainer()->get('ha.article.image_processor');
        $user = $this->newUserPersistent();
        $images = [
            $this->newFilePersistent($user),
        ];
        $article = $this->newArticle([
            'user' => $user,
            'images' => $images,
        ]);

        $processor->process($article);
        $this->em->persist($article);
        $this->em->flush($article);

        $this->assertEquals(1, $article->getImages()->count());
        $this->assertEquals(0, $article->getImages()[0]->getOrder());
        $this->assertEquals($images[0]->hash, $article->getImages()[0]->getFile()->hash);

        // Add more images
        array_push($images, $this->newFilePersistent($user));
        array_push($images, $this->newFilePersistent($user));
        array_push($images, $this->newFilePersistent($user));
        $bodyNew = $this->putImagesIntoText($this->faker->text, $images, $images[2]);
        $article->setBody($bodyNew);

        $processor->process($article);
        $this->em->persist($article);
        $this->em->flush($article);

        // Verify
        $this->assertEquals(4, $article->getImages()->count());
        $this->assertEquals(0, $article->getImages()[2]->getOrder());

        $primaryImage = $this->em
            ->getRepository(ArticleImage::class)
            ->find($article->getImages()[2]->getId());

        $this->assertEquals(0, $primaryImage->getOrder());
        $this->assertEquals($article->getPrimaryImage()->getId(), $primaryImage->getId());
    }

    public function testProcessArticleImagesRemove()
    {
        $processor = $this->getContainer()->get('ha.article.image_processor');
        $user = $this->newUserPersistent();
        $images = [
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
            $this->newFilePersistent($user),
        ];
        $article = $this->newArticle([
            'user' => $user,
            'images' => $images,
        ]);

        $processor->process($article);
        $this->em->persist($article);
        $this->em->flush($article);

        $this->assertEquals(4, $article->getImages()->count());
        $this->assertEquals(0, $article->getImages()[0]->getOrder());
        $this->assertEquals($images[0]->hash, $article->getImages()[0]->getFile()->hash);

        // Remove images
        array_pop($images);
        array_pop($images);
        $bodyNew = $this->putImagesIntoText($this->faker->text, $images, $images[1]);
        $article->setBody($bodyNew);

        $processor->process($article);
        $this->em->persist($article);
        $this->em->flush($article);

        // Verify
        $this->assertEquals(2, $article->getImages()->count());
        $this->assertEquals(0, $article->getImages()[1]->getOrder());

        $primaryImage = $this->em
            ->getRepository(ArticleImage::class)
            ->find($article->getImages()[1]->getId());

        $this->assertEquals(0, $primaryImage->getOrder());
        $this->assertEquals($article->getPrimaryImage()->getId(), $primaryImage->getId());
    }

    public function testProcessRandomSetOfArticlesAndImages()
    {
        $processor = $this->getContainer()->get('ha.article.image_processor');
        $user = $this->newUserPersistent();
        $imagesTotal = 25;
        $articlesTotal = 25;

        for ($i = 0; $i < mt_rand(5, $articlesTotal); $i++) {
            $images = [];
            for ($x = 0; $x < mt_rand(5, $imagesTotal); $x++) {
                $images[] = $this->newFilePersistent($user);
            }

            $article = $this->newArticle([
                'user' => $user,
                'images' => $images,
            ]);

            // Verify
            $this->assertEquals(0, $article->getImages()->count());
            $processor->process($article);

            // Verify
            $this->assertEquals(count($images), $article->getImages()->count());

            for ($y = 0; $y < count($images); $y++) {
                $this->assertEquals($images[$y]->hash, $article->getImages()[$y]->getFile()->hash);
            }
        }
    }
}
