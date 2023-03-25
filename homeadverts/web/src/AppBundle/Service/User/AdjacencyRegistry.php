<?php

namespace AppBundle\Service\User;

use AppBundle\Entity\User\Relation;
use AppBundle\Entity\User\User;
use Predis\ClientInterface;

class AdjacencyRegistry
{
    const PREFIX = 'adjacency_';
    /**
     * @var ClientInterface
     */
    private $client;
    /**
     * @var array
     */
    private $cachedChildIds = [
        'direct_childs' => [],
        'all_childs' => [],
        'unshared_childs' => [],
    ];
    /**
     * @var array
     */
    private $cachedParentIds = [
        'direct_parents' => [],
        'all_parents' => [],
    ];

    /**
     * @param ClientInterface $client
     */
    public function __construct(ClientInterface $client)
    {
        $this->client = $client;
    }

    public function getDirectChildIds($id)
    {
        return $this->client->smembers(self::PREFIX.$id.':dcs');
    }

    /**
     * @param int $id
     *
     * @return array
     */
    public function getAllChildIds($id)
    {
        return $this->client->smembers(self::PREFIX.$id.':acs');
    }

    public function getUnsharedChildIds($id)
    {
        return $this->client->smembers(self::PREFIX.$id.':unshared_acs');
    }

    public function getDirectParentIds($id)
    {
        return $this->client->smembers(self::PREFIX.$id.':dps');
    }

    public function getAllParentIds($id)
    {
        return $this->client->smembers(self::PREFIX.$id.':aps');
    }

    public function getAllUnsharedParentIds($id)
    {
        return $this->client->smembers(self::PREFIX.$id.':unshared_aps');
    }

    public function getWritableParents($id)
    {
        return $this->client->smembers(self::PREFIX.$id.':writable_ps');
    }

    public function processRelation(Relation $relation)
    {
        // ivalidate cache
        $this->cachedChildIds = [
            'direct_childs' => [],
            'all_childs' => [],
            'unshared_childs' => [],
        ];
        $this->cachedParentIds = [
            'direct_parents' => [],
            'all_parents' => [],
        ];

        if (null === $relation->getDeletedAt()) {
            $this->addChildIds($relation);
            $this->addParentIds($relation);

            $this->addAllIds($relation);
            if (Relation::TYPE_DIVISION === $relation->getType()) {
                $this->addAllUnsharedIds($relation);
            }
        } else {
            $this->removeChildIds($relation);
            $this->removeParentIds($relation);

            $this->removeAllIds($relation);
            if (Relation::TYPE_DIVISION === $relation->getType()) {
                $this->removeAllUnsharedIds($relation);
            }
        }
    }

    private function addChildIds(Relation $relation)
    {
        $parentId = $relation->getParent()->getId();
        $childId = $relation->getChild()->getId();

        // dc - direct child
        $this->client->incr(self::PREFIX.$parentId.':dc:'.$childId);
        $this->client->sadd(self::PREFIX.$parentId.':dcs', [$childId]);

        if (Relation::TYPE_DIVISION === $relation->getType()) {
            $this->client->incr(self::PREFIX.$parentId.':unshared_dc:'.$childId);
            $this->client->sadd(self::PREFIX.$parentId.':unshared_dcs', [$childId]);
        }
    }

    private function addAllIds(Relation $relation)
    {
        $childId = $relation->getChild()->getId();
        $allChildIds = array_merge([$childId], $this->client->smembers(self::PREFIX.$childId.':acs'));

        $parentId = $relation->getParent()->getId();
        $allParentIds = array_merge([$parentId], $this->client->smembers(self::PREFIX.$parentId.':aps'));

        foreach ($allParentIds as $allParentId) {
            foreach ($allChildIds as $allChildId) {
                $this->client->incr(self::PREFIX.$allParentId.':ac:'.$allChildId);
            }
            $this->client->sadd(self::PREFIX.$allParentId.':acs', $allChildIds);
        }

        foreach ($allChildIds as $allChildId) {
            foreach ($allParentIds as $allParentId) {
                $this->client->incr(self::PREFIX.$allChildId.':ap:'.$allParentId);
            }
            $this->client->sadd(self::PREFIX.$allChildId.':aps', $allParentIds);
        }
    }

    private function addAllUnsharedIds(Relation $relation)
    {
        $childId = $relation->getChild()->getId();
        $allChildIds = array_merge([$childId], $this->client->smembers(self::PREFIX.$childId.':unshared_acs'));

        $parentId = $relation->getParent()->getId();
        $allParentIds = array_merge([$parentId], $this->client->smembers(self::PREFIX.$parentId.':unshared_aps'));

        foreach ($allParentIds as $allParentId) {
            foreach ($allChildIds as $allChildId) {
                $this->client->incr(self::PREFIX.$allParentId.':unshared_ac:'.$allChildId);
            }
            $this->client->sadd(self::PREFIX.$allParentId.':unshared_acs', $allChildIds);
        }

        foreach ($allChildIds as $allChildId) {
            foreach ($allParentIds as $allParentId) {
                $this->client->incr(self::PREFIX.$allChildId.':unshared_ap:'.$allParentId);
            }
            $this->client->sadd(self::PREFIX.$allChildId.':unshared_aps', $allParentIds);
        }
    }

    private function removeAllIds(Relation $relation)
    {
        $childId = $relation->getChild()->getId();
        $allChildIds = array_merge([$childId], $this->client->smembers(self::PREFIX.$childId.':acs'));

        $parentId = $relation->getParent()->getId();
        $allParentIds = array_merge([$parentId], $this->client->smembers(self::PREFIX.$parentId.':aps'));

        foreach ($allParentIds as $allParentId) {
            foreach ($allChildIds as $allChildId) {
                $nbOfRelations = $this->client->decr(self::PREFIX.$allParentId.':ac:'.$allChildId);
                if (0 == $nbOfRelations) {
                    $this->client->srem(self::PREFIX.$allParentId.':acs', $allChildId);
                }
            }
        }

        foreach ($allChildIds as $allChildId) {
            foreach ($allParentIds as $allParentId) {
                $nbOfRelations = $this->client->decr(self::PREFIX.$allChildId.':ap:'.$allParentId);
                if (0 == $nbOfRelations) {
                    $this->client->srem(self::PREFIX.$allChildId.':aps', $allParentId);
                }
            }
        }
    }

    private function removeAllUnsharedIds(Relation $relation)
    {
        $childId = $relation->getChild()->getId();
        $allChildIds = array_merge([$childId], $this->client->smembers(self::PREFIX.$childId.':unshared_acs'));

        $parentId = $relation->getParent()->getId();
        $allParentIds = array_merge([$parentId], $this->client->smembers(self::PREFIX.$parentId.':unshared_aps'));

        foreach ($allParentIds as $allParentId) {
            foreach ($allChildIds as $allChildId) {
                $nbOfRelations = $this->client->decr(self::PREFIX.$allParentId.':unshared_ac:'.$allChildId);
                if (0 == $nbOfRelations) {
                    $this->client->srem(self::PREFIX.$allParentId.':unshared_acs', $allChildId);
                }
            }
        }

        foreach ($allChildIds as $allChildId) {
            foreach ($allParentIds as $allParentId) {
                $nbOfRelations = $this->client->decr(self::PREFIX.$allChildId.':unshared_ap:'.$allParentId);
                if (0 == $nbOfRelations) {
                    $this->client->srem(self::PREFIX.$allChildId.':unshared_aps', $allParentId);
                }
            }
        }
    }

    private function addParentIds(Relation $relation)
    {
        $parentId = $relation->getParent()->getId();
        $childId = $relation->getChild()->getId();

        $this->client->incr(self::PREFIX.$childId.':dp:'.$parentId);
        $this->client->sadd(self::PREFIX.$childId.':dps', [$parentId]);

        if (Relation::TYPE_ROLE == $relation->getType() && User::ROLE_AUTHOR == $relation->getRole()) {
            $this->client->sadd(self::PREFIX.$childId.':writable_ps', [$parentId]);
        }
    }

    private function removeChildIds(Relation $relation)
    {
        $parentId = $relation->getParent()->getId();
        $childId = $relation->getChild()->getId();

        $count = $this->client->decr(self::PREFIX.$parentId.':dc:'.$childId);
        if (0 == $count) {
            $this->client->srem(self::PREFIX.$parentId.':direct_childs', $childId);
        }

        if (Relation::TYPE_DIVISION === $relation->getType()) {
            $count = $this->client->decr(self::PREFIX.$parentId.':unshared_dc:'.$childId);
            if (0 == $count) {
                $this->client->srem(self::PREFIX.$parentId.':unshared_dcs', $childId);
            }
        }
    }

    private function removeParentIds(Relation $relation)
    {
        $parentId = $relation->getParent()->getId();
        $childId = $relation->getChild()->getId();

        $count = $this->client->decr(self::PREFIX.$childId.':dp:'.$parentId);
        if (0 == $count) {
            $this->client->srem(self::PREFIX.$childId.':dps', $parentId);
        }

        if (Relation::TYPE_ROLE == $relation->getType() && User::ROLE_AUTHOR == $relation->getRole()) {
            $this->client->srem(self::PREFIX.$childId.':writable_ps', [$parentId]);
        }
    }
}
