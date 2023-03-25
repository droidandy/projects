<?php

namespace AppBundle\Import\Processor;

class CollectionMerger
{
    /**
     * @var callable
     */
    private $creator;
    /**
     * @var callable
     */
    private $updater;
    /**
     * @var callable
     */
    private $matcher;

    /**
     * @param callable $creator
     * @param callable $updater
     * @param callable $matcher
     */
    public function __construct(callable $creator, callable $updater, callable $matcher)
    {
        $this->user = $creator;
        $this->updater = $updater;
        $this->matcher = $matcher;
    }

    public function merge($newColl, $oldColl, callable $postCreateCb, callable $postUpdateCb, callable $removeCb)
    {
        $oldColl = is_array($oldColl) ? $oldColl : iterator_to_array($oldColl);
        $elems = [];
        foreach ($newColl as $newElem) {
            $elem = $this->getCorrespondingElem($newElem, $oldColl);
            if (!$elem) {
                $elems[] = $elem = $this->createElem($newElem);
                $postCreateCb($elem);
            } else {
                $elems[] = $elem = $this->updateElem($newElem, $elem);
                $postUpdateCb($elem);
            }
        }

        $elemsRemoved = array_filter(
            $oldColl,
            function ($oldElem) use ($elems) {
                return !in_array($oldElem, $elems, true);
            }
        );
        foreach ($elemsRemoved as $itemRemoved) {
            $removeCb($itemRemoved);
        }

        return [
            $elems,
            $elemsRemoved,
        ];
    }

    private function getCorrespondingElem($newElem, $oldColl)
    {
        foreach ($oldColl as $item) {
            $matcher = $this->matcher;
            if ($matcher($newElem, $item)) {
                return $item;
            }
        }

        return null;
    }

    private function createElem($newElem)
    {
        $creator = $this->user;

        return $creator($newElem);
    }

    private function updateElem($newElem, $elem)
    {
        $updater = $this->updater;

        return $updater($newElem, $elem);
    }
}
