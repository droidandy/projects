<?php

namespace AppBundle\Elastic\Tag\Query;

use AppBundle\Elastic\Integration\Query\QueryInterface;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Tag\Mapping\TagMapping;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;

class TagSuggestQuery implements QueryInterface
{
    const FIELD_NAME = 'suggest';

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
            ->add('size', 'integer', [
                '__default' => 5,
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
        $query = [
            'suggest' => [
                'tag_suggest' => [
                    'prefix' => $criteria['term'],
                    'completion' => [
                        'field' => self::FIELD_NAME,
                        'size' => $criteria['size'],
                    ],
                ],
            ],
        ];

        return $requestFactory->createRequest($query, $this->getTypes());
    }

    /**
     * @return string
     */
    public function getTypes()
    {
        return TagMapping::TYPE;
    }
}
