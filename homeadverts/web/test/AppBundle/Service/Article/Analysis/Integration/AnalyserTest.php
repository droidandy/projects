<?php

namespace Test\AppBundle\Service\Article\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;

class TextAnalyserTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;

    public function testAnalyze()
    {
        $this->markTestSkipped('because there are collisions with other trait methods on Google\Cloud\Language\LanguageClient');
        $text = file_get_contents($this->getFixturePath('/article/file4.html'));
        $article = $this->newArticlePersistent([
            'body' => $text,
        ]);

        $meta = $this->getContainer()->get('ha_article.analyser')->analyze($article);

        $this->assertGreaterThan(0, count($meta['tags']));
    }
}
