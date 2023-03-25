<?php

namespace AppBundle\Import\Job;

use AppBundle\Entity\Import\ImportJobRepository;
use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Import\Adapter\Realogy\ApiException;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Service\Import\Importer;
use AppBundle\Import\Queue\ImportJobTracker;
use AppBundle\Import\Normalizer\NormalisedEntityFactory;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyProxy;
use AppBundle\Import\Processor\ChainProcessor;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Import\User\CountResolver;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Import\ImportProperty;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Entity\Import\ImportJob;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Downloads media associated to a property.
 */
class Process extends AbstractImportJob
{
    /**
     * @var Property
     */
    protected $property;
    /**
     * @var bool|null
     */
    protected $isPropertyNew = null;
    /**
     * @var Importer
     */
    protected $helper;
    /**
     * @var ImportJobRepository
     */
    protected $importJobRepo;
    /**
     * @var ImportContext
     */
    protected $importContext;
    /**
     * @var QueueAdapterInterface
     */
    protected $queueAdapter;
    /**
     * @var CountResolver
     */
    protected $countResolver;

    /**
     * @param array              $args
     * @param ContainerInterface $app
     *
     * @throws \Exception
     */
    public function doRun($args, $app)
    {
        /* @var EntityManager $em */
        /* @var Importer $helper */
        /* @var ImportJobRepository $importJobRepo */
        /* @var ImportContext $importContext */
        /* @var QueueAdapterInterface $queueAdapter */
        /* @var ImportJobTracker $importJobTracker */
        /* @var EventDispatcherInterface $importEventDispatcher */
        /* @var NormalisedEntityFactory $normalisedEntityFactory */
        /* @var ImportJob $job */

        $this->em = $em = $app->get('em');
        $this->helper = $helper = $app->get('ha.importer');
        $this->importJobRepo = $importJobRepo = $app->get('import_job_repo');
        $this->importContext = $importContext = $app->get('ha.import.import_context');
        $this->queueAdapter = $queueAdapter = $app->get('ha.import.queue_adapter');
        $this->importJobTracker = $importJobTracker = $app->get('ha.import.import_job_tracker');
        $this->importEventDispatcher = $importEventDispatcher = $app->get('ha.import.event_dispatcher');
        $this->countResolver = $app->get('ha.user.count_resolver');
        $normalisedEntityFactory = $app->get('ha.import.normalised_entity_factory');
        $this->lock = $app->get('ha.lock');

        $job = $helper->findJob($args['jobID']);

        $this->queueAdapter->dequeuePropertyProcessing(
            $job,
            $args['jobID']
        );
        $this->importJobTracker->extendLock();

        $this->property = $property = $normalisedEntityFactory->createProperty($args);

        $this->lock->executeInLock(
            'property'.$property->getSourceRef(),
            60,
            60,
            function () use ($app, $property, $job, $args) {
                $this->importJobTracker->tryPropertyImportStart();
                try {
                    if ($property instanceof NormalisedPropertyProxy) {
                        $property->initialize();
                    }
                } catch (ApiException $e) {
                    if (404 != $e->getHttpCode()) {
                        throw $e;
                    }

                    $this->importJobRepo->incrementSkipped($job, (bool) $this->countErrors());
                    $this->importJobTracker->tryPropertyImportComplete();

                    $this->logger->warning(
                        sprintf(
                            'Finished. Property "%s" not found with response "%s"',
                            json_encode($args),
                            json_encode($e->getParsedResponse())
                        )
                    );

                    return;
                }

                $this->log('Importing '.$property->getSourceRef());

                $hash = $property->getHash();
                $propertyObj = $this->findProperty($app, $property, $job);
                $previousStatus = $propertyObj->status;

                //make sure property has id due to BC
                /*if (!$propertyObj->getId()) {
                    $em->persist($propertyObj);
                    $em->flush($propertyObj);
                    $this->log('New entity '.spl_object_hash($propertyObj));
                } else {
                    $em->merge($propertyObj);
                    $this->log('Exists '.$propertyObj->getId().' '.spl_object_hash($propertyObj));
                }*/

                $skipped = false;

                try {
                    $importProperty = $this->getImportProperty($job, $property);
                    // See if this property hash already exists in the previous import
                    // If it does then we can skip importing it again.
                    if (
                        $propertyObj->getDeletedAt()
                        || !$this->helper->isHashLatest($propertyObj, $hash)
                        || Property::STATUS_ERROR === $propertyObj->status
                        || !$propertyObj->getAddress()->hasCoords()
                        || GoogleLocation::STATUS_PROCESSED_WITH_ADDRESS !== $propertyObj->getGoogleLocationsStatus()
                    ) {
                        if ($propertyObj->getDeletedAt()) {
                            $this->log('Restoring property from soft-deleted');
                        }
                        $propertyObj = $this->processorChain($app, $property, $propertyObj, $job, $importProperty);
                    } else {
                        $skipped = true;
                        $this->log('Property unchanged from last import');
                    }

                    $this->em->persist($propertyObj);
                    if ($propertyObj->getId()) {
                        $importProperty->property = $propertyObj->getId();
                        $this->em->persist($importProperty);
                    }
                    $this->em->flush();
                } catch (\Exception $e) {
                    $this->logError($e);

                    if (!$this->em->isOpen()) {
                        $this->em = $this->em->create(
                            $this->em->getConnection(),
                            $this->em->getConfiguration(),
                            $this->em->getEventManager()
                        );
                    }

                    if ($propertyObj->getId()) {
                        $propertyObj = $this->em->find(Property::class, $propertyObj->getId());
                        if ($propertyObj) {
                            $propertyObj->status = Property::STATUS_ERROR;
                            $importProperty->property = $propertyObj->getId();
                            // avoid excessive association resolution by usage of reference
                            $importProperty->job = $this->em->getReference(
                                ImportJob::class,
                                $importProperty->job->getId()
                            );
                            $this->em->persist($importProperty);
                            $this->em->persist($propertyObj);
                            $this->em->flush();

                            $this->importJobRepo->incrementUpdated($job, true);

                            if (Property::STATUS_ACTIVE == $previousStatus) {
                                $this->countResolver->onPropertyDeleted(
                                    $propertyObj->rental,
                                    $propertyObj->user
                                        ? $propertyObj->user->getId()
                                        : null,
                                    $propertyObj->company
                                        ? $propertyObj->company->getId()
                                        : null
                                );
                            }
                        } else {
                            $this->importJobRepo->incrementSkipped($job, true);
                        }
                    } else {
                        $this->importJobRepo->incrementSkipped($job, true);
                    }

                    $this->importJobRepo->addErrors($job, json_encode([ImportProperty::ERROR_OTHER => $e->getMessage()]));

                    $this->importJobTracker->tryPropertyImportComplete();

                    throw $e;
                }

                if ($skipped) {
                    $this->importJobRepo->incrementSkipped($job, (bool) $this->countErrors());
                } elseif ($this->isPropertyNew) {
                    $this->importJobRepo->incrementAdded($job, (bool) $this->countErrors());
                } else {
                    $this->importJobRepo->incrementUpdated($job, (bool) $this->countErrors());
                }

                $this->importJobRepo->addErrors($job, $this->getErrors());
                $this->em->refresh($job);

                if ($previousStatus != $propertyObj->status) {
                    if (Property::STATUS_ACTIVE == $previousStatus) {
                        $this->countResolver->onPropertyDeleted(
                            $propertyObj->rental,
                            $propertyObj->user
                                ? $propertyObj->user->getId()
                                : null,
                            $propertyObj->company
                                ? $propertyObj->company->getId()
                                : null
                        );
                    } elseif (Property::STATUS_ACTIVE == $propertyObj->status) {
                        $this->countResolver->onPropertyAdded($propertyObj);
                    }
                }

                $this->importJobTracker->tryPropertyImportComplete();
                $this->log('Finished. Property ID '.$propertyObj->getId());
            },
            function () use ($property, $args) {
                $this->log(
                    sprintf(
                        'Failed to acquire lock %s on %s',
                        'property'.$property->getSourceRef(),
                        json_encode($args)
                    )
                );
            }
        );
    }

    /**
     * todo: Hint - the actual property processor.
     *
     * @param $app
     * @param NormalisedPropertyInterface $property
     * @param Property                    $propertyObj
     * @param ImportJob                   $job
     * @param ImportProperty              $importProperty
     *
     * @return Property
     */
    public function processorChain(
        $app,
        NormalisedPropertyInterface $property,
        Property $propertyObj,
        ImportJob $job,
        ImportProperty $importProperty
    ) {
        $processor = new ChainProcessor($app, $job, $this);

        return $processor->process($property, $propertyObj, $importProperty);
    }

    public function setErrors($errors)
    {
        $this->errors = $errors;
    }

    public function getErrors()
    {
        return json_encode($this->errors);
    }

    public function countErrors()
    {
        $count = 0;

        foreach ($this->errors as $errors) {
            $count += count($errors);
        }

        return $count;
    }

    /**
     * @param ContainerInterface          $app
     * @param NormalisedPropertyInterface $normalised
     * @param ImportJob                   $job
     *
     * @return Property
     */
    protected function findProperty($app, NormalisedPropertyInterface $normalised, ImportJob $job)
    {
        // Try and see if it exists in doctrine
        $repo = $app->get('property_repo');

        if ($normalised->getSourceGuid()) {
            $property = $repo->findOneBy(['sourceGuid' => $normalised->getSourceGuid()]);

            if ($property) {
                $this->isPropertyNew = false;

                return $property;
            }
        }

        $property = $repo->findOneBy(['sourceRef' => $normalised->getSourceRef()]);

        if ($property) {
            $this->isPropertyNew = false;

            return $property;
        }

        $this->isPropertyNew = true;

        return new Property();
    }

    /**
     * @param ImportJob                   $job
     * @param NormalisedPropertyInterface $property
     *
     * @return ImportProperty
     */
    public function getImportProperty($job, NormalisedPropertyInterface $property)
    {
        $importProperty = new ImportProperty();
        $importProperty->job = $job;
        $importProperty->hash = $property->getHash();
        $importProperty->sourceRef = $property->getSourceGuid();
        $importProperty->date = new \DateTime();

        return $importProperty;
    }

    public function log($text, array $context = [])
    {
        $prefix = $this->property->getSourceRef() ? '['.$this->property->getSourceRef().'] ' : '';

        parent::log($prefix.$text, $context);
    }

    public function logError(\Exception $e, array $context = [])
    {
        $text = sprintf(
            '[%s] %s %s',
            $e->getCode(),
            $e->getMessage(),
            $e->getTraceAsString()
        );

        $prefix = $this->property->getSourceRef() ? '['.$this->property->getSourceRef().'] ' : '';

        $this->logger->error($prefix.$text, $context);
    }
}
