<?php

namespace AppBundle\Import\User;

use AppBundle\Entity\User\User;

interface LinksToUserResolverInterface
{
    /**
     * @param User $company
     *
     * @return mixed
     */
    public function resolveLinksToCompany(User $company);

    /**
     * @param User $office
     *
     * @return mixed
     */
    public function resolveLinksToOffice(User $office);

    /**
     * @param User $user
     */
    public function resolveLinksToUser(User $user);
}
