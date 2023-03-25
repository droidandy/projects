<?php

namespace AppBundle\Service\Report;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\User\User;
use Doctrine\ORM\EntityManager;

class DbReporter
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @param EntityManager $entityManager
     */
    public function __construct(EntityManager $entityManager)
    {
        $this->em = $entityManager;
    }

    public function getSummary()
    {
        $ledger = $this->em->getRepository('AppBundle:Import\ImportLedger');

        $dbPropertiesAvailability = $this->em->getRepository(Property::class)->getAvailabilitySummary();
        $dbProperties = $this->em->getRepository(Property::class)->getSummary();
        $dbCompanies = $this->em->getRepository(User::class)->getCompanySummary();
        $dbOffices = $this->em->getRepository(User::class)->getOfficeSummary();
        $dbUsers = $this->em->getRepository(User::class)->getAgentSummary();

        $syncDate = '';

        if ($ledger->getSyncDate()) {
            $syncDate = $ledger->getSyncDate()->getCreatedAtFormatted();
        }

        $summary = [
            'ledger' => [
                'sync_date' => $syncDate,
                'ledger' => [
                    'user' => $ledger->getTotalByType('user')[1],
                    'company' => $ledger->getTotalByType('company')[1],
                    'office' => $ledger->getTotalByType('office')[1],
                    'property' => $ledger->getTotalByType('property')[1],
                ],
            ],
            'db_summary' => [
                'company' => [
                    'total' => array_sum($dbCompanies),
                    'active' => isset($dbCompanies['0']) ? $dbCompanies['0'] : 0,
                    'soft_deleted' => isset($dbCompanies['1']) ? $dbCompanies['1'] : 0,
                    'missing' => count($ledger->getMissingUserRefIds('company')),
                ],
                'office' => [
                    'total' => array_sum($dbOffices),
                    'active' => isset($dbOffices['0']) ? $dbOffices['0'] : 0,
                    'soft_deleted' => isset($dbOffices['1']) ? $dbOffices['1'] : 0,
                    'missing' => count($ledger->getMissingUserRefIds('office')),
                ],
                'property' => [
                    'total' => array_sum($dbProperties),
                    'active' => [
                        'total' => array_sum([
                            $dbPropertiesAvailability[Property::AVAILABILITY_FOR_SALE],
                            $dbPropertiesAvailability[Property::AVAILABILITY_TO_RENT],
                        ]),
                        'sale' => $dbPropertiesAvailability[Property::AVAILABILITY_FOR_SALE],
                        'rent' => $dbPropertiesAvailability[Property::AVAILABILITY_TO_RENT],
                    ],
                    'inactive' => $dbProperties[Property::STATUS_INACTIVE],
                    'incomplete' => $dbProperties[Property::STATUS_INCOMPLETE],

                    'invalid' => $dbProperties[Property::STATUS_INVALID],
                    'soft_deleted' => $dbProperties[Property::STATUS_DELETED],
                    'missing' => count($ledger->getMissingPropertiesRefIds()),
                ],
                'user' => [
                    'total' => array_sum($dbUsers),
                    'missing' => count($ledger->getMissingUserRefIds('user')),
                    'active' => isset($dbUsers['0']) ? $dbUsers['0'] : 0,
                    'soft_deleted' => isset($dbUsers['1']) ? $dbUsers['1'] : 0,
                ],
            ],
        ];

        return $summary;
    }
}
