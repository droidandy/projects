<?php

namespace AppBundle\Elastic\Tag\Mapping;

use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Integration\Mapping\AbstractDocumentParserTemplate;
use AppBundle\Entity\User\User;

class TagDocumentParser extends AbstractDocumentParserTemplate
{
    /**
     * @param array $document
     *
     * @return Tag
     */
    protected function doParse(array $document)
    {
        $tag = new Tag();
        $tag->setId($document['_id']);
        $tag->setName($document['_source']['name']);
        $tag->setDisplayName($document['_source']['displayName']);
        $tag->setPrivate($document['_source']['private']);
        $tag->setCreatedAt(new \DateTime($document['_source']['createdAt']));

//        if (isset($document['text'])) {
//            $tag->setSuggest($document['text']);
//        }

        return $tag;
    }

    /**
     * @param array $data
     *
     * @return User
     */
    private function getUser(array $data)
    {
        $user = new User();
        $user->setId($data['id']);
        $user->setName($data['name']);
        $user->companyName = $data['companyName'];

        return $user;
    }
}
