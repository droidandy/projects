<?php

namespace AppBundle\Geo;

use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Inject;
use Elasticsearch\Client;
use Doctrine\DBAL\Driver\Connection;
use AppBundle\Entity\Embeddable\Coords;

/**
 * Turns lat/lngs into a tree of geoname data.
 *
 * @Service("reverse_geocoder")
 */
class ReverseGeocoder
{
    protected $es;
    protected $db;
    protected $cache;

    /**
     * Constructor.
     *
     * @InjectParams({
     *     "db" = @Inject("doctrine.dbal.geonames_connection")
     * })
     *
     * @param Client     $es
     * @param Connection $db
     */
    public function __construct(Client $esClient, Connection $db, $cache)
    {
        $this->es = $esClient;
        $this->db = $db;
        $this->cache = $cache;
    }

    public function lookup(Coords $coords, $country = false)
    {
        $key = $this->getCacheKey($coords, $country);

        if ($result = $this->cache->fetch($key)) {
            return unserialize($result);
        }

        $query = array(
            'index' => 'geonames',
            'type' => 'geoname',
            'body' => $this->getBody($coords, $country),
        );

        try {
            $result = $this->es->search($query);
        } catch (\Exception $e) {
            return false;
        }

        if (isset($result['error'])) {
            return false;
        }

        if ($result['hits']['total'] < 1) {
            return [];
        }

        $result = $this->getHierarchy($result['hits']['hits']);
        $this->cache->save($key, serialize($result));

        return $result;
    }

    protected function getBody(Coords $coords, $country)
    {
        $body = [
            /*'sort' => [
                [
                    '_geo_distance' => [
                        'location' => [
                            'lat' => (float)$coords->getLatitude(),
                            'lon' => (float)$coords->getLongitude(),
                        ],
                        'order' => 'asc',
                        'unit'  => 'km',
                    ]
                ]
            ],*/
            'size' => 30,
            'query' => [
                'filtered' => [
                    'query' => $country ? [
                            'term' => (object) ['country' => $country],
                        ] : [
                            'match_all' => [],
                        ],
                    'filter' => [
                        'geo_shape' => [
                            'location' => [
                                'shape' => [
                                    'type' => 'circle',
                                    'coordinates' => [(float) $coords->getLongitude(), (float) $coords->getLatitude()],
                                    'radius' => '1000km',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        return $body;
    }

    protected function getHierarchy($geonames)
    {
        $points = $this->getNearestPoints($geonames);

        foreach ($points as $point) {
            if ($result = $this->getHierachyForPoint($point)) {
                return $result;
            }
        }

        return [];
    }

    public function getHierachyForPoint($point)
    {
        $i = 0;
        $hierarchy = [];

        while (true) {
            $geoname = $this->getGeoname($point);

            if ('H' === $geoname['fclass']) {
                continue;
            }

            // First try and get hierarchy parent
            $parent = $this->getParent($geoname['geonameid']);

            if (!$parent) {
                // get the parent admin code
                $parts = [$geoname['country'], $geoname['admin1'], $geoname['admin2']];
                $parts = array_filter($parts);
                $code = implode('.', $parts);

                $parent = $this->getAdmin2Code($code);

                if (!$parent) {
                    $parent = $this->getAdmin1Code($code);
                }

                if (!$parent && !$hierarchy) {
                    return false;
                }

                $point = $parent['geonameid'];
            } else {
                $point = $parent['parentId'];
            }

            // Insurance if we get stuck in a loop
            if (!$parent || $i++ > 10) {
                break;
            }

            // Ensure we won't have duplicates in ther hierarchy
            $last = end($hierarchy);
            if ($last && ($geoname['asciiname'] === $last['asciiname'])) {
                continue;
            }

            // Try and find a better name
            if ($alt = $this->getAlternateName($geoname['geonameid'])) {
                $geoname['name'] = $alt['alternateName'];
            }

            // Clean up the name removing City Of, Kingdom of etc
            $geoname['name'] = $this->cleanName($geoname);

            $hierarchy[$geoname['geonameid']] = $geoname;
        }

        // reverse the hierarchy
        $hierarchy = array_reverse($hierarchy, true);

        return $hierarchy;
    }

    protected function getCacheKey($coords, $country)
    {
        // To encourage more cache hits we round down the lat/lng to 3 decimals
        // places which equals about 111m
        $lat = round($coords->getLatitude(), 3);
        $lng = round($coords->getLongitude(), 3);

        return 'reverse_geocode_'.sha1($lat.','.$lng.','.$country);
    }

    public function getNearestPoints(array $points)
    {
        $result = [];

        foreach ($points as $point) {
            if ($point['_source']['fclass'] === 'A' || $point['_source']['fcode'] === 'PPL') {
                $result[] = $point['_id'];
            }
        }

        return $result;
    }

    public function getGeoname($id)
    {
        return $this->cache('
            SELECT
                geonameid, name, asciiname, latitude, longitude, fclass, fcode, country, cc2, admin1, admin2, admin3, admin4, timezone
            FROM
                geoname
            WHERE
                geoname.geonameid = ?', $id);
    }

    public function getAdmin2Code($code)
    {
        return $this->cache('
            SELECT
                *
            FROM
                admin2Codes
            WHERE
                admin2Codes.code = ?', $code);
    }

    public function getAdmin1Code($code)
    {
        return $this->cache('
            SELECT
                *
            FROM
                admin1CodesAscii
            WHERE
                admin1CodesAscii.code = ?
        ', $code);
    }

    public function getParent($id)
    {
        return $this->cache('
            SELECT
                *
            FROM
                `hierarchy`
            WHERE
                `childId` = ?
        ', $id);
    }

    public function getAlternateName($id)
    {
        return $this->cache("
            SELECT
               *
            FROM
               `alternatename`
            WHERE
               (isoLanguage = 'en' OR isoLanguage = '')
               AND `geonameid` = ?
            ORDER BY
                isoLanguage DESC,
                isPreferredName DESC,
                isShortName DESC
        ", $id);
    }

    protected function cache($sql, $id)
    {
        static $data = [];

        $key = md5($sql.$id);

        if (!isset($data[$key])) {
            $data[$key] = $this->db->fetchAssoc($sql, [$id]);
        }

        return $data[$key];
    }

    public function cleanName($geoname)
    {
        $name = $geoname['name'];
        $name = str_replace([
            'City of',
            'Town of',
            'Township of',
            'Village of',
            'Arrondissement de la',
            'Arrondissement de',
            'Arrondissement du',
            'Arrondissement d\'',
            'Bureau d’arrondissement',
            '(Arrondissement)',
            'Comunidad Autónoma de las',
            'Comunidad Autónoma de',
            'Comunidat Autónoma de las',
            'Provincia de las',
            'Província de',
            'Província di',
            'Provincia di',
            'Provincia de',
            'Provincia dell’',
            'Provincias',
            'Província d\'',
            'London Borough of',
            'Municipality',
            'Regierungsbezirk',
            'Kreisfreie Stadt',
            ', Stadt',
            'Stadt',
            'District d\'',
            'District des ',
            'District de la ',
            'District de ',
            ' District',
        ], '', $name);

        return trim($name);
    }
}
