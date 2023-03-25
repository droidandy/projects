<?php

namespace AppBundle\Elastic\Integration\Mapping;

interface DocumentParserInterface
{
    /**
     * @var array
     *
     * @return mixed
     *
     * @throws \InvalidArgumentException
     */
    public function parse(array $document);

    /**
     * @param array $document
     *
     * @return bool
     */
    public function support(array $document);
}
