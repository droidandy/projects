<?php

namespace Test\AppBundle\Elastic\Integration\Query\Criteria;

use AppBundle\Elastic\Integration\Query\Criteria\NamespacedCriteria;
use AppBundle\Elastic\Integration\Query\Criteria\ValidationException;

class NamespacedCriteriaTest extends \PHPUnit_Framework_TestCase
{
    public function testDefaultValues()
    {
        $criteria = [
            '__ns__root' => [
                '__ns__namespace1' => [
                    'field1' => [
                        '__default' => true,
                    ],
                    'field2' => [
                        '__default' => 1,
                    ],
                    'field3' => [
                        '__default' => 500,
                    ],
                ],
                '__ns__namespace2' => [
                    'field1' => [
                        '__default' => false,
                    ],
                    'field4' => [
                        '__composite' => true,
                        '__default' => [
                                'field5' => 1,
                                'field6' => 2,
                                'field7' => 3,
                            ],
                    ],
                ],
                '__ns__composite_namespace' => [
                    '__ns__namespace3' => [
                        'field3' => [
                            '__default' => 100,
                            '__required' => true,
                        ],
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        $resolvedData = $namespacedCriteria->resolve([]);

        $this->assertEquals($criteria['__ns__root']['__ns__namespace1']['field1']['__default'], $resolvedData['root']['namespace1']['field1']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace1']['field2']['__default'], $resolvedData['root']['namespace1']['field2']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace1']['field3']['__default'], $resolvedData['root']['namespace1']['field3']);

        $this->assertEquals($criteria['__ns__root']['__ns__namespace2']['field1']['__default'], $resolvedData['root']['namespace2']['field1']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace2']['field4']['__default']['field5'], $resolvedData['root']['namespace2']['field4']['field5']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace2']['field4']['__default']['field6'], $resolvedData['root']['namespace2']['field4']['field6']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace2']['field4']['__default']['field7'], $resolvedData['root']['namespace2']['field4']['field7']);

        $this->assertEquals($criteria['__ns__root']['__ns__composite_namespace']['__ns__namespace3']['field3']['__default'], $resolvedData['root']['composite_namespace']['namespace3']['field3']);

        $resolvedData = $namespacedCriteria->resolve([
            'field1' => 'another value',
        ]);

        $this->assertEquals('another value', $resolvedData['root']['namespace1']['field1']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace1']['field2']['__default'], $resolvedData['root']['namespace1']['field2']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace1']['field3']['__default'], $resolvedData['root']['namespace1']['field3']);

        $this->assertEquals('another value', $resolvedData['root']['namespace2']['field1']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace2']['field4']['__default']['field5'], $resolvedData['root']['namespace2']['field4']['field5']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace2']['field4']['__default']['field6'], $resolvedData['root']['namespace2']['field4']['field6']);
        $this->assertEquals($criteria['__ns__root']['__ns__namespace2']['field4']['__default']['field7'], $resolvedData['root']['namespace2']['field4']['field7']);

        $this->assertArrayNotHasKey('field1', $resolvedData['root']['composite_namespace']['namespace3']);
    }

    /**
     * @expectedException \AppBundle\Elastic\Integration\Query\Criteria\ValidationException
     */
    public function testRequiredWithoutDefaultThrowsException()
    {
        $criteria = [
            '__ns__root' => [
                'field1' => [
                    '__required' => true,
                ],
                'field2' => [
                    '__required' => true,
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        try {
            $namespacedCriteria->resolve([
                'field1' => true,
            ]);
        } catch (ValidationException $e) {
            $errors = $e->getErrors();
            $this->assertEquals('Value is required', $errors['root']['field2']);

            throw $e;
        }
    }

    /**
     * @expectedException \AppBundle\Elastic\Integration\Query\Criteria\ValidationException
     */
    public function testRequiredWithoutDefaultThrowsExceptionNested()
    {
        $criteria = [
            '__ns__root' => [
                '__ns__namespace1' => [
                    'field1' => [
                        '__required' => true,
                    ],
                    'field2' => [
                        '__required' => true,
                    ],
                    'field3' => [
                        '__composite' => true,
                        'field4' => [
                            '__required' => true,
                        ],
                        'field5' => [
                            '__required' => true,
                        ],
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        try {
            $namespacedCriteria->resolve([
                'field1' => true,
                'field2' => true,
                'field3' => [
                    'field4' => true,
                ],
            ]);
        } catch (ValidationException $e) {
            $errors = $e->getErrors();
            $this->assertEquals('Value is required', $errors['root']['namespace1']['field3']['field5']);

            throw $e;
        }
    }

    public function testNonRequired()
    {
        $criteria = [
            '__ns__root' => [
                'field1' => [
                    '__required' => false,
                ],
                'field3' => [
                    '__composite' => true,
                    'field4' => [
                        '__required' => false,
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        $resolvedData = $namespacedCriteria->resolve([]);

        $this->assertNull($resolvedData['root']['field1']);
        $this->assertNull($resolvedData['root']['field3']['field4']);
    }

    public function testNormalize()
    {
        $criteria = [
            '__ns__root' => [
                '__ns__namespace1' => [
                    'field1' => [
                        '__normalize' => function ($val) {
                            return filter_var($val, FILTER_VALIDATE_BOOLEAN);
                        },
                    ],
                ],
                '__ns__composite_namespace' => [
                    '__ns__namespace2' => [
                        'field2' => [
                            '__composite' => true,
                            'field3' => [
                                '__normalize' => function ($val) {
                                    return filter_var($val, FILTER_VALIDATE_FLOAT);
                                },
                            ],
                            'field4' => [
                                '__composite' => true,
                                'field5' => [
                                    '__normalize' => function ($val) {
                                        return filter_var($val, FILTER_VALIDATE_FLOAT);
                                    },
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        $resolvedData = $namespacedCriteria->resolve([
            'field1' => '1',
            'field2' => [
                '__composite' => true,
                'field3' => '1',
                'field4' => [
                    '__composite' => true,
                    'field5' => '1',
                ],
            ],
        ]);

        $this->assertArrayNotHasKey('field2', $resolvedData['root']['namespace1']);
        $this->assertSame(true, $resolvedData['root']['namespace1']['field1']);

        $this->assertArrayNotHasKey('field1', $resolvedData['root']['composite_namespace']['namespace2']);
        $this->assertSame(1.0, $resolvedData['root']['composite_namespace']['namespace2']['field2']['field3']);
        $this->assertSame(1.0, $resolvedData['root']['composite_namespace']['namespace2']['field2']['field4']['field5']);
    }

    public function testValidatePassed()
    {
        $criteria = [
            '__ns__root' => [
                '__ns__namespace1' => [
                    'field1' => [
                        '__validate' => function ($val) {
                            return true === $val;
                        },
                    ],
                ],
                '__ns__namespace2' => [
                    'field2' => [
                        '__composite' => true,
                        'field3' => [
                            '__validate' => function ($val) {
                                return true === $val;
                            },
                        ],
                        'field4' => [
                            '__composite' => true,
                            'field5' => [
                                '__validate' => function ($val) {
                                    return true === $val;
                                },
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        $resolvedData = $namespacedCriteria->resolve([
            'field1' => true,
            'field2' => [
                'field3' => true,
                'field4' => [
                    'field5' => true,
                ],
            ],
        ]);

        $this->assertArrayNotHasKey('field2', $resolvedData['root']['namespace1']);
        $this->assertEquals(true, $resolvedData['root']['namespace1']['field1']);

        $this->assertArrayNotHasKey('field1', $resolvedData['root']['namespace2']);
        $this->assertEquals(true, $resolvedData['root']['namespace2']['field2']['field3']);
        $this->assertEquals(true, $resolvedData['root']['namespace2']['field2']['field4']['field5']);
    }

    /**
     * @expectedException \AppBundle\Elastic\Integration\Query\Criteria\ValidationException
     */
    public function testValidateFailedOuter()
    {
        $criteria = [
            '__ns__root' => [
                '__ns__namespace1' => [
                    'field1' => [
                        '__validate' => function ($val) {
                            return true === $val;
                        },
                    ],
                ],
                '__ns__namespace2' => [
                    'field2' => [
                        '__composite' => true,
                        'field3' => [
                            '__validate' => function ($val) {
                                return true === $val;
                            },
                        ],
                        'field4' => [
                            '__composite' => true,
                            'field5' => [
                                '__validate' => function ($val) {
                                    return true === $val;
                                },
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        try {
            $namespacedCriteria->resolve([
                'field1' => false,
                'field2' => [
                    'field3' => true,
                    'field4' => [
                        'field5' => true,
                    ],
                ],
            ]);
        } catch (ValidationException $e) {
            $errors = $e->getErrors();
            $this->assertEquals('Validation error', $errors['root']['namespace1']['field1']);

            throw $e;
        }
    }

    /**
     * @expectedException \AppBundle\Elastic\Integration\Query\Criteria\ValidationException
     */
    public function testValidateFailedNested()
    {
        $criteria = [
            '__ns__root' => [
                '__ns__namespace1' => [
                    'field1' => [
                        '__validate' => function ($val) {
                            return true === $val;
                        },
                    ],
                ],
                '__ns__composite_namespace' => [
                    '__ns__namespace2' => [
                        'field2' => [
                            '__composite' => true,
                            'field3' => [
                                '__validate' => function ($val) {
                                    return true === $val;
                                },
                            ],
                            'field4' => [
                                '__composite' => true,
                                'field5' => [
                                    '__validate' => function ($val) {
                                        return true === $val;
                                    },
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        try {
            $namespacedCriteria->resolve([
                'field1' => true,
                'field2' => [
                    'field3' => true,
                    'field4' => [
                        'field5' => false,
                    ],
                ],
            ]);
        } catch (ValidationException $e) {
            $errors = $e->getErrors();
            $this->assertEquals('Validation error', $errors['root']['composite_namespace']['namespace2']['field2']['field4']['field5']);

            throw $e;
        }
    }

    public function testCompositeCase()
    {
        $criteria = [
            '__ns__root' => [
                '__ns__composite_namespace' => [
                    '__ns__namespace1' => [
                        'field1' => [
                            '__default' => true,
                            '__required' => true,
                            '__validate' => function ($val) {
                                return true === $val;
                            },
                        ],
                    ],
                ],
                '__ns__namespace2' => [
                    'field2' => [
                        '__composite' => true,
                        'field3' => [
                            '__required' => false,
                            '__normalize' => function ($val) {
                                return filter_var($val, FILTER_VALIDATE_BOOLEAN);
                            },
                            '__validate' => function ($val) {
                                return true === $val;
                            },
                        ],
                        'field4' => [
                            '__composite' => true,
                            'field5' => [
                                '__required' => true,
                                '__normalize' => function ($val) {
                                    return filter_var($val, FILTER_VALIDATE_BOOLEAN);
                                },
                                '__validate' => function ($val) {
                                    return true === $val;
                                },
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        $resolvedData = $namespacedCriteria->resolve([
            'field2' => [
                'field4' => [
                    'field5' => '1',
                ],
            ],
        ]);

        $this->assertArrayNotHasKey('field2', $resolvedData['root']['composite_namespace']['namespace1']);
        $this->assertEquals(true, $resolvedData['root']['composite_namespace']['namespace1']['field1']);

        $this->assertArrayNotHasKey('field1', $resolvedData['root']['namespace2']);
        $this->assertEquals(null, $resolvedData['root']['namespace2']['field2']['field3']);
        $this->assertEquals(true, $resolvedData['root']['namespace2']['field2']['field4']['field5']);
    }

    /**
     * @expectedException \AppBundle\Elastic\Integration\Query\Criteria\ValidationException
     */
    public function testCompositeCaseFailed()
    {
        $criteria = [
            '__ns__root' => [
                '__ns__composite_namespace' => [
                    '__ns__namespace1' => [
                        'field1' => [
                            '__default' => true,
                            '__required' => true,
                            '__validate' => function ($val) {
                                return true === $val;
                            },
                        ],
                    ],
                ],
                '__ns__namespace2' => [
                    'field2' => [
                        '__composite' => true,
                        'field3' => [
                            '__required' => false,
                            '__normalize' => function ($val) {
                                return filter_var($val, FILTER_VALIDATE_BOOLEAN);
                            },
                            '__validate' => function ($val) {
                                return true === $val;
                            },
                        ],
                        'field4' => [
                            '__composite' => true,
                            'field5' => [
                                '__required' => true,
                                '__normalize' => function ($val) {
                                    return filter_var($val, FILTER_VALIDATE_BOOLEAN);
                                },
                                '__validate' => function ($val) {
                                    return true === $val;
                                },
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $namespacedCriteria = $this->getNamespacedCriteria($criteria);

        try {
            $namespacedCriteria->resolve([
                'field1' => false,
                'field2' => [
                    'field4' => [],
                ],
            ]);
        } catch (ValidationException $e) {
            $errors = $e->getErrors();
            $this->assertEquals('Validation error', $errors['root']['composite_namespace']['namespace1']['field1']);
            $this->assertEquals('Value is required', $errors['root']['namespace2']['field2']['field4']['field5']);

            throw $e;
        }
    }

    private function getNamespacedCriteria($criteria)
    {
        return new NamespacedCriteria($criteria);
    }
}
