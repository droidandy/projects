<?php

require_once __DIR__.'/../bootstrap.php.cache';
require_once __DIR__.'/../AppKernel.php';

use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Debug\Debug;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$input = new ArgvInput();
$env = $input->getParameterOption(['--env', '-e'], getenv('SYMFONY_ENV') ?: 'dev');
$debug = '0' !== getenv('SYMFONY_DEBUG') && !$input->hasParameterOption(['--no-debug', '']) && 'prod' !== $env;

// really hacky way of detecting if we're on the production server
// but fresque doesnt pass through the --env parameter
if ($debug && false !== strpos(realpath(__DIR__), '/releases/')) {
    $debug = false;
    $env = 'prod';
}

if ($debug) {
    Debug::enable();
}

$kernel = new AppKernel($env, $debug);
$kernel->loadClassCache();
$kernel->boot();

// There's no other way to pass this into the job otherwise thanks to deficiencies
// in php-resque.
$GLOBALS['ha_resque_container_hack'] = $kernel->getContainer();

// logger for Resque system, default is not informative
$logger = new Logger('resque_worker');
$logger
    ->pushHandler(new StreamHandler('php://stdout', \Monolog\Logger::NOTICE))
;

Resque_Event::listen(
    'onFailure',
    function (\Exception $e, Resque_Job $job) use ($kernel) {
        $container = $kernel->getContainer();
        $container->get('monolog.logger.import')->error($e->getMessage(), ['trace' => $e->getTraceAsString()]);
    }
);

// Disable deprecated errors (as doctrine throws them!)
error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
