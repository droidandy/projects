<?php

namespace AppBundle\Command\Installation;

use AppBundle\Entity\User\User;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class InstallBoardingRoomsCommand extends ContainerAwareCommand
{
    /**
     * @see Command
     */
    protected function configure()
    {
        $this
            ->setName('app:install:onboarding-rooms')
            ->setHelp('Add on boarding rooms for manually registered users');
    }

    /**
     * @see Command
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $roomFinder = $this->getContainer()->get('app.room_finder');
        $users = $this->getContainer()
            ->get('doctrine.orm.entity_manager')
            ->getRepository(User::class)
            ->findBy([
                'sourceRef' => null,
            ]);

        /**
         * @var User
         */
        foreach ($users as $user) {
            if ($user->getEmail() !== User::SERVICE_USER['email']) {
                $roomFinder->createOnBoardingRoom($user);
            }
            $output->writeln(sprintf(
                'Processing: %s',
                $user->getEmail()
            ));
        }
    }
}
