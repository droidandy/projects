<?php

namespace AppBundle\Entity\Traits;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Hashids\Hashids;
use AppBundle\Entity\Social\Article;

trait TokenTrait
{
    /**
     * @ORM\Column(type="string", unique=true, nullable=true)
     * @JMS\Type("string")
     * @JMS\ReadOnly
     * @JMS\Expose
     */
    protected $token;

    /**
     * @return string
     */
    public static function getUniqueFieldName()
    {
        return 'token';
    }

    /**
     * @return mixed
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * @param mixed $token
     */
    public function setToken($token)
    {
        $this->token = $token;
    }

    protected function generateToken()
    {
        /** @var DateTime $createdAt */
        $createdAt = $this->getCreatedAt();
        $uniqueTimestamp = $createdAt->getTimestamp().hexdec(uniqid());

        $hashIds = new Hashids(Article::TOKEN_SALT);
        $token = $hashIds->encode($uniqueTimestamp);

        $this->setToken($token);
    }
}
