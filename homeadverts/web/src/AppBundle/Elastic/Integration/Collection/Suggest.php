<?php

namespace AppBundle\Elastic\Integration\Collection;

use AppBundle\Elastic\Integration\Mapping\DocumentParserInterface;
use JMS\Serializer\Annotation as JMS;
use JMS\Serializer\Context;
use JMS\Serializer\JsonSerializationVisitor;

class Suggest implements \Iterator
{
    /**
     * @var string
     */
    private $prefix;
    /**
     * @var string
     */
    private $name;
    /**
     * @var int
     */
    private $count;
    /**
     * @var array
     */
    public $coll;
    /**
     * @var int
     */
    private $i;
    /**
     * @var array
     */
    private $objectColl = [];
    /**
     * @var string
     */
    private $objectParser;

    /**
     * @param string                  $name
     * @param array                   $result
     * @param DocumentParserInterface $objectParser
     */
    public function __construct($name, array $result, DocumentParserInterface $objectParser)
    {
        $this->name = $name;
        $this->i = 0;
        $this->prefix = $result[0]['text'];
        $this->coll = $result[0]['options'];
        $this->count = count($result[0]['options']);
        $this->objectParser = $objectParser;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getPrefix()
    {
        return $this->prefix;
    }

    /**
     * @return int
     */
    public function count()
    {
        return $this->count;
    }

    /**
     * @return mixed
     */
    public function current()
    {
        if (!isset($this->objectColl[$this->i])) {
            $this->objectColl[$this->i] = $this->objectParser->parse($this->coll[$this->i]);
        }

        return $this->objectColl[$this->i];
    }

    public function next()
    {
        ++$this->i;
    }

    /**
     * @return int
     */
    public function key()
    {
        return $this->i;
    }

    /**
     * @return bool
     */
    public function valid()
    {
        return $this->count && $this->i < $this->count;
    }

    public function rewind()
    {
        $this->i = 0;
    }

    /**
     * @JMS\HandlerCallback("json", direction="serialization")
     */
    public function serializeToJson(JsonSerializationVisitor $visitor, $data, Context $context)
    {
        $options = [];
        foreach ($this as $option) {
            $options[] = $context->accept($option);
        }

        $root = [
            'prefix' => $this->prefix,
            'total' => $this->count,
            'suggests' => $options,
        ];
        $visitor->setRoot($root);

        return $root;
    }
}
