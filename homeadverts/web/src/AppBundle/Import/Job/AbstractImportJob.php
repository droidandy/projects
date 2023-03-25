<?php

namespace AppBundle\Import\Job;

use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Queue\ImportContextFactory;
use AppBundle\Import\Queue\ImportJobTracker;
use AppBundle\Service\Lock\LockInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\IntrospectableContainerInterface;
use Doctrine\ORM\EntityManager;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

abstract class AbstractImportJob extends ResqueJob
{
    protected $errors = [];
    /**
     * @var EntityManager
     */
    protected $em;
    /**
     * @var ImportJobTracker
     */
    protected $importJobTracker;
    /**
     * @var EventDispatcherInterface
     */
    protected $importEventDispatcher;
    /**
     * @var UserImporter
     */
    protected $userImporter;
    /**
     * @var ImportContext
     */
    protected $importContext;
    /**
     * @var LockInterface
     */
    protected $lock;

    public function run($args, $container)
    {
        $this->createImportContext($args['jobID'], $container);
        $this->doRun($args, $container);
        $this->leaveImportContext($container);
        $this->sendEmails($container);
    }

    abstract protected function doRun($args, $container);

    private function createImportContext($importJobId, ContainerInterface $container)
    {
        /** @var ImportContextFactory $importContextFactory */
        $importContextFactory = $container->get('ha.import.import_context_factory');
        $container->set('ha.import.import_context', $importContextFactory->createFromImportJobId($importJobId));
    }

    private function leaveImportContext(ContainerInterface $container)
    {
        $container->set('ha.import.import_context', null);
    }

    /**
     * @param ContainerInterface $container
     *
     * @see \Symfony\Bundle\SwiftmailerBundle\EventListener\EmailSenderListener::onTerminate
     */
    private function sendEmails(ContainerInterface $container)
    {
        if (!$container->has('mailer')) {
            return;
        }
        $mailers = array_keys($container->getParameter('swiftmailer.mailers'));
        foreach ($mailers as $name) {
            if ($container instanceof IntrospectableContainerInterface ? $container->initialized(sprintf('swiftmailer.mailer.%s', $name)) : true) {
                if ($container->getParameter(sprintf('swiftmailer.mailer.%s.spool.enabled', $name))) {
                    $mailer = $container->get(sprintf('swiftmailer.mailer.%s', $name));
                    $transport = $mailer->getTransport();
                    if ($transport instanceof \Swift_Transport_SpoolTransport) {
                        $spool = $transport->getSpool();
                        if ($spool instanceof \Swift_MemorySpool) {
                            try {
                                $spool->flushQueue($container->get(sprintf('swiftmailer.mailer.%s.transport.real', $name)));
                            } catch (\Swift_TransportException $exception) {
                                if (null !== $this->logger) {
                                    $this->logger->error(sprintf('Exception occurred while flushing email queue: %s', $exception->getMessage()));
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
