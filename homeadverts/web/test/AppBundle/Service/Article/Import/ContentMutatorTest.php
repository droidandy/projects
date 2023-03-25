<?php

namespace Test\AppBundle\Service\Article\Import;

use AppBundle\Service\Article\Import\ContentMutator;
use Test\AppBundle\AbstractTestCase;

class ContentMutatorTest extends AbstractTestCase
{
    public function testReplaceProgressiveImages()
    {
        $contentMutator = new ContentMutator();

        $fixtureFile = $this->getFixturePath('/import/mutator/progressiveImages.html');

        $contents = $contentMutator->replaceProgressiveImages(
            file_get_contents($fixtureFile)
        );

        $this->assertEquals(
            80,
            strpos($contents, '<img class')
        );
        $this->assertEquals(
            457,
            strpos($contents, '</img')
        );
    }

    public function testReplaceImageAttributes()
    {
        $contentMutator = new ContentMutator();

        $fixtureFile = $this->getFixturePath('/import/mutator/imageAttributes.html');

        $contents = $contentMutator->updateLazyloadImages(
            file_get_contents($fixtureFile)
        );

        $this->assertGreaterThan(
            0,
            strpos($contents, 'src="https://pacificsothebysrealtyblog.com/wp-content/uploads/2018/07/noriastable-0.jpeg"')
        );
        $this->assertGreaterThan(
            0,
            strpos($contents, 'src="https://pacificsothebysrealtyblog.com/wp-content/uploads/2018/07/noriastable-1.jpeg"')
        );
        $this->assertGreaterThan(
            0,
            strpos($contents, 'src="https://pacificsothebysrealtyblog.com/wp-content/uploads/2018/07/noriastable-2.jpeg"')
        );
    }
}
