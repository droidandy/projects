<?php

namespace AppBundle\Import\Adapter\Realogy;

use AppBundle\Import\Adapter\Realogy\Command\CommandInterface;
use AppBundle\Import\Adapter\Realogy\Command\GetActiveAgents;
use AppBundle\Import\Adapter\Realogy\Command\GetActiveCompanies;
use AppBundle\Import\Adapter\Realogy\Command\GetActiveListings;
use AppBundle\Import\Adapter\Realogy\Command\GetActiveOffices;
use AppBundle\Import\Adapter\Realogy\Command\GetAgentById;
use AppBundle\Import\Adapter\Realogy\Command\GetAgentDelta;
use AppBundle\Import\Adapter\Realogy\Command\GetCompanyById;
use AppBundle\Import\Adapter\Realogy\Command\GetCompanyDelta;
use AppBundle\Import\Adapter\Realogy\Command\GetListingById;
use AppBundle\Import\Adapter\Realogy\Command\GetListingDelta;
use AppBundle\Import\Adapter\Realogy\Command\GetOfficeById;
use AppBundle\Import\Adapter\Realogy\Command\GetOfficeDelta;

class DataSyncClient
{
    /**
     * @var HandlerStack
     */
    private $handler;
    /**
     * @var callable
     */
    private $paginatorFactory;

    /**
     * @param callable $handler
     */
    public function __construct(callable $handler, callable $paginatorFactory)
    {
        $this->handler = $handler;
        $this->paginatorFactory = $paginatorFactory;
    }

    public function getActiveCompanies($args = [])
    {
        return $this->executeCommand(new GetActiveCompanies(), $args);
    }

    public function getActiveOffices($args = [])
    {
        return $this->executeCommand(new GetActiveOffices(), $args);
    }

    public function getActiveAgents($args = [])
    {
        return $this->executeCommand(new GetActiveAgents(), $args);
    }

    public function getActiveListings($args = [])
    {
        return $this->executeCommand(new GetActiveListings(), $args);
    }

    public function getCompanyDelta(\DateTime $since, $args = [])
    {
        return $this->getPaginator(new GetCompanyDelta(), ['since' => $this->formatSince($since)] + $args);
    }

    public function getOfficeDelta(\DateTime $since, $args = [])
    {
        return $this->getPaginator(new GetOfficeDelta(), ['since' => $this->formatSince($since)] + $args);
    }

    public function getAgentDelta(\DateTime $since, $args = [])
    {
        return $this->getPaginator(new GetAgentDelta(), ['since' => $this->formatSince($since)] + $args);
    }

    public function getListingDelta(\DateTime $since, $args = [])
    {
        return $this->getPaginator(new GetListingDelta(), ['since' => $this->formatSince($since)] + $args);
    }

    public function getCompanyById($id)
    {
        return $this->getById(new GetCompanyById(), $id);
    }

    public function getOfficeById($id)
    {
        return $this->getById(new GetOfficeById(), $id);
    }

    public function getAgentById($id)
    {
        return $this->getById(new GetAgentById(), $id);
    }

    public function getListingById($id)
    {
        return $this->getById(new GetListingById(), $id);
    }

    public function executeCommand(CommandInterface $command, $args)
    {
        $handler = $this->handler;

        return $handler($command, $args);
    }

    private function getById(CommandInterface $command, $id)
    {
        return $this->executeCommand($command, [
            'id' => $id,
        ]);
    }

    private function getPaginator(CommandInterface $command, $args)
    {
        $paginatorFactory = $this->paginatorFactory;

        return $paginatorFactory($this, $command, $args);
    }

    private function formatSince(\DateTime $since)
    {
        $since = clone $since;
        $since->setTimezone(new \DateTimeZone('UTC'));

        return substr($since->format('Y-m-d\TH:i:s.u'), 0, -3).'Z';
    }
}
