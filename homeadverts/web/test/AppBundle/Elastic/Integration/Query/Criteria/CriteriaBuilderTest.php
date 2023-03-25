<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria;

use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilder;
use AppBundle\Elastic\Integration\Query\Criteria\Type\TypeRegistry;
use AppBundle\Elastic\Integration\Query\QueryInterface;

class CriteriaBuilderTest extends \PHPUnit_Framework_TestCase
{
    public function testFromQuery()
    {
        $typeRegistry = $this->getTypeRegistry();
        $criteriaBuilder = $this->getCriteriaBuilder($typeRegistry);
        $typeRegistry
            ->expects($this->once())
            ->method('get')
            ->with('string')
            ->willReturn(
                function ($options) use (&$resolveCount) {
                    return array_replace_recursive([
                        '__default' => '',
                    ], $options);
                }
            )
        ;

        $query = $this->getQuery();
        $query
            ->expects($this->once())
            ->method('configureCriteria')
            ->with($criteriaBuilder)
            ->willReturnCallback(function ($criteriaBuilder) {
                $criteriaBuilder->add('field1', 'string');
            })
        ;

        $criteriaBuilder->fromQuery('root', $query);

        $refl = new \ReflectionObject($criteriaBuilder);
        $criteriaProp = $refl->getProperty('criteria');
        $criteriaProp->setAccessible(true);
        $criteria = $criteriaProp->getValue($criteriaBuilder);

        $this->assertEquals([
            '__ns__root' => [
                'field1' => [
                    '__default' => '',
                ],
            ],
        ], $criteria);
    }

    public function testFromCompositeQuery()
    {
        $typeRegistry = $this->getTypeRegistry();
        $criteriaBuilder = $this->getCriteriaBuilder($typeRegistry);
        $typeRegistry
            ->expects($this->any())
            ->method('get')
            ->with('string')
            ->willReturn(
                function ($options) use (&$resolveCount) {
                    return array_replace_recursive([
                        '__default' => '',
                    ], $options);
                }
            )
        ;

        $query1 = $this->getQuery();
        $query1
            ->expects($this->once())
            ->method('configureCriteria')
            ->with($criteriaBuilder)
            ->willReturnCallback(function ($criteriaBuilder) {
                $criteriaBuilder->add('field1', 'string');
            })
        ;
        $query2 = $this->getQuery();
        $query2
            ->expects($this->once())
            ->method('configureCriteria')
            ->with($criteriaBuilder)
            ->willReturnCallback(function ($criteriaBuilder) {
                $criteriaBuilder->add('field1', 'string', [
                    '__default' => 'new_value',
                ]);
            })
        ;

        $compositeQuery = $this->getQuery();
        $compositeQuery
            ->expects($this->once())
            ->method('configureCriteria')
            ->with($criteriaBuilder)
            ->willReturnCallback(function ($criteriaBuilder) use ($query1, $query2) {
                $criteriaBuilder->fromQuery('query1', $query1);
                $criteriaBuilder->fromQuery('query2', $query2);
            })
        ;

        $criteriaBuilder->fromQuery('root', $compositeQuery);

        $refl = new \ReflectionObject($criteriaBuilder);
        $criteriaProp = $refl->getProperty('criteria');
        $criteriaProp->setAccessible(true);
        $criteria = $criteriaProp->getValue($criteriaBuilder);

        $this->assertEquals([
            '__ns__root' => [
                '__ns__query1' => [
                    'field1' => [
                        '__default' => '',
                    ],
                ],
                '__ns__query2' => [
                    'field1' => [
                        '__default' => 'new_value',
                    ],
                ],
            ],
        ], $criteria);
    }

    public function testAddTypes()
    {
        $typeRegistry = $this->getTypeRegistry();
        $criteriaBuilder = $this->getCriteriaBuilder($typeRegistry);

        $resolveCount = 0;
        $typeRegistry
            ->expects($this->exactly(2))
            ->method('get')
            ->withConsecutive(['string'], ['boolean'])
            ->willReturnOnConsecutiveCalls(
                function ($options) use (&$resolveCount) {
                    ++$resolveCount;

                    return array_replace_recursive([
                        '__default' => '',
                    ], $options);
                },
                function ($options) use (&$resolveCount) {
                    ++$resolveCount;

                    return array_replace_recursive([
                        '__default' => false,
                    ], $options);
                }
            )
        ;

        $query = $this->getQuery();
        $query
            ->expects($this->once())
            ->method('configureCriteria')
            ->with($criteriaBuilder)
            ->willReturnCallback(function ($criteriaBuilder) use (&$resolveCount) {
                $criteriaBuilder->add('field1', 'string');
                $criteriaBuilder->add('field2', 'boolean', [
                    '__default' => true,
                ]);
                $criteriaBuilder->add('field3', function ($options) use (&$resolveCount) {
                    ++$resolveCount;

                    return [
                        '__default' => '1',
                    ];
                });
            })
        ;

        $criteriaBuilder->fromQuery('root', $query);

        $this->assertEquals(3, $resolveCount);

        $refl = new \ReflectionObject($criteriaBuilder);
        $criteriaProp = $refl->getProperty('criteria');
        $criteriaProp->setAccessible(true);
        $criteria = $criteriaProp->getValue($criteriaBuilder);

        $this->assertEquals([
            '__ns__root' => [
                'field1' => [
                    '__default' => '',
                ],
                'field2' => [
                    '__default' => true,
                ],
                'field3' => [
                    '__default' => '1',
                ],
            ],
        ], $criteria);
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Namespace is undefined
     */
    public function testAddTypesFailure()
    {
        $typeRegistry = $this->getTypeRegistry();
        $criteriaBuilder = $this->getCriteriaBuilder($typeRegistry);

        $typeRegistry
            ->expects($this->never())
            ->method('get')
            ->with('string')
            ->willReturn(
                function ($options) {
                    return array_replace_recursive([
                        '__default' => false,
                    ], $options);
                }
            )
        ;

        $criteriaBuilder->add('field1', 'string');
    }

    private function getCriteriaBuilder($typeRegistry)
    {
        return new CriteriaBuilder($typeRegistry);
    }

    private function getTypeRegistry()
    {
        return $this->getMockBuilder(TypeRegistry::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getQuery()
    {
        return $this->getMockBuilder(QueryInterface::class)
            ->getMock()
        ;
    }
}
