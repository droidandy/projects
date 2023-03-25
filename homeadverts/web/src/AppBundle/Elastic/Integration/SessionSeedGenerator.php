<?php

namespace AppBundle\Elastic\Integration;

class SessionSeedGenerator implements SeedGeneratorInterface
{
    public function getSeed()
    {
        return (int) substr(base_convert(session_id(), 36, 10), 0, 16);
    }
}
