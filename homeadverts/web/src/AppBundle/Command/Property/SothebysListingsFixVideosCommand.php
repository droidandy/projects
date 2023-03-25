<?php

namespace AppBundle\Command\Property;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SothebysListingsFixVideosCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('sothebys:listings:fix-videos')
            ->setDescription('Fill video metadata')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        /** @var EntityManager $em */
        $em = $container->get('em');
        $wellcomematFeed = $container->get('wellcomemat.feed');
        $videos = $wellcomematFeed->getVideos();
        $properties = $em->createQuery('SELECT p FROM AppBundle:Property p WHERE SIZE(p.videos) > 0 and p.dateUpdated < \'2016-10-01\'')->getResult();
        foreach ($properties as $property) {
            foreach ($property->getVideos() as $video) {
                if (false !== strpos($video->url, 'wellcomemat') && null === $video->metadata) {
                    $listingId = str_replace('3yd-RFGSIR-', '', $property->getSourceRef());
                    if (!empty($videos[$listingId])) {
                        $video->metadata = $videos[$listingId][0];
                        $em->persist($video);
                        $em->flush();
                    }
                }
            }
        }
    }
}
