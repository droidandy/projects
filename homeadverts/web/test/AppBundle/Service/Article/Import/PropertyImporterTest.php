<?php

namespace Test\AppBundle\Service\Article\Import;

use AppBundle\Service\Article\Import\PropertyImporter;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class PropertyImporterTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;
    use PropertyTrait;
    use GoogleLocationTrait;
    use AddressTrait;

    protected $rollbackTransactions = true;

    public function testImportDuplicatedPhotos()
    {
        // Add
        $user = $this->newUserPersistent();
        $property = $this->newPropertyToImport($user);
        $propertyUrl = '/property/'.$property->getId().'/'.$property->getSlug();

        // Run
        $data = $this
            ->getContainer()
            ->get('ha_article.property_importer')
            ->import($property);

        // Verify
        $this->assertEquals(
            PropertyImporter::IMAGE_GALLERY_LIMIT,
            count($data['images'])
        );
        $this->assertEquals($data['title'], $property->getName());
        $this->assertEquals(1, substr_count($data['body'], $propertyUrl));
        $this->assertEquals(1, substr_count($data['body'], $property->getAddressLine()));
        $this->assertEquals(
            PropertyImporter::IMAGE_GALLERY_LIMIT,
            substr_count(
                $data['body'],
                'luxuryaffairs-dev.s3.amazonaws.com'
            )
        );
    }
}
