<?php

namespace Test\AppBundle\Import_\Media;

use AppBundle\Import\Media\AWSImageRemover;
use Aws\S3\S3Client;
use Psr\Log\LoggerInterface;

class AWSImageRemoverTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $client;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $logger;
    /**
     * @var AWSImageRemover
     */
    private $awsImageRemover;

    protected function setUp()
    {
        $this->client = $this->getClient();
        $this->logger = $this->getLogger();
        $this->awsImageRemover = $this->getAWSImageRemover($this->client, $this->logger);
    }

    public function testRemoveWithFirstTry()
    {
        $images = [
            'https://bucket1.s3.amazonaws.com/path_to_photo1',
            'https://bucket1.s3.amazonaws.com/path_to_photo2',
            'https://bucket1.s3.amazonaws.com/path_to_photo3',
        ];
        $this
            ->logger
            ->expects($this->exactly(9))
            ->method('debug')
            ->withConsecutive(
                ['Image path_to_photo1 removal succeeded'],
                ['Image list_thumb_adv/path_to_photo1 removal succeeded'],
                ['Image gallery_thumb_adv/path_to_photo1 removal succeeded'],
                ['Image path_to_photo2 removal succeeded'],
                ['Image list_thumb_adv/path_to_photo2 removal succeeded'],
                ['Image gallery_thumb_adv/path_to_photo2 removal succeeded'],
                ['Image path_to_photo3 removal succeeded'],
                ['Image list_thumb_adv/path_to_photo3 removal succeeded'],
                ['Image gallery_thumb_adv/path_to_photo3 removal succeeded']
            )
        ;
        $this
            ->client
            ->expects($this->once())
            ->method('deleteObjects')
            ->with([
                'Bucket' => 'bucket1',
                'Delete' => [
                    'Objects' => [
                        ['Key' => 'path_to_photo1'],
                        ['Key' => 'list_thumb_adv/path_to_photo1'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                        ['Key' => 'path_to_photo2'],
                        ['Key' => 'list_thumb_adv/path_to_photo2'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo2'],
                        ['Key' => 'path_to_photo3'],
                        ['Key' => 'list_thumb_adv/path_to_photo3'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo3'],
                    ],
                ],
            ])
            ->willReturn([
                'Deleted' => [
                    ['Key' => 'path_to_photo1'],
                    ['Key' => 'list_thumb_adv/path_to_photo1'],
                    ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                    ['Key' => 'path_to_photo2'],
                    ['Key' => 'list_thumb_adv/path_to_photo2'],
                    ['Key' => 'gallery_thumb_adv/path_to_photo2'],
                    ['Key' => 'path_to_photo3'],
                    ['Key' => 'list_thumb_adv/path_to_photo3'],
                    ['Key' => 'gallery_thumb_adv/path_to_photo3'],
                ],
            ])
        ;

        $this->awsImageRemover->removeFromStorage($images);
    }

    public function testRemoveWithRetries()
    {
        $images = [
            'https://bucket1.s3.amazonaws.com/path_to_photo1',
            'https://bucket1.s3.amazonaws.com/path_to_photo2',
            'https://bucket1.s3.amazonaws.com/path_to_photo3',
        ];
        $this
            ->logger
            ->expects($this->exactly(9))
            ->method('debug')
            ->withConsecutive(
                ['Image path_to_photo2 removal succeeded'],
                ['Image list_thumb_adv/path_to_photo2 removal succeeded'],
                ['Image gallery_thumb_adv/path_to_photo2 removal succeeded'],
                ['Image path_to_photo3 removal succeeded'],
                ['Image list_thumb_adv/path_to_photo3 removal succeeded'],
                ['Image gallery_thumb_adv/path_to_photo3 removal succeeded'],
                ['Image list_thumb_adv/path_to_photo1 removal succeeded'],
                ['Image gallery_thumb_adv/path_to_photo1 removal succeeded'],
                ['Image path_to_photo1 removal succeeded']
            )
        ;
        $this
            ->client
            ->expects($this->exactly(3))
            ->method('deleteObjects')
            ->withConsecutive(
                [
                    [
                        'Bucket' => 'bucket1',
                        'Delete' => [
                            'Objects' => [
                                ['Key' => 'path_to_photo1'],
                                ['Key' => 'list_thumb_adv/path_to_photo1'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                                ['Key' => 'path_to_photo2'],
                                ['Key' => 'list_thumb_adv/path_to_photo2'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo2'],
                                ['Key' => 'path_to_photo3'],
                                ['Key' => 'list_thumb_adv/path_to_photo3'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo3'],
                            ],
                        ],
                    ],
                ],
                [
                    [
                        'Bucket' => 'bucket1',
                        'Delete' => [
                            'Objects' => [
                                ['Key' => 'path_to_photo1'],
                                ['Key' => 'list_thumb_adv/path_to_photo1'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                            ],
                        ],
                    ],
                ],
                [
                    [
                        'Bucket' => 'bucket1',
                        'Delete' => [
                            'Objects' => [
                                ['Key' => 'path_to_photo1'],
                            ],
                        ],
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                [
                    'Deleted' => [
                        ['Key' => 'path_to_photo2'],
                        ['Key' => 'list_thumb_adv/path_to_photo2'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo2'],
                        ['Key' => 'path_to_photo3'],
                        ['Key' => 'list_thumb_adv/path_to_photo3'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo3'],
                    ],
                    'Errors' => [
                        ['Key' => 'path_to_photo1'],
                        ['Key' => 'list_thumb_adv/path_to_photo1'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                    ],
                ],
                [
                    'Deleted' => [
                        ['Key' => 'list_thumb_adv/path_to_photo1'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                    ],
                    'Errors' => [
                        ['Key' => 'path_to_photo1'],
                    ],
                ],
                [
                    'Deleted' => [
                        ['Key' => 'path_to_photo1'],
                    ],
                ]
            )
        ;

        $this->awsImageRemover->removeFromStorage($images);
    }

    public function testRemoveWithRetriesNoSuccess()
    {
        $images = [
            'https://bucket1.s3.amazonaws.com/path_to_photo1',
            'https://bucket1.s3.amazonaws.com/path_to_photo2',
            'https://bucket1.s3.amazonaws.com/path_to_photo3',
        ];
        $this
            ->logger
            ->expects($this->exactly(9))
            ->method('debug')
            ->withConsecutive(
                ['Image list_thumb_adv/path_to_photo2 removal succeeded'],
                ['Image gallery_thumb_adv/path_to_photo2 removal succeeded'],
                ['Image path_to_photo3 removal succeeded'],
                ['Image list_thumb_adv/path_to_photo3 removal succeeded'],
                ['Image gallery_thumb_adv/path_to_photo3 removal succeeded'],
                ['Image path_to_photo2 removal succeeded'],

                ['Image path_to_photo1 removal failed. "404 : Missing"'],
                ['Image list_thumb_adv/path_to_photo1 removal failed. "404 : Missing"'],
                ['Image gallery_thumb_adv/path_to_photo1 removal failed. "404 : Missing"']
            )
        ;
        $this
            ->client
            ->expects($this->exactly(3))
            ->method('deleteObjects')
            ->withConsecutive(
                [
                    [
                        'Bucket' => 'bucket1',
                        'Delete' => [
                            'Objects' => [
                                ['Key' => 'path_to_photo1'],
                                ['Key' => 'list_thumb_adv/path_to_photo1'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                                ['Key' => 'path_to_photo2'],
                                ['Key' => 'list_thumb_adv/path_to_photo2'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo2'],
                                ['Key' => 'path_to_photo3'],
                                ['Key' => 'list_thumb_adv/path_to_photo3'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo3'],
                            ],
                        ],
                    ],
                ],
                [
                    [
                        'Bucket' => 'bucket1',
                        'Delete' => [
                            'Objects' => [
                                ['Key' => 'path_to_photo1'],
                                ['Key' => 'list_thumb_adv/path_to_photo1'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                                ['Key' => 'path_to_photo2'],
                            ],
                        ],
                    ],
                ],
                [
                    [
                        'Bucket' => 'bucket1',
                        'Delete' => [
                            'Objects' => [
                                ['Key' => 'path_to_photo1'],
                                ['Key' => 'list_thumb_adv/path_to_photo1'],
                                ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                                ['Key' => 'path_to_photo2'],
                            ],
                        ],
                    ],
                ]
            )
            ->willReturnOnConsecutiveCalls(
                [
                    'Deleted' => [
                        ['Key' => 'list_thumb_adv/path_to_photo2'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo2'],
                        ['Key' => 'path_to_photo3'],
                        ['Key' => 'list_thumb_adv/path_to_photo3'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo3'],
                    ],
                    'Errors' => [
                        ['Key' => 'path_to_photo1'],
                        ['Key' => 'list_thumb_adv/path_to_photo1'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                        ['Key' => 'path_to_photo2'],
                    ],
                ],
                [
                    'Deleted' => null,
                    'Errors' => [
                        ['Key' => 'path_to_photo1'],
                        ['Key' => 'list_thumb_adv/path_to_photo1'],
                        ['Key' => 'gallery_thumb_adv/path_to_photo1'],
                        ['Key' => 'path_to_photo2'],
                    ],
                ],
                [
                    'Deleted' => [
                        ['Key' => 'path_to_photo2'],
                    ],
                    'Errors' => [
                        [
                            'Key' => 'path_to_photo1',
                            'Code' => 404,
                            'Message' => 'Missing',
                        ],
                        [
                            'Key' => 'list_thumb_adv/path_to_photo1',
                            'Code' => 404,
                            'Message' => 'Missing',
                        ],
                        [
                            'Key' => 'gallery_thumb_adv/path_to_photo1',
                            'Code' => 404,
                            'Message' => 'Missing',
                        ],
                    ],
                ]
            )
        ;

        $this->awsImageRemover->removeFromStorage($images);
    }

    private function getClient()
    {
        return $this
            ->getMockBuilder(S3Client::class)
            ->disableOriginalConstructor()
            ->setMethods(['deleteObjects'])
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

    private function getAWSImageRemover($client, $logger)
    {
        return new AWSImageRemover(
            $client,
            ['list_thumb_adv', 'gallery_thumb_adv'],
            'bucket1',
            $logger
        );
    }
}
