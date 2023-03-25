<?php

namespace AppBundle\Elastic\Article;

use AppBundle\Elastic\Article\Query\ArticleTermQuery;
use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Integration\Query\Criteria\Type\PaginationType;
use AppBundle\Elastic\Integration\SearchHandler;
use AppBundle\Entity\Social\Article\ArticleRepository;
use AppBundle\Form\ArticleFiltersType;
use AppBundle\Service\User\AdjacencyRegistry;
use Symfony\Component\Form\FormFactoryInterface;

class ArticleSearchRepo
{
    /**
     * @var ArticleRepository
     */
    private $articleRepo;
    /**
     * @var SearchHandler
     */
    private $searchHandler;
    /**
     * @var FormFactoryInterface
     */
    private $formFactory;
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;

    /**
     * @param ArticleRepository    $articleRepo
     * @param SearchHandler        $searchHandler
     * @param FormFactoryInterface $formFactory
     * @param AdjacencyRegistry    $adjacencyRegistry
     */
    public function __construct(
        ArticleRepository $articleRepo,
        SearchHandler $searchHandler,
        FormFactoryInterface $formFactory,
        AdjacencyRegistry $adjacencyRegistry
    ) {
        $this->articleRepo = $articleRepo;
        $this->searchHandler = $searchHandler;
        $this->formFactory = $formFactory;
        $this->adjacencyRegistry = $adjacencyRegistry;
    }

    /**
     * @param string $term
     * @param array  $criteria
     * @param array  $paging
     *
     * @return array
     */
    public function findArticlesByTerm($term, $criteria = [], array $paging)
    {
        $searchCriteria = array_merge((array) $criteria, [
            'term' => $term,
            'limit' => $paging,
        ]);

        $view = function (SearchResults $searchResults) use ($term, $criteria, $paging) {
            return [
                'term' => $term,
                'form' => $this->formFactory->create(new ArticleFiltersType(), $criteria),
                'pages' => [
                    'total' => $searchResults->getTotalPages(),
                    'current' => $paging['page'],
                ],
                'search_results' => $searchResults,
                'pagination' => $this->getPagination($searchResults),
            ];
        };

        return $this->searchHandler->execute(new ArticleTermQuery($this->adjacencyRegistry), $searchCriteria, $view);
    }

    /**
     * @param SearchResults $searchResults
     * @param int           $pageLimit
     *
     * @return array
     */
    private function getPagination(SearchResults $searchResults)
    {
        $pages = [];
        $counter = $i = 0;
        $ids = [];

        foreach ($searchResults as $article) {
            $ids[] = $article->getId();
        }
        $articles = $this->articleRepo->findBy([
            'id' => $ids,
        ]);

        foreach ($articles as $article) {
            if ($counter >= PaginationType::PER_PAGE) {
                $counter = 0;
                ++$i;
            }

            $pages[$i][] = $article;
            ++$counter;
        }

        return $pages;
    }
}
