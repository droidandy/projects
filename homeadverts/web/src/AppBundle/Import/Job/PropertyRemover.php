<?php

namespace AppBundle\Import\Job;

use AppBundle\Entity\Communication\Notification;
use AppBundle\Entity\Messenger\Room;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyLike;
use AppBundle\Entity\Property\PropertyPhoto;
use AppBundle\Entity\Property\PropertyVideo;
use AppBundle\Entity\Property\PropertyVideo3d;
use AppBundle\Entity\User\User;
use AppBundle\Helper\SprintfLoggerTrait;
use AppBundle\Import\Job\RemoveImages;
use AppBundle\Import\Media\ImageCleaner;
use AppBundle\Import\User\CountResolver;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;
use AppBundle\Entity\Import\ImportJob;
use AppBundle\Helper\RedisClient;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManager;
use Psr\Log\LoggerInterface;

class PropertyRemover
{
    use SprintfLoggerTrait;

    const REF_TO_ID_QUERY_GENERAL = <<<SQL
    SELECT p.id AS property_id FROM property p WHERE p.sourceRef IN (:refs) AND p.source = :source
SQL;

    const REF_TO_ID_QUERY_SIR = <<<SQL
    SELECT p.id AS property_id FROM property p WHERE p.sourceGuid IN (:guids) AND p.source = 'sothebys'
SQL;

    /**
     * @var PropertyMapping
     */
    private $propertyMapping;
    /**
     * @var Connection
     */
    private $db;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var ImageCleaner
     */
    private $imageCleaner;
    /**
     * @var RedisClient
     */
    private $redisClient;
    /**
     * @var CountResolver
     */
    private $countResolver;
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @param PropertyMapping $propertyMapping
     * @param Connection      $db
     * @param EntityManager   $em
     * @param ImageCleaner    $imageCleaner
     * @param RedisClient     $redisClient
     * @param CountResolver   $countResolver
     * @param LoggerInterface $logger
     */
    public function __construct(
        PropertyMapping $propertyMapping,
        Connection $db,
        EntityManager $em,
        ImageCleaner $imageCleaner,
        RedisClient $redisClient,
        CountResolver $countResolver,
        LoggerInterface $logger
    ) {
        $this->propertyMapping = $propertyMapping;
        $this->db = $db;
        $this->em = $em;
        $this->imageCleaner = $imageCleaner;
        $this->redisClient = $redisClient;
        $this->countResolver = $countResolver;
        $this->logger = $logger;
    }

    /**
     * Removes properties that were not in a specific import job.
     *
     * @param ImportJob $job
     * @param array     $args
     * @param bool      $dryRun if true then the properties are not actually deleted
     *
     * @return \Iterator the number of properties removed
     */
    public function remove(ImportJob $job, array $args, $dryRun = false)
    {
        $propertyIds = $this->getProperties($job, $args);

        $counter = 1;
        foreach ($propertyIds as $i => $propertyId) {
            if ($dryRun || (!$job->hasFinished())) {
                yield $propertyId;
                continue;
            }

            /** @var Property $property */
            $property = $this->em->find(Property::class, $propertyId);

            if (!$property) {
                $this->warning('Skipping "%s". No matching entity found', $propertyId);
                continue;
            }
            if ($property->getDeletedAt()) {
                $this->warning(
                    'Skipping "%s". Entity already deleted at "%s"',
                    $propertyId,
                    $property->getDeletedAt()->format('u')
                );
                continue;
            }
            $this->info(
                'Removing "%s"',
                $propertyId
            );

            $property->setPrimaryPhotoManual(null);
            $property->setPrimaryPhotoDefault(null);
            /** @var PropertyPhoto $photo */
            foreach ($property->getPhotos()->toArray() as $photo) {
                $this->info(
                    '[Property:%s] Removing photo "%s"',
                    $propertyId,
                    $photo->getUrl()
                );
                $this->redisClient->enqueue('photo_remove', RemoveImages::class, [
                    'images' => [
                        ['path' => $photo->getUrl()],
                    ],
                ]);
                $property->getPhotos()->removeElement($photo);
                $photo->setProperty(null);
            }

            $this->info(
                '[Property:%s] Resolving counts "%s" "%s"',
                $propertyId,
                $property->getUser() ? $property->getUser()->getId() : null,
                $property->company ? $property->company->getId() : null
            );
            $this
                ->countResolver
                ->onPropertyDeleted(
                    (bool) $property->getRental(),
                    $property->getUser() ? $property->getUser()->getId() : null,
                    $property->company ? $property->company->getId() : null
                )
            ;

            if ($counter && 0 === $counter % 100) {
                $this->em->flush();
                $this->em->clear(Property::class);
                $this->em->clear(PropertyPhoto::class);
                $this->em->clear(PropertyVideo::class);
                $this->em->clear(PropertyVideo3d::class);
                $this->em->clear(User::class);
                $this->em->clear(Room::class);
                $this->em->clear(PropertyLike::class);
                $this->em->clear(Notification::class);
            }

            ++$counter;

            yield $propertyId;
        }

        $this->em->flush();
        $this->em->clear(Property::class);
        $this->em->clear(PropertyPhoto::class);
        $this->em->clear(PropertyVideo::class);
        $this->em->clear(PropertyVideo3d::class);
        $this->em->clear(User::class);
        $this->em->clear(Room::class);
        $this->em->clear(PropertyLike::class);
        $this->em->clear(Notification::class);
    }

    /**
     * Get property IDs that were not in the last import job.
     *
     * @param ImportJob $job
     *
     * @return array
     */
    protected function getProperties(ImportJob $job, array $args)
    {
        if (isset($args['ids_to_remove'])) {
            return $args['ids_to_remove'];
        } elseif (isset($args['refs_to_remove'])) {
            return $this
                ->em
                ->getConnection()
                ->executeQuery(
                    self::REF_TO_ID_QUERY_SIR,
                    [
                        'guids' => $args['refs_to_remove'],
                    ],
                    [
                        'guids' => Connection::PARAM_STR_ARRAY,
                    ]
                )
                ->fetchAll(\PDO::FETCH_COLUMN)
            ;
        } elseif (in_array($job->getMethod(), [ImportJob::DATA_SYNC_ACTIVE, ImportJob::DATA_SYNC_FAILED])) {
            return [];
        }

        $importedProperties = [];
        foreach ($this->getPropertiesIdsForJobId($job) as $row) {
            $importedProperties[] = $row['property_id'];
        }

        $allProperties = [];
        foreach ($this->getCurrentPropertiesIdsForImport($job->getImport()) as $row) {
            $allProperties[] = $row['property_id'];
        }

        if (!$allProperties) {
            return [];
        }

        $result = array_unique(array_diff($allProperties, $importedProperties));
        $pc = count($result) / count($allProperties);

        // Don't allow more than 30 percent of properties to be deleted at once.
        // This is probably a bug.
        if ($pc > 0.3) {
            trigger_error('More than 30% of properties tried to be deleted', E_USER_NOTICE);

            return [];
        }

        return $result;
    }

    public function expandProperties(array $propertyIds)
    {
        return $this
            ->em
            ->getConnection()
            ->executeQuery(
                'SELECT id, rental, user, company_id FROM property WHERE id IN (:ids)',
                [
                    'ids' => $propertyIds,
                ],
                [
                    'ids' => Connection::PARAM_INT_ARRAY,
                ]
            )
            ->fetchAll()
        ;
    }

    /**
     * @param $propertyId
     */
    protected function getPropertyPhotos($propertyId)
    {
        $urls = [];
        $stmt = $this->db->executeQuery('SELECT url FROM property_photo WHERE property_id = :id', ['id' => $propertyId]);
        while ($url = $stmt->fetchColumn()) {
            $urls[] = $url;
        }

        return $urls;
    }

    /**
     * Get property IDs that were in the last job.
     *
     * @param ImportJob $jobId
     *
     * @return array
     */
    protected function getPropertiesIdsForJobId(ImportJob $job)
    {
        return $this->db->fetchAll('
            SELECT
                import_property.property_id
            FROM
                `import_property`
            WHERE
                import_property.job_id = '.(int) $job->getId().'
        ');
    }

    /**
     * Gets all property IDs in the database that are owned by the same
     * user/franchise as a specific import.
     *
     * @param Import $import
     *
     * @return array
     */
    protected function getCurrentPropertiesIdsForImport(Import $import)
    {
        $sql = false;
        $user = $import->getUser();

        if ($user) {
            $sql = '
                SELECT
                    id AS property_id
                FROM
                    property
                WHERE
                    user = '.(int) $user->getId().'
            ';
        }

        if (!$sql) {
            throw new \Exception('Could not determine user for import');
        }

        return $this->db->fetchAll($sql);
    }

    public function removeImages($propertyId)
    {
        $this->imageCleaner->cleanPropertyPhotos($propertyId);
    }
}
