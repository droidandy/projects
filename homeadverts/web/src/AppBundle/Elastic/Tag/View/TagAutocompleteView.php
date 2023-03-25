<?php

namespace AppBundle\Elastic\Tag\View;

use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Integration\View\ViewInterface;

class TagAutocompleteView implements ViewInterface
{
    /**
     * @return string
     */
    public function getName()
    {
        return 'tag_autocomplete';
    }

    /**
     * @param mixed $results
     * @param array $runtimeOptions
     *
     * @return array
     */
    public function __invoke($results, $runtimeOptions = [])
    {
        $items = [];
        /** @var Tag $result */
        foreach ($results as $result) {
            $items[] = [
                'displayName' => $result->getDisplayName(),
                'name' => $result->getName(),
            ];
        }

        return [
            'items' => $items,
            'total' => $results->getTotal(),
        ];
    }
}
