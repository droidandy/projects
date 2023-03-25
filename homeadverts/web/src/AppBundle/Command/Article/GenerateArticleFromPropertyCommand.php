<?php

namespace AppBundle\Command\Article;

use AppBundle\Entity\Property\Property;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GenerateArticleFromPropertyCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */
    protected function configure()
    {
        $this
            ->setName('article:generate')
            ->addArgument(
                'id',
                InputArgument::REQUIRED,
                'Property Id'
            );
    }

    /**
     * @see Command
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $sc = $this->getContainer();

        $property = $sc
            ->get('em')
            ->getRepository(Property::class)
            ->find($input->getArgument('id'));

        $output->writeln(sprintf(
            'Generating %s %s ...',
            $property->getId(),
            $property->getTitle()
        ));

        $sc->get('ha.article.service')
            ->buildArticleFromProperty(
                $property,
                $property->getUser(),
                true
            );

        $output->writeln(sprintf('Finished'));
    }
}
