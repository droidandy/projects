<?php

namespace Test\AppBundle\Import_\Email;

use AppBundle\Service\Email\MessageBuilderInterface;
use AppBundle\Import\Adapter\ImportObserverInterface;
use AppBundle\Service\Email\AggregatedImportMailer;
use AppBundle\Import\ImportContext;
use AppBundle\Entity\Import\Import;
use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Import\ImportJobGroup;
use AppBundle\Entity\Embeddable\Status;
use Predis\ClientInterface;
use Psr\Log\LoggerInterface;

class AggregatedImportMailerTest extends \PHPUnit_Framework_TestCase
{
    private $recipients;
    private $fromAddress;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $client;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $messageBuilder;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $message;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $mailer;
    /**
     * @var AggregatedImportMailer
     */
    private $aggregateImportMailer;

    protected function setUp()
    {
        $this->recipients = $this->getRecipients();
        $this->fromAddress = $this->getFromAddress();
        $this->client = $this->getClient();
        $this->messageBuilder = $this->getMessageBuilder();
        $this->message = $this->getMessage();
        $this->mailer = $this->getMailer();
        $this->aggregateImportMailer = $this->getAggregateImportMailer(
            $this->recipients,
            $this->fromAddress,
            $this->client,
            $this->messageBuilder,
            $this->mailer
        );
    }

    public function testSendQueueFilling()
    {
        $importJobGroup = $this->getImportJobGroup();
        $importContexts = [];
        foreach ([Status::MODE_DONE, Status::MODE_DONE, Status::MODE_ON] as $status) {
            $importJob = $this->getImportJob($status);
            $importJobGroup->addImportJob($importJob);
            $importContexts[] = $this->getImportContext($importJob);
        }

        $summaries = $this->getSummaries(2);
        $this
            ->client
            ->expects($this->never())
            ->method('llen')
            ->with(AggregatedImportMailer::SUMMARIES_QUEUE)
        ;
        $this
            ->client
            ->expects($this->exactly(2))
            ->method('lpush')
            ->withConsecutive(
                [AggregatedImportMailer::SUMMARIES_QUEUE, [serialize($summaries[0])]],
                [AggregatedImportMailer::SUMMARIES_QUEUE, [serialize($summaries[1])]]
            )
            ->willReturnOnConsecutiveCalls(1, 1)
        ;

        foreach ($summaries as $i => $summary) {
            $this->aggregateImportMailer->send($summary, $importContexts[$i]);
        }
    }

    public function testSendTriggerSending()
    {
        $importJobGroup = $this->getImportJobGroup();
        $importContexts = [];
        foreach ([Status::MODE_DONE, Status::MODE_DONE, Status::MODE_DONE] as $status) {
            $importJob = $this->getImportJob($status);
            $importJobGroup->addImportJob($importJob);
            $importContexts[] = $this->getImportContext($importJob);
        }

        $summaries = $this->getSummaries(3);
        $this
            ->client
            ->expects($this->once())
            ->method('llen')
            ->with(AggregatedImportMailer::SUMMARIES_QUEUE)
            ->willReturnOnConsecutiveCalls(2)
        ;
        $this
            ->client
            ->expects($this->exactly(3))
            ->method('lpop')
            ->with(AggregatedImportMailer::SUMMARIES_QUEUE)
            ->willReturnOnConsecutiveCalls(
                serialize($summaries[0]),
                serialize($summaries[1]),
                null
            )
        ;
        $this
            ->messageBuilder
            ->expects($this->once())
            ->method('addTo')
            ->with($this->recipients)
            ->willReturnSelf()
        ;
        $this
            ->messageBuilder
            ->expects($this->once())
            ->method('addFrom')
            ->with($this->fromAddress)
            ->willReturnSelf()
        ;
        $this
            ->messageBuilder
            ->expects($this->once())
            ->method('addSubject')
            ->with('Import Report: 3 import(s) ran in the last 24 hours.')
            ->willReturnSelf()
        ;
        $this
            ->messageBuilder
            ->expects($this->once())
            ->method('addBody')
            ->with(
                'AppBundle::emails/aggregated_import_stats.html.twig',
                    ['summaries' => [$summaries[2], $summaries[0], $summaries[1]]]
            )
            ->willReturnSelf()
        ;
        $this
            ->messageBuilder
            ->expects($this->once())
            ->method('createMessage')
            ->willReturn($this->message)
        ;
        $this
            ->mailer
            ->expects($this->once())
            ->method('send')
            ->with($this->message)
        ;

        $this->aggregateImportMailer->send($summaries[2], $importContexts[2]);
    }

    private function getRecipients()
    {
        return ['alice@homeadverts.com', 'bob@homeadverts.com'];
    }

    private function getFromAddress()
    {
        return 'no-reply@homeadverts.com';
    }

    private function getClient()
    {
        return $this
            ->getMockBuilder(ClientInterface::class)
            ->setMethods([
                'llen', 'lpop', 'lpush',
                'getProfile', 'getOptions', 'connect',
                'disconnect', 'getConnection', 'createCommand',
                'executeCommand', '__call',
            ])
            ->getMock()
        ;
    }

    private function getMessageBuilder()
    {
        return $this
            ->getMockBuilder(MessageBuilderInterface::class)
            ->getMock()
        ;
    }

    private function getMessage()
    {
        return $this
            ->getMockBuilder(\Swift_Message::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getMailer()
    {
        return $this
            ->getMockBuilder(\Swift_Mailer::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getSummaries($number)
    {
        $summaries = [];
        for ($i = 0; $i < $number; ++$i) {
            $summaries[] = $this->getSummary();
        }

        return $summaries;
    }

    private function getSummary()
    {
        return [
            'type' => 'type',
            'job_id' => uniqid(),
        ];
    }


    private function getImportContext($importJob)
    {
        return new ImportContext($importJob, null, $this->getImportObserverFactory());
    }

    private function getImportJob($status)
    {
        $importJob = new ImportJob($this->getImport());
        switch ($status) {
            case Status::MODE_ON:
                $importJob->setStatusImportOn(); break;
            case Status::MODE_DONE:
                $importJob->setStatusImportDone(); break;
            case Status::MODE_FAILED:
                $importJob->setStatusImportFailed('failure'); break;
        }

        return $importJob;
    }

    private function getImport()
    {
        return new Import();
    }


    private function getAggregateImportMailer($recipients, $fromAddress, $client, $messageBuilder, $mailer)
    {
        return new AggregatedImportMailer($recipients, $fromAddress, $client, $messageBuilder, $mailer, $this->getLogger());
    }

    private function getImportObserverFactory()
    {
        return function () {
            return $this->getImportObserver();
        };
    }

    private function getImportObserver()
    {
        return $this
            ->getMockBuilder(ImportObserverInterface::class)
            ->getMock()
        ;
    }

    private function getLogger()
    {
        return $this
            ->getMockBuilder(LoggerInterface::class)
            ->getMock()
        ;
    }
}
