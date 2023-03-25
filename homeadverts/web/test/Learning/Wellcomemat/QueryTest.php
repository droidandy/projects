<?php

namespace Learning\Wellcomemat;

use GuzzleHttp\Client;

class QueryTest extends \PHPUnit_Framework_TestCase
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
                'status' => 400,
            ],
        ]);
        $json = json_decode($res->getBody(), true);

        if (1 != $json['success']) {
            $this->log('Request failed');
        }

        $medias = $json['medias'];
        $json = null;

        $this->log('Count of inactive videos = %s', count($this->getInactive($medias)));
        $this->log('Count of non-active/inactive videos = %s', count($this->getOtherStatusCodes($medias)));
        $this->log('Count of empty custom id videos = %s', count($this->getEmptyCustomId($medias)));
        $this->log('Count of malformed custom id videos = %s', count($this->getMalformedCustomId($medias)));

        $this->log('Count of valid videos = %s', count($this->getValid($medias)));
    }

    protected function getInactive($values)
    {
        return array_filter($values, function ($value) {
            return QueryTest::isStatusInactive($value);
        });
    }

    protected function getOtherStatusCodes($values)
    {
        return array_filter($values, function ($value) {
            return !QueryTest::isStatusInactive($value) && !QueryTest::isStatusActive($value);
        });
    }

    protected function getEmptyCustomId($values)
    {
        return array_filter($values, function ($value) {
            return QueryTest::isCustomIdEmpty($value);
        });
    }

    protected function getMalformedCustomId($values)
    {
        return array_filter($values, function ($value) {
            return !QueryTest::isCustomValid($value);
        });
    }

    protected function getValid($values)
    {
        return array_filter($values, function ($value) {
            return QueryTest::isStatusActive($value) && !QueryTest::isCustomIdEmpty($value) && QueryTest::isCustomValid($value);
        });
    }

    protected function log($msg, ...$params)
    {
        echo sprintf($msg."\n", ...$params);
    }
}
