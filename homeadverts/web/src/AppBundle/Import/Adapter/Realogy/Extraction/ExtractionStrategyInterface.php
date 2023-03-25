<?php

namespace AppBundle\Import\Adapter\Realogy\Extraction;

interface ExtractionStrategyInterface
{
    public function createCompanies(
        callable $totalCb = null,
        callable $preExtractingCb = null,
        callable $postExtractingCb = null
    );

    public function createOffices(
        callable $totalCb = null,
        callable $preExtractingCb = null,
        callable $postExtractingCb = null
    );

    public function createUsers(callable $totalCb = null);

    public function createProperties(callable $totalCb = null);
}
