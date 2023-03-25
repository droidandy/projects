<?php

namespace AppBundle\Service\Article\Publisher\Channel;

class ChannelPostingResult
{
    const CHANNEL_RESULT_SUFFIX = 'Result';

    /**
     * @var array
     */
    private $response;
    /**
     * @var bool
     */
    private $isPositive;

    /**
     * @param bool  $isPositive
     * @param array $response
     */
    public function __construct($isPositive, array $response)
    {
        $this->isPositive = $isPositive;
        $this->response = $response;
    }

    /**
     * @return bool
     */
    public function isPositive()
    {
        return $this->isPositive;
    }

    /**
     * @return array
     */
    public function getResponse()
    {
        return $this->response;
    }
}
