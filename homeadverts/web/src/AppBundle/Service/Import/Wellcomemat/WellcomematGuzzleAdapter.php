<?php

namespace AppBundle\Service\Import\Wellcomemat;

use GuzzleHttp\Client;

class WellcomematGuzzleAdapter
{
    const ACTIVE = 200;
    const RESIDENTIAL_REAL_ESTATE_VIDEO = 1;

    private $client;
    private $endpoint;

    public function __construct(
        $endpoint = 'http://www.wellcomemat.com/api/media/',
        $key = 'thahomeadvertscom',
        $secret = '94ac398ed9bb8fae468441ddf733144a',
        Client $client = null
    ) {
        $this->client = $client ?: new Client();
        $this->endpoint = $endpoint;
        $this->key = $key;
        $this->secret = $secret;
    }

    public function queryAll($filters = [])
    {
        $body = [
            'key' => $this->key,
            'secret' => $this->secret,
        ];
        $body += $this->getFilters($filters);

        $response = $this->client->post($this->endpoint.'query.php', [
            'form_params' => $body,
        ]);

        return json_decode((string) $response->getBody(), true);
    }

    private function getFilters($filters)
    {
        $wellFilters = [];
        if (!empty($filters['status'])) {
            switch ($filters['status']) {
                case self::ACTIVE:
                    $wellFilters['status'] = '400'; break;
            }
        }
        if (!empty($filters['video_type'])) {
            switch ($filters['video_type']) {
                case self::RESIDENTIAL_REAL_ESTATE_VIDEO:
                    $wellFilters['video_type'] = '1'; break;
            }
        }

        return $wellFilters;
    }
}
