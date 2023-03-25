<?php

namespace AppBundle\Service\Email;

use AppBundle\Import\Queue\ImportContext;
use Predis\ClientInterface;
use Psr\Log\LoggerInterface;

class AggregatedImportMailer implements ImportMailerInterface
{
    const SUMMARIES_QUEUE = 'summaries_queue';
    /**
     * @var string[]
     */
    private $recipients;
    /**
     * @var string
     */
    private $fromAddress;
    /**
     * @var ClientInterface
     */
    private $client;
    /**
     * @var MessageBuilderInterface
     */
    private $messageBuilder;
    /**
     * @var \Swift_Mailer
     */
    private $mailer;
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * AggregatedImportMailer constructor.
     *
     * @param \string[]               $recipients
     * @param string                  $fromAddress
     * @param ClientInterface         $client
     * @param MessageBuilderInterface $messageBuilder
     * @param \Swift_Mailer           $mailer
     * @param LoggerInterface         $logger
     */
    public function __construct(
        array $recipients,
        $fromAddress,
        ClientInterface $client,
        MessageBuilderInterface $messageBuilder,
        \Swift_Mailer $mailer,
        LoggerInterface $logger
    ) {
        $this->recipients = $recipients;
        $this->fromAddress = $fromAddress;
        $this->client = $client;
        $this->messageBuilder = $messageBuilder;
        $this->mailer = $mailer;
        $this->logger = $logger;
    }

    /**
     * @param array $summary
     */
    public function send($summary, ImportContext $importContext)
    {
        $this->sendAggregate($summary);
    }

    private function sendAggregate($summary)
    {
        $summaries = [$summary];
        $summaryStrings = [implode(' ', [
            'type' => $summary['type'],
            'id' => $summary['job_id'],
        ])];
        while ($summary = $this->client->lpop(self::SUMMARIES_QUEUE)) {
            $summary = unserialize($summary);
            $summaries[] = $summary;
            $summaryStrings[] = implode(' ', [
                'type' => $summary['type'],
                'id' => $summary['job_id'],
            ]);
        }

        $message = $this->getMessage($summaries);
        $this->mailer->send($message);

        $this->logger->info(
            'Import group is completed. Summary sent. <{summary}>',
            ['summary' => implode('> <', $summaryStrings)]
        );
    }

    private function getMessage($summaries)
    {
        return $this
            ->messageBuilder
            ->addTo($this->recipients)
            ->addFrom($this->fromAddress)
            ->addSubject(sprintf('Import Report: %s import(s) ran in the last 24 hours.', count($summaries)))
            ->addBody('AppBundle::email/import/aggregated_import_stats.html.twig', ['summaries' => $summaries])
            ->createMessage()
        ;
    }
}
