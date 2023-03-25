<?php

namespace AppBundle\Elastic\Integration\Collection;

use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;

class SuggestionResults implements \Iterator, \ArrayAccess
{
    /**
     * @var array
     */
    private $results = [];
    /**
     * @var array
     */
    private $wrappedSuggestions = [];
    /**
     * @var DocumentParserInterface
     */
    private $objectParser;

    /**
     * @param array                   $results
     * @param DocumentParserInterface $objectParser
     */
    public function __construct(array $results, DocumentParserInterface $objectParser)
    {
        $this->results = $results;
        $this->objectParser = $objectParser;
    }

    /**
     * @return mixed
     */
    public function current()
    {
        return $this->wrapSuggestion(key($this->results), current($this->results));
    }

    public function next()
    {
        next($this->results);
    }

    /**
     * @return mixed
     */
    public function key()
    {
        return key($this->results);
    }

    /**
     * @return bool
     */
    public function valid()
    {
        return (bool) current($this->results);
    }

    public function rewind()
    {
        reset($this->results);
    }

    /**
     * @param mixed $offset
     *
     * @return bool
     */
    public function offsetExists($offset)
    {
        return isset($this->results[$offset]);
    }

    /**
     * @param mixed $offset
     *
     * @return mixed
     */
    public function offsetGet($offset)
    {
        return $this->wrapSuggestion($offset, $this->results[$offset]);
    }

    /**
     * @param mixed $offset
     * @param mixed $value
     */
    public function offsetSet($offset, $value)
    {
        throw new \LogicException('Invalid operation');
    }

    /**
     * @param mixed $offset
     */
    public function offsetUnset($offset)
    {
        throw new \LogicException('Invalid operation');
    }

    /**
     * @param mixed $key
     * @param array $suggestion
     *
     * @return mixed
     */
    private function wrapSuggestion($key, $suggestion)
    {
        if (!isset($this->wrappedSuggestions[$key])) {
            switch (true) {
                case '_suggest' == substr($key, -strlen('_suggest')):
                    $this->wrappedSuggestions[$key] = new Suggest($key, $suggestion, $this->objectParser);
                    break;
                default:
                    throw new \InvalidArgumentException('A suggest name should end with a suffix of a suggest type');
            }
        }

        return $this->wrappedSuggestions[$key];
    }
}
