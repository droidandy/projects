<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class DebugSandboxCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('debug:sandbox')
            ->setDescription('Debugs something')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        $em = $app->get('em');

        dump($app->get('import_job_repo')->findAllMostRecent());
        exit;
        $batchSize = 20;
        $i = 0;
        $q = $em->createQuery("SELECT u FROM AppBundle\\Entity\\User\\User u WHERE u.address.latitude is NULL AND (u.address.townCity is not NULL OR u.address.townCity <> '') ORDER BY u.id DESC");
        $iterableResult = $q->iterate();

        foreach ($iterableResult as $row) {
            $user = $row[0];
            echo $user->getEmail();
            if ($loc = $app->get('address_geocoder')->geocode($user->address)) {
                echo ' - '.$loc;
                $user->address->setCoords($loc);
            }
            echo "\n";
            if (0 === ($i % $batchSize)) {
                echo "--------------- Flushing ---------\n";
                $em->flush(); // Executes all updates.
                $em->clear(); // Detaches all objects from Doctrine!
            }
            ++$i;
        }
        $em->flush();
    }
}
