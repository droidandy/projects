<?php

namespace Learning\Serialization;

use JMS\Serializer\Annotation as Serializer;
use JMS\Serializer\Construction\ObjectConstructorInterface;
use JMS\Serializer\DeserializationContext;
use JMS\Serializer\Metadata\ClassMetadata;
use JMS\Serializer\SerializerInterface;
use JMS\Serializer\VisitorInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use AppBundle\Entity\Social\Article;

class JMSSerializerTest extends KernelTestCase
{
    /**
     * @var SerializerInterface
     */
    private $jmsSerializer;

    protected function setUp()
    {
        self::bootKernel();
        $container = self::$kernel->getContainer();
        $container->set('jms_serializer.unserialize_object_constructor', new ArticleConstructor());
        $this->jmsSerializer = $container->get('jms_serializer');
    }

    public function testUpdateExistingObject()
    {
        $jsonData = <<<JSON
    {"id": 1, "token": "aabb", "title": "deserialized title"}
JSON;
        $article = $this->jmsSerializer->deserialize($jsonData, Article::class, 'json');

        $this->assertEquals('aabb', $article->getToken());
        $this->assertEquals('deserialized title', $article->getTitle());
        $this->assertEquals('original subtitle', $article->getSubtitle());
        $this->assertEquals('original description', $article->getDescription());
        $this->assertEquals('original body', $article->getBody());
        $this->assertEquals(new \DateTime('May 15th 2017'), $article->getCreatedAt());

        $jsonData = <<<JSON
    {"id": 1, "token": "aabb", "title": null}
JSON;
        $article = $this->jmsSerializer->deserialize($jsonData, Article::class, 'json');

        $this->assertEquals('aabb', $article->getToken());
        $this->assertEquals(null, $article->getTitle());
        $this->assertEquals('original subtitle', $article->getSubtitle());
        $this->assertEquals('original description', $article->getDescription());
        $this->assertEquals('original body', $article->getBody());
        $this->assertEquals(new \DateTime('May 15th 2017'), $article->getCreatedAt());

        $jsonData = <<<JSON
    {"id": 1, "token": "aabb"}
JSON;
        $article = $this->jmsSerializer->deserialize($jsonData, Article::class, 'json');

        $this->assertEquals('aabb', $article->getToken());
        $this->assertEquals('original title', $article->getTitle());
        $this->assertEquals('original subtitle', $article->getSubtitle());
        $this->assertEquals('original description', $article->getDescription());
        $this->assertEquals('original body', $article->getBody());
        $this->assertEquals(new \DateTime('May 15th 2017'), $article->getCreatedAt());
    }

    public function testNullValue()
    {
        $jsonData = '{"greek":null, "italian":null}';
        $a = $this->jmsSerializer->deserialize($jsonData, Geko::class, 'json');
        $this->assertEquals(null, $a->greek);
        $this->assertEquals(null, $a->italian);

        $jsonData = '{"greek":[{"creep":"creep"}]}';
        $a = $this->jmsSerializer->deserialize($jsonData, Geko::class, 'json');
        $this->assertEquals(1, count($a->greek));
    }

    public function testArrayValue()
    {
        $jsonData = '[{"creep":"creep_one"}, {"creep":"creep_two"}]';
        $a = $this->jmsSerializer->deserialize($jsonData, 'array<Learning\Serialization\Bramante>', 'json');
        $this->assertEquals(2, count($a));
        $this->assertEquals('creep_one', $a[0]->creep);
        $this->assertEquals('creep_two', $a[1]->creep);
    }

    public static function buildArticle()
    {
        $article = new Article();
        $article->setTitle('original title');
        $article->setSubtitle('original subtitle');
        $article->setDescription('original description');
        $article->setBody('original body');
        $article->setCreatedAt(new \DateTime('May 15th 2017'));

        return $article;
    }
}

class Geko
{
    /**
     * @Serializer\Type("ArrayCollection<Learning\Serialization\Bramante>")
     */
    public $greek;
    /**
     * @Serializer\Type("string")
     */
    public $italian = 'ita';
}

class Bramante
{
    /**
     * @Serializer\Type("string")
     */
    public $creep;
}

class ArticleConstructor implements ObjectConstructorInterface
{
    public function construct(VisitorInterface $visitor, ClassMetadata $metadata, $data, array $type, DeserializationContext $context)
    {
        return JMSSerializerTest::buildArticle();
    }
}
