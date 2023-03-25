<?php

namespace Test\AppBundle\Service\Oauth;

use AppBundle\Service\Oauth\CachedGrantType as BaseCachedGrantType;
use Doctrine\Common\Cache\ArrayCache as BaseArrayCache;
use Sainsburys\Guzzle\Oauth2\AccessToken as BaseAccessToken;
use Sainsburys\Guzzle\Oauth2\GrantType\GrantTypeInterface;

class CachedGrantTypeTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var ArrayCache
     */
    private $cache;
    /**
     * @var GrantTypeInterface
     */
    private $grantType;
    /**
     * @var CachedGrantType
     */
    private $cachedGrantType;

    protected function setUp()
    {
        $this->cache = new ArrayCache();
        $this->grantType = $this->getGrantType();

        $this->cachedGrantType = new CachedGrantType($this->cache, $this->grantType, 'ha_test');
    }

    public function testGetCachedGetToken()
    {
        $curDateTime = new \DateTime();
        $this->cache->curDateTime = $curDateTime;
        /** @var \PHPUnit_Framework_MockObject_MockObject $grantType */
        $grantType = $this->grantType;
        $grantType
            ->expects($this->exactly(2))
            ->method('getToken')
            ->willReturnCallback(
                function () use ($curDateTime) {
                    return $this->getAccessToken(
                        $curDateTime,
                        3600
                    );
                }
            )
        ;

        $this->cachedGrantType->curDateTime = $curDateTime;

        $accessToken1 = $this->cachedGrantType->getToken();

        $curDateTime->add(new \DateInterval('PT5M'));
        $this->assertSame(
            $accessToken1,
            $this->cachedGrantType->getToken()
        );

        $curDateTime->add(new \DateInterval('PT50M'));
        $this->assertSame(
            $accessToken1,
            $this->cachedGrantType->getToken()
        );

        $curDateTime->add(new \DateInterval('PT5M'));
        $accessToken2 = $this->cachedGrantType->getToken();

        $this->assertNotSame(
            $accessToken1,
            $accessToken2
        );

        $curDateTime->add(new \DateInterval('PT5M'));
        $this->assertSame(
            $accessToken2,
            $this->cachedGrantType->getToken()
        );

        $this->assertEquals(5, $this->cache->fetchHits);
        $this->assertEquals(2, $this->cache->saveHits);
    }

    public function testGetAlreadyCached()
    {
        $curDateTime = new \DateTime();
        $this->cache->curDateTime = $curDateTime;
        /** @var \PHPUnit_Framework_MockObject_MockObject $grantType */
        $grantType = $this->grantType;
        $grantType
            ->expects($this->never())
            ->method('getToken')
        ;

        $accessToken1 = $this->getAccessToken(
            $curDateTime,
            3600
        );
        $this->cache->save('ha_test'.CachedGrantType::KEY_NAME, $accessToken1, 3570);

        $curDateTime->add(new \DateInterval('PT5M'));
        $this->assertSame(
            $accessToken1,
            $this->cachedGrantType->getToken()
        );

        $curDateTime->add(new \DateInterval('PT15M'));
        $this->assertSame(
            $accessToken1,
            $this->cachedGrantType->getToken()
        );

        $curDateTime->add(new \DateInterval('PT30M'));
        $this->assertSame(
            $accessToken1,
            $this->cachedGrantType->getToken()
        );
    }

    private function getGrantType()
    {
        return $this
            ->getMockBuilder(GrantTypeInterface::class)
            ->getMock()
        ;
    }

    private function getAccessToken(\DateTime $curDateTime, $expiresIn)
    {
        return new AccessToken(
            $curDateTime,
            'token_value',
            'Bearer',
            [
                'expires_in' => $expiresIn,
                'scope' => 'https://btt.realogyfg.com/datasyncapi',
            ]
        );
    }
}

class CachedGrantType extends BaseCachedGrantType
{
    /**
     * @var \DateTime
     */
    public $curDateTime;

    protected function getCurrentDateTime()
    {
        return $this->curDateTime;
    }
}

class AccessToken extends BaseAccessToken
{
    /**
     * @var \DateTime
     */
    public $curDateTime;

    /**
     * @param string $token
     * @param string $type  the token type (from OAuth2 key 'token_type')
     * @param array  $data  other token data
     */
    public function __construct(\DateTime $curDateTime, $token, $type, array $data = [])
    {
        $this->curDateTime = $curDateTime;
        $this->token = $token;
        $this->type = $type;
        $this->data = $data;
        if (isset($data['expires'])) {
            $this->expires = clone $this->curDateTime;
            $this->expires->setTimestamp($data['expires']);
        } elseif (isset($data['expires_in'])) {
            $this->expires = clone $this->curDateTime;
            $this->expires->add(new \DateInterval(sprintf('PT%sS', $data['expires_in'])));
        }
        if (isset($data['refresh_token'])) {
            $this->refreshToken = new self($this->curDateTime, $data['refresh_token'], 'refresh_token');
        }
    }

    public function isExpired()
    {
        return null !== $this->expires && $this->expires->getTimestamp() < $this->curDateTime->getTimestamp();
    }
}

class ArrayCache extends BaseArrayCache
{
    public $ttl;
    public $saveHits = 0;
    public $fetchHits = 0;
    /**
     * @var \DateTime
     */
    public $curDateTime;
    /**
     * @var \DateTime
     */
    public $expiresAt;

    protected function doSave($id, $data, $lifeTime = 0)
    {
        if (false === strpos($id, 'DoctrineNamespaceCacheKey')) {
            $this->ttl = $lifeTime;
            ++$this->saveHits;
            $this->expiresAt = clone $this->curDateTime;
            $this->expiresAt->add(new \DateInterval(sprintf('PT%sS', $lifeTime)));
        }

        return parent::doSave($id, $data, $lifeTime);
    }

    protected function doFetch($id)
    {
        if (false === strpos($id, 'DoctrineNamespaceCacheKey')) {
            ++$this->fetchHits;
            if ($this->expiresAt && $this->expiresAt->getTimestamp() < $this->curDateTime->getTimestamp()) {
                return false;
            }
        }

        return parent::doFetch($id);
    }
}
