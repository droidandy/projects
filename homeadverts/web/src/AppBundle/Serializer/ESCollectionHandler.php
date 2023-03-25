<?php

namespace AppBundle\Serializer;

use AppBundle\Elastic\Integration\Collection\SearchResults;
use JMS\Serializer\Context;
use JMS\Serializer\GraphNavigator;
use JMS\Serializer\Handler\SubscribingHandlerInterface;
use JMS\Serializer\JsonSerializationVisitor;

class ESCollectionHandler implements SubscribingHandlerInterface
{
    public static function getSubscribingMethods()
    {
        $methods = [];

        $types = [
            'AppBundle\Elastic\Integration\Collection\SearchResults',
        ];
        foreach ($types as $type) {
            $methods[] = [
                'direction' => GraphNavigator::DIRECTION_SERIALIZATION,
                'format' => 'json',
                'type' => $type,
                'method' => 'serializeSearchToJson',
            ];
        }

        return $methods;
    }

    public function serializeSearchToJson(JsonSerializationVisitor $visitor, SearchResults $collection, array $type, Context $context)
    {
        $objects = [];
        foreach ($collection as $object) {
            $objects[] = $context->accept($object);
        }

        $root = new \ArrayObject([
            'total' => $visitor->visitInteger($collection->getTotal(), [], $context),
            'results' => $objects,
        ]);
        $visitor->setRoot($root);

        return $root;
    }
}
