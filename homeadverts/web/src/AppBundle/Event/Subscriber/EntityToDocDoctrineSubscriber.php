<?php

namespace AppBundle\Event\Subscriber;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Integration\Mapping\MappingFactoryInterface;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use AppBundle\Entity\User\User;
use Symfony\Component\DependencyInjection\ContainerInterface;

class EntityToDocDoctrineSubscriber implements EventSubscriber
{
    /**
     * @var ContainerInterface
     */
    private $container;
    /**
     * @var MappingFactoryInterface
     */
    private $mappingFactory;
    /**
     * @var bool
     */
    private $test;

    public function __construct(ContainerInterface $container, $test = false)
    {
        $this->container = $container;
        $this->test = $test;
    }

    public function getSubscribedEvents()
    {
        return [
            'postUpdate',
            'postPersist',
        ];
    }

    public function postPersist(LifecycleEventArgs $eventArgs)
    {
        $this->post($eventArgs);
    }

    public function postUpdate(LifecycleEventArgs $eventArgs)
    {
        $this->post($eventArgs);
    }

    private function post(LifecycleEventArgs $eventArgs)
    {
        // TODO: to support exception on "UserProcess" caused by VCR
        if ($this->test) {
            return false;
        }

        $entity = $eventArgs->getEntity();

        if (!$this->mappingFactory) {
            $this->mappingFactory = $this->container->get('ha.es.mapping_factory');
        }

        switch (true) {
            case $entity instanceof User:
                $mapping = $this->mappingFactory->get('user');
                break;
            case $entity instanceof Property:
                $mapping = $this->mappingFactory->get('property');
                break;
            case $entity instanceof Tag:
                $mapping = $this->mappingFactory->get('tag');
                break;
            case $entity instanceof Article:
                $mapping = $this->mappingFactory->get('article');
                break;
            default:
                return;
        }

        $mapping->addDocument($entity->getId(), $entity);
    }
}
