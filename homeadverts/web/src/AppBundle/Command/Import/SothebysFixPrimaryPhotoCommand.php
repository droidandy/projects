<?php

namespace AppBundle\Command\Import;

use AppBundle\Import\Adapter\Realogy\DataSyncClient;
use AppBundle\Import\Normalizer\Property\PropertyNormalizer;
use AppBundle\Import\Job\PropertyPhotoProcess;
use AppBundle\Import\Processor\FakePhotoHandler;
use AppBundle\Helper\SprintfLoggerTrait;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManager;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SothebysFixPrimaryPhotoCommand extends ContainerAwareCommand
{
    use SprintfLoggerTrait;
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var PropertyNormalizer
     */
    private $propertyNormalizer;
    /**
     * @var Connection
     */
    private $conn;
    /**
     * @var EntityManager
     */
    private $em;
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
    /**
     * @var FakePhotoHandler
     */
    private $fakePhotoHandler;

    protected function configure()
    {
        $this
            ->setName('sothebys:fix:primary-photo')
            ->setDescription('Set proper primary photo on all properties')
        ;
    }

    protected function initialize(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $this->dataSyncClient = $container->get('ha.import.datasync_client');
        $this->propertyNormalizer = $container->get('ha.import.datasync_property_normalizer');
        $this->conn = $container->get('db');
        $this->em = $container->get('em');
        $this->logger = $container->get('monolog.logger.import');

        $this->fakePhotoHandler = new FakePhotoHandler(
            $container->get('ha.import.photo_manager'),
            $container->get('ha.import.comparison_strategy'),
            function ($logLevel, $msg, ...$args) {
                if ('log' == $logLevel) {
                    $this->logger->info(sprintf($msg, ...$args));
                } else {
                    $this->logger->$logLevel($msg, ...$args);
                }
            },
            $container->get('redis_client')
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $redis = $this->getContainer()->get('redis_client');

        $date = new \DateTime('2018-08-17');
        $idToGuidMap = $this
            ->conn
            ->executeQuery(
                'SELECT id, sourceGuid FROM property WHERE source = :source AND dateUpdated < :date_updated',
                [
                    'source' => 'sothebys',
                    'date_updated' => $date->format('Y-m-d'),
                ]
            )
            ->fetchAll(\PDO::FETCH_KEY_PAIR)
        ;

        $this->total = count($idToGuidMap);
        $this->info('Total properties %s', $this->total);
        $this->progress = 0;

        $this->logProgress();
        foreach ($idToGuidMap as $id => $guid) {
            ++$this->progress;
            $redis->enqueue('import_process', PropertyPhotoProcess::class, [
                'property_id' => $id,
                'property_guid' => $guid,
            ]);
            $this->logProgress();
        }

        $this->logProgress(true);
    }

    private function logProgress($force = false)
    {
        if ($force || 0 === $this->progress % 10) {
            $this->info('Progress %s / %s', $this->progress, $this->total);
        }
    }

    private function logPrefix()
    {
        return 'SIR_FIX_PRIMARY_PHOTO';
    }
}
