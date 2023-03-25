<?php

namespace Test\AppBundle\Command\DataSync;

use AppBundle\Command\DataSync\DataSyncGuidPopulateCommand;
use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClient;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Driver\Statement;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use GuzzleHttp\Promise;

class DataSyncGuidPopulateCommandTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var DataSyncGuidPopulateCommand
     */
    private $dataSyncGuidPopulateCommand;

    protected function setUp()
    {
        $this->dataSyncClient = $dataSyncClient = $this->getDataSyncCLient();
        $this->conn = $conn = $this->getConnection();
        $this->logger = $logger = $this->getLogger();

        $this->dataSyncGuidPopulateCommand = $dataSyncGuidPopulateCommand = new DataSyncGuidPopulateCommand();

        $refl = new \ReflectionObject($dataSyncGuidPopulateCommand);
        $reflProp = $refl->getProperty('dataSyncClient');
        $reflProp->setAccessible(true);
        $reflProp->setValue($dataSyncGuidPopulateCommand, $dataSyncClient);

        $refl = new \ReflectionObject($dataSyncGuidPopulateCommand);
        $reflProp = $refl->getProperty('conn');
        $reflProp->setAccessible(true);
        $reflProp->setValue($dataSyncGuidPopulateCommand, $conn);

        $refl = new \ReflectionObject($dataSyncGuidPopulateCommand);
        $reflProp = $refl->getProperty('logger');
        $reflProp->setAccessible(true);
        $reflProp->setValue($dataSyncGuidPopulateCommand, $logger);
    }

    public function testExecuteNoExistings()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $dataSyncClient */
        $dataSyncClient = $this->dataSyncClient;
        $dataSyncClient
            ->expects($this->once())
            ->method('getActiveListings')
            ->willReturn(
                Promise\promise_for([
                    (object) [
                        'entityId' => 'BF2B18B6-2321-471D-8527-E6C46556A55A',
                        'lastUpdateOn' => '2018-04-03T23:55:59.323',
                    ],
                    (object) [
                        'entityId' => 'BF2C5440-14F5-4AD4-A806-840FAF3C1AE7',
                        'lastUpdateOn' => '2018-02-05T21:10:18.470',
                    ],
                    (object) [
                        'entityId' => 'BF2D0CD0-42C9-474D-96A5-0F8B377E827C',
                        'lastUpdateOn' => '2018-01-17T14:15:37.467',
                    ],
                    (object) [
                        'entityId' => '48C58FF6-4545-4119-B9D0-D9E756FCD228',
                        'lastUpdateOn' => '2018-07-02T19:20:47.980',
                    ],
                    (object) [
                        'entityId' => '48C76B89-5439-455C-86F9-30C2AE476025',
                        'lastUpdateOn' => '2018-07-19T09:10:34.370',
                    ],
                    (object) [
                        'entityId' => '48CAC724-350C-413F-977C-D13CBB198F9F',
                        'lastUpdateOn' => '2018-06-18T21:47:22.337',
                    ],
                    (object) [
                        'entityId' => '2B1F1083-58B7-46D9-B76A-573B3AC32F8F',
                        'lastUpdateOn' => '2018-07-20T20:09:56.513',
                    ],
                    (object) [
                        'entityId' => '2B1FDDAE-40C3-4609-87E6-6BC3E3195D26',
                        'lastUpdateOn' => '2018-01-09T14:25:09.773',
                    ],
                    (object) [
                        'entityId' => '2B214BBA-32A2-4E0B-A7F1-90F75010FC28',
                        'lastUpdateOn' => '2018-06-18T03:55:29.017',
                    ],
                ])
            )
        ;
        $dataSyncClient
            ->expects($this->exactly(9))
            ->method('getListingById')
            ->withConsecutive(
                ['BF2B18B6-2321-471D-8527-E6C46556A55A'],
                ['BF2C5440-14F5-4AD4-A806-840FAF3C1AE7'],
                ['BF2D0CD0-42C9-474D-96A5-0F8B377E827C'],
                ['48C58FF6-4545-4119-B9D0-D9E756FCD228'],
                ['48C76B89-5439-455C-86F9-30C2AE476025'],
                ['48CAC724-350C-413F-977C-D13CBB198F9F'],
                ['2B1F1083-58B7-46D9-B76A-573B3AC32F8F'],
                ['2B1FDDAE-40C3-4609-87E6-6BC3E3195D26'],
                ['2B214BBA-32A2-4E0B-A7F1-90F75010FC28']
            )
            ->willReturnOnConsecutiveCalls(
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => 'BF2B18B6-2321-471D-8527-E6C46556A55A',
                            'RFGListingId' => 'Z8Y2EC',
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => 'BF2C5440-14F5-4AD4-A806-840FAF3C1AE7',
                            'RFGListingId' => 'YV3E6Y',
                            'mlsNumbers' => ['1341696'],
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => 'BF2D0CD0-42C9-474D-96A5-0F8B377E827C',
                            'RFGListingId' => '7W6JBW',
                            'mlsNumbers' => ['136787'],
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '48C58FF6-4545-4119-B9D0-D9E756FCD228',
                            'RFGListingId' => 'TFN55P',
                            'mlsNumbers' => ['154423'],
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '48C76B89-5439-455C-86F9-30C2AE476025',
                            'RFGListingId' => 'HX82JN',
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '48CAC724-350C-413F-977C-D13CBB198F9F',
                            'RFGListingId' => '6QKEWE',
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '2B1F1083-58B7-46D9-B76A-573B3AC32F8F',
                            'RFGListingId' => '3D4G72',
                            'mlsNumbers' => ['18002802'],
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '2B1FDDAE-40C3-4609-87E6-6BC3E3195D26',
                            'RFGListingId' => 'FYHFTE',
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '2B214BBA-32A2-4E0B-A7F1-90F75010FC28',
                            'RFGListingId' => 'FL29XY',
                            'mlsNumbers' => ['DM2-2091', 'QBS11910'],
                        ],
                    ]
                )
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $query */
        $query = $this->getQuery();
        $query
            ->expects($this->once())
            ->method('fetchAll')
            ->with(\PDO::FETCH_COLUMN)
            ->willReturn([])
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $conn */
        $conn = $this->conn;
        $conn
            ->expects($this->once())
            ->method('query')
            ->with('SELECT sourceGuid FROM property WHERE sourceGuid IS NOT NULL')
            ->willReturn($query)
        ;
        $conn
            ->expects($this->exactly(11))
            ->method('executeUpdate')
            ->willReturnCallback(function ($sql, $params) {
                if ('UPDATE property SET sourceGuid = :source_guid WHERE sourceRef = :source_ref' == $sql) {
                    $this->assertContains(
                        $params['source_guid'],
                        [
                            'BF2B18B6-2321-471D-8527-E6C46556A55A',
                            'BF2C5440-14F5-4AD4-A806-840FAF3C1AE7',
                            'BF2D0CD0-42C9-474D-96A5-0F8B377E827C',
                            '48C58FF6-4545-4119-B9D0-D9E756FCD228',
                            '48C76B89-5439-455C-86F9-30C2AE476025',
                            '48CAC724-350C-413F-977C-D13CBB198F9F',
                            '2B1F1083-58B7-46D9-B76A-573B3AC32F8F',
                            '2B1FDDAE-40C3-4609-87E6-6BC3E3195D26',
                            '2B214BBA-32A2-4E0B-A7F1-90F75010FC28',
                        ]
                    );
                    switch ($params['source_guid']) {
                        case 'BF2B18B6-2321-471D-8527-E6C46556A55A':
                        case 'BF2C5440-14F5-4AD4-A806-840FAF3C1AE7':
                        case '48C58FF6-4545-4119-B9D0-D9E756FCD228':
                        case '48C76B89-5439-455C-86F9-30C2AE476025':
                        case '2B1F1083-58B7-46D9-B76A-573B3AC32F8F':
                        case '2B1FDDAE-40C3-4609-87E6-6BC3E3195D26':
                            return 1;
                        case 'BF2D0CD0-42C9-474D-96A5-0F8B377E827C':
                        case '48CAC724-350C-413F-977C-D13CBB198F9F':
                        case '2B214BBA-32A2-4E0B-A7F1-90F75010FC28':
                            return 0;
                    }
                } elseif ('UPDATE property SET sourceGuid = :source_guid WHERE mlsRef IN (:mls_numbers)' == $sql) {
                    $this->assertContains(
                        $params['source_guid'],
                        [
                            'BF2D0CD0-42C9-474D-96A5-0F8B377E827C',
                            '48CAC724-350C-413F-977C-D13CBB198F9F',
                            '2B214BBA-32A2-4E0B-A7F1-90F75010FC28',
                        ]
                    );
                    switch ($params['source_guid']) {
                        case 'BF2D0CD0-42C9-474D-96A5-0F8B377E827C':
                        case '48CAC724-350C-413F-977C-D13CBB198F9F':
                            return 1;
                        case '2B214BBA-32A2-4E0B-A7F1-90F75010FC28':
                            return 0;
                    }
                }
            })
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(4))
            ->method('info')
            ->withConsecutive(
                ['DATASYNC_GUID_POPULATE. Total guids 9'],
                ['DATASYNC_GUID_POPULATE. Existing guids 0. To process guids 9'],
                ['DATASYNC_GUID_POPULATE. Progress 0 / 9'],
                ['DATASYNC_GUID_POPULATE. Progress 9 / 9']
            )
        ;
        $logger
            ->expects($this->exactly(6))
            ->method('notice')
            ->withConsecutive(
                ['DATASYNC_GUID_POPULATE. GUID BF2D0CD0-42C9-474D-96A5-0F8B377E827C. ID 7W6JBW. Not updated with guid'],
                ['DATASYNC_GUID_POPULATE. GUID 48CAC724-350C-413F-977C-D13CBB198F9F. ID 6QKEWE. Not updated with guid'],
                ['DATASYNC_GUID_POPULATE. GUID 48CAC724-350C-413F-977C-D13CBB198F9F. No matches found'],
                ['DATASYNC_GUID_POPULATE. GUID 2B214BBA-32A2-4E0B-A7F1-90F75010FC28. ID FL29XY. Not updated with guid'],
                ['DATASYNC_GUID_POPULATE. GUID 2B214BBA-32A2-4E0B-A7F1-90F75010FC28. MLS NUMBERS DM2-2091, QBS11910. Not updated with guid'],
                ['DATASYNC_GUID_POPULATE. GUID 2B214BBA-32A2-4E0B-A7F1-90F75010FC28. No matches found']
            )
        ;

        $refl = new \ReflectionObject($this->dataSyncGuidPopulateCommand);
        $method = $refl->getMethod('execute');
        $method->setAccessible(true);

        $methodToTest = $method->getClosure($this->dataSyncGuidPopulateCommand);

        $methodToTest($this->getInput(), $this->getOutput());
    }

    public function testExecuteWithExisting()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $dataSyncClient */
        $dataSyncClient = $this->dataSyncClient;
        $dataSyncClient
            ->expects($this->once())
            ->method('getActiveListings')
            ->willReturn(
                Promise\promise_for([
                    (object) [
                        'entityId' => 'BF2B18B6-2321-471D-8527-E6C46556A55A',
                        'lastUpdateOn' => '2018-04-03T23:55:59.323',
                    ],
                    (object) [
                        'entityId' => 'BF2C5440-14F5-4AD4-A806-840FAF3C1AE7',
                        'lastUpdateOn' => '2018-02-05T21:10:18.470',
                    ],
                    (object) [
                        'entityId' => 'BF2D0CD0-42C9-474D-96A5-0F8B377E827C',
                        'lastUpdateOn' => '2018-01-17T14:15:37.467',
                    ],
                    (object) [
                        'entityId' => '48C58FF6-4545-4119-B9D0-D9E756FCD228',
                        'lastUpdateOn' => '2018-07-02T19:20:47.980',
                    ],
                    (object) [
                        'entityId' => '48C76B89-5439-455C-86F9-30C2AE476025',
                        'lastUpdateOn' => '2018-07-19T09:10:34.370',
                    ],
                    (object) [
                        'entityId' => '48CAC724-350C-413F-977C-D13CBB198F9F',
                        'lastUpdateOn' => '2018-06-18T21:47:22.337',
                    ],
                    (object) [
                        'entityId' => '2B1F1083-58B7-46D9-B76A-573B3AC32F8F',
                        'lastUpdateOn' => '2018-07-20T20:09:56.513',
                    ],
                    (object) [
                        'entityId' => '2B1FDDAE-40C3-4609-87E6-6BC3E3195D26',
                        'lastUpdateOn' => '2018-01-09T14:25:09.773',
                    ],
                    (object) [
                        'entityId' => '2B214BBA-32A2-4E0B-A7F1-90F75010FC28',
                        'lastUpdateOn' => '2018-06-18T03:55:29.017',
                    ],
                ])
            )
        ;
        $dataSyncClient
            ->expects($this->exactly(6))
            ->method('getListingById')
            ->withConsecutive(
                ['BF2C5440-14F5-4AD4-A806-840FAF3C1AE7'],
                ['BF2D0CD0-42C9-474D-96A5-0F8B377E827C'],
                ['48C58FF6-4545-4119-B9D0-D9E756FCD228'],
                ['48C76B89-5439-455C-86F9-30C2AE476025'],
                ['2B1FDDAE-40C3-4609-87E6-6BC3E3195D26'],
                ['2B214BBA-32A2-4E0B-A7F1-90F75010FC28']
            )
            ->willReturnOnConsecutiveCalls(
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => 'BF2C5440-14F5-4AD4-A806-840FAF3C1AE7',
                            'RFGListingId' => 'YV3E6Y',
                            'mlsNumbers' => ['1341696'],
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => 'BF2D0CD0-42C9-474D-96A5-0F8B377E827C',
                            'RFGListingId' => '7W6JBW',
                            'mlsNumbers' => ['136787'],
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '48C58FF6-4545-4119-B9D0-D9E756FCD228',
                            'RFGListingId' => 'TFN55P',
                            'mlsNumbers' => ['154423'],
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '48C76B89-5439-455C-86F9-30C2AE476025',
                            'RFGListingId' => 'HX82JN',
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '2B1FDDAE-40C3-4609-87E6-6BC3E3195D26',
                            'RFGListingId' => 'FYHFTE',
                        ],
                    ]
                ),
                Promise\promise_for(
                    (object) [
                        'listingSummary' => (object) [
                            'listingId' => '2B214BBA-32A2-4E0B-A7F1-90F75010FC28',
                            'RFGListingId' => 'FL29XY',
                            'mlsNumbers' => ['DM2-2091', 'QBS11910'],
                        ],
                    ]
                )
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $query */
        $query = $this->getQuery();
        $query
            ->expects($this->once())
            ->method('fetchAll')
            ->with(\PDO::FETCH_COLUMN)
            ->willReturn([
                'BF2B18B6-2321-471D-8527-E6C46556A55A',
                '48CAC724-350C-413F-977C-D13CBB198F9F',
                '2B1F1083-58B7-46D9-B76A-573B3AC32F8F',
            ])
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $conn */
        $conn = $this->conn;
        $conn
            ->expects($this->once())
            ->method('query')
            ->with('SELECT sourceGuid FROM property WHERE sourceGuid IS NOT NULL')
            ->willReturn($query)
        ;
        $conn
            ->expects($this->exactly(8))
            ->method('executeUpdate')
            ->willReturnCallback(function ($sql, $params) {
                if ('UPDATE property SET sourceGuid = :source_guid WHERE sourceRef = :source_ref' == $sql) {
                    $this->assertContains(
                        $params['source_guid'],
                        [
                            'BF2C5440-14F5-4AD4-A806-840FAF3C1AE7',
                            'BF2D0CD0-42C9-474D-96A5-0F8B377E827C',
                            '48C58FF6-4545-4119-B9D0-D9E756FCD228',
                            '48C76B89-5439-455C-86F9-30C2AE476025',
                            '2B1FDDAE-40C3-4609-87E6-6BC3E3195D26',
                            '2B214BBA-32A2-4E0B-A7F1-90F75010FC28',
                        ]
                    );
                    switch ($params['source_guid']) {
                        case 'BF2C5440-14F5-4AD4-A806-840FAF3C1AE7':
                        case '48C58FF6-4545-4119-B9D0-D9E756FCD228':
                        case '48C76B89-5439-455C-86F9-30C2AE476025':
                        case '2B1FDDAE-40C3-4609-87E6-6BC3E3195D26':
                            return 1;
                        case 'BF2D0CD0-42C9-474D-96A5-0F8B377E827C':
                        case '2B214BBA-32A2-4E0B-A7F1-90F75010FC28':
                            return 0;
                    }
                } elseif ('UPDATE property SET sourceGuid = :source_guid WHERE mlsRef IN (:mls_numbers)' == $sql) {
                    $this->assertContains(
                        $params['source_guid'],
                        [
                            'BF2D0CD0-42C9-474D-96A5-0F8B377E827C',
                            '2B214BBA-32A2-4E0B-A7F1-90F75010FC28',
                        ]
                    );
                    switch ($params['source_guid']) {
                        case 'BF2D0CD0-42C9-474D-96A5-0F8B377E827C':
                            return 1;
                        case '2B214BBA-32A2-4E0B-A7F1-90F75010FC28':
                            return 0;
                    }
                }
            })
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->logger;
        $logger
            ->expects($this->exactly(4))
            ->method('info')
            ->withConsecutive(
                ['DATASYNC_GUID_POPULATE. Total guids 9'],
                ['DATASYNC_GUID_POPULATE. Existing guids 3. To process guids 6'],
                ['DATASYNC_GUID_POPULATE. Progress 0 / 6'],
                ['DATASYNC_GUID_POPULATE. Progress 6 / 6']
            )
        ;
        $logger
            ->expects($this->exactly(4))
            ->method('notice')
            ->withConsecutive(
                ['DATASYNC_GUID_POPULATE. GUID BF2D0CD0-42C9-474D-96A5-0F8B377E827C. ID 7W6JBW. Not updated with guid'],
                ['DATASYNC_GUID_POPULATE. GUID 2B214BBA-32A2-4E0B-A7F1-90F75010FC28. ID FL29XY. Not updated with guid'],
                ['DATASYNC_GUID_POPULATE. GUID 2B214BBA-32A2-4E0B-A7F1-90F75010FC28. MLS NUMBERS DM2-2091, QBS11910. Not updated with guid'],
                ['DATASYNC_GUID_POPULATE. GUID 2B214BBA-32A2-4E0B-A7F1-90F75010FC28. No matches found']
            )
        ;

        $refl = new \ReflectionObject($this->dataSyncGuidPopulateCommand);
        $method = $refl->getMethod('execute');
        $method->setAccessible(true);

        $methodToTest = $method->getClosure($this->dataSyncGuidPopulateCommand);

        $methodToTest($this->getInput(), $this->getOutput());
    }

    private function getDataSyncCLient()
    {
        return $this
            ->getMockBuilder(DataSyncClient::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getConnection()
    {
        return $this
            ->getMockBuilder(Connection::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;
    }

    private function getInput()
    {
        return $this
            ->getMockBuilder(InputInterface::class)
            ->getMock()
        ;
    }

    private function getOutput()
    {
        return $this
            ->getMockBuilder(OutputInterface::class)
            ->getMock()
        ;
    }

    private function getQuery()
    {
        return $this
            ->getMockBuilder(Statement::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
