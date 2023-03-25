<?php

namespace Test\AppBundle\Service\Article\Publisher\Integration\Channel;

use AppBundle\Service\Article\Publisher\Channel\TwitterChannel;
use AppBundle\Service\Article\Publisher\Publisher;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;
use VCR\VCR;

class TwitterChannelTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;

    /**
     * @var TwitterChannel
     */
    private $channel;

    protected function setUp()
    {
        parent::setUp();

        $this->channel = $this->getContainer()->get('ha.publisher.channel.twitter');

        VCR::configure()
            ->setCassettePath('test/fixtures/vcr/social')
            ->enableRequestMatchers(array('method', 'url', 'host', 'body'));
        // On each API request Twitter generates new signature stored in Authorization header.
        // Therefore we skip headers matching.

        VCR::turnOn();
    }

    protected function tearDown()
    {
        parent::tearDown();

        unset($this->channel);
        VCR::turnOff();
    }

    public function testChannelGetName()
    {
        $this->assertEquals(
            Publisher::CHANNEL_TWITTER,
            $this->channel->getName()
        );
    }

    public function testGetBody()
    {
        $article = $this->newSocialArticle();

        $body = $this->channel->getBody($article);
        $text = <<<EOT
Hello World
http://dev.homeadverts.com/story/00000
EOT;

        $this->assertEquals(
            $text,
            $body
        );
    }

    public function testPostUpdateSuccess()
    {
        VCR::insertCassette('twitter-success.yml');

        $article = $this->newSocialArticle();
        $article->getAuthor()->setTwitterAccessToken('2734027794-6dHCDhNn4ubTifdJTwT3uQkaxVlhUioXkEyXbBM');
        $article->getAuthor()->setTwitterTokenSecret('zaR05xSyBGXMitJKQY68VrcfoyXSfyytG2qg227v6Fyx5');

        $result = $this->channel->post($article);

        $this->assertTrue($result->isPositive());
        $this->assertEquals(
            'Sun Jan 13 20:52:37 +0000 2019',
            $result->getResponse()['created_at']
        );
    }

    public function testPostUpdateFailStatusDuplicate()
    {
        VCR::insertCassette('twitter-fail-duplicate.yml');

        $article = $this->newSocialArticle();
        $article->getAuthor()->setTwitterAccessToken('2734027794-6dHCDhNn4ubTifdJTwT3uQkaxVlhUioXkEyXbBM');
        $article->getAuthor()->setTwitterTokenSecret('zaR05xSyBGXMitJKQY68VrcfoyXSfyytG2qg227v6Fyx5');

        $result = $this->channel->post($article);

        $this->assertFalse($result->isPositive());
        $this->assertEquals(
            'Status is a duplicate.',
            $result->getResponse()['errors'][0]->message
        );
    }

    public function testPostUpdateFailBadAuth()
    {
        VCR::insertCassette('twitter-fail-auth.yml');

        $article = $this->newSocialArticle();
        $article->getAuthor()->setTwitterAccessToken('2734027794-6dHCDhNn4ubTifdJTwT3uQkaxVlhUio1XkEyXbBM');
        $article->getAuthor()->setTwitterTokenSecret('zaR05xSyBGXMitJKQY68VrcfoyXSfyytG2qg227v6Fyx5');

        $result = $this->channel->post($article);

        $this->assertFalse($result->isPositive());
        $this->assertEquals(
            'Bad Authentication data.',
            $result->getResponse()['errors'][0]->message
        );
    }
}
