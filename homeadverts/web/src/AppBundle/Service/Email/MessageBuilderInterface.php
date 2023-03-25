<?php

namespace AppBundle\Service\Email;

interface MessageBuilderInterface
{
    /**
     * @return \Swift_Message
     */
    public function createMessage();

    /**
     * @param string $subject
     *
     * @return $this
     */
    public function addSubject($subject);

    /**
     * @param string $from
     * @param string $name
     *
     * @return $this
     */
    public function addFrom($from, $name = null);

    /**
     * @param string $toAddress
     * @param string $toName
     *
     * @return $this
     */
    public function addTo($toAddress, $toName = null);

    /**
     * @param $cc
     *
     * @return $this
     */
    public function addCc($cc);

    /**
     * @param array|null $cc
     *
     * @return $this
     */
    public function setCc(array $cc = null);

    /**
     * @return $this
     */
    public function removeCc();

    /**
     * @param $template
     * @param array|null $parameters
     *
     * @return $this
     */
    public function addBody($template, array $parameters = null);
}
