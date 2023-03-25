<?php

namespace AppBundle\Elastic\Article\Mapping;

use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\ArticleTag;
use AppBundle\Elastic\Integration\Mapping\MappingTemplate;

class ArticleMapping extends MappingTemplate
{
    const TYPE = 'article';

    /**
     * @return ArticleDocumentParser
     */
    public function getDocumentParser()
    {
        return new ArticleDocumentParser($this->getIndex(), $this->getMapping());
    }

    /**
     * @param $entity
     *
     * @return bool
     */
    public function support($entity)
    {
        return $entity instanceof Article;
    }

    /**
     * @return array
     */
    protected function getSettings()
    {
        return [
            'analysis' => [
                'analyzer' => [
                    'standard_no_tags' => [
                        'type' => 'custom',
                        'tokenizer' => 'standard',
                        'char_filter' => [
                            'html_strip',
                        ],
                        'filter' => [
                            'standard', 'lowercase', 'stop',
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * @return array
     */
    protected function getProperties()
    {
        return [
            'slug' => [
                'type' => 'keyword',
            ],
            'token' => [
                'type' => 'keyword',
            ],
            'title' => [
                'type' => 'text',
            ],
            'subtitle' => [
                'type' => 'text',
            ],
            'description' => [
                'type' => 'text',
            ],
            'primaryImage' => [
                'type' => 'object',
            ],
            'body' => [
                'type' => 'text',
                'analyzer' => 'standard_no_tags',
            ],
            'author' => [
                'properties' => [
                    'id' => [
                        'type' => 'integer',
                    ],
                    'name' => [
                        'type' => 'keyword',
                    ],
                    'companyName' => [
                        'type' => 'keyword',
                    ],
                    'profileImage' => [
                        'type' => 'keyword',
                    ],
                    'profileImageManual' => [
                        'type' => 'keyword',
                    ],
                ],
            ],
            'assignee' => [
                'properties' => [
                    'id' => [
                        'type' => 'integer',
                    ],
                    'name' => [
                        'type' => 'keyword',
                    ],
                    'companyName' => [
                        'type' => 'keyword',
                    ],
                    'profileImage' => [
                        'type' => 'keyword',
                    ],
                    'profileImageManual' => [
                        'type' => 'keyword',
                    ],
                ],
            ],
            'likesCount' => [
                'type' => 'integer',
            ],
            'messagesCount' => [
                'type' => 'integer',
            ],
            'tags' => [
                'type' => 'text',
            ],
            'published' => [
                'type' => 'boolean',
            ],
            'publishedAt' => [
                'type' => 'date',
            ],
            'updatedAt' => [
                'type' => 'date',
            ],
            'rank' => [
                'type' => 'integer',
            ],
        ];
    }

    /**
     * @param Article $article
     *
     * @return array
     */
    protected function doGetDocument($article)
    {
        $author = $article->getAuthor();
        $assignee = $article->getAssignee();

        return [
            'slug' => $article->getSlug(),
            'token' => $article->getToken(),
            'title' => $article->getTitle(),
            'subtitle' => $article->getSubtitle(),
            'description' => $article->getDescription(),
            'primaryImage' => $this->getPrimaryImage($article),
            'body' => $article->getBody(),
            'author' => [
                'id' => $author->getId(),
                'name' => $author->getName(),
                'companyName' => $author->getCompanyName(),
                'profileImage' => $author->profileImage,
                'profileImageManual' => $author->profileImageManual,
            ],
            'assignee' => $assignee
                ? [
                    'id' => $assignee->getId(),
                    'name' => $assignee->getName(),
                    'companyName' => $assignee->getCompanyName(),
                    'profileImage' => $assignee->profileImage,
                    'profileImageManual' => $assignee->profileImageManual,
                ]
                : null,
            'likesCount' => $article->getLikesCount(),
            'messagesCount' => $article->getMessagesCount(),
            'tags' => $this->getTags($article),
            'published' => null !== $article->getPublishedAt() ? true : false,
            'publishedAt' => $article->getPublishedAt() ? $article->getPublishedAt()->format('c') : null,
            'updatedAt' => $article->getUpdatedAt() ? $article->getUpdatedAt()->format('c') : null,
            'rank' => 0,
        ];
    }

    /**
     * @param Article $article
     *
     * @return array
     */
    private function getTags(Article $article)
    {
        return array_map(function (ArticleTag $tag) {
            return $tag->getTag()->getDisplayName();
        }, $article->getTags()->toArray());
    }

    /**
     * @param Article $article
     *
     * @return array
     */
    private function getPrimaryImage(Article $article)
    {
        $image = $article->getPrimaryImage();

        if (!$image) {
            return [];
        }

        return [
            'hash' => $image->getFile()->hash,
            'ext' => $image->getFile()->ext,
        ];
    }
}
