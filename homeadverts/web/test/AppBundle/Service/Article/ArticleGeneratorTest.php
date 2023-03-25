<?php

namespace Test\AppBundle\Service\Article;

use AppBundle\Service\Article\ArticleService;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class ArticleGeneratorTest extends AbstractTestCase
{
    use UserTrait;
    use PropertyTrait;
    use GoogleLocationTrait;
    use AddressTrait;
    use TagTrait;

    protected $rollbackTransactions = true;

    public function testImport()
    {
        // Run
        $this
            ->getContainer()
            ->get('ha_article.generator')
            ->generate();
    }
}
