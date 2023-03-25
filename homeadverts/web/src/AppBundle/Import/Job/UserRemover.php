<?php

namespace AppBundle\Import\Job;

use AppBundle\Import\User\CountResolver;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Types\Type;
use AppBundle\Entity\Import\ImportJob;
use AppBundle\Elastic\User\Mapping\UserMapping;

class UserRemover
{
    const USER_COUNTS_QUERY_TEMPLATE = <<<SQL
    SELECT 
        count(u.id) all_user_count, 
        count(iu.user_id) last_import_user_count, 
        (count(u.id) - count(iu.user_id)) to_delete_user_count
        FROM user u
            LEFT JOIN import_user iu ON u.id = iu.user_id AND iu.job_id = :job_id
            WHERE u.deletedAt IS NULL AND u.type='user'
SQL;

    const USER_IDS_TO_DELETE_QUERY_TEMPLATE = <<<SQL
    SELECT u.id u_id 
        FROM user u
            LEFT JOIN import_user iu ON u.id = iu.user_id AND iu.job_id = :job_id
            WHERE iu.user_id IS NULL AND u.deletedAt IS NULL AND u.type='user'
SQL;

    const USER_REMOVE_QUERY_TEMPLATE = <<<SQL
    UPDATE user u 
        SET 
            u.username = CONCAT(u.username, :hash), 
            u.username_canonical = CONCAT(u.username_canonical, :hash), 
            u.email = CONCAT(u.email, :hash), 
            u.email_canonical = CONCAT(u.email_canonical, :hash),
            u.deletedAt = :deleted_at
        WHERE u.id = :id
SQL;
    const USER_REF_TO_ID_QUERY = <<<SQL
    SELECT u.id u_id
        FROM user u
        JOIN user_source_ref sr ON u.id = sr.user_id
        WHERE (u.sourceRef IN (:refs) OR sr.ref IN (:refs))
SQL;

    /**
     * @var Connection
     */
    private $conn;
    /**
     * @var UserMapping
     */
    private $userMapping;
    /**
     * @var CountResolver
     */
    private $countResolver;

    private $progress;

    /**
     * @param Connection    $conn
     * @param UserMapping   $userMapping
     * @param CountResolver $countResolver
     */
    public function __construct(Connection $conn, UserMapping $userMapping, CountResolver $countResolver)
    {
        $this->conn = $conn;
        $this->userMapping = $userMapping;
        $this->countResolver = $countResolver;
    }

    public function remove(ImportJob $job, $args, $dryRun = false, $onFinishMethod = 'setUserRemovedNotify')
    {
        $ids = $this->getIdsToRemove($job, $args);
        $users = $this->expandUserIds($ids);
        $deletedAt = new \DateTime();
        $this->progress = 0;
        foreach ($users as $user) {
            $roles = Type::getType(Type::TARRAY)
                ->convertToPHPValue(
                    $user['roles'],
                    $this->conn->getDatabasePlatform()
                )
            ;
            if (in_array(User::ROLE_COMPANY, $roles)) {
                $this->countResolver->onCompanyRemoved(
                    $user['id'],
                    function () use ($user, $deletedAt) {
                        $this->removalStep($user, $deletedAt);
                    }
                );
            } elseif (in_array(User::ROLE_OFFICE, $roles)) {
                $this->countResolver->onOfficeRemoved(
                    $user['id'],
                    function () use ($user, $deletedAt) {
                        $this->removalStep($user, $deletedAt);
                    }
                );
            } elseif (in_array(User::ROLE_AGENT, $roles)) {
                $this->removalStep($user, $deletedAt);
                $this->countResolver->onAgentRemoved($user['id']);
            }
        }
        $job->$onFinishMethod($this->progress);
    }

    private function removalStep($user, \DateTime $deletedAt)
    {
        if ($this->conn->executeUpdate(self::USER_REMOVE_QUERY_TEMPLATE, [
            'hash' => '_'.md5($user['id']),
            'deleted_at' => Type::getType(
                Type::DATETIME
            )->convertToDatabaseValue(
                $deletedAt,
                $this->conn->getDatabasePlatform()
            ),
            'id' => $user['id'],
        ])) {
            ++$this->progress;
            $this->userMapping->markDocumentDeleted($user['id'], $deletedAt);
        }
    }

    private function expandUserIds(array $userIds)
    {
        return $this
            ->conn
            ->executeQuery(
                'SELECT id, roles FROM user WHERE id IN (:ids)',
                [
                    'ids' => $userIds,
                ],
                [
                    'ids' => Connection::PARAM_INT_ARRAY,
                ]
            )
            ->fetchAll()
        ;
    }

    private function getIdsToRemove(ImportJob $job, $args)
    {
        if (isset($args['ids_to_remove'])) {
            return $args['ids_to_remove'];
        } elseif (isset($args['refs_to_remove'])) {
            return $this
                ->conn
                ->executeQuery(
                    self::USER_REF_TO_ID_QUERY,
                    [
                        'refs' => $args['refs_to_remove'],
                    ],
                    [
                        'refs' => Connection::PARAM_STR_ARRAY,
                    ]
                )
                ->fetchAll(\PDO::FETCH_COLUMN)
            ;
        }

        $counts = $this->conn->fetchAssoc(
            self::USER_COUNTS_QUERY_TEMPLATE,
            [
                'job_id' => $job->getId(),
            ]
        );
        $this->validateCounts($counts);

        return $this
            ->conn
            ->executeQuery(
                self::USER_IDS_TO_DELETE_QUERY_TEMPLATE,
                [
                    'job_id' => $job->getId(),
                ]
            )
            ->fetchAll(\PDO::FETCH_COLUMN)
        ;
    }

    private function validateCounts($counts)
    {
        if ($counts['to_delete_user_count'] / $counts['all_user_count'] > 0.3) {
            throw new \RuntimeException('More than 30% of users tried to be deleted');
        }
    }
}
