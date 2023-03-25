<?php

namespace Test\AppBundle;

use Doctrine\ORM\EntityManager;
use Faker;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpKernel\KernelInterface;
use Doctrine\DBAL\Connection;

abstract class AbstractTestCase extends KernelTestCase
{
    /**
     * @var \Faker\Generator
     */
    protected $faker;
    /**
     * @var EntityManager
     */
    protected $em;
    /**
     * @var KernelInterface
     */
    protected static $kernel = null;
    /**
     * @var int
     */
    protected static $seed = 2000;
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var bool
     */
    protected $rollbackTransactions = false;

    /**
     * @param string $name
     *
     * @return string
     */
    public function getTemporaryFilename($name)
    {
        return sys_get_temp_dir().'/'.$name;
    }

    /**
     * @return string
     */
    public function getFixturesPath()
    {
        return realpath($this
                ->getContainer()
                ->getParameter('kernel.root_dir').'/../test/fixtures/').'/';
    }

    /**
     * @param string $fixture
     *
     * @return string
     */
    public function getFixturePath($fixture)
    {
        return $this->getFixturesPath().$fixture;
    }

    /**
     * @return bool|string
     */
    protected function getStaticFixturesDirectory()
    {
        return realpath(__DIR__.'/../fixtures/');
    }

    /**
     * @param string $filename
     *
     * @return string
     */
    protected function getStaticFixture($filename)
    {
        return $this->getStaticFixturesDirectory().'/'.$filename;
    }

    /**
     * @param $entity
     */
    public function removeEntity($entity)
    {
        $this->em->remove($entity);
        $this->em->flush();

        $isFound = $this
            ->em
            ->getRepository(get_class($entity))
            ->findOneBy(['id' => $entity->getId()]);

        $this->assertNull($isFound);
    }

    /**
     * @param array $entities
     */
    public function removeEntities($entities)
    {
        foreach ($entities as $entity) {
            $instance = $this
                ->em
                ->getRepository(get_class($entity))
                ->findOneBy(['id' => $entity->getId()]);

            $this->removeEntity($instance);
        }
    }

    protected function setUp()
    {
        static::$kernel = static::createKernel();
        static::$kernel->boot();

        $this->em = static::$kernel->getContainer()->get('doctrine.orm.entity_manager');
        $this->faker = Faker\Factory::create();

        if ($this->rollbackTransactions) {
            $this->conn = $this->em->getConnection();
            $this->conn->beginTransaction();
        }

        parent::setUp();
    }

    protected function tearDown()
    {
        unset($this->em);

        $refl = new \ReflectionObject($this);

        foreach ($refl->getProperties() as $prop) {
            if ((!($prop->isStatic())) and (0 !== strpos($prop->getDeclaringClass()->getName(), 'PHPUnit_'))) {
                $prop->setAccessible(true);
                $prop->setValue($this, null);
            }
        }

        if ($this->rollbackTransactions) {
            $this->conn->rollBack();
        }

        parent::tearDown();
    }

    public function getEntityManager()
    {
        return $this->em;
    }

    /**
     * @return \Symfony\Component\DependencyInjection\ContainerInterface
     */
    public function getContainer()
    {
        return static::$kernel->getContainer();
    }

    /**
     * @return int
     */
    public static function getNextSeed()
    {
        self::$seed += 1;

        return self::$seed;
    }

    protected function getFaker()
    {
        return $this->faker;
    }
}
