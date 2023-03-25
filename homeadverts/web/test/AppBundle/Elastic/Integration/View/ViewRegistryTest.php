<?php

namespace Test\AppBundle\Elastic\Integration\View;

use AppBundle\Elastic\Integration\View\ViewRegistry;
use AppBundle\Elastic\Integration\View\ViewInterface;

class ViewRegistryTest extends \PHPUnit_Framework_TestCase
{
    public function testGetSuccess()
    {
        $views = [];
        for ($i = 1; $i < 4; ++$i) {
            $views['name'.$i] = $view = $this->getView();
            $view
                ->expects($this->once())
                ->method('getName')
                ->willReturn('name'.$i)
            ;
        }

        $viewRegistry = $this->getViewRegistry($views);

        $this->assertSame($views['name1'], $viewRegistry->get('name1'));
        $this->assertSame($views['name2'], $viewRegistry->get('name2'));
        $this->assertSame($views['name3'], $viewRegistry->get('name3'));
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage The view name1 doesn't exist
     */
    public function testGetUnexistingName()
    {
        $viewRegistry = $this->getViewRegistry([]);

        $viewRegistry->get('name1');
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage The view name nameone doesn't match the actual name1 view name
     */
    public function testGetWrongName()
    {
        $view = $this->getView();
        $view
            ->expects($this->exactly(2))
            ->method('getName')
            ->willReturn('name1')
        ;

        $viewRegistry = $this->getViewRegistry([
            'nameone' => $view,
        ]);

        $viewRegistry->get('nameone');
    }

    private function getViewRegistry($views)
    {
        return new ViewRegistry($views);
    }

    private function getView()
    {
        return $this->getMockBuilder(ViewInterface::class)
            ->getMock()
        ;
    }
}
