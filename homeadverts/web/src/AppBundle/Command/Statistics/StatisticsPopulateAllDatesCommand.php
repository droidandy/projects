<?php

namespace AppBundle\Command\Statistics;

use AppBundle\Service\Statistics\StatisticsAggregation;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class StatisticsPopulateAllDatesCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */
    protected function configure()
    {
        $this
            ->setName('statistics:populate:all-dates')
        ;
    }

    /**
     * @see Command
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        /** @var StatisticsAggregation $statistics */
        $statistics = $this->getContainer()->get('ha_statistics_aggregation');

        $statistics->populateStatsForAllDates();
    }
}
