<?php

namespace AppBundle\Command\Geo;

use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Geo\Geocode\ReverseGeocodeLocationUnfolder;
use Doctrine\ORM\EntityManager;
use function GuzzleHttp\Promise\each_limit;
use Monolog\Logger;
use Monolog\Processor\UidProcessor;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Helper\ProgressHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class PrefillLocationsCommand extends ContainerAwareCommand
{
    /**
     * @var string
     */
    private $type;
    /**
     * @var string
     */
    private $totalFn;
    /**
     * @var string
     */
    private $iteratorFn;
    /**
     * @var Logger
     */
    private $logger;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var PropertyRepository|UserRepository
     */
    private $repo;
    /**
     * @var ReverseGeocodeLocationUnfolder
     */
    private $locationUnfolder;
    /**
     * @var ProgressHelper
     */
    private $progress;
    /**
     * @var int|null
     */
    private $from;
    /**
     * @var int|null
     */
    private $step;
    /**
     * @var int
     */
    private $batchSize;

    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('geo:prefill_locations_command')
            ->setDescription('Used to prefill locations')
            ->addArgument('type')
            ->addOption('from', null, InputOption::VALUE_OPTIONAL, '', 0)
            ->addOption('step', null, InputOption::VALUE_OPTIONAL, '', null)
            ->addOption('unprocessed', null, InputOption::VALUE_NONE)
        ;
    }

    protected function initialize(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();

        $this->type = $input->getArgument('type');
        if (!in_array($this->type, ['property', 'user'])) {
            throw new \InvalidArgumentException('Only "property" and "user" are supported types');
        }

        $this->from = $from = $input->getOption('from');
        if ($input->getOption('unprocessed')) {
            $this->step = $step = null;
            $this->totalFn = 'getTotalToProcess';
            $this->iteratorFn = 'getIterableToProcess';
        } else {
            $this->step = $step = $input->getOption('step');
            $this->totalFn = 'getTotal';
            $this->iteratorFn = 'getIterable';
        }
        $this->batchSize = 'test' === $container->getParameter('kernel.environment')
            ? 3
            : 20
        ;

        $this->logger = $container->get('monolog.logger.geo');
        $processor = new UidProcessor();
        $message = sprintf(
            'Starting geo:prefill_locations_command for "%s". UID %s. Params %s',
            $this->type,
            $processor->getUid(),
            json_encode([
                'from' => $from,
                'step' => $step ?: null,
            ])
        );
        $this->logger->info($message);
        $this->logger
            ->pushProcessor($processor)
        ;

        $this->em = $container->get('em');
        $this->repo = $container->get(sprintf('%s_repo', $this->type));
        /* @var ReverseGeocodeLocationUnfolder $locationUnfolder */
        $this->locationUnfolder = $container->get('ha.geo.location_unfolder');

        $this->progress = $this->getHelperSet()->get('progress');
        $this->progress->setRedrawFrequency(100);
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $from = $this->from;
        $step = $this->step;
        $i = 0;

        $totalFn = $this->totalFn;
        $total = $this->repo->$totalFn();
        $this->progress->start($output, $total);

        $this
            ->logger
            ->info('Total number of {type} = {total}', [
                'type' => $this->type,
                'total' => $total,
            ])
        ;

        $iterator = function () use ($from, $step, $total, &$i) {
            $this->progress->setCurrent($from);
            $entitiesToDetach = [];

            $step = $step ?: $total;
            for ($j = $from; $j < $total; $j = $j + $step) {
                $this
                    ->logger
                    ->info('Total {total}. Offest {offset}. Step {step}', [
                        'total' => $total,
                        'offset' => $j,
                        'step' => $step ?: 'NULL',
                    ])
                ;

                $iteratorFn = $this->iteratorFn;
                foreach ($this->repo->$iteratorFn($j, $step) as $row) {
                    $entity = current($row);
                    $entitiesToDetach[] = $entity;
                    $this->logger->info('Processing entity [{id}]', ['id' => $entity->getId()]);

                    yield $this
                        ->locationUnfolder
                        ->unfold($entity)
                        ->then(function () use ($entity, &$i, &$entitiesToDetach) {
                            $this->logger->info('Processed entity [{id}]', ['id' => $entity->getId()]);
                            $this->progress->advance();
                            ++$i;

                            if ($i && 0 === $i % $this->batchSize) {
                                $this
                                    ->logger
                                    ->info('Flushing on {i}. Ids: "{total}":"{ids}"', [
                                        'i' => $i,
                                        'total' => count($entitiesToDetach),
                                        'ids' => implode(
                                            ', ',
                                            array_map(
                                                function ($entity) {
                                                    return $entity->getId();
                                                },
                                                $entitiesToDetach
                                            )
                                        ),
                                    ])
                                ;
                                $this->em->flush();
                                foreach ($entitiesToDetach as $entityToDetach) {
                                    $this->locationUnfolder->release($entityToDetach->getGoogleLocations()->toArray());
                                    $this->em->detach($entityToDetach);
                                    if ($entityToDetach instanceof User) {
                                        foreach (
                                            [
                                                'getUserProfile',
                                                'getTeamProfile',
                                                'getCompanyProfile',
                                                'getCreditCard',
                                                'getSubscription',
                                            ] as $getter
                                        ) {
                                            $assoc = $entityToDetach->$getter();
                                            if ($assoc) {
                                                $this->em->detach($assoc);
                                            }
                                        }
                                    }
                                }
                                $entitiesToDetach = [];
                                $this->locationUnfolder->purge();
                            }
                        })
                        ->otherwise(function ($reason) use ($entity, &$entitiesToDetach) {
                            if ($reason instanceof \Exception) {
                                $this
                                    ->logger
                                    ->error(
                                        'Entity [{id}]: Exception occurred '.$reason->getMessage().$reason->getTraceAsString(),
                                        [
                                            'id' => $entity->getId(),
                                        ]
                                    )
                                ;
                            } else {
                                $this
                                    ->logger
                                    ->error(
                                        'Entity [{id}]: Exception occurred '.$reason,
                                        [
                                            'id' => $entity->getId(),
                                        ]
                                    )
                                ;
                            }
                            if (!$this->em->isOpen()) {
                                $entitiesToDetach = [];
                                $this->locationUnfolder->reset();
                                $refl = new \ReflectionObject($this->em);
                                $closedRefl = $refl->getProperty('closed');
                                $closedRefl->setAccessible(true);
                                $closedRefl->setValue($this->em, false);
                            }
                        })
                    ;
                }
            }
        };

        $eachPromise = each_limit($iterator(), 10);
        $eachPromise->wait();

        $this->em->flush();
    }
}
