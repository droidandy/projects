<?php

namespace AppBundle\Controller\Api\Property;

use AppBundle\Controller\Api\ApiControllerTemplate;
use AppBundle\Entity\Property\Property;

class PropertyController extends ApiControllerTemplate
{
    /**
     * @var string
     */
    protected $model = Property::class;
}
