<?php

namespace AppBundle\Service\User;

use Abraham\TwitterOAuth\TwitterOAuth;
use Exception;
use Facebook\Facebook;
use Happyr\LinkedIn\LinkedIn;
use RuntimeException;
use AppBundle\Entity\Social\Article\ArticleRepository;
use AppBundle\Elastic\User\UserSearchRepo;
use AppBundle\Entity\User\User;

class UserProfile
{
    const SOCIAL_GOOGLE_URL = 'https://plus.google.com/';
    const SOCIAL_TWITTER_URL = 'https://twitter.com/';

    /**
     * @var string
     */
    protected $socialCredentials;
    /**
     * @var ArticleRepository
     */
    protected $articleRepository;
    /**
     * @var UserSearchRepo
     */
    protected $userSearchRepo;

    /**
     * @param UserSearchRepo    $userSearchRepo
     * @param ArticleRepository $articleRepository
     * @param array socialCredentials
     */
    public function __construct(
        UserSearchRepo $userSearchRepo,
        ArticleRepository $articleRepository,
        array $socialCredentials
    ) {
        $this->userSearchRepo = $userSearchRepo;
        $this->articleRepository = $articleRepository;
        $this->socialCredentials = $socialCredentials;
    }

    /**
     * @param User $user
     *
     * @return array
     */
    public function getUserActions(User $user)
    {
        $actions = [
            'article' => [
                'total' => $user->articleCount,
            ],
            'property' => [
                'for_sale' => [
                    'total' => $user->propertyForSaleCount,
                ],
                'to_rent' => [
                    'total' => $user->propertyToRentCount,
                ],
            ],
        ];

        if (User::TYPE_COMPANY === $user->getType()) {
            $actions = array_merge(
                [
                    'agent' => [
                        'total' => $user->agentCount,
                    ],
                    'affiliate' => [
                        'total' => $user->affiliateCount,
                    ],
                ],
                $actions
            );
        }

        return $actions;
    }

    /**
     * @param User   $user
     * @param string $networkName
     *
     * @throws RuntimeException
     *
     * @return string
     */
    public function getSocialProfileLink(User $user, $networkName)
    {
        try {
            switch ($networkName) {
                case 'facebook':
                    return $this->getSocialProfileLinkFacebook($user);
                case 'google':
                    return $this->getSocialProfileLinkGoogle($user);
                case 'twitter':
                    return $this->getSocialProfileLinkTwitter($user);
                case 'linkedin':
                    return $this->getSocialProfileLinkLinkedIn($user);
            }
        } catch (Exception $e) {
            throw new RuntimeException('User\'s profile address cannot be retrieved');
        }
    }

    /**
     * @param User $user
     *
     * @return string
     */
    private function getSocialProfileLinkFacebook(User $user)
    {
        $fb = new Facebook([
            'app_id' => $this->socialCredentials['facebook'][0],
            'app_secret' => $this->socialCredentials['facebook'][1],
        ]);

        $response = $fb->post(
            '/me',
            ['fields' => 'id, link, name'],
            $user->getFacebookAccessToken()
        );
        $data = json_decode($response->getBody());

        return $data->link;
    }

    /**
     * @param User $user
     *
     * @return string
     */
    private function getSocialProfileLinkGoogle(User $user)
    {
        return self::SOCIAL_GOOGLE_URL.$user->getGoogleId();
    }

    /**
     * @param User $user
     *
     * @throws RuntimeException
     *
     * @return string
     */
    private function getSocialProfileLinkTwitter(User $user)
    {
        $tw = new TwitterOAuth(
            $this->socialCredentials['twitter'][0],
            $this->socialCredentials['twitter'][1],
            $user->getTwitterAccessToken(),
            $user->getTwitterTokenSecret()
        );

        $response = (array) $tw->get(
            'users/show',
            [
                'user_id' => $user->getTwitterId(),
            ]
        );
        $link = self::SOCIAL_TWITTER_URL.$response['screen_name'];

        return $link;
    }

    /**
     * @param User $user
     *
     * @throws RuntimeException
     *
     * @return string
     */
    private function getSocialProfileLinkLinkedIn(User $user)
    {
        $linkedIn = new LinkedIn(
            $this->socialCredentials['linkedin'][0],
            $this->socialCredentials['linkedin'][1]
        );
        $linkedIn->setAccessToken($user->getLinkedinAccessToken());

        $response = $linkedIn->get('v1/people/~/');

        return $response['siteStandardProfileRequest']['url'];
    }
}
