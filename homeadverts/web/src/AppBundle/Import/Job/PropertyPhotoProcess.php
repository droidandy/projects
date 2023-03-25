<?php

namespace AppBundle\Import\Job;

use AppBundle\Entity\Property\Property;
use AppBundle\Import\Adapter\Realogy\ApiException;
use AppBundle\Import\Normalizer\NormalisedEntityFactory;
use AppBundle\Import\Processor\FakePhotoHandler;
use AppBundle\Service\Import\Wellcomemat\WellcomematFeed;
use Doctrine\ORM\EntityManager;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PropertyPhotoProcess extends ResqueJob
{
    /**
     * @var LoggerInterface
     */
    protected $logger;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var NormalisedEntityFactory
     */
    private $normalizedPropertyFactory;
    /**
     * @var FakePhotoHandler
     */
    private $fakePhotoHandler;
    /**
     * @var string
     */
    private $propertyGuid;
    /**
     * @var int
     */
    private $propertyId;
    /**
     * @var WellcomematFeed
     */
    private $wellcomematFeed;
    /**
     * @var array
     */
    private $stats = [
        'added' => 0,
        'modified' => 0,
        'deleted' => 0,
    ];

    /**
     * @param $args
     * @param ContainerInterface $container
     */
    public function run($args, $container)
    {
        $this->initialize($args, $container);
        $this->wellcomematFeed->disable();

        $this->logger->info(sprintf(
            '[Property %s:%s] PHOTO_JOB_STARTED',
            $this->propertyId,
            $this->propertyGuid
        ));

        $normalizedProperty = $this
            ->normalizedPropertyFactory
            ->createProperty(['ref' => $this->propertyGuid])
        ;
        $property = $this
            ->em
            ->find(
                Property::class,
                $this->propertyId
            )
        ;

        try {
            $this->stats = $this
                ->fakePhotoHandler
                ->handle(
                    $normalizedProperty,
                    $property
                )
            ;

            $this->em->flush();
        } catch (ApiException $e) {
            $this->logger->error(sprintf(
                '[Property %s:%s] ERROR %s %s',
                $this->propertyId,
                $this->propertyGuid,
                $e->getHttpCode(),
                $e->getMessage()
            ));
        } finally {
            $this->wellcomematFeed->enable();
        }
    }

    public function getStats()
    {
        return $this->stats;
    }

    private function initialize(array $args = [], ContainerInterface $container)
    {
        $this->logger = $container->get('monolog.logger.import');
        $this->em = $container->get('em');
        $this->normalizedPropertyFactory = $container->get('ha.import.normalised_entity_factory');
        $this->wellcomematFeed = $container->get('wellcomemat.feed');

        $this->propertyGuid = $args['property_guid'];
        $this->propertyId = $args['property_id'];

        $this->fakePhotoHandler = new FakePhotoHandler(
            $container->get('ha.import.photo_manager'),
            $container->get('ha.import.comparison_strategy'),
            function ($logLevel, $msg, ...$args) {
                $msg = sprintf('[Property %s:%s] ', $this->propertyId, $this->propertyGuid).$msg;
                if ('log' == $logLevel) {
                    $this->logger->info(sprintf($msg, ...$args));
                } else {
                    $this->logger->$logLevel($msg, ...$args);
                }
            },
            $container->get('redis_client')
        );

        $this->stats = [
            'added' => 0,
            'modified' => 0,
            'deleted' => 0,
        ];
    }
}
