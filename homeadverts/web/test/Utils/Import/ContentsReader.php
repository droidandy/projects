<?php

namespace Test\Utils\Import;

use AppBundle\Service\Article\Import\ContentsReaderInterface;

class ContentsReader implements ContentsReaderInterface
{
    /**
     * @param string $name
     *
     * @return string
     */
    public function getContents($source)
    {
        return file_get_contents($source);
    }
}
