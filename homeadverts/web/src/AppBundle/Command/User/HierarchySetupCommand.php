<?php

namespace AppBundle\Command\User;

use AppBundle\Entity\User\Relation;
use AppBundle\Service\User\AdjacencyRegistry;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class HierarchySetupCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('hierarchy:setup')
            ->setDescription('Build hierarchy cache')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $redis = $container->get('snc_redis.default_client');
        $keys = $redis->keys(AdjacencyRegistry::PREFIX.'*');

        if ($keys) {
            $redis->del($keys);
        }

        $adjacencyRegistry = $container->get('ha.user.adjacency_registry');
        /** @var EntityManager $em */
        $em = $container->get('em');
        $relationRepo = $em->getRepository(Relation::class);

        $relations = $relationRepo->findAll();
        foreach ($relations as $relation) {
            if (null === $relation->getDeletedAt()) {
                $adjacencyRegistry->processRelation($relation);
            }
        }
    }
}
