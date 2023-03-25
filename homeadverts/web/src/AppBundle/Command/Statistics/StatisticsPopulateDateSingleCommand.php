<?php

namespace AppBundle\Command\Statistics;

use AppBundle\Service\Statistics\StatisticsAggregation;
use DateTime;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class StatisticsPopulateDateSingleCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */
    protected function configure()
    {
        $this
            ->setName('statistics:populate:single-date')
            ->addArgument(
                'date',
                InputArgument::OPTIONAL,
                'Aggregation date (optional)'
            )
        ;
    }

    /**
     * @see Command
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $argDate = $input->getArgument('date');

        if ($argDate) {
            $date = new DateTime($argDate);
        } else {
            $date = new DateTime();
        }

        /** @var StatisticsAggregation $statistics */
        $statistics = $this->getContainer()->get('ha_statistics_aggregation');

        $statistics->populateStatsForDate($date);
    }
}
