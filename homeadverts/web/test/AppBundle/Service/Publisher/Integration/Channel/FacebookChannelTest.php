<?php

namespace Test\AppBundle\Service\Article\Publisher\Integration\Channel;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;
use Exception;
use VCR\VCR;
use AppBundle\Service\Article\Publisher\Publisher;
use AppBundle\Service\Article\Publisher\Channel\FacebookChannel;

class FacebookChannelTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;

    /**
     * @var FacebookChannel
     */
    private $channel;

    protected function setUp()
    {
        parent::setUp();

        $this->channel = $this->getContainer()->get('ha.publisher.channel.facebook');

        VCR::configure()->setCassettePath('test/fixtures/vcr/social');
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
            Publisher::CHANNEL_FACEBOOK,
            $this->channel->getName()
        );
    }

    /**
     * @throws Exception
     */
    public function testGetBody()
    {
        $article = $this->newSocialArticle();
        $body = $this->channel->getBody($article);

        $this->assertEquals(
            'http://dev.homeadverts.com/story/00000',
            $body['link']
        );
        $this->assertEquals(
            'Hello World',
            $article->getTitle()
        );
    }

    /**
     * @throws Exception
     */
    public function testPostUpdateSuccess()
    {
        $this->markTestSkipped('facebook disallowed publishing to users profile by API');
        VCR::insertCassette('facebook-success.yml');

        $article = $this->newSocialArticle();
        $article->getAuthor()->setFacebookAccessToken('EAAIVsJIBgb8BADk1uqcY0yQO8Bsd9EWbaBlpF5RlzVGTsjwAgVDW9izn3aukHAsGtAQSijQ5y8vsJrpK9jIe3ZBOZCshmw9A6fltZARXcZAWEf2Ojlx4DOhTZBdxqsYatRGxiy6etRqECeKJiR8j70drzDxoUj92OARK97QkZChQZDZD');

        $result = $this->channel->post($article);

        $this->assertTrue($result->isPositive());
        $this->assertEquals(
            '1142479689150338_1680009335397368',
            $result->getResponse()['id']
        );
    }

    /**
     * @throws Exception
     */
    public function testPostUpdateTokenWrong()
    {
        VCR::insertCassette('facebook-fail.yml');

        $article = $this->newSocialArticle();
        $article->getAuthor()->setFacebookAccessToken('EAAIVsJIBgb8BAH5K7t1SXmyZAKdQnYEMn5EWBZChdMUr8ZBU6l0W3mayyasyoFCOkW7AHmIGYmk6tvTVbfW0bjyJ3WOgZBDd6qwjjTelWIq1DbfRBcqflwsrH6HC56SGZADga8zEFsb8MXv1wF4KFVNBUvT4zGVkYkbOCYdJj1QQZDZD');

        $result = $this->channel->post($article);

        $this->assertFalse($result->isPositive());
        $this->assertEquals(
            'Undefined offset: 1',
            $result->getResponse()[0]
        );
    }
}
