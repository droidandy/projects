<?php

namespace AppBundle\Helper;

use DOMDocument;

class StringUtils
{
    /**
     * @param string $text
     *
     * @return string
     */
    public function removeMediaCaptions($text)
    {
        $dom = $this->buildDocument($text);
        $list = $dom->getElementsByTagName('figcaption');

        while ($list->length > 0) {
            $p = $list->item(0);
            $p->parentNode->removeChild($p);
        }

        return $this->getBodyFromDOMDocument($dom);
    }

    /**
     * @param string $text
     *
     * @return string
     */
    public function stripTags($text)
    {
        return strip_tags($text);
    }

    /**
     * @param string $text
     *
     * @return string
     */
    public function removeNewlines($text)
    {
        return preg_replace('/\\n/', '', $text);
    }

    /**
     * @param string $text
     *
     * @return string
     */
    public function removeExtraSpaces($text)
    {
        return trim(preg_replace('/(\\s)+/', '$1', $text));
    }

    /**
     * @param string $originalText
     * @param int    $limit
     *
     * @return string
     */
    public function extractUncutPhrase($text, $limit)
    {
        $phrase = mb_substr($text, 0, $limit);
        $nextSymbol = mb_substr($text, $limit, 1);

        // Equal to original
        if ($phrase == $text) {
            return $phrase;
        }

        // If ends with mark
        if (preg_match("~[^\w\-'/]~i", $nextSymbol)) {
            return trim($phrase);
        }

        $parts = explode(' ', $phrase);
        array_pop($parts);

        return implode(' ', $parts);
    }

    /**
     * @param string $text
     *
     * @return array
     */
    public function extractImgSrcs($text)
    {
        $dom = $this->buildDocument($text);
        $data = [];

        foreach ($dom->getElementsByTagName('img') as $image) {
            $data[] = $image->getAttribute('src');
        }

        return $data;
    }

    /**
     * @param string $text
     *
     * @return string
     */
    public function getPrimaryImageSrc($text)
    {
        $dom = $this->buildDocument($text);

        foreach ($dom->getElementsByTagName('img') as $image) {
            if (false !== strpos($image->getAttribute('class'), 'primary-media')) {
                return $image->getAttribute('src');
            }
        }
    }

    /**
     * @param string $text
     *
     * @return DOMDocument
     */
    private function buildDocument($text)
    {
        $dom = new DOMDocument();

        libxml_use_internal_errors(true);
        $dom->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'.$text);
        libxml_use_internal_errors(false);

        return $dom;
    }

    /**
     * Return HTML without automatically added "<html><body>" tags.
     *
     * @param DOMDocument $dom
     *
     * @return DOMElement
     */
    public function getBodyFromDOMDocument(DOMDocument $dom)
    {
        // Return without automatically added "<html><body>" tags
        $result = new DOMDocument();
        $body = $dom->getElementsByTagName('body')->item(0);
        foreach ($body->childNodes as $child) {
            $result->appendChild($result->importNode($child, true));
        }

        return trim($dom->saveHTML());
    }

    /**
     * @param string $intro
     * @param string $originalDescription
     *
     * @return array
     */
    public function getDescriptionBlocks(string $intro, string $originalDescription)
    {
        $first = substr($intro, 0, $this->findDelimiterPos($intro));

        $description = substr(str_replace($first, '', $originalDescription), 1);

        $chunkSize = intval(strlen($description) / 4);
        $chunks = [
            $first.'.',
        ];

        for ($i = 0; $i < 4; ++$i) {
            $chunk = substr($description, 0, $chunkSize);
            $chunk = substr($chunk, 0, $this->findDelimiterPos($chunk));

            $description = substr(str_replace($chunk, '', $description), 1);

            $chunks[] = ucfirst(trim($chunk)).'.';
        }

        return $chunks;
    }

    /**
     * @param string $text
     *
     * @return bool|int
     */
    private function findDelimiterPos(string $text)
    {
        $pos = strrpos($text, '.');

        if (!$pos) {
            $pos = strrpos($text, ',');
        }

        return $pos;
    }
}
