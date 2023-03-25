<?php

namespace AppBundle\Import\Email;

use Doctrine\DBAL\Connection;
use FOS\UserBundle\Util\CanonicalizerInterface;

class MysqlEmailsInUseList implements EmailsInUseListInterface
{
    /**
     * @var Connection
     */
    private $conn;
    /**
     * @var CanonicalizerInterface
     */
    private $canonicalizer;

    /**
     * @param Connection             $conn
     * @param CanonicalizerInterface $canonicalizer
     */
    public function __construct(Connection $conn, CanonicalizerInterface $canonicalizer)
    {
        $this->conn = $conn;
        $this->canonicalizer = $canonicalizer;
    }

    public function isInUse(string $email): bool
    {
        return (bool) $this
            ->conn
            ->executeQuery(
                'SELECT email_canonical FROM user WHERE email_canonical = :email LIMIT 1',
                [
                    'email' => $this->canonicalizer->canonicalize($email),
                ]
            )
            ->fetchColumn()
        ;
    }

    /**
     * @param string $email
     * @param string $sourceRef
     *
     * @return bool
     */
    public function isInUseBySourceRef(string $email, string $sourceRef): bool
    {
        return (bool) $this
            ->conn
            ->executeQuery(
                'SELECT email_canonical FROM user WHERE email_canonical = :email AND sourceRef = :sourceRef LIMIT 1',
                [
                    'email' => $this->canonicalizer->canonicalize($email),
                    'sourceRef' => $sourceRef,
                ]
            )
            ->fetchColumn()
        ;
    }

    public function addInUse(string $email): void
    {
        // This happens automatically for MySQL list
    }
}
