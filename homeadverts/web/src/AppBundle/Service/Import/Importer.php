<?php

namespace AppBundle\Service\Import;

use AppBundle\Entity\Property\Property;
use Doctrine\ORM\EntityManager;
use AppBundle\Import\Media\AvatarManagerInterface;
use AppBundle\Entity\Import\ImportJob;
use AppBundle\Geo\Geocode\ReverseGeocodeLocationUnfolder;
use AppBundle\Entity\Import\ImportProperty;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AppBundle\Import\Queue\ResqueQueueAdapter;

class Importer
{
    /**
     * @var ContainerInterface
     */
    protected $app;
    /**
     * @var EntityManager
     */
    protected $em;
    /**
     * @var AvatarManagerInterface
     */
    protected $avatarManager;
    /**
     * @var LoggerInterface
     */
    protected $logger;
    /**
     * @var ReverseGeocodeLocationUnfolder
     */
    protected $locationUnfolder;
    /**
     * @var ResqueQueueAdapter
     */
    protected $queueAdapter;

    public function __construct($app)
    {
        $this->app = $app;
        $this->em = $app->get('doctrine')->getManager();
        $this->avatarManager = $app->get('ha.import.avatar_manager');
        $this->logger = $app->get('monolog.logger.import');
        $this->locationUnfolder = $app->get('ha.geo.location_unfolder');
        $this->queueAdapter = $app->get('ha.import.queue_adapter');
    }

    public function import($method)
    {
        $job = new ImportJob();
        $job->setMethod($method);

        $this->em->persist($job);
        $this->em->flush();

        $this->queueAdapter->enqueueDeploy($job);
    }

    public function findJob($id)
    {
        return $this->app->get('import_job_repo')->findOneById($id);
    }

    public function updateStatus(ImportJob $job, $status)
    {
        $job->setStatus($status);

        $this->em->persist($job);
        $this->em->flush();
    }

    public function setType(ImportJob $job, $type)
    {
        $job->setTypeNotify($type);

        $this->em->persist($job);
        $this->em->flush();
    }

    public function setTotal(ImportJob $job, $total)
    {
        $job->setTotalNotify($total);

        $this->em->persist($job);
        $this->em->flush();
    }

    public function incrementProcessed(ImportJob $job, $error, $skipped = false)
    {
        $this->em
            ->createQuery('
                UPDATE AppBundle\\Entity\\Import\\ImportJob i
                SET
                    i.processed = i.processed + 1,
                    i.skipped = i.skipped + :skipped,
                    i.updated = i.updated + :updated,
                    i.errors = i.errors + :error
                WHERE i.id = :id
            ')
            ->setParameter('id', $job->getId())
            ->setParameter('skipped', (int) $skipped)
            ->setParameter('updated', (int) !$skipped)
            ->setParameter('error', (int) $error)
            ->execute();
    }

    public function addErrors(ImportJob $job, $errors)
    {
        $errors = json_decode($errors, true);

        $this->em
            ->createQuery('
                UPDATE AppBundle\\Entity\\Import\\ImportJob i
                SET
                    i.errorsBedroom = i.errorsBedroom + :bedrooms,
                    i.errorsMetadata = i.errorsMetadata + :metadata,
                    i.errorsAddress = i.errorsAddress + :address,
                    i.errorsPrice = i.errorsPrice + :price,
                    i.errorsPhotos = i.errorsPhotos + :photos,
                    i.errorsOther = i.errorsOther + :other
                WHERE i.id = :id
            ')
            ->setParameter('bedrooms', isset($errors[ImportProperty::ERROR_BEDROOMS]))
            ->setParameter('metadata', isset($errors[ImportProperty::ERROR_METADATA]))
            ->setParameter('address', isset($errors[ImportProperty::ERROR_ADDRESS]))
            ->setParameter('price', isset($errors[ImportProperty::ERROR_PRICE]))
            ->setParameter('photos', isset($errors[ImportProperty::ERROR_PHOTOS]))
            ->setParameter('other', isset($errors[ImportProperty::ERROR_OTHER]))
            ->setParameter('id', $job->getId())
            ->execute();
    }

    public function isComplete(ImportJob $job)
    {
        $result = $this->em
            ->getConnection()
            ->createQueryBuilder()
            ->select('i.processed = i.total AS complete')
            ->from('import_job', 'i')
            ->where('i.id = :id')
            ->setParameter('id', $job->getId())
            ->execute()
            ->fetch();

        return (bool) $result['complete'];
    }

    public function isHashLatest(Property $property, $hash)
    {
        if (!$property->getId()) {
            return false;
        }

        $conn = $this->em->getConnection();
        $dbHash = $conn
            ->fetchColumn(
                'SELECT ip.hash FROM import_property ip WHERE ip.property_id = :property_id ORDER BY ip.id DESC LIMIT 1',
                [
                    'property_id' => $property->getId(),
                ]
            )
        ;

        return $dbHash == $hash;
    }
}
