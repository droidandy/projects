<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Import\Adapter\Sothebys\DataSync\Normalizer\UserNormalizer;
use Test\AppBundle\AbstractFrameworkTestCase;
use Test\Utils\Traits\DataSyncTrait;

class UserNormalizerTest extends AbstractFrameworkTestCase
{
    use DataSyncTrait;

    public function testNormalize()
    {
        $normalizer = new UserNormalizer();

        $this->assertEquals($this->getNormalisedUser(), $normalizer->normalize($this->getUser()));
    }
}
