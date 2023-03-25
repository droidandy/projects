<?php

namespace Test\AppBundle\Service\Article\Import;

use AppBundle\Entity\Storage\File;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Import\ContentsReader;
use Test\Utils\Traits\UserTrait;
use AppBundle\Service\File\FileManager;
use AppBundle\Service\Article\Import\PageImporter;

class PageImporterTest extends AbstractTestCase
{
    use UserTrait;

    // https://www.zillow.com/blog/historic-racial-injustices-housing-221898/
    // https://www.trulia.com/blog/how-to-inherit-a-rent-controlled-apartment-from-a-friend/
    // https://www.redfin.com/blog/2017/10/migration-patterns-show-more-people-leaving-politically-blue-counties.html

    public function testZillow()
    {
        $fixtureFile = $this->getFixturePath('/import/zillow.html');

        // Test
        $importer = new PageImporter(
            $this->mockFileManger(),
            new ContentsReader()
        );
        $article = $importer->import($fixtureFile);

        // Validate
        $this->assertEquals(
            'How Historic Racial Injustices Still Impact Housing Today',
            $article['title']
        );
        $this->assertGreaterThan(0, strlen($article['body']));
    }

    public function testTrulia()
    {
        $fixtureFile = $this->getFixturePath('/import/trulia.html');

        // Test
        $importer = new PageImporter(
            $this->mockFileManger(),
            new ContentsReader()
        );
        $article = $importer->import($fixtureFile);

        // Validate
        $this->assertEquals(
            'How To Inherit A Rent-Controlled Apartment From A Friend',
            $article['title']
        );
        $this->assertGreaterThan(0, strlen($article['body']));
    }

    public function testRedfinWithTwoImages()
    {
        $fixtureFile = $this->getFixturePath('/import/redfin.html');

        // Prepare
        $text = file_get_contents($fixtureFile);
        $articleTempFilename = $this->getTemporaryFilename('redfin.html');

        $text = str_replace(
            '{{IMAGE_ONE}}',
            $this->getFixturesPath().'image.jpg',
            $text
        );
        $text = str_replace(
            '{{IMAGE_TWO}}',
            $this->getFixturesPath().'mu.jpg',
            $text
        );
        $text = str_replace(
            '{{IMAGE_THREE}}',
            $this->getFixturesPath().'profile_photo.png',
            $text
        );
        file_put_contents($articleTempFilename, $text);

        $fileOne = new File();
        $fileTwo = new File();
        $fileOne->hash = 1;
        $fileOne->url = 'http://one.com/one';
        $fileOne->source = $this->getFixturesPath().'image.jpg';
        $fileTwo->hash = 2;
        $fileTwo->url = 'http://two.com/two';
        $fileTwo->source = $this->getFixturesPath().'mu.jpg';

        // Run
        $fileManager = $this->mockFileManger();
        $fileManager
            ->expects($this->at(0))
            ->method('save')
            ->willReturn($fileOne);
        $fileManager
            ->expects($this->at(1))
            ->method('save')
            ->willReturn($fileTwo);

        $importer = new PageImporter(
            $fileManager,
            new ContentsReader()
        );
        $article = $importer->import($articleTempFilename);

        // Validate
        $this->assertEquals(
            'Migration Patterns Show More People Leaving Politically Blue Counties',
            $article['title']
        );

        $this->assertEquals(2, count($article['images']));
        $this->assertGreaterThan(0, strpos($article['body'], 'http://one.com/one'));
        $this->assertGreaterThan(0, strpos($article['body'], 'http://two.com/two'));

        // Remove
        unlink($articleTempFilename);
    }

    /**
     * @return FileManager
     */
    private function mockFileManger()
    {
        return $this
            ->getMockBuilder(FileManager::class)
            ->disableOriginalConstructor()
            ->getMock();
    }
}
