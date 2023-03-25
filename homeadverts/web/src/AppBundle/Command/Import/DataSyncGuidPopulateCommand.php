<?php

namespace AppBundle\Command\Import;

use AppBundle\Import\Adapter\Realogy\ApiException;
use AppBundle\Import\Adapter\Realogy\DataSyncClient;
use AppBundle\Helper\SprintfLoggerTrait;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use GuzzleHttp\Promise;
use GuzzleHttp\Psr7;

class DataSyncGuidPopulateCommand extends ContainerAwareCommand
{
    use SprintfLoggerTrait;
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var Connection
     */
    private $conn;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var int
     */
    private $progress;
    /**
     * @var int
     */
    private $total;

    protected function configure()
    {
        $this
            ->setName('datasync:guid:populate')
            ->setDescription('Populate all existing properties with guid by listing-id')
        ;
    }

    protected function initialize(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $this->dataSyncClient = $container->get('ha.import.datasync_client');
        $this->conn = $container->get('db');
        $this->logger = $container->get('monolog.logger.import');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $listingGuids = [];
        try {
            foreach ($this->dataSyncClient->getActiveListings()->wait(true) as $listingInfo) {
                $listingGuids[] = $listingInfo->entityId;
            }
        } catch (ApiException $e) {
            $requestException = $e->getRequestException();
            $this->error(
                'Request %s failed with response %s',
                Psr7\str($requestException->getRequest()),
                Psr7\str($requestException->getResponse())
            );

            throw $e;
        }

        $existingGuids = $this
            ->conn
            ->query('SELECT sourceGuid FROM property WHERE sourceGuid IS NOT NULL')
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;

        $this->info('Total guids %s', count($listingGuids));
        $listingGuids = array_diff($listingGuids, $existingGuids);
        $this->total = count($listingGuids);
        $this->info(
            'Existing guids %s. To process guids %s',
            count($existingGuids),
            $this->total
        );

        $this->progress = 0;
        $this->logProgress();
        $promise = Promise\each_limit(
            $this->getListingGuid($listingGuids),
            10,
            function ($listingInfo) {
                ++$this->progress;
                if (!empty($listingInfo->listingSummary->RFGListingId)) {
                    $rowCount = $this->conn->executeUpdate(
                            'UPDATE property SET sourceGuid = :source_guid WHERE sourceRef = :source_ref',
                            [
                                'source_guid' => $listingInfo->listingSummary->listingId,
                                'source_ref' => sprintf('3yd-RFGSIR-%s', $listingInfo->listingSummary->RFGListingId),
                            ]
                        )
                    ;
                    if ($rowCount) {
                        return;
                    } else {
                        $this->notice(
                            'GUID %s. ID %s. Not updated with guid',
                            $listingInfo->listingSummary->listingId,
                            $listingInfo->listingSummary->RFGListingId
                        );
                    }
                }
                if (!empty($listingInfo->listingSummary->mlsNumbers)) {
                    $rowCount = $this
                        ->conn
                        ->executeUpdate(
                            'UPDATE property SET sourceGuid = :source_guid WHERE mlsRef IN (:mls_numbers)',
                            [
                                'source_guid' => $listingInfo->listingSummary->listingId,
                                'mls_numbers' => $listingInfo->listingSummary->mlsNumbers,
                            ],
                            [
                                'source_guid' => \PDO::PARAM_STR,
                                'mls_numbers' => Connection::PARAM_STR_ARRAY,
                            ]
                        )
                    ;
                    if ($rowCount) {
                        return;
                    } else {
                        $this->notice(
                            'GUID %s. MLS NUMBERS %s. Not updated with guid',
                            $listingInfo->listingSummary->listingId,
                            implode(', ', $listingInfo->listingSummary->mlsNumbers)
                        );
                    }
                }
                if (!empty($listingInfo->listingSummary->listingId)) {
                    $this->notice('GUID %s. No matches found', $listingInfo->listingSummary->listingId);
                }
                $this->logProgress();
            },
            function ($reason) {
                if ($reason instanceof ApiException) {
                    $this->notice(
                        'GetById Request failed with the code %s and the message %s',
                        $reason->getHttpCode(),
                        json_encode($reason->getParsedResponse())
                    );
                }
            }
        );
        $promise->wait();
        $this->logProgress(true);
    }

    private function getListingGuid($listingGuids)
    {
        foreach ($listingGuids as $listingGuid) {
            yield $this
                ->dataSyncClient
                ->getListingById($listingGuid)
            ;
        }
    }

    private function logProgress($force = false)
    {
        if ($force || 0 === $this->progress % 10) {
            $this->info('Progress %s / %s', $this->progress, $this->total);
        }
    }

    private function logPrefix()
    {
        return 'DATASYNC_GUID_POPULATE';
    }
}
