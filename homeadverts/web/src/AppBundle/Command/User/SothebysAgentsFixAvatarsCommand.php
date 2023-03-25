<?php

namespace AppBundle\Command\User;

use AppBundle\Import\Job\AvatarFix;
use Doctrine\ORM\EntityManager;
use Monolog\Logger;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SothebysAgentsFixAvatarsCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('sothebys:agents:fix-avatars')
            ->setDescription('Fix not uploaded avatars')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $redis = $this->getContainer()->get('redis_client');

        /** @var Logger $logger */
        $logger = $container->get('monolog.logger.import');
        /** @var EntityManager $em */
        $em = $container->get('em');
        $userIds = $em->createQuery('SELECT u.id FROM AppBundle:User\User u JOIN u.sourceRefs sr WHERE u.createdAt > \'2016-09-30\'')->getScalarResult();
        $count = 0;
        foreach ($userIds as $userId) {
            $logger->debug(sprintf('Added to processing %s', $userId['id']));
            $redis->enqueue('thumb_process', AvatarFix::class, ['user_id' => $userId['id']]);
            ++$count;
        }
        $logger->debug(sprintf('Total processed %s', $count));
    }
}
