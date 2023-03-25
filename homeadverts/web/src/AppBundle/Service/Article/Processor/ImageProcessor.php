<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\ArticleImage;
use AppBundle\Entity\Storage\File;
use AppBundle\Helper\StringUtils;
use Doctrine\ORM\EntityManager;

class ImageProcessor implements ProcessorInterface
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var StringUtils
     */
    private $stringUtils;

    /**
     * ImageProcessor constructor.
     *
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
        $this->stringUtils = new StringUtils();
    }

    /**
     * @param Article $article
     */
    public function process(Article $article)
    {
        $hashes = $this->extractHashes($article);
        $images = $article->getImages();

        // Remove outdated first
        foreach ($images as $image) {
            if (!in_array($image->getFile()->hash, $hashes)) {
                $images->removeElement($image);
            }
        }

        // Add new after
        foreach ($hashes as $hash) {
            $exists = false;

            foreach ($images as $image) {
                if ($image->getFile()->hash == $hash) {
                    $exists = true;
                }
            }

            if (!$exists) {
                $images[] = $this->newImage($article, $hash);
            }
        }

        $article->setImages($images);
        $this->setPrimaryImage($article);
    }

    /**
     * @param Article $article
     */
    private function setPrimaryImage(Article $article)
    {
        /** @var ArticleImage $image */
        $url = $this->stringUtils->getPrimaryImageSrc($article->getBody());

        if ($url) {
            $hash = File::getHashFromPath($url);

            foreach ($article->getImages() as $image) {
                // todo: debug there..
                $newOrder = $image->getOrder() + 1;
                $image->setOrder($newOrder);

                if ($image->getFile()->hash == $hash) {
                    $image->setOrder(0);
                }
            }
        }
    }

    /**
     * @param Article $article
     *
     * @return array
     */
    private function extractHashes(Article $article)
    {
        $srcs = $this->stringUtils->extractImgSrcs($article->getBody());

        return array_map(function ($src) {
            return File::getHashFromPath($src);
        }, $srcs);
    }

    /**
     * @param Article $article
     * @param string  $hash
     *
     * @return ArticleImage
     */
    private function newImage(Article $article, string $hash)
    {
        $file = $this->em->getRepository(File::class)->findOneBy([
            'hash' => $hash,
        ]);

        $articleImage = new ArticleImage();
        $articleImage->setFile($file);
        $articleImage->setArticle($article);

        return $articleImage;
    }
}
