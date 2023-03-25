<?php

namespace Test\AppBundle\Provider;

use Test\AppBundle\AbstractWebTestCase;
use HWI\Bundle\OAuthBundle\OAuth\ResourceOwner\GenericOAuth2ResourceOwner;
use AppBundle\Service\User\UserManager;
use AppBundle\Provider\FOSUBUserProvider as UserProvider;
use AppBundle\Entity\User\User;

class UserProviderTest extends AbstractWebTestCase
{
    const TEST_USERNAME = 'bot';

    public function testUnknownUserOAuthResponseCreatesUser()
    {
        $mock = $this->createUserResponseMock();
        $provider = $this->createUserProviderUnknownUser();

        $newUser = $provider->loadUserByOAuthUserResponse($mock);

        $this->assertInstanceOf(User::class, $newUser);
        $this->assertNotEmpty($newUser->getFacebookId());
        $this->assertNotEmpty($newUser->getFacebookAccessToken());
    }

    public function testConnectUser()
    {
        $user = new User();
        $userResponseMock = $this->createUserResponseMock();
        $provider = $this->updateUserProvider();

        $provider->connect($user, $userResponseMock);

        $this->assertNotEmpty($user->getFacebookId());
        $this->assertNotEmpty($user->getFacebookAccessToken());
    }

    public function testLoadUserByOAuthUserResponse()
    {
        $user = new User();
        $mock = $this->createUserResponseMock();
        $provider = $this->createUserProvider($user);

        $loadedUser = $provider->loadUserByOAuthUserResponse($mock);

        $this->assertEquals($user, $loadedUser);
    }

    private function createUserResponseMock()
    {
        $provider = 'facebook';
        $file = realpath($this->getFixturesPath().'profile_photo.png');

        $resourceMock = $this
            ->getMockBuilder(GenericOAuth2ResourceOwner::class)
            ->disableOriginalConstructor()
            ->getMock();
        $resourceMock
            ->method('getName')
            ->will($this->returnValue($provider));

        $responseMock = $this->getMock('HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface');
        $responseMock->method('getEmail')->will($this->returnValue('bot@homeadverts.com'));
        $responseMock->method('getUsername')->will($this->returnValue(self::TEST_USERNAME));
        $responseMock->method('getRealname')->will($this->returnValue(self::TEST_USERNAME));
        $responseMock->method('getAccessToken')->will($this->returnValue('0123456'));
        $responseMock->method('getTokenSecret')->will($this->returnValue('0123456'));
        $responseMock->method('getResourceOwner')->will($this->returnValue($resourceMock));
        $responseMock->method('getProfilePicture')->will($this->returnValue($file));

        return $responseMock;
    }

    private function createUserProvider($user)
    {
        $userManagerMock = $this
            ->getMockBuilder(UserManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        $userManagerMock
            ->expects($this->any())
            ->method('findUserByEmail')
            ->will($this->returnValue($user))
        ;

        $provider = new UserProvider(
            $userManagerMock,
            ['facebook' => 'facebookId']
        );

        return $provider;
    }

    private function updateUserProvider()
    {
        $userManagerMock = $this
            ->getMockBuilder(UserManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        $userManagerMock
            ->expects($this->any())
            ->method('updateUser')
            ->withAnyParameters()
        ;

        $provider = new UserProvider(
            $userManagerMock,
            ['facebook' => 'facebookId']
        );

        return $provider;
    }

    private function createUserProviderUnknownUser()
    {
        $userManagerMock = $this
            ->getMockBuilder(UserManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        $userManagerMock
            ->expects($this->any())
            ->method('findUserByOauthResponse')
            ->will($this->returnValue(null))
        ;
        $userManagerMock
            ->expects($this->any())
            ->method('createUser')
            ->will($this->returnValue(new User()))
        ;
        $userManagerMock
            ->expects($this->any())
            ->method('updateUser')
            ->withAnyParameters()
        ;

        $provider = new UserProvider(
            $userManagerMock,
            ['facebook' => 'facebookId']
        );

        return $provider;
    }
}
