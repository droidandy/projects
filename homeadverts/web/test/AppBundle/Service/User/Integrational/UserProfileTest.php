<?php

namespace Test\AppBundle\Service\User\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\UserTrait;
use VCR\VCR;

class UserProfileTest extends AbstractTestCase
{
    use UserTrait;

    protected function setUp()
    {
        parent::setUp();

        $cassettePath = $this->getFixturesPath().'vcr/profile';

        VCR::configure()
            ->setCassettePath($cassettePath)
            ->setBlackList(array('vendor/guzzle'))
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

    public function testGetSocialProfileLinkFacebook()
    {
        VCR::insertCassette('facebook.yml');

        $user = $this->newUserPersistent();

        $user->setFacebookId('000000');
        $user->setFacebookAccessToken('EAAIVsJIBgb8BAJ7NfJWxVCGksAkDh7ukiLRv8ElOGdVmpmZCsN7acU5xViCTYHDzZAEeCBHHs41yk7IElc9foF4wW45MgVlD8zfuAoSV5ZB5ZAB4oDrQSBj0GGTSu6mR71zYW57ZCs6bgy1nuPENAcfvvwHFcGRuvxJZBsztVo7gZDZD');
        $url = $this->getContainer()
            ->get('ha.user_profile')
            ->getSocialProfileLink(
                $user,
                'facebook'
            );

        $this->assertEquals(
            'https://www.facebook.com/app_scoped_user_id/000000/',
            $url
        );
    }

    public function testGetSocialProfileLinkGoogle()
    {
        VCR::insertCassette('google.yml');

        $user = $this->newUserPersistent();

        $user->setGoogleId('000000');
        $url = $this->getContainer()
            ->get('ha.user_profile')
            ->getSocialProfileLink(
                $user,
                'google'
            );

        $this->assertEquals(
            'https://plus.google.com/000000',
            $url
        );
    }

    public function testGetSocialProfileLinkTwitter()
    {
        VCR::insertCassette('twitter.yml');

        $user = $this->newUserPersistent();

        $user->setTwitterId('2734027794');
        $user->setTwitterAccessToken('000000');
        $user->setTwitterTokenSecret('000000');
        $url = $this->getContainer()
            ->get('ha.user_profile')
            ->getSocialProfileLink(
                $user,
                'twitter'
            );

        $this->assertEquals(
            'https://twitter.com/iproskuryakov',
            $url
        );
    }

    public function testGetSocialProfileLinkLinkedIn()
    {
        VCR::insertCassette('linkedin.yml');

        $user = $this->newUserPersistent();

        $user->setLinkedinId('wc8M6dKhjJ');
        $user->setLinkedinAccessToken('000000');
        $url = $this->getContainer()
            ->get('ha.user_profile')
            ->getSocialProfileLink(
                $user,
                'linkedin'
            );

        $this->assertEquals(
            'https://www.linkedin.com/profile/view?id=AAoAAAadacIBuboPQAtCHniw5x41kapcYEn3n60&authType=name&authToken=Sak9&trk=api*a4232014*s4298234*',
            $url
        );
    }
}
