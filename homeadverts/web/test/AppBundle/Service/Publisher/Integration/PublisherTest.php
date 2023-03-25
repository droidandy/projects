<?php

namespace Test\AppBundle\Service\Article\Publisher\Integration;

use AppBundle\Service\Article\Publisher\Publisher;
use VCR\VCR;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;

class PublisherTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;

    protected function setUp()
    {
        parent::setUp();

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

        VCR::turnOff();
    }

    public function testPublishChannelsEnabled()
    {
        VCR::insertCassette('publisher-fail.yml');

        $article = $this->newSocialArticle();

        // Preparing data
        $user = $article->getAuthor();
        $user->setTwitterAccessToken('_2734027794-6dHCDhNn4ubTifdJTwT3uQkaxVlhUio1XkEyXbBM');
        $user->setTwitterTokenSecret('_zaR05xSyBGXMitJKQY68VrcfoyXSfyytG2qg227v6Fyx5');
        $user->setLinkedinAccessToken('_AQV8xakRLl0ffcjHf7LP_EXYZEyPTy_7-NPT1HVB5rK0PS3u9Kdv2_luRQ30-GjK6KSKBQCrxrqLIIzDAKcpILpISe2kFM8pJ-PcETL9ESuYlDTTpirFLZIbMws575hkuSm2saeke7gOuHprTJX3KtzURCqWqOaZBS0DJ2wZ7DJqjJUO_1ft5K1Cf1hjdTxcKhlRa1jVQRhsvzQFCsY8ByiEDf56gbZMBxNRSqGZZVOMumLN2ZfF2M9N9usmcMSY0GRx6JqlC7zrdEeBXSkFC0kDkX5ElVtnalc3-qEbrlVIGJFNvbcKnNAcUAsnbp807F_OR2MAXEP5WjNEjuFluMD5Gpjo8A');
        $user->setFacebookAccessToken('_EAAIVsJIBgb8BAH5K7tSXmyZAKdQnYEMn5EWBZChdMUr8ZBU6l0W3mayyasyoFCOkW7AHmIGYmk6tvTVbfW0bjyJ3WOgZBDd6qwjjTelWIq1DbfRBcqflwsrH6HC56SGZADga8zEFsb8MXv1wF4KFVNBUvT4zGVkYkbOCYdJj1QQZDZD');
        $user->setSettings([
            $user->getAutoshareKey('facebook') => true,
            $user->getAutoshareKey('twitter') => true,
            $user->getAutoshareKey('linkedin') => true,
        ]);

        $article->copyChannelsStateFromUser();

        // Actual posting
        $this->getContainer()->get('ha.article.publisher')->publish($article);

        // Validating
        $facebook = $article->getChannelPostingResult(Publisher::CHANNEL_FACEBOOK);
        $twitter = $article->getChannelPostingResult(Publisher::CHANNEL_TWITTER);
        $linkedin = $article->getChannelPostingResult(Publisher::CHANNEL_LINKEDIN);

        $this->assertFalse($facebook->isPositive());
        $this->assertEquals(
            'Undefined offset: 1',
            $facebook->getResponse()[0]
        );

        $this->assertFalse($twitter->isPositive());
        $this->assertEquals(
            'Bad Authentication data.',
            $twitter->getResponse()['errors'][0]->message
        );

        $this->assertFalse($linkedin->isPositive());
        $this->assertEquals(
            'Invalid access token.',
            $linkedin->getResponse()['message']
        );
    }

    public function testPublishChannelsDisabled()
    {
        // Preparing data
        $article = $this->newSocialArticle();
        $user = $article->getAuthor();
        $user->setTwitterAccessToken('_2734027794-6dHCDhNn4ubTifdJTwT3uQkaxVlhUio1XkEyXbBM');
        $user->setTwitterTokenSecret('_zaR05xSyBGXMitJKQY68VrcfoyXSfyytG2qg227v6Fyx5');
        $user->setLinkedinAccessToken('_AQV8xakRLl0ffcjHf7LP_EXYZEyPTy_7-NPT1HVB5rK0PS3u9Kdv2_luRQ30-GjK6KSKBQCrxrqLIIzDAKcpILpISe2kFM8pJ-PcETL9ESuYlDTTpirFLZIbMws575hkuSm2saeke7gOuHprTJX3KtzURCqWqOaZBS0DJ2wZ7DJqjJUO_1ft5K1Cf1hjdTxcKhlRa1jVQRhsvzQFCsY8ByiEDf56gbZMBxNRSqGZZVOMumLN2ZfF2M9N9usmcMSY0GRx6JqlC7zrdEeBXSkFC0kDkX5ElVtnalc3-qEbrlVIGJFNvbcKnNAcUAsnbp807F_OR2MAXEP5WjNEjuFluMD5Gpjo8A');
        $user->setFacebookAccessToken('_EAAIVsJIBgb8BAH5K7tSXmyZAKdQnYEMn5EWBZChdMUr8ZBU6l0W3mayyasyoFCOkW7AHmIGYmk6tvTVbfW0bjyJ3WOgZBDd6qwjjTelWIq1DbfRBcqflwsrH6HC56SGZADga8zEFsb8MXv1wF4KFVNBUvT4zGVkYkbOCYdJj1QQZDZD');

        $user->setSettings([
            $user->getAutoshareKey('facebook') => false,
            $user->getAutoshareKey('twitter') => false,
            $user->getAutoshareKey('linkedin') => false,
        ]);
        $article->copyChannelsStateFromUser();

        // Actual posting: no external requests should be issued
        $this->getContainer()->get('ha.article.publisher')->publish($article);

        // Validating
        $facebook = $article->getChannelPostingResult(Publisher::CHANNEL_FACEBOOK);
        $twitter = $article->getChannelPostingResult(Publisher::CHANNEL_TWITTER);
        $linkedin = $article->getChannelPostingResult(Publisher::CHANNEL_LINKEDIN);

        $this->assertFalse($facebook->isPositive());
        $this->assertEquals([], $facebook->getResponse());

        $this->assertFalse($twitter->isPositive());
        $this->assertEquals([], $twitter->getResponse());

        $this->assertFalse($linkedin->isPositive());
        $this->assertEquals([], $linkedin->getResponse());
    }
}
