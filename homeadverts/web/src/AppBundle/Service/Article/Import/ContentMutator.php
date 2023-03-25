<?php

namespace AppBundle\Service\Article\Import;

use AppBundle\Helper\StringUtils;
use AppBundle\Entity\Storage\File;
use DOMDocument;
use DOMElement;

class ContentMutator
{
    /**
     * @var array
     */
    const ALLOWED_TAGS = [
        '<p>',
        '<a>',
        '<h1>',
        '<h2>',
        '<h3>',
        '<i><em>',
        '<b><strong>',
        '<blockquote>',
        '<img>',
        '<ul><li>',
    ];

    /**
     * @param string $content
     *
     * @return string
     */
    public function replaceProgressiveImages($content)
    {
        return str_replace(
            [
                '<progressive-image',
                '</progressive-image>',
            ],
            [
                '<img',
                '</img>',
            ],
            $content
        );
    }

    /**
     * @param string $content
     *
     * @return string
     */
    public function updateLazyloadImages($content)
    {
        $dom = new DOMDocument();

        libxml_use_internal_errors(true);
        $dom->loadHTML($content);
        libxml_use_internal_errors(false);

        $images = $dom->getElementsByTagName('img');

        foreach ($images as $tag) {
            $dataSrc = $tag->getAttribute('data-src');
            $dataLazySrc = $tag->getAttribute('data-lazy-src');

            if ($dataSrc) {
                $tag->setAttribute('src', $dataSrc);
            }
            if ($dataLazySrc) {
                $tag->setAttribute('src', $dataLazySrc);
            }
        }

        return trim($dom->saveHTML());
    }

    /**
     * @param string $content
     *
     * @return string
     */
    public function stripTags($content)
    {
        $allowableTags = implode('', self::ALLOWED_TAGS);

        return strip_tags(
            $content,
            $allowableTags
        );
    }

    /**
     * @param string $content
     *
     * @return string
     */
    public function convertHTMLEntitiesToCharacters($content)
    {
        return html_entity_decode($content);
    }

    /**
     * @param string $title
     * @param string $name
     *
     * @return string
     */
    public function addLinkToOriginalSource($content, $title, $url)
    {
        return sprintf(
            '%s<p>Originally published at <a href="%s" title="%s">%s</a><p>',
            $content,
            $url,
            $title,
            parse_url($url, PHP_URL_HOST)
        );
    }

    /**
     * @param string $content
     * @param File[] $fileImages
     *
     * @return string
     */
    public function replaceImages($content, array $fileImages)
    {
        $stringUtils = new StringUtils();
        $dom = new DOMDocument();

        libxml_use_internal_errors(true);
        $dom->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'.$content);
        libxml_use_internal_errors(false);

        foreach ($dom->getElementsByTagName('img') as $node) {
            $url = $node->getAttribute('src');
            $fileImage = $this->findFileImage($fileImages, $url);

            if ($fileImage) {
                $img = $dom->createElement('img');
                $div = $dom->createElement('div');
                $figure = $dom->createElement('figure');
                $figCaption = $this->createImageCaption($dom, $node);

                $img->setAttribute('src', $fileImage->url);
                $div->setAttribute('class', 'medium-insert-images');

                $figure->appendChild($img);

                if ($figCaption) {
                    $figure->appendChild($figCaption);
                }

                $div->appendChild($figure);

                $node->parentNode->replaceChild($div, $node);
            }
        }

        return $stringUtils->getBodyFromDOMDocument($dom);
    }

    /**
     * @param DOMDocument $dom
     * @param DOMElement  $node
     *
     * @return DOMElement
     */
    public function createImageCaption(DOMDocument $dom, DOMElement $node)
    {
        $caption = '';

        if ($node->getAttribute('alt')) {
            $caption = $node->getAttribute('alt');
        }
        if ($node->getAttribute('title')) {
            $caption = $node->getAttribute('title');
        }

        if ($caption) {
            $figcaption = $dom->createElement('figcaption');
            $figcaption->appendChild($dom->createTextNode($caption));

            return $figcaption;
        }
    }

    /**
     * @param File[] $fileImages
     * @param string $url
     *
     * @return File
     */
    private function findFileImage(array $fileImages, string $url)
    {
        foreach ($fileImages as $fileImage) {
            if ($fileImage->source == $url) {
                return $fileImage;
            }
        }
    }
}
