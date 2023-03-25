<?php

namespace AppBundle\Twig;

use Twig_Extension;
use Twig_SimpleFilter;
use AppBundle\Entity\Social\Article;
use AppBundle\Service\File\ImageHelper;
use AppBundle\Entity\Storage\File;
use AppBundle\Service\File\Storage\S3FileStorage;
use AppBundle\Service\Article\ArticleMedia;

class ImageExtension extends Twig_Extension
{
    /**
     * @var S3FileStorage
     */
    private $storage;
    /**
     * @var ImageHelper
     */
    private $imageHelper;
    /**
     * @var ArticleMedia
     */
    private $articleMedia;

    /**
     * @param S3FileStorage $storage
     * @param ImageHelper   $imageHelper
     * @param ArticleMedia  $articleMedia
     */
    public function __construct(
        S3FileStorage $storage,
        ImageHelper $imageHelper,
        ArticleMedia $articleMedia
    ) {
        $this->storage = $storage;
        $this->imageHelper = $imageHelper;
        $this->articleMedia = $articleMedia;
    }

    /**
     * {@inheritdoc}
     */
    public function getFilters()
    {
        return [
            new Twig_SimpleFilter('user_profile_image', [$this, 'userProfileImage']),
            new Twig_SimpleFilter('media_image', [$this, 'mediaImage']),
            new Twig_SimpleFilter('article_image', [$this, 'articleImagePath']),
        ];
    }

    /**
     * @param  array
     *
     * @return string
     */
    public function userProfileImage($user)
    {
        $url = $this->imageHelper->userProfileImage($user);
        $url = str_replace('http://', 'https://', $url);

        return $url;
    }

    /**
     * @param File $file
     *
     * @return string
     */
    public function mediaImage(File $file)
    {
        return $this->storage->getUrl($file);
    }

    /**
     * @param Article $article
     * @param string  $filterName
     *
     * @return string
     */
    public function articleImagePath(Article $article, $filterName)
    {
        return $this->articleMedia->getArticlePrimaryImage($article, $filterName);
    }

    /**
     * The extension name.
     *
     * @return string
     */
    public function getName()
    {
        return 'image_extension';
    }
}
