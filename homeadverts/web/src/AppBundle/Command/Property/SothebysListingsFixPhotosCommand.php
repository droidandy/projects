<?php

namespace AppBundle\Command\Property;

use AppBundle\Import\Job\PhotoFix;
use Doctrine\ORM\EntityManager;
use Monolog\Logger;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SothebysListingsFixPhotosCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('sothebys:listings:fix-photos')
            ->setDescription('Fix missing hash and size and width')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $redis = $container->get('redis_client');

        /** @var Logger $logger */
        $logger = $container->get('monolog.logger.import');
        /** @var EntityManager $em */
        $em = $container->get('em');
        $photoIds = $em->createQuery('SELECT pp.id FROM AppBundle:PropertyPhoto pp WHERE pp.hash = \'\'')->getScalarResult();
        $count = 0;
        foreach ($photoIds as $photoId) {
            $logger->debug(sprintf('Added to processing %s', $photoId['id']));
            $redis->enqueue('thumb_process', PhotoFix::class, ['photo_id' => $photoId]);
            ++$count;
        }
        $logger->debug(sprintf('Total processed %s', $count));
    }
}
