<?php

namespace Test\AppBundle\Elastic\Category\Query;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Category\Mapping\TagMapping;
use AppBundle\Elastic\Category\Query\TagSuggestQuery;

class TagSuggestQueryTest extends \PHPUnit_Framework_TestCase
{
    public function testConfigureCriteria()
    {
        $criteriaBuilder = $this->getCriteriaBuilder();
        $criteriaBuilder
            ->expects($this->exactly(2))
            ->method('add')
            ->withConsecutive(
                ['term', 'string', $this->callback(function ($val) {
                    return true === $val['__required'] && is_callable($val['__validate']);
                })],
                ['size', 'integer', [
                    '__default' => 5,
                ]]
            )
            ->willReturnSelf()
        ;

        $tagSuggestQuery = $this->getTagSuggestQuery();
        $tagSuggestQuery
            ->configureCriteria($criteriaBuilder)
        ;
    }

    public function testBuild()
    {
        $criteria = [
            'term' => 'Tag',
            'size' => 5,
            'categories' => null,
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'suggest' => [
                        'tag_suggest' => [
                            'prefix' => 'Tag',
                            'completion' => [
                                'field' => 'suggest',
                                'size' => 5,
                            ],
                        ],
                    ],
                ],
                TagMapping::TYPE
            )
            ->willReturn($request)
        ;

        $tagSuggestQuery = $this->getTagSuggestQuery();
        $request = $tagSuggestQuery->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    private function getTagSuggestQuery()
    {
        return new TagSuggestQuery();
    }

    private function getCriteriaBuilder()
    {
        return $this->getMockBuilder(CriteriaBuilderInterface::class)
            ->getMock()
        ;
    }

    private function getRequestFactory()
    {
        return $this->getMockBuilder(RequestFactoryInterface::class)
            ->getMock()
        ;
    }

    private function getRequest()
    {
        return $this->getMockBuilder(RequestInterface::class)
            ->getMock()
        ;
    }
}
