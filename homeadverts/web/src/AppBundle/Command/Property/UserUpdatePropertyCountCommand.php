<?php

namespace AppBundle\Command\Property;

use AppBundle\Import\User\CountResolver;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Process\Process;

class UserUpdatePropertyCountCommand extends ContainerAwareCommand
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('user:update_property_count')
            ->setDescription('Update all user asset counts.')
        ;
    }

    /**
     * {@inheritdoc}
     *
     * @param InputInterface  $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $countResolver = $this->getContainer()->get('ha.user.count_resolver');
        $countResolver->disableUpdateCache();

        $db = $this->getContainer()->get('db');
        $db->beginTransaction();
        try {
            $rowsUpdated = $db->executeUpdate(
                'UPDATE user 
                    SET agentCount = DEFAULT,
                        affiliateCount = DEFAULT, 
                        propertyCount = DEFAULT, 
                        propertyForSaleCount = DEFAULT, 
                        propertyToRentCount = DEFAULT,
                        articleCount = DEFAULT
                '
            );

            $output->writeln('Number of rows reset '.$rowsUpdated);

            $agentIds = $db
                ->executeQuery("SELECT id FROM user WHERE roles LIKE '%ROLE_AGENT%' AND deletedAt IS NULL")
                ->fetchAll(\PDO::FETCH_COLUMN)
            ;
            $output->writeln(sprintf('%s agents to update', count($agentIds)));

            foreach ($agentIds as $agentId) {
                $countResolver->resolveAgent($agentId);
            }

            $officeIds = $db
                ->executeQuery("SELECT id FROM user WHERE roles LIKE '%ROLE_OFFICE%' AND deletedAt IS NULL")
                ->fetchAll(\PDO::FETCH_COLUMN)
            ;
            $output->writeln(sprintf('%s offices to update', count($officeIds)));

            foreach ($officeIds as $officeId) {
                $countResolver->resolveOffice($officeId, CountResolver::CHAIN_MODE_ADD);
            }

            $companyIds = $db
                ->executeQuery("SELECT id FROM user WHERE roles LIKE '%ROLE_COMPANY%' AND deletedAt IS NULL")
                ->fetchAll(\PDO::FETCH_COLUMN)
            ;
            $output->writeln(sprintf('%s companies to update', count($companyIds)));

            foreach ($companyIds as $companyId) {
                $countResolver->resolveCompany($companyId, CountResolver::CHAIN_MODE_ADD);
            }
            $db->commit();

            foreach (['remove', 'setup', 'populate'] as $cmd) {
                $output->writeln('Running elasticsearch:mapping:'.$cmd.' user');

                $process = new Process(
                    $this
                        ->getContainer()
                        ->getParameter('kernel.root_dir')
                        .'/console elasticsearch:mapping:'
                        .$cmd
                        .' user --env=prod',
                    null,
                    null,
                    null,
                    null
                );

                $process->run();

                if (!$process->isSuccessful()) {
                    $output->writeln('elasticsearch:mapping:'.$cmd.' user failed');
                    $output->writeln($process->getErrorOutput());

                    break;
                }
            }
        } catch (\Exception $e) {
            $output->writeln('Exception occured '.$e->getMessage());
            $db->rollBack();
        }
    }
}
