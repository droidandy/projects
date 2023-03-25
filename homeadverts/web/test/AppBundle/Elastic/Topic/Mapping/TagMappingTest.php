<?php

namespace Test\AppBundle\Elastic\Category\Mapping;

use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Tag\Mapping\TagDocumentParser;
use AppBundle\Elastic\Tag\Mapping\TagMapping;
use AppBundle\Entity\User\User;
use Test\AppBundle\Elastic\Integration\Mapping\AbstractMappingTemplateTest;
use Test\Utils\Traits\DateTrait;

class TagMappingTest extends AbstractMappingTemplateTest
{
    use DateTrait;

    protected function getDocumentParserClass()
    {
        return TagDocumentParser::class;
    }

    public function testAddDocumentSuccessful()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $client */
        $client = $this->client;
        $mapping = $this->mappingTemplate;

        $user = new User();
        $user->name = 'Name';
        $user->companyName = 'Company name';

        $tag1 = new Tag();
        $tag1->setDisplayName('Test tag');
        $tag1->setName('test_tag');
        $tag1->setPrivate(false);
        $tag1->user = $user;

        $tag2 = new Tag();
        $tag2->setDisplayName('Test tag');
        $tag2->setName('test_tag');
        $tag2->setPrivate(true);
        $tag2->user = $user;

        $client
            ->expects($this->exactly(2))
            ->method('index')
            ->withConsecutive(
                [
                    [
                        'index' => $this->getIndex(),
                        'type' => $this->getMapping(),
                        'id' => 1,
                        'body' => [
                            'suggest' => 'Test tag',
                            'name' => 'test_tag',
                            'displayName' => 'Test tag',
                            'private' => false,
                            'user' => $this->getUserDoc(null),
                            'createdAt' => $tag1->getCreatedAt()->format('c'),
                        ],
                    ],
                ],
                [
                    [
                        'index' => $this->getIndex(),
                        'type' => $this->getMapping(),
                        'id' => 1,
                        'body' => [
                            'suggest' => 'Test tag',
                            'name' => 'test_tag',
                            'displayName' => 'Test tag',
                            'private' => true,
                            'user' => $this->getUserDoc(null),
                            'createdAt' => $tag2->getCreatedAt()->format('c'),
                        ],
                    ],
                ]
            )
            ->willReturn([
                'result' => 'created',
            ])
        ;

        $mapping->addDocument(1, $tag1);
        $mapping->addDocument(1, $tag2);
    }

    protected function getIndex()
    {
        return 'tags';
    }

    protected function getMapping()
    {
        return 'tag';
    }

    protected function getMappingTemplate($index, $mapping, $client, $populateESRepo, $em, $logger)
    {
        return new TagMapping($index, $mapping, $client, $populateESRepo, $em, $logger);
    }

    protected function getPropertyDefinition()
    {
        return [
            'suggest' => [
                'type' => 'completion',
            ],
            'name' => [
                'type' => 'keyword',
            ],
            'displayName' => [
                'type' => 'text',
                'fields' => [
                    'raw' => [
                        'type' => 'keyword',
                    ],
                ],
            ],
            'private' => [
                'type' => 'boolean',
            ],
            'createdAt' => [
                'type' => 'date',
            ],
        ];
    }

    protected function getPropertyDefinitionToUpdate()
    {
        return [
            'suggest' => [
                'type' => 'completion',
            ],
        ];
    }

    protected function getIdValue()
    {
        return 1;
    }

    protected function getPropertyValues()
    {
        return [
            'suggest' => 'Test tag',
            'name' => 'test_tag',
            'displayName' => 'Test tag',
            'private' => false,
            'user' => $this->getUserDoc(null),
            'createdAt' => $this->getDate()->format('c'),
        ];
    }

    protected function getPropertyValuesToUpdate()
    {
        return ['suggest'];
    }

    protected function getPropertyValuesToUpdateNonexisting()
    {
        return ['nonexisting_field'];
    }

    protected function getEntity()
    {
        $user = new User();
        $user->name = 'Name';
        $user->companyName = 'Company name';

        $tag = new Tag();
        $tag->setDisplayName('Test tag');
        $tag->setName('test_tag');
        $tag->setPrivate(false);
        $tag->user = $user;
        $tag->setCreatedAt($this->getDate());

        return $tag;
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
