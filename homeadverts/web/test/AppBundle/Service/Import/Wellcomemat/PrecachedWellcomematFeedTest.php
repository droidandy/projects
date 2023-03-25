<?php

namespace Test\AppBundle\Elastic\Article\Import\Wellcomemat;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Service\Import\Wellcomemat\PrecachedWellcomematFeed;
use AppBundle\Service\Import\Wellcomemat\WellcomematFeedInterface;
use Doctrine\Common\Cache\CacheProvider;

class PrecachedWellcomematFeedTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var PrecachedWellcomematFeed
     */
    private $precachedWcFeed;
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var CacheProvider
     */
    private $cache;
    /**
     * @var WellcomematFeedInterface
     */
    private $wcFeed;

    protected function setUp()
    {
        $this->importContext = $importContext = $this->getImportContext();
        $this->importJob = $importJob = $this->getImportJob();
        $this->cache = $cache = $this->getCache();
        $this->wcFeed = $wcFeed = $this->getWcFeed();

        $this->precachedWcFeed = new PrecachedWellcomematFeed($importContext, $cache, $wcFeed);
    }

    public function testEnableDisable()
    {
        $enabled = false;
        /** @var \PHPUnit_Framework_MockObject_MockObject $wcFeed */
        $wcFeed = $this->wcFeed;
        $wcFeed
            ->method('isEnabled')
            ->willReturnCallback(function () use (&$enabled) {
                return $enabled;
            })
        ;
        $wcFeed
            ->method('enable')
            ->willReturnCallback(function () use (&$enabled) {
                $enabled = true;
            })
        ;
        $wcFeed
            ->method('disable')
            ->willReturnCallback(function () use (&$enabled) {
                $enabled = false;
            })
        ;

        $this->assertFalse($this->precachedWcFeed->isEnabled());

        $this->precachedWcFeed->enable();
        $this->assertTrue($this->precachedWcFeed->isEnabled());

        $this->precachedWcFeed->disable();
        $this->assertFalse($this->precachedWcFeed->isEnabled());
    }

    public function testPrecacheOnDisabled()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $wcFeed */
        $wcFeed = $this->wcFeed;
        $wcFeed
            ->method('isEnabled')
            ->willReturn(false)
        ;
        $wcFeed
            ->expects($this->never())
            ->method('getVideos')
        ;
    }

    public function testPrecacheOnEnabled()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $wcFeed */
        $wcFeed = $this->wcFeed;
        $wcFeed
            ->method('isEnabled')
            ->willReturn(true)
        ;
        $wcFeed
            ->expects($this->once())
            ->method('getVideos')
            ->willReturn([
                1, 2, 3,
            ])
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->method('getImportJob')
            ->willReturn($this->importJob)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $cache */
        $cache = $this->cache;
        $cache
            ->expects($this->once())
            ->method('save')
            ->with(
                'wellcomemat_videos_1',
                [
                    1, 2, 3,
                ]
            )
            ->willReturn(true)
        ;
        $cache
            ->expects($this->once())
            ->method('contains')
            ->with('wellcomemat_videos_1')
            ->willReturn(true)
        ;
        $cache
            ->expects($this->once())
            ->method('fetch')
            ->with('wellcomemat_videos_1')
        ;

        $this->precachedWcFeed->precacheVideos();
        $this->precachedWcFeed->getVideos();
    }

    public function testNonPrecachedGetVideosOnDisabled()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $wcFeed */
        $wcFeed = $this->wcFeed;
        $wcFeed
            ->method('isEnabled')
            ->willReturn(false)
        ;
        $wcFeed
            ->expects($this->never())
            ->method('getVideos')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->expects($this->never())
            ->method('getImportJob')
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $cache */
        $cache = $this->cache;
        $cache
            ->expects($this->never())
            ->method('contains')
        ;
        $cache
            ->expects($this->never())
            ->method('fetch')
        ;

        $this->precachedWcFeed->getVideos();
    }

    public function testNonPrecachedGetVideosOnEnabled()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $wcFeed */
        $wcFeed = $this->wcFeed;
        $wcFeed
            ->method('isEnabled')
            ->willReturn(true)
        ;
        $wcFeed
            ->expects($this->once())
            ->method('getVideos')
            ->willReturn([
                1, 2, 3,
            ])
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importContext */
        $importContext = $this->importContext;
        $importContext
            ->method('getImportJob')
            ->willReturn($this->importJob)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $cache */
        $cache = $this->cache;
        $cache
            ->method('contains')
            ->willReturnOnConsecutiveCalls(false, true, true)
        ;
        $cache
            ->expects($this->once())
            ->method('save')
            ->with(
                'wellcomemat_videos_1',
                [
                    1, 2, 3,
                ]
            )
        ;
        $cache
            ->method('fetch')
            ->willReturn([
                1, 2, 3,
            ])
        ;

        $this->assertEquals(
            [
                1, 2, 3,
            ],
            $this->precachedWcFeed->getVideos()
        );
        $this->assertEquals(
            [
                1, 2, 3,
            ],
            $this->precachedWcFeed->getVideos()
        );
        $this->assertEquals(
            [
                1, 2, 3,
            ],
            $this->precachedWcFeed->getVideos()
        );
    }

    public function getImportContext()
    {
        return $this
            ->getMockBuilder(ImportContext::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    public function getImportJob()
    {
        $importJob = $this
            ->getMockBuilder(ImportJob::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        $importJob
            ->method('getId')
            ->willReturn(1)
        ;

        return $importJob;
    }

    public function getCache()
    {
        return $this
            ->getMockBuilder(CacheProvider::class)
            ->getMock()
        ;
    }

    public function getWcFeed()
    {
        return $this
            ->getMockBuilder(WellcomematFeedInterface::class)
            ->getMock()
        ;
    }
}
