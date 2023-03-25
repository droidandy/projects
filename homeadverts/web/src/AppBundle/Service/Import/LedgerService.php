<?php

namespace AppBundle\Service\Import;

use AppBundle\Entity\Import\ImportLedgerRepository;
use AppBundle\Event\LedgerEvent;
use AppBundle\Import\Adapter\Realogy\DataSyncClient;
use Doctrine\ORM\EntityManager;

class LedgerService
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var DataSyncClient
     */
    private $dataSync;
    /**
     * @var ImportLedgerRepository
     */
    private $ledgerRepo;

    /**
     * @param EntityManager $em
     * @param DataSyncClient $dataSync
     */
    public function __construct(EntityManager $em, DataSyncClient $dataSync)
    {
        $this->em = $em;
        $this->ledgerRepo = $this->em->getRepository('AppBundle:Import\ImportLedger');
        $this->dataSync = $dataSync;
    }

    /**
     * @param LedgerEvent $event
     */
    public function updateFromEvent(LedgerEvent $event)
    {
        $this->ledgerRepo->removeByType($event->type);
        $sql = '';

        foreach ($event->collection as $i) {
            $sql .= sprintf(
                'INSERT INTO import_ledger (type, refId, createdAt) VALUES ("%s", "%s", now());',
                $event->type,
                $i->entityId
            );
        }

        $this->em->getConnection()->exec($sql);
    }

    public function update()
    {
        $this->ledgerRepo->removeAll();

        $companies = $this->dataSync->getActiveCompanies()->wait(true);
        $offices = $this->dataSync->getActiveOffices()->wait(true);
        $users = $this->dataSync->getActiveAgents()->wait(true);
        $properties = $this->dataSync->getActiveListings()->wait(true);

        $sql = $this->buildSQL('company', $companies);
        $sql .= $this->buildSQL('office', $offices);
        $sql .= $this->buildSQL('user', $users);
        $sql .= $this->buildSQL('property', $properties);

        $this->em->getConnection()->exec($sql);
    }

    /**
     * @param string $type
     * @param array  $collection
     *
     * @return string
     */
    private function buildSQL(string $type, array $collection)
    {
        $sql = '';

        foreach ($collection as $i) {
            $sql .= sprintf(
                'INSERT INTO import_ledger (type, refId, createdAt) VALUES ("%s", "%s", now());',
                $type,
                $i->entityId
            );
        }

        return $sql;
    }
}
