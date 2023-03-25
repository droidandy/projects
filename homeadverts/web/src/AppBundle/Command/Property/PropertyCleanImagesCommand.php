<?php

namespace AppBundle\Command\Property;

use Aws\Result;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class PropertyCleanImagesCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('property:clean:images')
            ->setDescription('Remove images from S3 that don\'t have a matching property.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $client = $container->get('ha.s3_client');
        $db = $container->get('database_connection');
        $bucket = $container->getParameter('s3.bucket.name');

        $q = $db->executeQuery('SELECT id FROM property');

        $propertyIds = [];
        while ($row = $q->fetchColumn()) {
            $propertyIds[(int) $row] = (int) $row;
        }

        /** @var Result[] $results */
        $results = $client->getPaginator('ListObjects', array(
            'Bucket' => $bucket,
            'Prefix' => 'properties/',
        ));

        $deleted = 0;

        foreach ($results as $result) {
            foreach ($result['Contents'] as $object) {
                preg_match('/properties\\/([0-9]+?)\\//us', $object['Key'], $matches);
                $id = (int) $matches[1];
                if (isset($propertyIds[$id]) || $id <= 0) {
                    echo 'Skipping '.$object['Key']."\n";
                    continue;
                }

                echo 'Deleting '.$object['Key']."\n";
                $client->deleteObject([
                    'Bucket' => $bucket,
                    'Key' => $object['Key'],
                ]);
                ++$deleted;
            }
        }

        dump($deleted.' deleted images');
    }
}
