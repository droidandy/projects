<?php

namespace AppBundle\Service\Geo;

use GeoIp2\Database\Reader;

class IpToCountry
{
    const UNKNOWN_COUNTRY = 'ZZ';

    /**
     * @var string
     */
    private $db;

    public function __construct(string $db)
    {
        $this->db = $db;
    }

    /**
     * Converts an IP address to a two character ISO country code.
     *
     * If no country can be found then ZZ is returned.
     *
     * @param string $ip
     *
     * @return string
     */
    public function getCountry($ip)
    {
        $reader = new Reader($this->db);

        try {
            $record = $reader->country($ip);
        } catch (\Exception $e) {
            return self::UNKNOWN_COUNTRY;
        }

        if (!isset($record->country->isoCode)) {
            return self::UNKNOWN_COUNTRY;
        }

        return strtoupper($record->country->isoCode);
    }
}
