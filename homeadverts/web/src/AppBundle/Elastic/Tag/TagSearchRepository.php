<?php

namespace AppBundle\Elastic\Tag;

use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Tag\Query\TagSearchQuery;
use AppBundle\Elastic\Tag\Query\TagSuggestQuery;
use AppBundle\Elastic\Integration\SearchHandler;

class TagSearchRepository
{
    /**
     * @var SearchHandler
     */
    private $searchHandler;

    /**
     * CategorySearchRepository constructor.
     *
     * @param SearchHandler $searchHandler
     */
    public function __construct(SearchHandler $searchHandler)
    {
        $this->searchHandler = $searchHandler;
    }

    /**
     * @param string $term
     * @param int    $size
     *
     * @return array
     */
    public function findByName($term, $size = 5)
    {
        $query = new TagSuggestQuery();
        $result = [];

        $tags = $this
            ->searchHandler
            ->execute(
                $query,
                [
                    'term' => $term,
                    'size' => $size,
                ],
                'raw'
            )
            ->getSuggestions()['tag_suggest']
        ;


        foreach ($tags as $tag) {
            $result[] = [
                'id' => $tag->id,
                'displayName' => $tag->displayName,
            ];
        }

        return $result;
    }
}
