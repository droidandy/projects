<?php

namespace AppBundle\Serializer\Constructor;

use Doctrine\ORM\EntityManager;
use JMS\Serializer\Construction\DoctrineObjectConstructor;
use JMS\Serializer\Construction\ObjectConstructorInterface;
use JMS\Serializer\DeserializationContext;
use JMS\Serializer\Metadata\ClassMetadata;
use JMS\Serializer\VisitorInterface;

class UniqueFieldDoctrineObjectConstructor implements ObjectConstructorInterface
{
    /**
     * @var DoctrineObjectConstructor
     */
    private $objectConstructor;
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * UniqueFieldDoctrineObjectConstructor constructor.
     *
     * @param DoctrineObjectConstructor $objectConstructor
     */
    public function __construct(DoctrineObjectConstructor $objectConstructor, EntityManager $em)
    {
        $this->objectConstructor = $objectConstructor;
        $this->em = $em;
    }

    public function construct(VisitorInterface $visitor, ClassMetadata $metadata, $data, array $type, DeserializationContext $context)
    {
        if ($metadata->reflection->implementsInterface(UniqueFieldConstructableInterface::class)) {
            $className = $metadata->name;
            $className::getUniqueFieldName();
            $field = $className::getUniqueFieldName();

            if (array_key_exists($field, $data)) {
                $object = $this->em->getRepository($metadata->name)->findOneBy([
                    $field => $data[$field],
                ]);

                if ($object) {
                    return $object;
                }
            }
        }

        return $this->objectConstructor->construct($visitor, $metadata, $data, $type, $context);
    }
}
