<?php

namespace Test\AppBundle\Elastic\User\View;

use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Entity\User\User;
use AppBundle\Elastic\User\View\UserSimpleSearchView;
use Symfony\Component\Routing\RouterInterface;

class AgentSimpleSearchViewTest extends \PHPUnit_Framework_TestCase
{
    public function testInvoke()
    {
        $router = $this->getRouter();
        $router
            ->expects($this->exactly(3))
            ->method('generate')
            ->withConsecutive(
                [
                    'ha_directory_profile',
                    [
                        'id' => 1,
                        'slug' => 'user-name-1',
                    ],
                    true,
                ],
                [
                    'ha_directory_profile',
                    [
                        'id' => 2,
                        'slug' => 'user-name-2',
                    ],
                    true,
                ],
                [
                    'ha_directory_profile',
                    [
                        'id' => 3,
                        'slug' => 'user-name-3',
                    ],
                    true,
                ]
            )
            ->willReturnOnConsecutiveCalls(
                'url_user_1',
                'url_user_2',
                'url_user_3'
            )
        ;

        $users = [];
        foreach ([
                     [1, 'user_name_1', 'company_name_1', 5],
                     [2, 'user_name_2', 'company_name_1', 6],
                     [3, 'user_name_3', 'company_name_3', 7],
                 ] as $userData) {
            $users[] = $this->getUser(...$userData);
        }

        $searchResults = $this->getSearchResults();
        $searchResults
            ->expects($this->once())
            ->method('getTotal')
            ->willReturn(3)
        ;
        $searchResults
            ->method('current')
            ->willReturnCallback(function () use (&$users) {
                return current($users);
            })
        ;
        $searchResults
            ->method('key')
            ->willReturnCallback(function () use (&$users) {
                return key($users);
            })
        ;
        $searchResults
            ->method('next')
            ->willReturnCallback(function () use (&$users) {
                return next($users);
            })
        ;
        $searchResults
            ->method('valid')
            ->willReturnCallback(function () use (&$users) {
                return current($users);
            })
        ;

        $agentSimpleSearch = $this->getAgentSimpleSearchView($router);

        $viewOutput = $agentSimpleSearch($searchResults);

        $this->assertEquals([
            'items' => [
                [
                    'id' => 1,
                    'title' => 'user_name_1, company_name_1',
                    'url' => 'url_user_1',
                    'properties' => 5,
                ],
                [
                    'id' => 2,
                    'title' => 'user_name_2, company_name_1',
                    'url' => 'url_user_2',
                    'properties' => 6,
                ],
                [
                    'id' => 3,
                    'title' => 'user_name_3, company_name_3',
                    'url' => 'url_user_3',
                    'properties' => 7,
                ],
            ],
            'total' => 3,
        ], $viewOutput);
    }

    private function getAgentSimpleSearchView($router)
    {
        return new UserSimpleSearchView($router);
    }

    private function getRouter()
    {
        return $this
            ->getMockBuilder(RouterInterface::class)
            ->getMock()
        ;
    }

    private function getUser($id, $name, $companyName, $propertyCount)
    {
        $user = new User();
        $user->setId($id);
        $user->setName($name);
        $user->companyName = $companyName;
        $user->propertyCount = $propertyCount;

        return $user;
    }

    private function getSearchResults()
    {
        return $this
            ->getMockBuilder(SearchResults::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
