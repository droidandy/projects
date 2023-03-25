<?php

namespace AppBundle\Elastic\Integration\Mapping;

interface PopulateESInterface
{
    public function getEntitiesForDocTotal();

    public function getEntities();
}
