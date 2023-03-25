<?php

namespace AppBundle\Elastic\Integration\Mapping;

class DocumentParserChain implements DocumentParserInterface
{
    /**
     * @var DocumentParserInterface[]
     */
    private $parsers;

    /**
     * DocumentParserChain constructor.
     *
     * @param DocumentParserInterface[] $parsers
     */
    public function __construct($parsers)
    {
        $this->parsers = $parsers;
    }

    /**
     * @param array $document
     *
     * @return mixed
     *
     * @throws \InvalidArgumentException
     */
    public function parse(array $document)
    {
        foreach ($this->parsers as $parser) {
            if ($parser->support($document)) {
                return $parser->parse($document);
            }
        }

        throw new \InvalidArgumentException('Can\'t parse the element, make sure you configured a corresponding parser');
    }

    /**
     * @param array $document
     *
     * @return bool
     */
    public function support(array $document)
    {
        foreach ($this->parsers as $parser) {
            if ($parser->support($document)) {
                return true;
            }
        }

        return false;
    }
}
