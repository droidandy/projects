<?php

namespace AppBundle\Service\Article\Analysis;

interface AnalyzerClientInterface
{
    /**
     * @param string $text
     *
     * @return array
     */
    public function getTags($text);
}
