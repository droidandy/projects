<?php

namespace AppBundle\Import\Job;

use AppBundle\Entity\User\User;
use AppBundle\Import\Media\PhotoDownloader;
use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\Connection;
use Guzzle\Http\Exception\BadResponseException;
use Guzzle\Http\Client;
use Guzzle\Http\Message\Response;

class AvatarFix extends ResqueJob
{
    public function run($args, $app)
    {
        $userId = $args['user_id'];
        /** @var EntityManager $em */
        $em = $app->get('em');
        /** @var Client $client */
        $client = $app->get('ha.import.http_client');
        /** @var Connection $sothebysConn */
        $sothebysConn = $app->get('doctrine.dbal.sothebys_connection');
        /** @var PhotoDownloader $photoDownloader */
        $avatarManager = $app->get('ha.import.avatar_manager');

        $user = $em
            ->createQuery('SELECT u, sr FROM AppBundle:User\User u JOIN u.sourceRefs sr WHERE u.id = ?1')
            ->setParameter(1, $userId)
            ->getSingleResult()
        ;
        try {
            /** @var Response $reponse */
            $response = $client
                ->head($user->profileImage)
                ->send()
            ;
        } catch (BadResponseException $e) {
            $response = $e->getResponse();
        }
        if (404 == $response->getStatusCode() || 403 == $response->getStatusCode()) {
            $this->log(sprintf('404: In processing %s %s', $user->sourceRef, $user->profileImage));
            $sourceRefs = $user->sourceRefs;
            foreach ($sourceRefs as $sourceRef) {
                if ('guid' == $sourceRef->type) {
                    $ref = $sourceRef->ref;
                    break;
                }
            }
            if (empty($ref)) {
                $this->log(sprintf('Skipped %s', $user->sourceRef));

                return;
            }
            $stmt = $sothebysConn->executeQuery(<<<SQL
                SELECT 
                    samo.url AS url,
                    samo.image_sequence_no AS image_sequence_no,
                    samo.media_category_type AS media_category_type 
                FROM sir_agent_media_original samo WHERE samo.agent_guid = ?
SQL
                , [$ref]);
            $avatar = $this->getAvatar($stmt->fetchAll());
            $fakeUser = new User();
            $fakeUser->sourceRef = $user->sourceRef;
            $fakeUser->profileImage = $avatar;
            $avatarManager->process($fakeUser);
        } else {
            $this->log(sprintf('Correct %s', $user->sourceRef));
        }
    }

    public function getAvatar($photos)
    {
        usort($photos, function ($val1, $val2) {
            return $val1['image_sequence_no'] - $val2['image_sequence_no'];
        });
        foreach ($photos as $photo) {
            if ('5' == $photo['media_category_type']) {
                return $photo['url'];
            }
        }

        return isset($photos[0]) ? $photos[0]['url'] : null;
    }
}
