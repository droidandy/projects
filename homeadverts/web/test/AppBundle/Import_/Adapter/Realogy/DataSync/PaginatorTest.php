<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\CommandInterface;
use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClient;
use AppBundle\Import\Adapter\Sothebys\DataSync\Paginator;
use GuzzleHttp\Promise;

class PaginatorTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var DataSyncClient
     */
    private $client;
    /**
     * @var CommandInterface
     */
    private $command;
    /**
     * @var Paginator
     */
    private $paginator;

    protected function setUp()
    {
        $this->command = $this->getCommand();
        $this->client = $this->getClient();

        $this->paginator = new Paginator($this->client, $this->command, ['limit' => 10]);
    }

    public function testIterator()
    {
        $i = $j = 1;
        foreach ($this->paginator as $item) {
            if ($j < 3) {
                $this->assertEquals('localhost/'.($j + 1), $item->nextLink);
            } else {
                $this->assertTrue(empty($item->nextLink));
            }
            $this->assertEquals(
                [
                    $i, $i + 1, $i + 2,
                ],
                $item->data
            );

            $i += 3;
            ++$j;
        }
    }

    public function testEachCallback()
    {
        $i = $j = 1;
        $this
            ->paginator
            ->each(function ($item) use (&$i, &$j) {
                if ($j < 3) {
                    $this->assertEquals('localhost/'.($j + 1), $item->nextLink);
                } else {
                    $this->assertTrue(empty($item->nextLink));
                }
                $this->assertEquals(
                    [
                        $i, $i + 1, $i + 2,
                    ],
                    $item->data
                );

                $i += 3;
                ++$j;
            })
            ->wait()
        ;
    }

    private function getClient()
    {
        $client = $this
            ->getMockBuilder(DataSyncClient::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $client
            ->expects($this->exactly(3))
            ->method('executeCommand')
            ->withConsecutive(
                [
                    $this->command,
                    [
                        'limit' => 10,
                    ],
                ],
                [
                    $this->command,
                    [
                        'limit' => 10,
                        'next_link' => 'localhost/2',
                    ],
                ],
                [
                    $this->command,
                    [
                        'limit' => 10,
                        'next_link' => 'localhost/3',
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                Promise\promise_for((object) [
                    'nextLink' => 'localhost/2',
                    'data' => [
                        1, 2, 3,
                    ],
                ]),
                Promise\promise_for((object) [
                    'nextLink' => 'localhost/3',
                    'data' => [
                        4, 5, 6,
                    ],
                ]),
                Promise\promise_for((object) [
                    'data' => [
                        7, 8, 9,
                    ],
                ])
            )
        ;

        return $client;
    }

    private function getCommand()
    {
        return $this
            ->getMockBuilder(CommandInterface::class)
            ->getMock()
        ;
    }
}
