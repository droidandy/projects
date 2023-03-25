<?php

namespace AppBundle\Helper;

trait SprintfLoggerTrait
{
    private function log($msg, ...$arguments)
    {
        $this->logger->debug(sprintf($msg, ...$arguments));
    }

    private function notice($msg, ...$arguments)
    {
        $this->doLog('notice', $msg, ...$arguments);
    }

    private function warning($msg, ...$arguments)
    {
        $this->doLog('warning', $msg, ...$arguments);
    }

    private function error($msg, ...$arguments)
    {
        $this->doLog('error', $msg, ...$arguments);
    }

    private function info($msg, ...$arguments)
    {
        $this->doLog('info', $msg, ...$arguments);
    }

    private function debug($msg, ...$arguments)
    {
        $this->doLog('debug', $msg, ...$arguments);
    }

    private function doLog($level, $msg, ...$arguments)
    {
        $this->logger->$level($this->resolveMessage($msg, ...$arguments));
    }

    private function resolveMessage($msg, ...$arguments)
    {
        $prefix = $this->logPrefix();
        $prefix .= $prefix ? '. ' : '';

        return sprintf($prefix.$msg, ...$arguments);
    }

    private function logPrefix()
    {
        return '';
    }
}
