<?php

namespace AppBundle\Elastic\Article\Mapping;

use AppBundle\Entity\Storage\File;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\ArticleImage;
use AppBundle\Entity\Social\ArticleTag;
use AppBundle\Entity\Social\Tag;
use AppBundle\Elastic\Integration\Mapping\AbstractDocumentParserTemplate;
use AppBundle\Entity\User\User;

class ArticleDocumentParser extends AbstractDocumentParserTemplate
{
    /**
     * @param array $document
     *
     * @return Article
     */
    protected function doParse(array $document)
    {
        $source = $document['_source'];

        $article = new Article();
        $article->setId($document['_id']);
        $article->setSlug($source['slug']);
        $article->setToken($source['token']);
        $article->setTitle($source['title']);
        $article->setSubtitle($source['subtitle']);
        $article->setDescription($source['description']);
        $article->setBody($source['body']);
        $article->setLikesCount($source['likesCount']);
        $article->setAuthor($this->getUser($source['author']));
        $article->setAssignee(
            $source['assignee']
                ? $this->getUser($source['assignee'])
                : null
        );
        $article->setTags($this->getTags($source['tags']));
        $article->setPublishedAt(new \DateTime($source['publishedAt']));
        $article->setUpdatedAt(new \DateTime($source['updatedAt']));

        if ($source['primaryImage']) {
            $article->setImages($this->getImages($source['primaryImage']));
        }

        return $article;
    }

    /**
     * @param array $userDoc
     *
     * @return User
     */
    private function getUser($userDoc)
    {
        $author = new User();
        $author->setId($userDoc['id']);
        $author->setName($userDoc['name']);
        $author->companyName = $userDoc['companyName'];
        $author->profileImage = $userDoc['profileImage'];
        $author->profileImageManual = $userDoc['profileImageManual'];

        return $author;
    }

    /**
     * @param $fileDoc
     *
     * @return ArticleImage[]
     */
    private function getImages(array $fileDoc)
    {
        $file = new File();
        $file->hash = $fileDoc['hash'];
        $file->ext = $fileDoc['ext'];

        $image = new ArticleImage();
        $image->setFile($file);
        $image->setOrder(0);

        return [
            $image,
        ];
    }

    /**
     * @param $tagDocs
     *
     * @return array
     */
    private function getTags($tagDocs)
    {
        $articleTags = [];
        foreach ($tagDocs as $tagDoc) {
            $tag = new Tag();
            $tag->setDisplayName($tagDoc);

            $articleTags[] = $articleTag = new ArticleTag();
            $articleTag->setTag($tag);
        }

        return $articleTags;
    }
}
