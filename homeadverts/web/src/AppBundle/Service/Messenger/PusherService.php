<?php

namespace AppBundle\Service\Messenger;

use AppBundle\Entity\Messenger\Message;
use AppBundle\Entity\User\User;
use Pusher\Pusher;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Pusher\PusherException;

class PusherService
{
    /**
     * @var string
     */
    const PUSHER_CHANNEL_USER = 'presence-user-';
    const PUSHER_CHANNEL_ONLINE = 'presence-online';
    const PUSHER_EVENT_NEW_MESSAGE = 'message';
    const PUSHER_EVENT_READ_MESSAGE = 'read';

    /**
     * @var Pusher
     */
    protected $pusherLibrary;

    /**
     * @param Pusher $pusherLibrary
     */
    public function __construct(Pusher $pusherLibrary)
    {
        $this->pusherLibrary = $pusherLibrary;
    }

    /**
     * Creates a presence signature (an extension of socket signing).
     *
     * @param User   $user
     * @param string $channelName
     * @param string $socketId
     *
     * @throws \Pusher\PusherException
     * @throws AccessDeniedException
     *
     * @return string
     */
    public function authorizeUser(User $user, string $channelName, string $socketId): string
    {
        if (!$this->validateChannel($channelName, $user)) {
            throw new AccessDeniedException(
                sprintf('Invalid channel name for user id: %s', $user->getId())
            );
        }

        return $this
            ->pusherLibrary
            ->presence_auth(
                $channelName,
                $socketId,
                $user->getId(),
                $this->buildPayload($user)
            );
    }

    /**
     * @param User   $user
     * @param string $socketId
     *
     * @throws PusherException
     *
     * @return string
     */
    public function authorizeOnline(User $user, string $socketId): string
    {
        return $this
            ->pusherLibrary
            ->presence_auth(
                $this::PUSHER_CHANNEL_ONLINE,
                $socketId,
                $user->getId(),
                $this->buildPayload($user)
            );
    }

    /**
     * Sends a $message to the given $channel and $event,
     * optionally taking a $socketId to be excluded from the recipients.
     *
     * @param $channel
     * @param $event
     * @param $message
     * @param string|null $socketId
     * @param bool        $autoEncodeToJson Defaults to true, set to false if your $message is already on json, or if you want raw output
     *
     * @return bool $response
     */
    public function sendMessage(
        string $channel,
        string $event,
        array $message
    ) {
        $response = $this->pusherLibrary->trigger(
            $channel,
            $event,
            $message
        );

        return $response;
    }

    /**
     * @param User    $user
     * @param Message $message
     */
    public function updatePusherNewMessage(User $user, Message $message)
    {
        // == Send Message ==
        $payload = [
            'room' => [
                'id' => $message->room->getId(),
            ],
            'message' => [
                'id' => $message->getId(),
                'text' => $message->text,
                'timestamp' => $message->getTimestamp(),
                'user' => [
                    'id' => $user->getId(),
                ],
            ],
        ];

        foreach ($message->room->users as $userTo) {
            $channelName = $this->getUserChannel($userTo);

            $this
                ->sendMessage(
                    $channelName,
                    self::PUSHER_EVENT_NEW_MESSAGE,
                    $payload
                );
        }
    }

    /**
     * @param User $user
     *
     * @return array
     */
    private function buildPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->getName(),
        ];
    }

    /**
     * @param User $user
     *
     * @return string
     */
    public static function getUserChannel(User $user): string
    {
        return self::PUSHER_CHANNEL_USER.$user->getId();
    }

    /**
     * @param string $channelName
     * @param User   $user
     *
     * @return bool
     */
    private function validateChannel(string $channelName, User $user): bool
    {
        return $channelName === $this->getUserChannel($user);
    }
}
