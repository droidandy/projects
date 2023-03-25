<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Social\ArticleImage;
use AppBundle\Entity\Storage\File;
use DateTime;
use Faker;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\ArticleLike;
use AppBundle\Entity\Social\Tag;
use AppBundle\Entity\User\User;

trait ArticleTrait
{
    /**
     * @var int
     */
    private $token = 1;
    /**
     * @var callable|null
     */
    private $articleDataGenerator;

    /**
     * @param User     $user
     * @param Article  $article
     * @param DateTime $createdAt
     *
     * @return ArticleLike
     */
    public function newArticleLikePersistent(User $user, Article $article, DateTime $createdAt = null)
    {
        $like = new ArticleLike();
        $like->setUser($user);
        $like->setLiked($article);

        if ($createdAt) {
            $like->setCreatedAt($createdAt);
        }

        $article->likes->add($like);
        $this->em->persist($like);
        $this->em->flush($like);

        return $like;
    }

    /**
     * @return Article
     */
    public function newSocialArticle()
    {
        $user = $this->newUser();
        $article = $this->newArticle([
            'user' => $user,
        ]);
        $article->setToken('00000');
        $article->setTitle('Hello World');
        $article->setSubtitle('...');

        return $article;
    }

    /**
     * @param array|null $data
     *
     * @return Article
     */
    public function newArticle(array $data = [])
    {
        $faker = $this->getFaker();
        $text = $faker->text(100);

        if ($this->articleDataGenerator) {
            $articleDataGenerator = $this->articleDataGenerator;
            $data = array_replace_recursive($articleDataGenerator(), $data);
        }

        $data = array_merge([
            'slug' => null,
            'title' => null,
            'subtitle' => null,
            'description' => null,
            'tags' => [],
            'body' => null,
            'token' => null,
            'user' => null,
            'images' => [],
            'published_at' => null,
        ], $data);

        if ($data['body']) {
            $text = $data['body'];
        }
        if (count($data['images']) > 0) {
            $text = $this->putImagesIntoText($text, $data['images'], $data['images'][0]);
        }

        $article = new Article();
        $article->setSlug($data['slug']);
        $article->setTitle($data['title'] ?: $faker->text(10));
        $article->setSubtitle($data['subtitle'] ?: $faker->text(20));
        $article->setDescription($data['description'] ?: $faker->text(30));
        $article->setBody($text);
        $article->setToken($data['token'] ?: md5(time().$faker->numberBetween(0, 9999999)));

        if (!$data['user'] || is_array($data['user'])) {
            $data['user'] = $this->newUser((array) $data['user']);
        }
        $article->setAuthor($data['user']);

        if (!empty($data['tags'])) {
            if (is_string($data['tags'][0])) {
                $data['tags'] = array_map(function ($tagName) use ($data) {
                    return $this->createOrFetchTag([
                        'displayName' => $tagName,
                        'user' => $data['user'],
                    ]);
                }, $data['tags']);
            }
            $article->addRawTags($data['tags'], $data['user']);
        }

        $article->setPublishedAt($data['published_at']);

        return $article;
    }

    /**
     * @param array|int $articleDataOrCount
     *
     * @return Article[]
     */
    public function createArticles($articleDataOrCount)
    {
        $articles = [];
        if (is_array($articleDataOrCount)) {
            foreach ($articleDataOrCount as $articleData) {
                $articles[] = $this->newArticle($articleData);
            }
        } elseif (is_int($articleDataOrCount)) {
            for ($i = 0; $i < $articleDataOrCount; ++$i) {
                $articles[] = $this->newArticle();
            }
        }

        return $articles;
    }

    /**
     * @param string $term
     * @param array  $data
     *
     * @return Article[]
     */
    public function createArticlesWithSearchTerm($term, array $data = [])
    {
        $articles = [];

        foreach ($data as $name => $count) {
            switch ($name) {
                case 'author.name':
                    $articleDoc = [
                        'user' => ['name' => $term],
                    ]; break;
                case 'author.companyName':
                    $articleDoc = [
                        'user' => ['companyName' => $term],
                    ]; break;
                case 'tags':
                    $articleDoc = [
                        'tags' => [$term.' article_tag'],
                    ]; break;
                default:
                    $articleDoc = [
                        $name => $term,
                    ]; break;
            }
            $articleDoc = array_merge([
                'slug' => '---',
                'title' => '---',
                'subtitle' => '---',
                'description' => '---',
                'tags' => ['---'],
                'body' => '---',
// @TODO fix counting token, fails to be set that way for some reasons
//                    'token' => $this->token++,
                'user' => [
                    'name' => '---',
                    'companyName' => '---',
                ],
            ], $articleDoc);
            $articleData = array_fill(0, $count, $articleDoc);
            $articles = array_merge($articles, $this->createArticles($articleData));
        }

        return $articles;
    }

    /**
     * @param int $count
     *
     * @return Article[]
     */
    public function createArticlesNonsearcheable($count)
    {
        $articleData = [];
        for ($i = 0; $i < $count; ++$i) {
            $articleData[] = array_fill(0, $count, [
                'slug' => '---',
                'title' => '---',
                'subtitle' => '---',
                'description' => '---',
                'tags' => ['---'],
                'body' => '---',
// @TODO fix counting token, fails to be set that way for some reasons
//                'token' => $this->token++,
                'user' => [
                    'name' => '---',
                    'companyName' => '---',
                ],
            ]);
        }

        return $this->createArticles($articleData);
    }

    /**
     * @param array  $arguments
     * @param string $createMethod
     *
     * @return Article[]
     */
    public function createArticlesPersistent($arguments, $createMethod = 'createArticles')
    {
        $em = $this->getEntityManager();
        $articles = $this->$createMethod(...$arguments);
        foreach ($articles as $article) {
            foreach ($article->getTags() as $articleTag) {
                $em->persist($articleTag->getTag());
            }
            $em->persist($article->getAuthor());
            $em->persist($article);
        }

        if ($this->flush) {
            $em->flush($articles);

            $client = $this->getContainer()->get('es_client');
            $client->indices()->refresh(['index' => 'test_articles']);
        }

        return $articles;
    }

    /**
     * @param string $term
     * @param array  $data
     *
     * @return Article[]
     */
    public function createArticlesWithSearchTermPersistent($term, $data)
    {
        return $this->createArticlesPersistent([$term, $data], 'createArticlesWithSearchTerm');
    }

    /**
     * @param int $count
     *
     * @return Article[]
     */
    public function createArticlesNonsearcheablePersistent($count)
    {
        return $this->createArticlesPersistent([$count], 'createArticlesNonsearcheable');
    }

    /**
     * @param string $text
     * @param array  $files
     * @param File $primaryFile
     *
     * @return string
     */
    protected function putImagesIntoText($text, array $files, File $primaryFile)
    {
        $prevPosition = 0;
        $textChunks = [];

        foreach ($files as $file) {
            $position = mt_rand($prevPosition, strlen($text));
            $textChunks[] = substr($text, $prevPosition, $position - $prevPosition);

            if ($primaryFile->hash == $file->hash) {
                $textChunks[] = sprintf(
                    '<img src="%s" class="primary-media"/>',
                    'https://cdn.homeadverts.dev/media/'. $file->getNameOnStorage()
                );
            } else {
                $textChunks[] = sprintf(
                    '<img src="%s"/>',
                    'https://cdn.homeadverts.dev/media/'. $file->getNameOnStorage()
                );
            }
        }

        $textChunks[] = substr($text, $prevPosition);
        $text = implode('', $textChunks);

        return $text;
    }

    /**
     * @param array $data
     *
     * @return Article
     */
    protected function newArticlePersistent($data = [])
    {
        $article = $this->newArticle($data);

        $this->em->persist($article->getAuthor());
        $this->em->persist($article);
        $this->em->flush($article);

        return $article;
    }

    /**
     * @param $token
     * @param array $images
     *
     * @return array
     */
    private function generateArticleData($token, array $images)
    {
        // Route format on S3 was changed from "/%s/%s to "/%s/%s/%s"
        // https://luxuryaffairs-dev.s3.amazonaws.com/media/6b/e2/ed3919f64191493bf71f78376614c8c38a5433520d0306713df5af22a73a.jpeg

        $imagedText = <<<TEXT
                I give Pirrip as my father’s family name, on the authority of his tombstone and my sister,—Mrs. Joe Gargery, who married the blacksmith.
                As I never saw my father or my mother, and never saw any likeness of either of them (for their days were long before the days of photographs),
                my first fancies regarding what they were like were unreasonably derived from their tombstones.
                The shape of the letters on my father’s, gave me an odd idea that he was a square, stout, dark man, with curly black hair. From the character and turn of the inscription,
                “Also Georgiana Wife of the Above,” I drew a childish conclusion that my mother was freckled and sickly. To five little stone lozenges, each about a foot and a half long,
                which were arranged in a neat row beside their grave, and were sacred to the memory of five li</b>ttle brothers of mine,—who gave up trying to get a living,
                exceedingly early in that universal struggle,—I am indebted for a belief I religiously entertained that they had all been born on their backs with their hands in their trousers-pockets,
                and had never taken them out in this state of existence.
TEXT;
        $prevPosition = 0;
        $textChunks = [];

        foreach ($images as $image) {
            $name = $image->hash;
            $position = mt_rand($prevPosition, strlen($imagedText));
            $textChunks[] = substr($imagedText, $prevPosition, $position - $prevPosition);
            $textChunks[] = sprintf(
                '<img src="%s"/>',
                'https://cdn.homeadverts.dev/media/'
                .substr($name, 0, 2).'/'
                .substr($name, 2, 2).'/'
                .substr($name, 4).'.jpg'
            );
        }

        $textChunks[] = substr($imagedText, $prevPosition);
        $imagedText = implode('', $textChunks);
        $data = [
            'token' => $token,
            'title' => $this->faker->title,
            'body' => <<<TEXT
                <p>My father’s family na<i>me being <a href="https://en.wikipedia.org/wiki/Pip_(Great_Expectations)">Pirrip</a>, and my Christian name Philip,
                my infant tongue could make of both names nothing </i>longer or more explicit than Pip.
                So, I called myself Pip, and came to be called Pip.</p>
                <p><b>I give Pirrip as my father’s family name, on the authority of his tombstone and my sister,—Mrs. Joe Gargery, who married the blacksmith.
                As I never saw my father or my mother, and never saw any likeness of either of them (for their days were long before the days of photographs),
                my first fancies regarding what they were like were unreasonably derived from their tombstones.
{$imagedText}
                The shape of the letters on my father’s, gave me an odd idea that he was a square, stout, dark man, with curly black hair. From the character and turn of the inscription,
                “Also Georgiana Wife of the Above,” I drew a childish conclusion that my mother was freckled and sickly. To five little stone lozenges, each about a foot and a half long,
                which were arranged in a neat row beside their grave, and were sacred to the memory of five li</b>ttle brothers of mine,—who gave up trying to get a living,
                exceedingly early in that universal struggle,—I am indebted for a belief I religiously entertained that they had all been born on their backs with their hands in their trousers-pockets,
                and had never taken them out in this state of existence.</p>
                <p>Ours was the marsh country, down by the river, within, as the river wound, twenty miles of the sea.
                My first most vivid and broad impression of the identity of things seems to me to have been gained on a memorable raw afternoon towards evening.
                At such a time I found out for certain that this bleak place overgrown with nettles was the churchyard; and that Philip Pirrip, late of this parish, and also Georgiana wife of the above,
                were dead and buried; and that Alexander, Bartholomew, Abraham, Tobias, and Roger, infant children of the aforesaid, were also dead and buried;
                and that the dark flat wilderness beyond the churchyard, intersected with dikes and mounds and gates, with scattered cattle feeding on it, was the marshes;
                and that the low leaden line beyond was the river; and that the distant savage lair from which the wind was rushing was the sea;
                and that the small bundle of shivers growing afraid of it all and beginning to cry, was Pip.</p>
TEXT
        ];

        return $data;
    }

    // Wrong order
    // See https://stackoverflow.com/questions/16731240/what-is-a-reasonable-order-of-java-modifiers-abstract-final-public-static-e

    /**
     * @param array $userData
     *
     * @return User
     */
    abstract public function newUser(array $userData = []);

//    /**
//     * @param array $tagData
//     * @return Tag
//     */
//    abstract public function newTag(array $tagData = []);

    /**
     * @return Faker\Generator
     */
    abstract protected function getFaker();
}
