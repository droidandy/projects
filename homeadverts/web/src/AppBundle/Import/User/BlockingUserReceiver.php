<?php

namespace AppBundle\Import\User;

use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Queue\ImportJobTracker;
use AppBundle\Import\Normalizer\User\NormalisedUser;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Import\Job\UserImporter;
use AppBundle\Helper\SprintfLoggerTrait;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Import\ImportUser;
use AppBundle\Entity\User\User;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use AppBundle\Event\ImportEvent;

// todo: Unused service to be removed?
class BlockingUserReceiver implements UserReceiverInterface
{
    use SprintfLoggerTrait;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var UserImporter
     */
    private $userImporter;
    /**
     * @var ImportJobTracker
     */
    private $importJobTracker;
    /**
     * @var EventDispatcherInterface
     */
    private $importEventDispatcher;
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var QueueAdapterInterface
     */
    private $queueAdapter;

    /**
     * BlockingUserReceiver constructor.
     *
     * @param EntityManager            $em
     * @param LoggerInterface          $logger
     * @param UserImporter             $userImporter
     * @param ImportJobTracker         $importJobTracker
     * @param EventDispatcherInterface $importEventDispatcher
     * @param ImportContext            $importContext
     * @param QueueAdapterInterface    $queueAdapter
     */
    public function __construct(
        EntityManager $em,
        LoggerInterface $logger,
        UserImporter $userImporter,
        ImportJobTracker $importJobTracker,
        EventDispatcherInterface $importEventDispatcher,
        ImportContext $importContext,
        QueueAdapterInterface $queueAdapter
    ) {
        $this->em = $em;
        $this->logger = $logger;
        $this->userImporter = $userImporter;
        $this->importJobTracker = $importJobTracker;
        $this->importEventDispatcher = $importEventDispatcher;
        $this->importContext = $importContext;
        $this->queueAdapter = $queueAdapter;
    }

    /**
     * @param NormalisedUser[] $users
     */
    public function receive(array $users = [])
    {
        $this->importEventDispatcher->dispatch(
            ImportEvent::USER_PROCESSING_STARTED,
            new ImportEvent($this->importContext)
        );
        $batchSize = 20;
        $i = 0;
        foreach ($users as $user) {
            ++$i;
            $this->userImporter->fetchUser($user);
            if (0 === ($i % $batchSize)) {
                try {
                    $this->em->flush();
                    $this->em->clear(User::class);
                    $this->em->clear(ImportUser::class);
                } catch (\Exception $e) {
                    $this->log(
                        'Creating user failed with the message "%s". Line "%s". Backtrace "%s"',
                        $e->getMessage(),
                        $e->getLine(),
                        $e->getTraceAsString()
                    );
                }
            }
        }
        $this->em->flush();
        $this->em->clear(User::class);
        $this->em->clear(ImportUser::class);

        if ($this->importJobTracker->isUserImportCompleted()) {
            $this->importEventDispatcher->dispatch(
                ImportEvent::USER_PROCESSING_COMPLETED,
                new ImportEvent($this->importContext)
            );
            $this->scheduleUserRemoval();
        }
    }

    private function scheduleUserRemoval()
    {
        $this->queueAdapter->enqueueUserRemoval($this->importContext->getImportJob());
    }
}
