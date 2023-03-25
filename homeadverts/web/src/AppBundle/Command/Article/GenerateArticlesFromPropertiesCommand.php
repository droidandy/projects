<?php

namespace AppBundle\Command\Article;

use AppBundle\Entity\Property\Property;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GenerateArticlesFromPropertiesCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */
    protected function configure()
    {
        $this->setName('article:generate:all');
    }

    /**
     * @see Command
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $sc = $this->getContainer();
        $progress = $this->getHelperSet()->get('progress');
        $progress->setRedrawFrequency(100);

        // Cleaning previously generated
        $articlesQty = $sc
            ->get('article_repo')
            ->removeArticlesWithPropertyPrivateTag();
        $output->writeln(sprintf('Cleaning %s untouched articles', $articlesQty));

        // Fetching properties
        $properties = $sc
            ->get('property_repo')
            ->getSinglePropertyPerUser();
        $articleService = $sc->get('ha.article.service');
        $output->writeln(sprintf('Fetched %s properties', count($properties)));

        // Generating articles
        foreach ($properties as $property) {
            /*
             * @var Property $property
             */
            $output->writeln(sprintf(
                'Generating %s %s ...',
                $property->getId(),
                $property->getTitle()
            ));

            $articleService->buildArticleFromProperty(
                $property,
                $property->getUser(),
                true
            );
        }

        $output->writeln(sprintf('Finished'));
    }
}
