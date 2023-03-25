<?php

namespace AppBundle\Elastic\User\View;

use AppBundle\Entity\User\User;

class MessengerSearchView
{
    /**
     * @param mixed $results
     *
     * @return array
     */
    public function __invoke($results)
    {
        $items = [];

        /** @var User $user */
        foreach ($results as $user) {
            $items[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'company' => $user->getCompanyName(),
                'photo' => $user->getProfileImage(),
            ];
        }

        return [
            'items' => $items,
            'total' => $results->getTotal(),
        ];
    }
}
