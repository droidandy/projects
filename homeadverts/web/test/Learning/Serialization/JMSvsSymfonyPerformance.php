<?php

namespace Learning\Serialization;

use AppBundle\Entity\Social\Article;
use AppBundle\Entity\User\User;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Faker;

class JMSvsSymfonyPerformance extends KernelTestCase
{
    public static $seed;

    public static function setUpBeforeClass()
    {
        self::$seed = mt_rand();
    }

    protected function setUp()
    {
        self::bootKernel();
    }

    public function testSerializationSymfony()
    {
        $symfonySerializer = static::$kernel->getContainer()->get('serializer');

        $startTime = microtime(true);
        $articles = $this->generateRandomData();
        $serializedArticles = $symfonySerializer->serialize($articles, 'json');
        $endTime = microtime(true) - $startTime;
        $memoryUsage = memory_get_peak_usage();

        echo sprintf("\n[Symfony] Execution stats: time to serialize %s | peak memory usage %s\n", $endTime, $memoryUsage / 1024 / 1024);

        return $serializedArticles;
    }

    public function testSerializationJMS()
    {
        $jmsSerializer = SerializerBuilder::create()->build();

        $startTime = microtime(true);
        $articles = $this->generateRandomData();
        $serializedArticles = $jmsSerializer->serialize($articles, 'json');
        $endTime = microtime(true) - $startTime;
        $memoryUsage = memory_get_peak_usage();

        echo sprintf("\n[JMS] Execution stats: time to serialize %s | peak memory usage %s\n", $endTime, $memoryUsage / 1024 / 1024);

        return $serializedArticles;
    }

    public function testDeserializationSymfony()
    {
        $symfonySerializer = static::$kernel->getContainer()->get('serializer');

        $articles = $this->generateRandomData();
        $articlesJson = [];
        foreach ($articles as $article) {
            $articlesJson[] = $symfonySerializer->serialize($article, 'json');
        }
        $startTime = microtime(true);
        $articles = [];
        foreach ($articlesJson as $articleJson) {
            $articles[] = $symfonySerializer->deserialize($articleJson, Article::class, 'json');
        }
        $endTime = microtime(true) - $startTime;
        $memoryUsage = memory_get_peak_usage();

        echo sprintf("[Symfony] Execution stats: time to deserialize %s | peak memory usage %s\n", $endTime, $memoryUsage / 1024 / 1024);
    }

    public function testDeserializationJMS()
    {
        $jmsSerializer = SerializerBuilder::create()->build();

        $articles = $this->generateRandomData();
        $articlesJson = [];
        foreach ($articles as $article) {
            $articlesJson[] = $jmsSerializer->serialize($article, 'json');
        }
        $startTime = microtime(true);
        $articles = [];
        foreach ($articlesJson as $articleJson) {
            $articles[] = $jmsSerializer->deserialize($articleJson, Article::class, 'json');
        }
        $endTime = microtime(true) - $startTime;
        $memoryUsage = memory_get_peak_usage();

        echo sprintf("[JMS] Execution stats: time to deserialize %s | peak memory usage %s\n", $endTime, $memoryUsage / 1024 / 1024);
    }

    private function generateRandomData()
    {
        $faker = Faker\Factory::create();
        $faker->seed(self::$seed);

        $articles = [];
        for ($i = 0; $i < 1000; ++$i) {
            $articles[] = $this->buildArticle($faker, $this->buildAuthor($faker));
        }

        return $articles;
    }

    private function buildArticle(Faker\Generator $faker, User $author)
    {
        $article = new Article();
        $article->setTitle($faker->title);
        $article->setSubtitle($faker->title);
        $article->setDescription($faker->title);
        $article->setBody($faker->text);
        $article->setToken($faker->randomNumber());
        $article->setCreatedAt($faker->dateTime);
        $article->setUpdatedAt($faker->dateTime);
        $article->setPublishedAt($faker->dateTime);
        $article->setAuthor($author);

        return $article;
    }

    private function buildAuthor(Faker\Generator $faker)
    {
        $user = new User();
        $user->setUsername($faker->userName);
        $user->setName($faker->name);
        $user->setEmail($faker->email);
        $user->setPassword($faker->password);
        $user->setEnabled(true);
        $user->setLocked(false);

        return $user;
    }
}
