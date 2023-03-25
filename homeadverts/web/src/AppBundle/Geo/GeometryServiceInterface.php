<?php

namespace AppBundle\Geo;

use AppBundle\Entity\Location\Location;

interface GeometryServiceInterface
{
    const LOCATION_BLACKLIST = ['london'];

    /**
     * @param Location[] $locations
     */
    public function warmupGeometries(array $locations = []);

    public function getGeometry(Location $location);
}
