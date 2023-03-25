<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Helper\StringUtils;

class HeadTextSubtitleExtractor implements SubtitleExtractorInterface
{
    /**
     * @var StringUtils
     */
    private $stringUtil;

    public function __construct()
    {
        $this->stringUtil = new StringUtils();
    }

    /**
     * @param string $text
     * @param int    $length
     *
     * @return string
     */
    public function extractSubtitle($text, $length = self::DEFAULT_MAX_LENGTH)
    {
        return $this->extractText($text, $length);
    }

    /**
     * @param string $text
     * @param int    $length
     *
     * @return string
     */
    public function extractIntro($text, $length)
    {
        if ($text) {
            $text = $this->extractText($text, $length);
        }

        return $text;
    }

    /**
     * @param string $text
     * @param int    $length
     *
     * @return string
     */
    protected function extractText($text, $length)
    {
        $text = $this->stringUtil->removeMediaCaptions($text);
        $text = $this->stringUtil->stripTags($text);
        $text = $this->stringUtil->removeNewlines($text);
        $text = $this->stringUtil->removeExtraSpaces($text);
        $text = $this->stringUtil->extractUncutPhrase($text, $length);

        return $text;
    }
}
