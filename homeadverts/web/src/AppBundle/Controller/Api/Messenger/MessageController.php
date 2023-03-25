<?php

namespace AppBundle\Controller\Api\Messenger;

use AppBundle\Controller\Api\ApiControllerTemplate;
use AppBundle\Entity\Messenger\Message;
use AppBundle\Entity\Messenger\Room;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MessageController extends ApiControllerTemplate
{
    /**
     * @var string
     */
    protected $model = Message::class;

    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="user",
     *     class="AppBundle\Entity\Messenger\Room"
     * )
     *
     * @return Response
     */
    public function newAction(Room $room, Request $request)
    {
        $payload = json_decode($request->getContent(), true);

        $this
            ->get('app.message_sender')
            ->newMessage(
                $this->getUser(),
                $room,
                $payload['text']
            );

        return new Response();
    }

    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="message",
     *     class="AppBundle\Entity\Messenger\Message"
     * )
     *
     * @param Message $message
     *
     * @return Response
     */
    public function readAction(Message $message)
    {
        $this->get('app.message_sender')->readMessage(
            $message,
            $this->getUser()
        );

        return new Response();
    }
}
