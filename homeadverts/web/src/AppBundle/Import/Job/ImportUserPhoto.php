<?php

namespace AppBundle\Import\Job;

use Symfony\Component\DependencyInjection\ContainerInterface;

class ImportUserPhoto extends ResqueJob
{
    public function run($args, $app)
    {
        /* @var ContainerInterface $app */
        $app
            ->get('ha.user_manager')
            ->replaceImageFromPath(
                $args['user'],
                $args['path'],
                'profileImage'
            );
    }
}
