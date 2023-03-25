<?php

namespace AppBundle\Service\Email;

class MessageBuilder implements MessageBuilderInterface
{
    /**
     * @var \Swift_Message
     */
    protected $message;
    /**
     * @var string
     */
    protected $subject;
    /**
     * @var string
     */
    protected $fromAddress;
    /**
     * @var string
     */
    protected $fromName;
    /**
     * @var string
     */
    protected $toAddress;
    /**
     * @var string
     */
    protected $toName;
    /**
     * @var array
     */
    protected $cc;
    /**
     * @var string
     */
    protected $bodyTemplate;
    /**
     * @var array
     */
    protected $bodyParameters;
    /**
     * @var \Twig_Environment
     */
    protected $twig;
    /**
     * @var array
     */
    protected $contentTypes = [
        'body_text' => 'text/plain',
        'body_html' => 'text/html',
    ];
    /**
     * @var array
     */
    protected $context = [];
    /**
     * @var
     */
    protected $template;

    public function __construct(\Twig_Environment $twig)
    {
        $this->twig = $twig;
    }

    /**
     * @return \Swift_Message
     */
    public function createMessage()
    {
        $this->message = $message = \Swift_Message::newInstance();
        $message->setSubject($this->subject);
        $message->setFrom($this->fromAddress, $this->fromName);
        $message->setTo($this->toAddress, $this->toName);
        $message->setCc($this->cc);

        foreach (['body_text', 'body_html'] as $block) {
            $message->addPart(
                $this->renderBlock(
                    $block,
                    $this->bodyTemplate,
                    $this->bodyParameters
                ),
                $this->getContentType($block)
            );
        }

        return $message;
    }

    /**
     * @param string $subject
     *
     * @return $this
     */
    public function addSubject($subject)
    {
        $this->subject = $subject;

        return $this;
    }

    /**
     * @param string $from
     * @param string $name
     *
     * @return $this
     */
    public function addFrom($from, $name = null)
    {
        $this->fromAddress = $from;
        $this->fromName = $name;

        return $this;
    }

    /**
     * @param string $toAddress
     * @param string $toName
     *
     * @return $this
     */
    public function addTo($toAddress, $toName = null)
    {
        $this->toAddress = $toAddress;
        $this->toName = $toName;

        return $this;
    }

    /**
     * @param $cc
     *
     * @return $this
     */
    public function addCc($cc)
    {
        $this->cc[] = $cc;

        return $this;
    }

    /**
     * @param array|null $cc
     *
     * @return $this
     */
    public function setCc(array $cc = null)
    {
        $this->cc = $cc;

        return $this;
    }

    /**
     * @return $this
     */
    public function removeCc()
    {
        $this->cc = null;

        return $this;
    }

    /**
     * @param $template
     * @param array|null $parameters
     *
     * @return $this
     */
    public function addBody($template, array $parameters = null)
    {
        $this->bodyTemplate = $template;
        $this->bodyParameters = $parameters;

        return $this;
    }

    /**
     * @param \Twig_Environment $template
     */
    public function setTwig(\Twig_Environment $twig)
    {
        $this->twig = $twig;
    }

    /**
     * @param string     $block
     * @param string     $template
     * @param array|null $parameters
     *
     * @return string
     */
    protected function renderBlock($block, $template, array $parameters = null)
    {
        $context = $this->context = $this->context ?: $this->twig->mergeGlobals($parameters ?: []);
        $template = $this->template = $this->template ?: $this->twig->loadTemplate($template);

        return $template->renderBlock($block, $context);
    }

    /**
     * @param $type
     *
     * @return string
     */
    protected function getContentType($type)
    {
        if (!isset($this->contentTypes[$type])) {
            throw new \InvalidArgumentException('Undefined type');
        }

        return $this->contentTypes[$type];
    }
}
