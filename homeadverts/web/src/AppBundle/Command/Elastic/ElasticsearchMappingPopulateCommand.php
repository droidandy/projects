<?php

namespace AppBundle\Command\Elastic;

use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ElasticsearchMappingPopulateCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('elasticsearch:mapping:populate')
            ->setDescription('Populate ES mapping')
            ->addArgument('mapping', InputArgument::OPTIONAL)
        ;
    }

    /**
     * @param InputInterface  $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $mapping = strtolower($input->getArgument('mapping'));
        if ($mapping && !in_array($mapping, MappingInterface::MAPPINGS)) {
            throw new \InvalidArgumentException(
                'Mapping should be one of '.json_encode(MappingInterface::MAPPINGS)
            );
        }

        if (!$mapping) {
            $mappings = MappingInterface::MAPPINGS;
        } else {
            $mappings = [$mapping];
        }

        $app = $this->getContainer();
        $mappingFactory = $app->get('ha.es.mapping_factory');
        foreach ($mappings as $repoName => $name) {
            $progress = $this->getHelperSet()->get('progress');
            $progress->setRedrawFrequency(100);
            $output->writeln(sprintf('Populating "%s" mapping...', $name));
            $mappingFactory->get($name)->populateFromDB($progress, $output);
            $output->writeln(sprintf('"%s" mapping populated', $name));
        }
    }
}
