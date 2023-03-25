<?php

namespace Test\AppBundle\Service\Article\Processor;

use AppBundle\Helper\StringUtils;

class StringUtilsTest extends \PHPUnit_Framework_TestCase
{
    public function testRemoveMedias()
    {
        $stringUtils = new StringUtils();
        $originalText = '
            <figcaption>Amanvari Residence in Los Cabos. Photo Aman</figcaption>
            <p class="">As I walked along the winding pathways by a gentle&nbsp;estuary&nbsp;></p>
        ';

        $text = $stringUtils->removeMediaCaptions($originalText);
        $this->assertEquals(
            false,
            strpos($text, 'figcaption')
        );
    }

    public function testStripTags()
    {
        $stringUtils = new StringUtils();

        $originalText = <<<TEXT
            <p>My father’s family na<i>me being <a href="https://en.wikipedia.org/wiki/Pip_(Great_Expectations)">Pirrip</a>, and my Christian name Philip, 
            my super-duper infant tongue's could make of both names nothing </i>longer or more explicit than Pip. 
            So, I called myself Pip, and came to be called Pip.</p>
TEXT;
        $resultText = <<<TEXT
            My father’s family name being Pirrip, and my Christian name Philip, 
            my super-duper infant tongue's could make of both names nothing longer or more explicit than Pip. 
            So, I called myself Pip, and came to be called Pip.
TEXT;

        $this->assertEquals($resultText, $stringUtils->stripTags($originalText));
    }

    public function testRemoveNewLines()
    {
        $stringUtils = new StringUtils();

        $originalText = <<<TEXT
            My father’s family name being Pirrip, and my Christian name Philip, 
            my super-duper infant tongue's could make of both names nothing longer or more explicit than Pip. 
            So, I called myself Pip, and came to be called Pip.
TEXT;
        $resultText = <<<TEXT
            My father’s family name being Pirrip, and my Christian name Philip,             my super-duper infant tongue's could make of both names nothing longer or more explicit than Pip.             So, I called myself Pip, and came to be called Pip.
TEXT;

        $this->assertEquals($resultText, $stringUtils->removeNewlines($originalText));
    }

    public function testRemoveExtraSpaces()
    {
        $stringUtils = new StringUtils();

        $originalText = <<<TEXT
            My father’s family  name being Pirrip, and my Christian name Philip,             my super-duper infant tongue's could make of both names nothing longer or more explicit than Pip.             So, I called myself Pip, and came to be called Pip.
TEXT;

        $resultText = <<<TEXT
My father’s family name being Pirrip, and my Christian name Philip, my super-duper infant tongue's could make of both names nothing longer or more explicit than Pip. So, I called myself Pip, and came to be called Pip.
TEXT;

        $this->assertEquals($resultText, $stringUtils->removeExtraSpaces($originalText));
    }

    public function testExtractUncutPhrase()
    {
        $stringUtils = new StringUtils();

        $text = 'infant tongue\'s could make of both names nothing';
        $phrase = 'infant tongue\'s could make of both names nothing';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 48));

        $text = 'infant tongue\'s could make of both names nothing';
        $phrase = 'infant tongue\'s';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 15));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 16));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 19));

        $text = 'infant tongue could make of both names nothing';
        $phrase = 'infant tongue';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 13));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 14));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 17));

        $text = 'infant ton-gue could make of both names nothing';
        $phrase = 'infant ton-gue';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 14));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 15));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 18));

        $text = 'infant ton-gue could make of both names nothing';
        $phrase = 'infant';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 11));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 12));

        $text = 'infant tongue5';
        $phrase = 'infant';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 13));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 11));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 7));
    }

    public function testExtractUncutPhraseEndsWithDelimiter()
    {
        $stringUtils = new StringUtils();

        $text = 'infant tongue ';
        $phrase = 'infant tongue';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 13));

        $text = 'infant tongue,';
        $phrase = 'infant tongue';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 13));
    }

    public function testExtractUncutPhraseWithoutAddedEnding()
    {
        $stringUtils = new StringUtils();

        $text = 'infant tongue!';
        $phrase = 'infant tongue!';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 14));
        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 100));

        $text = 'infant tongue!';
        $phrase = 'infant tongue';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 13));

        $text = 'infant tongue.';
        $phrase = 'infant tongue';

        $this->assertEquals($phrase, $stringUtils->extractUncutPhrase($text, 13));
    }

    public function testExtractImgSrcs()
    {
        $text = <<<TEXT
I drew a childish c<img src="https://cdn.homeadverts.dev/media/c4/5369e2c27b4f11253387d5da0db125870747c9e65b20fd6820cf502d5d4591.jpg"/>                I give Pirrip as my father’s family name, on the authority of his tombstone and my sister,—Mrs. Joe Gargery, who married the blacksmith. 
                As I never saw my father or my mother, and never saw any likeness of either of them (for their days were long before the days of photographs), 
                my first fancies regarding what they were like were unreasonably derived from their tombstones. 
                The shape of the letters on my father’s, gave me an odd idea that he was a square, stout<img src="https://cdn.homeadverts.dev/media/6e/7b1cfc931b6c17b8697bd7a8784f14aacf084e3fc2b3279154aced89afbc36.jpg"/>
TEXT;

        $stringUtils = new StringUtils();
        $srcs = $stringUtils->extractImgSrcs($text);
        $this->assertEquals(2, count($srcs));
        $this->assertEquals(
            [
                'https://cdn.homeadverts.dev/media/c4/5369e2c27b4f11253387d5da0db125870747c9e65b20fd6820cf502d5d4591.jpg',
                'https://cdn.homeadverts.dev/media/6e/7b1cfc931b6c17b8697bd7a8784f14aacf084e3fc2b3279154aced89afbc36.jpg',
            ],
            $srcs
        );
    }
}
