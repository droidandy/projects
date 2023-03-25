<?php

namespace AppBundle\Command\User;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class TestAgentEmails extends Command
{
    protected function configure()
    {
        $this
            ->setName('fix:test-agent-emails')
            ->setDescription('Assigns proeprties to the correct agent')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        $db = $app->get('database_connection');

        // get the last listhub import job
        $properties = $db->fetchAll("
            SELECT
                user.*, property.property_id
            FROM
                user
                JOIN property ON (property.user = user.id)
            WHERE
                user.username LIKE '%.test.com%'
        ");

        $users = [];

        foreach ($properties as $property) {
            if (!isset($users[$property['id']])) {
                $users[$property['id']] = [];
            }
            $users[$property['id']][] = $property['property_id'];
        }

        dump($users);
    }
}
