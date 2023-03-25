<?php

namespace AppBundle\Elastic\Article\View;

use AppBundle\Entity\Social\Article;
use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Integration\View\ViewInterface;
use Symfony\Component\Routing\RouterInterface;

class ArticleAutocompleteView implements ViewInterface
{
    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * SearchLocationView constructor.
     *
     * @param RouterInterface $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'article_autocomplete';
    }

    /**
     * @param SearchResults $results
     * @param array         $runtimeOptions
     */
    public function __invoke($results, $runtimeOptions = [])
    {
        $items = [];

        if (count($results) > 0) {
            /** @var Article $article */
            foreach ($results as $article) {
                $items[] = [
                    'id' => $article->getId(),
                    'title' => $article->getTitle(),
                    'details' => $article->getIntro('autocomplete'),
                    'url' => $this->router->generate('ha_article_details', [
                        'token' => $article->getToken(),
                        'slug' => $article->getSlug(),
                    ]),
                ];
            }
        }

        return [
            'items' => $items,
            'url' => $this->router->generate('ha_article_search', [
                'term' => $runtimeOptions['criteria']['term'],
            ]),
            'total' => $results->getTotal(),
        ];
    }
}
