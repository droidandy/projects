<?php

namespace AppBundle\Command\File;

use AppBundle\Entity\Social\Article;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class FixUrlsCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */
    protected function configure()
    {
        $this->setName('file:fix');
    }

    /**
     * @see Command
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->getContainer()
            ->get('em');

        $articles = $em->getRepository(Article::class)
            ->findAll();

        /** @var Article $article */
        foreach ($articles as $article) {
            $output->writeln($article->getId());
            $body = str_replace(
                'properties-homeadverts-com.s3',
                'luxuryaffairs-prod.s3',
                $article->getBody()
            );

            $article->setBody($body);
        }

        $em->flush();
    }
}
