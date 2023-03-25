<?php

namespace AppBundle\Elastic\Tag\Mapping;

use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Integration\Mapping\MappingTemplate;
use AppBundle\Entity\User\User;

class TagMapping extends MappingTemplate
{
    const TYPE = 'tag';

    /**
     * @return TagDocumentParser
     */
    public function getDocumentParser()
    {
        return new TagDocumentParser($this->getIndex(), $this->getMapping());
    }

    /**
     * @param object $entity
     *
     * @return bool
     */
    public function support($entity)
    {
        return $entity instanceof Tag;
    }

    /**
     * @return array
     */
    protected function getProperties()
    {
        return [
            /*
             * @link https://www.elastic.co/guide/en/elasticsearch/reference/current/suggester-context.html#_category_query
             * When no categories are provided at query-time, all indexed documents are considered.
             * as it will degrade search performance.
             */
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

    /**
     * @param Tag $tag
     *
     * @return array
     */
    protected function doGetDocument($tag)
    {
        return [
            'suggest' => $tag->getDisplayName(),
            'name' => $tag->getName(),
            'displayName' => $tag->getDisplayName(),
            'private' => $tag->getPrivate(),
            'user' => $this->getUser($tag->user),
            'createdAt' => $tag->getCreatedAt()->format('c'),
        ];
    }

    /**
     * @param User $user
     *
     * @return array
     */
    private function getUser(User $user)
    {
        return [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'companyName' => $user->getCompanyName(),
        ];
    }
}
