<?php

namespace Test\AppBundle\Elastic\Article\Validator\Constraints;

use AppBundle\Validation\ArticleImageValidator;
use AppBundle\Validation\Constraint\ArticleImage;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Symfony\Component\Validator\Violation\ConstraintViolationBuilderInterface;

class ArticleImageValidatorTest extends \PHPUnit_Framework_TestCase
{
    public function testPassCorrectStrings()
    {
        $context = $this->getContext();

        $validator = $this->getArticleImageValidator();
        $validator->initialize($context);

        $context
            ->expects($this->never())
            ->method('buildViolation')
        ;

        $text = <<<TEXT
            Any text <img src="https://cdn.homeadverts.dev/media/0a/7a/fc4f47849f12443d5d93068c25cf1c95c33c12c50c5aef85121b05e8cde9.jpg"/> 
            enriched <img src="https://cdn.homeadverts.dev/media/79/5f/802b020ee68527d33d56e209244a3c5389937ce58a312713e62fce06eb88.jpg"/>
            with images <img src="https://cdn.homeadverts.dev/media/8e/55/734149a873870b520345ba6fe99a6539cb10fe7776367fe0714c25d4159d.jpg"/>
TEXT;

        $validator->validate($text, new ArticleImage());
    }

    public function testDetectIncorrectStrings()
    {
        $constraint = new ArticleImage();

        $context = $this->getContext();

        $validator = $this->getArticleImageValidator();
        $validator->initialize($context);

        $builder1 = $this->getConstraintViolationBuilder();
        $builder2 = $this->getConstraintViolationBuilder();

        $builder1
            ->expects($this->once())
            ->method('setParameter')
            ->with('{{ src }}', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
            ->willReturnSelf()
        ;
        $builder1
            ->expects($this->once())
            ->method('addViolation')
        ;

        $builder2
            ->expects($this->once())
            ->method('setParameter')
            ->with('{{ src }}', 'http://localhost/image.png')
            ->willReturnSelf()
        ;
        $builder2
            ->expects($this->once())
            ->method('addViolation')
        ;

        $context
            ->expects($this->exactly(2))
            ->method('buildViolation')
            ->withConsecutive(
                [$constraint->message],
                [$constraint->message]
            )
            ->willReturnOnConsecutiveCalls($builder1, $builder2)
        ;

        $text = <<<TEXT
            Any text <img src="https://cdn.homeadverts.dev/media/0a/7a/fc4f47849f12443d5d93068c25cf1c95c33c12c50c5aef85121b05e8cde9.jpg"/> 
            enriched <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>
            with images <img src="http://localhost/image.png"/>
TEXT;

        $validator->validate($text, $constraint);
    }

    private function getArticleImageValidator()
    {
        return new ArticleImageValidator(['https://cdn.homeadverts.dev']);
    }

    private function getContext()
    {
        return $this->getMockBuilder(ExecutionContextInterface::class)
            ->getMock()
        ;
    }

    private function getConstraintViolationBuilder()
    {
        return $this->getMockBuilder(ConstraintViolationBuilderInterface::class)
            ->getMock()
        ;
    }
}
