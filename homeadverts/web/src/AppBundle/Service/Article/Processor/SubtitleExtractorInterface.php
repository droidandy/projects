<?php

namespace AppBundle\Service\Article\Processor;

interface SubtitleExtractorInterface
{
    const DEFAULT_MAX_LENGTH = 100;

    public function extractSubtitle($text, $length = self::DEFAULT_MAX_LENGTH);
}
