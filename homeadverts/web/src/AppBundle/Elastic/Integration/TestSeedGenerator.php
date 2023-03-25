<?php

namespace AppBundle\Elastic\Integration;

class TestSeedGenerator implements SeedGeneratorInterface
{
    /**
     * @return int
     */
    public function getSeed()
    {
        return (int)substr(base_convert(uniqid(), 36, 10), 0, 16);
    }
}
