<?php

namespace AppBundle\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;

trait OAuthTokensTrait
{
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $twitterId = '';

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $twitterAccessToken = '';

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $twitterTokenSecret = '';

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $facebookId = '';

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $facebookAccessToken = '';

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $googleId = '';

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $googleAccessToken = '';

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $linkedinId = '';

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $linkedinAccessToken = '';

    /**
     * @return mixed
     */
    public function getTwitterId()
    {
        return $this->twitterId;
    }

    /**
     * @param mixed $twitterId
     *
     * @return self
     */
    public function setTwitterId($twitterId)
    {
        $this->twitterId = $twitterId;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getTwitterAccessToken()
    {
        return $this->twitterAccessToken;
    }

    /**
     * @param mixed $twitterAccessToken
     *
     * @return self
     */
    public function setTwitterAccessToken($twitterAccessToken)
    {
        $this->twitterAccessToken = $twitterAccessToken;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getTwitterTokenSecret()
    {
        return $this->twitterTokenSecret;
    }

    /**
     * @param mixed $twitterTokenSecret
     *
     * @return self
     */
    public function setTwitterTokenSecret($twitterTokenSecret)
    {
        $this->twitterTokenSecret = $twitterTokenSecret;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getFacebookId()
    {
        return $this->facebookId;
    }

    /**
     * @param mixed $facebookId
     *
     * @return self
     */
    public function setFacebookId($facebookId)
    {
        $this->facebookId = $facebookId;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getFacebookAccessToken()
    {
        return $this->facebookAccessToken;
    }

    /**
     * @param mixed $facebookAccessToken
     *
     * @return self
     */
    public function setFacebookAccessToken($facebookAccessToken)
    {
        $this->facebookAccessToken = $facebookAccessToken;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getGoogleId()
    {
        return $this->googleId;
    }

    /**
     * @param mixed $googleId
     *
     * @return self
     */
    public function setGoogleId($googleId)
    {
        $this->googleId = $googleId;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getGoogleAccessToken()
    {
        return $this->googleAccessToken;
    }

    /**
     * @param mixed $googleAccessToken
     *
     * @return self
     */
    public function setGoogleAccessToken($googleAccessToken)
    {
        $this->googleAccessToken = $googleAccessToken;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getLinkedinId()
    {
        return $this->linkedinId;
    }

    /**
     * @param mixed $linkedinId
     *
     * @return self
     */
    public function setLinkedinId($linkedinId)
    {
        $this->linkedinId = $linkedinId;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getLinkedinAccessToken()
    {
        return $this->linkedinAccessToken;
    }

    /**
     * @param mixed $linkedinAccessToken
     *
     * @return self
     */
    public function setLinkedinAccessToken($linkedinAccessToken)
    {
        $this->linkedinAccessToken = $linkedinAccessToken;

        return $this;
    }

    /**
     * @param UserResponseInterface $response
     *
     * @return $this
     */
    public function setTokenData($response)
    {
        $id = $this->getOauthIdFieldName($response);
        $token = $this->getOauthAccessFieldName($response);

        $this->{$id} = $response->getUsername();
        $this->{$token} = $response->getAccessToken();

        if ('twitter' == $response->getResourceOwner()->getName()) {
            $this->setTwitterTokenSecret($response->getTokenSecret());
        }

        return $this;
    }

    /**
     * @param UserResponseInterface $response
     *
     * @return $this
     */
    public function unsetTokenData(UserResponseInterface $response)
    {
        $this->{$this->getOauthIdFieldName($response)} = null;
        $this->{$this->getOauthAccessFieldName($response)} = null;

        return $this;
    }

    /**
     * @param $response
     *
     * @return string
     */
    private function getOauthAccessFieldName(UserResponseInterface $response)
    {
        $service = $response->getResourceOwner()->getName();

        return $service.'AccessToken';
    }

    /**
     * @param $response
     *
     * @return string
     */
    private function getOauthIdFieldName(UserResponseInterface $response)
    {
        $service = $response->getResourceOwner()->getName();

        return $service.'Id';
    }

    /**
     * @param UserResponseInterface $response
     *
     * @return string
     */
    public static function getOauthFieldName(UserResponseInterface $response)
    {
        $service = $response->getResourceOwner()->getName();

        return $service.'Id';
    }
}
