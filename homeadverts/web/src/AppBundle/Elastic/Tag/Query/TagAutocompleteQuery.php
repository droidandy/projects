<?php

namespace AppBundle\Elastic\Tag\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Tag\Mapping\TagMapping;

class TagAutocompleteQuery implements QueryInterface
{
    /**
     * @param CriteriaBuilderInterface $criteriaBuilder
     */
    public function configureCriteria(CriteriaBuilderInterface $criteriaBuilder)
    {
        $criteriaBuilder
            ->add('term', 'string', [
                '__required' => true,
                '__validate' => function ($value) {
                    return mb_strlen($value) >= 3;
                },
            ])
        ;
    }

    /**
     * @param array                   $criteria
     * @param RequestFactoryInterface $requestFactory
     *
     * @return RequestInterface
     */
    public function build(array $criteria, RequestFactoryInterface $requestFactory)
    {
        return $requestFactory->createRequest([
            'from' => 0,
            'size' => 3,
            'query' => [
                'bool' => [
                    'should' => [
                        [
                            'prefix' => [
                                'displayName' => $criteria['term'],
                            ],
                        ],
                        [
                            'match' => [
                                'displayName' => $criteria['term'],
                            ],
                        ],
                    ],
                    'filter' => [
                        [
                            'term' => [
                                'private' => false,
                            ],
                        ],
                    ],
                    'minimum_should_match' => 1,
                ],
            ],
        ], $this->getTypes());
    }

    /**
     * @return string
     */
    public function getTypes()
    {
        return TagMapping::TYPE;
    }
}
