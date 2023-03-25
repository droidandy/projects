<?php

namespace AppBundle\Command\Search;

use AppBundle\Elastic\Location\LocationRepo;
use AppBundle\Elastic\Property\PropertySearchRepo;
use AppBundle\Elastic\User\UserSearchRepo;
use AppBundle\Entity\Location\Location;
use AppBundle\Search\Market;
use Doctrine\ORM\EntityRepository;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\MemoryPeakUsageProcessor;
use Monolog\Processor\MemoryUsageProcessor;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Stopwatch\Stopwatch;

class RepoCommand extends ContainerAwareCommand
{
    /**
     * @var Stopwatch
     */
    private $stopwatch;
    /**
     * @var string
     */
    private $type;
    /**
     * @var mixed
     */
    private $repo;
    /**
     * @var EntityRepository
     */
    private $locationRepo;
    /**
     * @var string
     */
    private $searchTerm;

    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('search:repo')
            ->setDescription('Used to run repor queries in cli and get extensive logging stats about execution')
            ->addArgument('type')
            ->addArgument('search_term')
        ;
    }

    protected function initialize(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();

        $this->stopwatch = $container->get('debug.stopwatch');

        $logger = new Logger('search_debug');
        $logger
            ->pushHandler(new StreamHandler('php://stdout'))
            ->pushProcessor(new MemoryUsageProcessor())
            ->pushProcessor(new MemoryPeakUsageProcessor())
        ;

        $esClientBuilder = $container->get('es_client_builder');
        $esClientBuilder
            ->setLogger($logger)
            ->setTracer($logger)
        ;

        $this->locationRepo = $container->get('location_repo');

        $type = $input->getArgument('type');
        switch ($type) {
            case 'location.ags':
            case 'location.sum':
                $this->repo = $container->get('ha.search.location_repo'); break;
            case 'property':
                $this->repo = $container->get('ha.property.property_search_repo'); break;
            case 'user':
            case 'user_names':
                $this->repo = $container->get('ha.user.user_search_repo'); break;
            default:
                throw new \InvalidArgumentException('"location" or "property" or "user repo supported only"');
        }
        $this->type = $type;

        $this->searchTerm = $input->getArgument('search_term');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->stopwatch->openSection();

        switch ($this->type) {
            case 'location.ags':
                /** @var LocationRepo $repo */
                $repo = $this->repo;
                $repo->findAggregationsPerLocation($this->searchTerm);
                break;
            case 'location.sum':
                $location = $this->findLocation($this->searchTerm);
                /** @var LocationRepo $repo */
                $repo = $this->repo;
                $repo->summary($location);
                break;
            case 'property':
                $location = $this->findLocation($this->searchTerm);
                /** @var PropertySearchRepo $repo */
                $repo = $this->repo;
                $repo->findPropertiesByLocation($location, Market::sale());
                break;
            case 'user':
                $location = $this->findLocation($this->searchTerm);
                /** @var UserSearchRepo $repo */
                $repo = $this->repo;
                $repo->findAgentsByLocation($location);
                break;
            case 'user_names':
                /** @var UserSearchRepo $repo */
                $repo = $this->repo;
                $repo->findByName($this->searchTerm);
                break;
        }

        $this->stopwatch->stopSection('search:repo');

        $events = $this->stopwatch->getSectionEvents('search:repo');
        foreach ($events as $eventName => $event) {
            $output->writeln(sprintf(
                '[%s] [%s] Duration [%d ms]',
                $event->getCategory(),
                $eventName,
                $event->getDuration()
            ));
        }
    }

    /**
     * @param $id
     *
     * @return Location
     */
    private function findLocation($id)
    {
        $this->stopwatch->start('find_location', 'init');
        $location = $this->locationRepo->find((int) $id);
        $this->stopwatch->stop('find_location');

        return $location;
    }
}
