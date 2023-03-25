<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Service\Geo\LocaleHelper;
use AppBundle\Import\Adapter\Sothebys\DataSync\Normalizer\PropertyNormalizer;
use AppBundle\Import\Wellcomemat\WellcomematFeed;
use Psr\Log\LoggerInterface;
use Test\AppBundle\AbstractFrameworkTestCase;
use Test\Utils\Traits\DataSyncTrait;

class DataSyncPropertyNormalizerTest extends AbstractFrameworkTestCase
{
    use DataSyncTrait;
    /**
     * @var WellcomematFeed
     */
    private $wellcomematFeed;
    /**
     * @var LocaleHelper
     */
    private $localeHelper;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var PropertyNormalizer
     */
    private $dataSyncPropertyNormalizer;

    protected function setUp()
    {
        $this->wellcomematFeed = $this->getWellcomematFeed();
        $this->localeHelper = $this->getLocaleHelper();
        $this
            ->localeHelper
            ->method('acresToSquareMetres')
            ->willReturn(1000)
        ;
        $this
            ->localeHelper
            ->method('squareFeetToSquareMetres')
            ->willReturn(100)
        ;
        $this
            ->localeHelper
            ->method('hectaresToSquareMetres')
            ->willReturn(1000000)
        ;
        $this->logger = $this->getLogger();

        $this->dataSyncPropertyNormalizer = new PropertyNormalizer(
            $this->wellcomematFeed,
            $this->localeHelper,
            $this->logger
        );
    }

    public function testNormalizeOrdinaryProperty()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $wellcomematFeed */
        $wellcomematFeed = $this->wellcomematFeed;
        $wellcomematFeed
            ->expects($this->once())
            ->method('getVideos')
            ->willReturn([
                '7W6JBW' => [
                    [
                        'hash' => 'abc',
                        'created' => '2018-08-31T05:05:22.000+03:00',
                    ],
                ],
                '8W6JBW' => [
                    [
                        'hash' => 'def',
                        'created' => '2018-08-31T05:05:22.000+03:00',
                    ],
                ],
            ])
        ;

        $normalizedPoperty = $this->dataSyncPropertyNormalizer->normalize($this->getProperty());
        $this->assertEquals(
            $this->getNormalisedProperty(),
            $normalizedPoperty
        );
    }

    public function testNormalizeProperty3d()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $wellcomematFeed */
        $wellcomematFeed = $this->wellcomematFeed;
        $wellcomematFeed
            ->expects($this->once())
            ->method('getVideos')
            ->willReturn([
                '7W6JBW' => [
                    [
                        'hash' => 'abc',
                        'created' => '2018-08-31T05:05:22.000+03:00',
                    ],
                ],
                '8W6JBW' => [
                    [
                        'hash' => 'def',
                        'created' => '2018-08-31T05:05:22.000+03:00',
                    ],
                ],
            ])
        ;

        $normalizedPoperty = $this->dataSyncPropertyNormalizer->normalize($this->getProperty3d());
        $this->assertEquals(
            $this->getNormalisedProperty3d(),
            $normalizedPoperty
        );
    }

    private function getWellcomematFeed()
    {
        return $this
            ->getMockBuilder(WellcomematFeed::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getLocaleHelper()
    {
        return $this
            ->getMockBuilder(LocaleHelper::class)
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
}
