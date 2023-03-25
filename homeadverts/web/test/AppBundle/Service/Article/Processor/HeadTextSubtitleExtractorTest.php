<?php

namespace Test\AppBundle\Service\Article\Processor;

use AppBundle\Service\Article\Processor\HeadTextSubtitleExtractor;
use Test\AppBundle\AbstractFrameworkTestCase;

class HeadTextSubtitleExtractorTest extends AbstractFrameworkTestCase
{
    public function testExtractSubtitleA()
    {
        $title = 'My father’s family name being Pirrip, and my Christian name Philip, my super-duper infant tongue\'s';
        $text = file_get_contents($this->getFixture('/article/file1.html'));

        $extractor = new HeadTextSubtitleExtractor();

        $this->assertEquals($title, $extractor->extractSubtitle($text));
        $this->assertEquals($title, $extractor->extractSubtitle($text, 101));
        $this->assertEquals($title, $extractor->extractSubtitle($text, 103));
    }

    public function testExtractSubtitleB()
    {
        $title = 'Hawk launched the 56m Cape Hawk and the 75m Sky Hawk at the Boot Dusseldorf, both of which';
        $text = file_get_contents($this->getFixture('/article/file2.html'));

        $extractor = new HeadTextSubtitleExtractor();

        $this->assertEquals($title, $extractor->extractSubtitle($text));
    }

    public function testExtractIntro()
    {
        $text = file_get_contents($this->getFixture('/article/file3.html'));

        $extractor = new HeadTextSubtitleExtractor();

        $this->assertEquals(297, strlen($extractor->extractIntro($text, 300)));
    }
}
