<?php

namespace Test\AppBundle\Elastic\Article\Token;

use AppBundle\Elastic\Article\Token\HashidsTokenGenerator;
use AppBundle\Entity\Social\Article;
use Doctrine\ORM\EntityManager;
use Hashids\Hashids;

class HashidsTokenGeneratorTest extends \PHPUnit_Framework_TestCase
{
    public function testGenerateTokenWithoutId()
    {
        $this->markTestSkipped();

        $article = $this->getArticle();
        $article
            ->expects($this->exactly(2))
            ->method('getId')
            ->willReturnOnConsecutiveCalls(null, 1)
        ;

        $hashids = $this->getHashids();
        $hashids
            ->expects($this->once())
            ->method('encode')
            ->with(1)
            ->willReturn('1q')
        ;

        $em = $this->getEntityManager();
        $em
            ->expects($this->once())
            ->method('persist')
            ->with($article)
        ;
        $em
            ->expects($this->once())
            ->method('flush')
            ->with($article)
        ;

        $tokenGenerator = $this->getTokenGenerator($hashids, $em);
        $token = $tokenGenerator->generateToken($article);

        $this->assertEquals('1q', $token);
    }

    public function testGenerateTokenWithId()
    {
        $this->markTestSkipped();

        $article = $this->getArticle();
        $article
            ->expects($this->exactly(2))
            ->method('getId')
            ->willReturnOnConsecutiveCalls(1, 1)
        ;

        $hashids = $this->getHashids();
        $hashids
            ->expects($this->once())
            ->method('encode')
            ->with(1)
            ->willReturn('1q')
        ;

        $em = $this->getEntityManager();
        $em
            ->expects($this->never())
            ->method('persist')
        ;
        $em
            ->expects($this->never())
            ->method('flush')
        ;

        $tokenGenerator = $this->getTokenGenerator($hashids, $em);
        $token = $tokenGenerator->generateToken($article);

        $this->assertEquals('1q', $token);
    }

    private function getTokenGenerator($hashids, $em)
    {
        return new HashidsTokenGenerator($hashids, $em);
    }

    private function getHashids()
    {
        return $this->getMockBuilder(Hashids::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getEntityManager()
    {
        return $this->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getArticle()
    {
        return $this->getMockBuilder(Article::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
