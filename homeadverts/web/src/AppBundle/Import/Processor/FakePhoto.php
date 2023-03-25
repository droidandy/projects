<?php

namespace AppBundle\Import\Processor;

use AppBundle\Import\Media\PhotoComparisonStrategyInterface;
use AppBundle\Import\Media\PhotoManager;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Entity\Import\ImportProperty;
use AppBundle\Entity\Property\Property;
use Psr\Log\LoggerInterface;

class FakePhoto extends Processor
{
    /**
     * @var PhotoManager
     */
    private $photoManager;
    /**
     * @var PhotoComparisonStrategyInterface
     */
    private $comparisonStrategy;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var FakePhotoHandler
     */
    private $fakePhotoHandler;

    private $stats = [];

    /**
     * @param NormalisedPropertyInterface $normalised
     * @param Property                    $propertyObj
     */
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        if ('sothebys' !== $normalised->getSourceName()) {
            return;
        }
        $this->initialize();

        $this->stats = $this
            ->fakePhotoHandler
            ->handle(
                $normalised,
                $propertyObj,
                function ($msg) {
                    $this->addError(ImportProperty::ERROR_PHOTOS, $msg);
                }
            )
        ;
    }

    public function getStats()
    {
        return $this->stats;
    }

    private function initialize()
    {
        $this->stats = [
            'added' => 0,
            'modified' => 0,
            'deleted' => 0,
            'errors' => 0,
        ];
        $this->photoManager = $this->app->get('ha.import.photo_manager');
        $this->comparisonStrategy = $this->app->get('ha.import.comparison_strategy');
        $this->logger = $this->app->get('monolog.logger.import');

        $this->fakePhotoHandler = new FakePhotoHandler(
            $this->photoManager,
            $this->comparisonStrategy,
            function ($logLevel, $msg, ...$args) {
                switch ($logLevel) {
                    case 'log':
                        $this->log($msg, ...$args); break;
                    default:
                        $this->logger->$logLevel($msg, ...$args); break;
                }
            },
            $this->app->get('redis_client')
        );
    }

    private function log($msg, ...$parameters)
    {
        $this->job->log(sprintf($msg, ...$parameters));
    }
}
