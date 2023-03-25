<?php

namespace AppBundle\Service\Article\Import;

interface ContentsReaderInterface
{
    /**
     * @param string $name
     *
     * @return string
     */
    public function getContents($source);
}
