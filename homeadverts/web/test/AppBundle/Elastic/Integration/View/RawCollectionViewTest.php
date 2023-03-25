<?php

namespace Test\AppBundle\Elastic\Integration\View;

use AppBundle\Elastic\Integration\View\RawCollectionView;

class RawCollectionViewTest extends \PHPUnit_Framework_TestCase
{
    public function testInvoke()
    {
        $view = new RawCollectionView();

        $this->assertEquals([1, 2, 3], $view([1, 2, 3]));
    }

    public function testName()
    {
        $view = new RawCollectionView();

        $this->assertEquals('raw', $view->getName());
    }
}
