<?php

namespace Test\AppBundle\Service\Article\Publisher\Integration\Channel;

use AppBundle\Service\Article\Publisher\Channel\LinkedInChannel;
use AppBundle\Service\Article\Publisher\Publisher;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;
use VCR\VCR;

class LinkedInChannelTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;

    /**
     * @var LinkedInChannel
     */
    private $channel;

    protected function setUp()
    {
        parent::setUp();

        $this->channel = $this->getContainer()->get('ha.publisher.channel.linkedin');

        VCR::configure()->setCassettePath('test/fixtures/vcr/social');
        VCR::turnOn();
    }

    protected function tearDown()
    {
        parent::tearDown();

        unset($this->channel);
        VCR::turnOff();
    }

    public function testGetBody()
    {
        $article = $this->newSocialArticle();

        $body = $this->channel->getBody($article);
        $text = <<<EOT
Hello World
...
http://dev.homeadverts.com/story/00000
EOT;

        $this->assertEquals(
            $text,
            $body
        );
    }

    public function testChannelGetName()
    {
        $this->assertEquals(
            Publisher::CHANNEL_LINKEDIN,
            $this->channel->getName()
        );
    }

    public function testPostUpdateSuccess()
    {
        VCR::insertCassette('linkedin-success.yml');

        $article = $this->newSocialArticle();
        $article->getAuthor()->setLinkedinAccessToken('AQWwZeQ3xBhCUvite01ZmOdBY8har1D2L2I4VdipvvwSxID6gTJoNeQSKBEijy6RgqB4g-ZqkX5HH6oR6tv-2wdR97a6FHo5OQ6pJL2fFgZNCT2xLhkCx1T6vpr6kMx8iNUZmABOSqlzTRvlQnn2KsNPDUSMuWeUXiXXhZHttfDisdCCf0qF1Suyxn88-4jgksKu2_jbDW977lN5h6uUIwyfKsLhpqHx9UC-x73yeRPBn5VRL8yTj8iiEFIo8r3kLhaCXgkpNdjem0702YEOqpWMds5S3EX4r0OiU2TWZm29K9u6DzKz_YAwVNDoVF15EsGmIucRcGUVdvbjjghgZWhcWk9ahA');

        $result = $this->channel->post($article);

        $this->assertTrue($result->isPositive());
        $this->assertEquals(
            'UPDATE-110979522-6490327644004065280',
            $result->getResponse()['updateKey']
        );
        $this->assertEquals(
            'www.linkedin.com/updates?category=6490327644004065280',
            $result->getResponse()['updateUrl']
        );
    }

    public function testPostUpdateFailExpiredToken()
    {
        VCR::insertCassette('linkedin-fail.yml');

        $article = $this->newSocialArticle();
        $article->getAuthor()->setLinkedinAccessToken('AQUa64oa9KiIdmHzd_foIfLW6Of9zw4anc-ZaZop5W_VJQc0SdXZauzHbDM45lAd2-awp34MMkI07_E4ytzoSAUaBUF2HRvVXnlISQQd9qVqJcbC6pYun3pQbKdS95Cf3ps1hLUt1d1GyuQ8gdb-B_IlNaVk9sj-jkihe81I-ok3xv562yBP0uPYEHYbaP1ukEHaC2ngu6Z8cFyQ1CAT5of7XlgP-9SltryApFsScCy3qGM-42lfUVbo6CxwpGIQTVJjRJ5o7DOgpwihKx3wHzPcW5Q47av8fETVMwUAp4pa4sbsWaOTeKValiqtKnyg4ubYb7BKLoE6ppNbLN9nnbkgJQY5IA');

        $result = $this->channel->post($article);

        $this->assertFalse($result->isPositive());
        $this->assertEquals(
            'The token used in the request has expired.',
            $result->getResponse()['message']
        );
    }

    public function testPostUpdateFail()
    {
        VCR::insertCassette('linkedin-fail.yml');

        $article = $this->newSocialArticle();
        $article->getAuthor()->setLinkedinAccessToken('AQV18xakRLl0ffcjHf7LP_EXYZEyPTy_7-NPT1HVB5rK0PS3u9Kdv2_luRQ30-GjK6KSKBQCrxrqLIIzDAKcpILpISe2kFM8pJ-PcETL9ESuYlDTTpirFLZIbMws575hkuSm2saeke7gOuHprTJX3KtzURCqWqOaZBS0DJ2wZ7DJqjJUO_1ft5K1Cf1hjdTxcKhlRa1jVQRhsvzQFCsY8ByiEDf56gbZMBxNRSqGZZVOMumLN2ZfF2M9N9usmcMSY0GRx6JqlC7zrdEeBXSkFC0kDkX5ElVtnalc3-qEbrlVIGJFNvbcKnNAcUAsnbp807F_OR2MAXEP5WjNEjuFluMD5Gpjo8A');

        $result = $this->channel->post($article);

        $this->assertFalse($result->isPositive());
        $this->assertEquals(
            'Invalid access token.',
            $result->getResponse()['message']
        );
    }
}
