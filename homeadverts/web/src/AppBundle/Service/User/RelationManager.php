<?php

namespace AppBundle\Service\User;

use AppBundle\Entity\User\User;
use AppBundle\Entity\User\Relation;
use Doctrine\ORM\EntityManager;

class RelationManager
{
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @param AdjacencyRegistry $adjacencyRegistry
     * @param EntityManager     $em
     */
    public function __construct(AdjacencyRegistry $adjacencyRegistry, EntityManager $em)
    {
        $this->adjacencyRegistry = $adjacencyRegistry;
        $this->em = $em;
    }

    public function attachAgent(User $agent, User $company)
    {
        $relation = new Relation();
        $relation->setType(Relation::TYPE_ROLE);
        $relation->setRole(User::ROLE_AGENT);
        $relation->setRoleName(User::ROLE_AGENT_NAME);
        $relation->setIsPublic(true);

        $this->attach($agent, $company, $relation);
    }

    public function attachAuthor(User $author, User $userOrCompany)
    {
        $relation = new Relation();
        $relation->setType(Relation::TYPE_ROLE);
        $relation->setRole(User::ROLE_AUTHOR);
        $relation->setRoleName(User::ROLE_AUTHOR_NAME);
        $relation->setIsPublic(true);

        $this->attach($author, $userOrCompany, $relation);
    }

    public function attachOffice(User $office, User $company, $divisionType, $divisionName)
    {
        $relation = new Relation();
        $relation->setType(Relation::TYPE_DIVISION);
        $relation->setDivision($divisionType);
        $relation->setDivisionName($divisionName);
        $relation->setIsPublic(true);

        $this->attach($office, $company, $relation);
    }

    public function attachCompany(User $childCompany, User $company)
    {
        $relation = new Relation();
        $relation->setType(Relation::TYPE_DIVISION);
        $relation->setDivision(User::TYPE_SUBDIVISION);
        $relation->setDivisionName(User::TYPE_SUBDIVISION_NAME);
        $relation->setIsPublic(true);

        $this->attach($childCompany, $company, $relation);
    }

    public function attach(User $child, User $parent, Relation $relation)
    {
        $relation->setChild($child);
        $relation->setParent($parent);
        $this->adjacencyRegistry->processRelation($relation);
        $this->em->persist($relation);
    }

    public function detach(Relation $relation)
    {
        $relation->setDeletedAtNow();
        $this->adjacencyRegistry->processRelation($relation);
        $this->em->persist($relation);
    }
}
