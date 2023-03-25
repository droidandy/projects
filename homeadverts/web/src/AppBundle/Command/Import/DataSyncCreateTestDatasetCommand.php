<?php

namespace AppBundle\Command\Import;

use AppBundle\Import\Adapter\Realogy\ApiException;
use AppBundle\Import\Adapter\Realogy\DataSyncClient;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class DataSyncCreateTestDatasetCommand extends ContainerAwareCommand
{
    // todo: fix nested paths

    const PREFIX = __DIR__.'/../../../../test/fixtures/import/datasync/';
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;

    protected function configure()
    {
        $this
            ->setName('datasync:create:test-dataset')
            ->setDescription('Build test dataset')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->dataSyncClient = $this->getContainer()->get('ha.import.datasync_client');

        $listings = file_get_contents(self::PREFIX.'get-active-agents/sample.json');
        $listings = json_decode($listings);

        $delta = file_get_contents(self::PREFIX.'get-agents-delta/delta_big.json');
        $delta = json_decode($delta);

        $this->fill($listings, $delta, 'Agent', self::PREFIX.'/test-dataset/agent/');

        $listings = file_get_contents(self::PREFIX.'get-active-listings/sample.json');
        $listings = json_decode($listings);

        $delta = file_get_contents(self::PREFIX.'get-property-delta/delta_big.json');
        $delta = json_decode($delta);

        $this->fill($listings, $delta, 'Listing', self::PREFIX.'/test-dataset/property/');
    }

    private function fill($listings, $delta, $target, $targetPath)
    {
        $deletedGuids = [];
        $upsertedGuids = [];
        $unchangedGuids = [];

        foreach ($listings as $il => $listing) {
            foreach ($delta as $dp => $deltaPage) {
                foreach ($deltaPage->data as $di => $item) {
                    if ('Delete' == $item->action) {
                        $id = $item->id;

                        if ($id == $listing->entityId) {
                            $deletedGuids[] = [$listing->entityId, $il, [$dp, $di]];
                            continue 3;
                        }
                    } elseif ('Upsert' == $item->action) {
                        $id = $item->id;

                        if ($id == $listing->entityId) {
                            $upsertedGuids[] = [$listing->entityId, $il, [$dp, $di]];
                            continue 3;
                        }
                    }
                }
            }
            $unchangedGuids[] = [$listing->entityId, $il];
        }
//        var_dump(count($deletedGuids), count($upsertedGuids), count($unchangedGuids)); exit;

        $activeSet = $deltaSet = [];
        for ($i = 0; $i < 5; ++$i) {
            $key = array_rand($deletedGuids);
            list($entityId, $listingIdx, list($page, $deltaIdx)) = $deletedGuids[$key];

            $deltaSet[] = $delta[$page]->data[$deltaIdx];
            $activeSet[] = $listings[$listingIdx];

            unset($deletedGuids[$key]);
        }

        for ($i = 0; $i < 5; ++$i) {
            $key = array_rand($upsertedGuids);
            list($entityId, $listingIdx, list($page, $deltaIdx)) = $upsertedGuids[$key];

            $deltaSet[] = $delta[$page]->data[$deltaIdx];
            $activeSet[] = $listings[$listingIdx];

            unset($upsertedGuids[$key]);
        }

        for ($i = 0; $i < 5; ++$i) {
            $key = array_rand($unchangedGuids);
            list($entityId, $listingIdx) = $unchangedGuids[$key];

            $activeSet[] = $listings[$listingIdx];

            unset($unchangedGuids[$key]);
        }

        $deltaSet = [
            [
                'data' => $deltaSet,
            ],
        ];

        file_put_contents($targetPath.'delta.json', json_encode($deltaSet, JSON_PRETTY_PRINT));
        file_put_contents($targetPath.'active.json', json_encode($activeSet, JSON_PRETTY_PRINT));

        while ($item = array_shift($activeSet)) {
            try {
                $entity = $this->dataSyncClient->{'get'.$target.'ById'}($item->entityId)->wait(true);
                file_put_contents($targetPath.$item->entityId.'.json', json_encode($entity, JSON_PRETTY_PRINT));

            } catch (ApiException $e) {
//                if ($e->getHttpCode() == 404) {
                $key = array_rand($unchangedGuids);
                list($entityId, $listingIdx) = $unchangedGuids[$key];

                array_push($activeSet, $listings[$listingIdx]);

                unset($unchangedGuids[$key]);
//                }
            }
        }
    }
}
