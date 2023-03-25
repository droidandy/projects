<?php

namespace Test\AppBundle\Elastic\Category\Mapping;

use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Category\Mapping\TagDocumentParser;
use Test\Utils\Traits\DateTrait;

class TagDocumentParserTest extends \PHPUnit_Framework_TestCase
{
    use DateTrait;

    public function testSupport()
    {
        $parser = $this->getDocumentParser();

        $el = [
            '_index' => 'tags',
            '_type' => 'tag',
        ];
        $this->assertTrue($parser->support($el));

        $el = [
            '_index' => 'not_tags',
            '_type' => 'tag',
        ];
        $this->assertFalse($parser->support($el));

        $el = [
            '_index' => 'tags',
            '_type' => 'not_tag',
        ];
        $this->assertFalse($parser->support($el));
    }

    public function testParse()
    {
        $hitElements[] = $this->getTagDoc(1);
        $hitElements[] = $this->getTagDoc(2, [
            '_source' => [
                'private' => true,
            ],
        ]);
        $hitElements[] = $this->getTagDoc(2);

        $parser = $this->getDocumentParser();

        foreach ($hitElements as $hitElement) {
            $source = $hitElement['_source'];
            $tag = $parser->parse($hitElement);

            $this->assertInstanceOf(Tag::class, $tag);
            $this->assertEquals($hitElement['_id'], $tag->getId());
            $this->assertEquals($source['name'], $tag->getName());
            $this->assertEquals($source['displayName'], $tag->getDisplayName());
            $this->assertEquals($source['private'], $tag->getPrivate());
            $this->assertEquals($source['user']['id'], $tag->user->getId());
            $this->assertEquals($source['user']['name'], $tag->user->getName());
            $this->assertEquals($source['user']['companyName'], $tag->user->companyName);
            $this->assertEquals($this->getDate()->format('c'), $tag->getCreatedAt()->format('c'));
        }
    }

    public function testParseSuggest()
    {
        $hitElements[] = $this->getTagDoc(1, [
            'text' => 'Test tag 1',
        ]);
        $hitElements[] = $this->getTagDoc(1, [
            'text' => 'Test tag 2',
            '_source' => [
                'private' => true,
            ],
        ]);

        $parser = $this->getDocumentParser();

        foreach ($hitElements as $hitElement) {
            $source = $hitElement['_source'];
            $tag = $parser->parse($hitElement);

            $this->assertInstanceOf(Tag::class, $tag);
            $this->assertEquals($hitElement['_id'], $tag->getId());
            $this->assertEquals($source['name'], $tag->getName());
            $this->assertEquals($source['displayName'], $tag->getDisplayName());
            $this->assertEquals($source['private'], $tag->getPrivate());
            $this->assertEquals($source['user']['id'], $tag->user->getId());
            $this->assertEquals($source['user']['name'], $tag->user->getName());
            $this->assertEquals($source['user']['companyName'], $tag->user->companyName);
            $this->assertEquals($this->getDate()->format('c'), $tag->getCreatedAt()->format('c'));

            if (isset($hitElement['text'])) {
                $this->assertEquals($hitElement['text'], $tag->getSuggest());
            }
        }
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage Supported index "tags" and mapping "tag"
     */
    public function testParseFailure()
    {
        $hitElement = $this->getTagDoc(1, [
            '_index' => 'not_tags',
            '_type' => 'not_tag',
            'text' => 'Test tag 1',
        ]);

        $parser = $this->getDocumentParser();

        $parser->parse($hitElement);
    }

    private function getDocumentParser()
    {
        return new TagDocumentParser('tags', 'tag');
    }

    private function getTagDoc($id = 1, array $doc = [])
    {
        return array_replace_recursive(
            [
                '_index' => 'tags',
                '_type' => 'tag',
                '_id' => $id,
                '_source' => [
                    'suggest' => 'Test tag '.$id,
                    'name' => 'test_tag_'.$id,
                    'displayName' => 'Test tag_'.$id,
                    'private' => false,
                    'user' => $this->getUserDoc(2),
                    'createdAt' => $this->getDate()->format('c'),
                ],
            ],
            $doc
        );
    }

    private function getUserDoc($id)
    {
        return [
            'id' => $id,
            'name' => 'Name',
            'companyName' => 'Company name',
        ];
    }
}
