<?php

namespace Learning\Wellcomemat;

use GuzzleHttp\Client;

class PrepareFixturesTest extends \PHPUnit_Framework_TestCase
{
    public static function isStatusInactive($value)
    {
        return '500' == $value['status_code'];
    }

    public static function isStatusActive($value)
    {
        return '400' == $value['status_code'];
    }

    public static function isCustomIdEmpty($value)
    {
        return empty($value['customid']);
    }

    public static function isCustomValid($value)
    {
        return preg_match('/^[0-9A-Z]{6,6}$/', $value['customid']);
    }

    public function testAllVideos()
    {
        $client = new Client();
        $res = $client->post('http://www.wellcomemat.com/api/media/query.php', [
            'form_params' => [
                'key' => 'thahomeadvertscom',
                'secret' => '94ac398ed9bb8fae468441ddf733144a',
            ],
        ]);
        $json = json_decode($res->getBody(), true);

        if (1 != $json['success']) {
            $this->log('Request failed');
        }

        $medias = $json['medias'];
        $json = null;

        $inactiveMedias = array_slice($this->getInactive($medias), 0, 2);
        $activeMedias = $this->getActive($medias);
        $emptyCustomIdMedias = array_slice($this->getEmptyCustomId($activeMedias), 0, 2);
        $malformedMedias = array_slice($this->getMalformedCustomId($activeMedias), 0, 2);
        $validMedias = array_slice($this->getValid($activeMedias), 0, 2);

        $medias = array_merge($inactiveMedias, $emptyCustomIdMedias, $malformedMedias, $validMedias);
        shuffle($medias);

        $output = [
            'success' => 1,
            'error' => '',
            'warnings' => '',
            'medias' => $medias,
        ];
        file_put_contents(__DIR__.'/../../AppBundle/Import/Wellcomemat/fixtures/response_g.json', json_encode($output));
        $output = null;

        $client = new Client();
        $res = $client->post('http://www.wellcomemat.com/api/media/query.php', [
            'form_params' => [
                'key' => 'thahomeadvertscom',
                'secret' => '94ac398ed9bb8fae468441ddf733144a',
                'status' => 400,
            ],
        ]);
        $json = json_decode($res->getBody(), true);

        if (1 != $json['success']) {
            $this->log('Request failed');
        }

        $activeMedias = $json['medias'];
        $json = null;

        $emptyCustomIdMedias = array_slice($this->getEmptyCustomId($activeMedias), 0, 2);
        $malformedMedias = array_slice($this->getMalformedCustomId($activeMedias), 0, 2);
        $validMedias = array_slice($this->getValid($activeMedias), 0, 2);

        $medias = array_merge($inactiveMedias, $emptyCustomIdMedias, $malformedMedias, $validMedias);
        shuffle($medias);

        $output = [
            'success' => 1,
            'error' => '',
            'warnings' => '',
            'medias' => $medias,
        ];
        file_put_contents(__DIR__.'/../../AppBundle/Import/Wellcomemat/fixtures/response_active_g.json', json_encode($output));
    }

    protected function getInactive($values)
    {
        return array_filter($values, function ($value) {
            return PrepareFixturesTest::isStatusInactive($value);
        });
    }

    protected function getActive($values)
    {
        return array_filter($values, function ($value) {
            return PrepareFixturesTest::isStatusActive($value);
        });
    }

    protected function getOtherStatusCodes($values)
    {
        return array_filter($values, function ($value) {
            return !PrepareFixturesTest::isStatusInactive($value) && !PrepareFixturesTest::isStatusActive($value);
        });
    }

    protected function getEmptyCustomId($values)
    {
        return array_filter($values, function ($value) {
            return PrepareFixturesTest::isCustomIdEmpty($value);
        });
    }

    protected function getMalformedCustomId($values)
    {
        return array_filter($values, function ($value) {
            return !PrepareFixturesTest::isCustomValid($value);
        });
    }

    protected function getValid($values)
    {
        return array_filter($values, function ($value) {
            return PrepareFixturesTest::isStatusActive($value) && !PrepareFixturesTest::isCustomIdEmpty($value) && PrepareFixturesTest::isCustomValid($value) && strpos($value['keywords'], 'International Realty');
        });
    }

    protected function log($msg, ...$params)
    {
        echo sprintf($msg."\n", ...$params);
    }
}
