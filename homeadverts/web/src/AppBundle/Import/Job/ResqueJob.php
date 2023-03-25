<?php

namespace AppBundle\Import\Job;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A wrapper around PHPResque jobs to make them more testable.
 */
abstract class ResqueJob implements ResqueJobInterface
{
    /**
     * @var LoggerInterface
     */
    protected $logger;
    /**
     * @var ContainerInterface
     */
    private $container;

    abstract public function run($args, $container);

    public function __construct($container = null)
    {
        if ($container) {
            $this->container = $container;
        } elseif (isset($GLOBALS['ha_resque_container_hack'])) { // EWWWWW but needed for PHP-Resque as you cant inject dependencies
            $this->container = $GLOBALS['ha_resque_container_hack'];
        }

        if (!$this->container) {
            throw new \Exception('Service container not injected. Cannot continue.');
        }

        $this->logger = $this->container->get('monolog.logger.import');
    }

    public function perform()
    {
        return $this->run($this->args, $this->container);
    }

    public function get($service)
    {
        return $this->container->get($service);
    }

    protected function log($text, array $context = [])
    {
        $this->logger->debug($text, $context);
    }
}
