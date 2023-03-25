<?php

namespace AppBundle\Import\Email;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Queue\ImportContext;
use FOS\UserBundle\Util\CanonicalizerInterface;
use Predis\Client;

class RedisEmailsInUseList implements EmailsInUseListInterface
{
    const EMAILS_IN_USE = 'emails_in_use';
    const TTL = 3600;
    /**
     * @var Client
     */
    private $client;
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var CanonicalizerInterface
     */
    private $canonicalizer;
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var bool
     */
    private $initialized = false;
    /**
     * @var string
     */
    private $cacheKey;

    /**
     * @param Client                 $client
     * @param UserRepository         $userRepo
     * @param CanonicalizerInterface $canonicalizer
     */
    public function __construct(
        Client $client,
        UserRepository $userRepo,
        CanonicalizerInterface $canonicalizer,
        ImportContext $importContext = null
    ) {
        $this->client = $client;
        $this->userRepo = $userRepo;
        $this->canonicalizer = $canonicalizer;
        $this->importContext = $importContext;
    }

    public function isInUse(string $email): bool
    {
        $this->initialize();
        $email = $this->canonicalizer->canonicalize($email);

        return (bool) $this->client->sismember($this->cacheKey, $email);
    }

    public function addInUse(string $email): void
    {
        $this->initialize();
        $email = $this->canonicalizer->canonicalize($email);

        $this->client->sadd($this->cacheKey, [$email]);
    }

    private function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->cacheKey = self::EMAILS_IN_USE;
        if ($this->importContext) {
            $this->cacheKey .= $this->importContext->getImportJob()->getId();
        }

        if ($this->client->exists($this->cacheKey)) {
            $this->initialized = true;

            return;
        }

        $emails = $this->userRepo->getAllSignupEmails();

        $this->client->sadd($this->cacheKey, $emails);
        $this->client->expire($this->cacheKey, self::TTL);

        $this->initialized = true;
    }
}
