<?php

namespace AppBundle\Import\Media;

use AppBundle\Import\Job\RemoveImages;
use AppBundle\Helper\RedisClient;
use Doctrine\DBAL\Connection;

class ImageCleaner
{
    const GET_IMAGES_SQL = <<<SQL
    SELECT url FROM property_photo WHERE property_id = :property_id
SQL;

    /**
     * @var Connection
     */
    private $conn;
    /**
     * @var RedisClient
     */
    private $redisClient;

    /**
     * @param Connection  $conn
     * @param RedisClient $redisClient
     */
    public function __construct(Connection $conn, RedisClient $redisClient)
    {
        $this->conn = $conn;
        $this->redisClient = $redisClient;
    }

    public function cleanPropertyPhotos($propertyId)
    {
        $stmt = $this->conn->executeQuery(self::GET_IMAGES_SQL, ['property_id' => $propertyId]);
        $photosToRemove = [];
        while ($url = $stmt->fetchColumn()) {
            $photosToRemove[] = $url;
        }
        if (!empty($photosToRemove)) {
            $this->scheduleRemoval($propertyId, $photosToRemove);
        }
    }

    protected function scheduleRemoval($propertyId, $photosToRemove)
    {
        $this->redisClient->enqueue('thumb_process', RemoveImages::class, [
            'property_id' => $propertyId,
            'images_to_remove' => $photosToRemove,
        ]);
    }
}
