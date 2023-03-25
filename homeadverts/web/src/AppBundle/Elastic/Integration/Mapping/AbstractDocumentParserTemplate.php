<?php

namespace AppBundle\Elastic\Integration\Mapping;

abstract class AbstractDocumentParserTemplate implements DocumentParserInterface
{
    /**
     * @var string
     */
    private $index;
    /**
     * @var string
     */
    private $mapping;

    /**
     * @param string $index
     * @param string $mapping
     */
    public function __construct($index, $mapping)
    {
        $this->index = $index;
        $this->mapping = $mapping;
    }

    /**
     * @param array $document
     */
    public function parse(array $document)
    {
        if (!$this->support($document)) {
            throw new \InvalidArgumentException(
                sprintf(
                    'Supported index "%s" and mapping "%s"',
                    $this->index,
                    $this->mapping
                )
            );
        }

        return $this->doParse($document);
    }

    /**
     * @param array $el
     *
     * @return bool
     */
    public function support(array $document)
    {
        return $document['_index'] === $this->index && $document['_type'] === $this->mapping;
    }

    /**
     * @param array $document
     *
     * @return object
     */
    abstract protected function doParse(array $document);
}
