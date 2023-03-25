<?php

namespace AppBundle\Entity\Traits;

trait MessagesTrait
{
    /**
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("messagesCount")
     * @JMS\Groups({"collection","details","message"})
     *
     * @return int
     */
    public function getMessagesCount(): int
    {
        if ($this->room) {
            return $this->room->messages->count();
        }

        return 0;
    }
}
