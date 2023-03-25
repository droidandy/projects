<?php

namespace AppBundle\Command\Elastic;

use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ElasticsearchMappingSetupCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('elasticsearch:mapping:setup')
            ->setDescription('Create ES mapping')
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
        foreach ($mappings as $name) {
            $output->writeln(sprintf('Creating "%s" mapping...', $name));
            $mappingFactory->get($name)->apply();
            $output->writeln(sprintf('"%s" mapping created', $name));
        }
    }
}
