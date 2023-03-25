<?php

namespace AppBundle\Service\Article\Import;

use GuzzleHttp\Client;

class ContentsReader implements ContentsReaderInterface
{
    const TIMEOUT = 15.0;

    /**
     * @param string $name
     *
     * @return string
     */
    public function getContents($source)
    {
        $client = new Client([
            'timeout' => self::TIMEOUT,
            'cookies' => true,
            'allow_redirects' => [
                'max' => 10,        // allow at most 10 redirects.
                'strict' => true,      // use "strict" RFC compliant redirects.
                'referer' => true,      // add a Referer header
                'track_redirects' => true,
            ],
            'headers' => [
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding' => 'zip, deflate, sdch',
                'Accept-Language' => 'en-US,en;q=0.8',
                'Cache-Control' => 'max-age=0',
                'User-Agent' => 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:47.0) Gecko/20100101 Firefox/47.0',
            ],
        ]);
        $response = $client->request('GET', $source);

        return $response->getBody()->getContents();
    }
}
