<?php

namespace Test\AppBundle\Controller\Api\Article;

use AppBundle\Service\Article\ArticleService;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;
use Test\AppBundle\AbstractWebTestCase;

class ArticlePropertyControllerTest extends AbstractWebTestCase
{
    use AddressTrait;
    use LocationTrait;
    use GoogleLocationTrait;
    use UserTrait;
    use ArticleTrait;
    use PropertyTrait;
    use TagTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testConvertProperty()
    {
        // Add
        $admin = $this->newAdminPersistent();
        $property = $this->newPropertyToImport($admin);
        $this->em->persist($property);
        $this->em->flush();

        $tagProperty = $this->newTagPersistent([
            'name' => ArticleService::TAG_PROPERTY_PRIVATE,
            'user' => $admin,
            'private' => true,
        ]);

        $this->logIn($admin);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_article_import_property', [
                'id' => $property->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $location = $response->headers->get('Location');
        $content = $response->getContent();
        $result = json_decode($content, true);

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertNotEmpty($location);
    }
}
