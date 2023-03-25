<?php

namespace AppBundle\Elastic\User\View;

use AppBundle\Elastic\Integration\View\ViewInterface;
use AppBundle\Entity\User\User;
use Symfony\Component\Routing\RouterInterface;

class UserSimpleSearchView implements ViewInterface
{
    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * SearchAgentView constructor.
     *
     * @param RouterInterface $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'user_simple_search';
    }

    /**
     * @param mixed $results
     * @param array $runtimeOptions
     *
     * @return array
     */
    public function __invoke($results, $runtimeOptions = [])
    {
        $items = [];

        /** @var User $user */
        foreach ($results as $user) {
            $title = $user->getName();
            $companyName = $user->getCompanyName();

            if ($title != $companyName) {
                $title .= ', '.$user->getCompanyName();
            }

            $items[] = [
                'id' => $user->getId(),
                'title' => $title,
                'agents' => $user->agentCount,
                'affiliates' => $user->affiliateCount,
                'properties' => $user->propertyCount,
                'articles' => $user->articleCount,
                'address' => $user->address->getPublicAddress(),
                'url' => $this->router->generate('ha_user_profile', [
                    'id' => $user->getId(),
                    'slug' => $user->slug(),
                ], true),
            ];
        }

        return [
            'items' => $items,
            'total' => $results->getTotal(),
        ];
    }
}
