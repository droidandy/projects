<?php

namespace AppBundle\Command\Import;

use AppBundle\Import\Job\CompanyProcess;
use AppBundle\Import\Job\CompanyRemove;
use AppBundle\Import\Job\OfficeProcess;
use AppBundle\Import\Job\OfficeRemove;
use AppBundle\Import\Job\Process;
use AppBundle\Import\Job\RemoveProperties;
use AppBundle\Import\Job\UserProcess;
use AppBundle\Import\Job\UserRemove;
use Predis\ClientInterface;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class QueueAdapterCommand extends Command
{
    const OPTIONS = [
        'company' => [
            'process' => CompanyProcess::class,
            'remove' => CompanyRemove::class,
        ],
        'office' => [
            'process' => OfficeProcess::class,
            'remove' => OfficeRemove::class,
        ],
        'user' => [
            'process' => UserProcess::class,
            'remove' => UserRemove::class,
        ],
        'property' => [
            'process' => Process::class,
            'remove' => RemoveProperties::class,
        ],
    ];

    protected function configure()
    {
        $this
            ->setName('import:resque-adapter')
            ->setDescription('Get stats on job queues')
            ->addArgument('import-job-id', InputArgument::REQUIRED)
            ->addArgument('domain', InputArgument::OPTIONAL)
            ->addArgument('queue', InputArgument::OPTIONAL)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        /** @var ClientInterface $client */
        $client = $this->getContainer()->get('snc_redis.default_client');

        $importJobIdArg = $input->getArgument('import-job-id');
        $domainArg = $input->getArgument('domain');
        $queueArg = $input->getArgument('queue');

        $report = [];
        foreach (self::OPTIONS as $domain => $queues) {
            if (!$domainArg || $domainArg === $domain) {
                foreach ($queues as $queue => $class) {
                    if (!$queueArg || $queueArg === $queue) {
                        $report[$domain][$queue] = $client->scard('import_'.$queue.$class.$importJobIdArg);
                    }
                }
            }
        }

        echo "\n\n";
        echo json_encode($report, JSON_PRETTY_PRINT);
        echo "\n\n";
    }
}
