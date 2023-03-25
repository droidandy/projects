<?php

namespace AppBundle\Service\Email;

use AppBundle\Entity\User\AccessToken;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Messenger\Message;
use AppBundle\Service\Report\DbReporter;
use Twig_Environment;
use Swift_Message;
use Swift_Mailer;
use Symfony\Component\Routing\Router;
use Symfony\Component\Templating\EngineInterface;

class Mailer
{
    const MESSENGER_URL = 'https://messenger.luxuryaffairs.co.uk/';

    const MAIL_ACCOUNT_NEW = 'New account';
    const MAIL_ACCOUNT_TERMINATE = 'Account terminated';
    const MAIL_UPGRADE_REQUEST = 'Account upgrade request';
    const MAIL_NEW_PASSWORD = 'New password';
    const MAIL_NEW_MESSAGE = 'You have a new message';
    const MAIL_DATABASE_SUMMARY = 'Database Summary';

    const MAIL_BILLING_UPGRADE = 'User plan upgrade';
    const MAIL_BILLING_DOWNGRADE = 'User plan downgrade';

    /**
     * @var Twig_Environment
     */
    protected $twig;
    /**
     * @var EngineInterface
     */
    protected $templating;
    /**
     * @var Router
     */
    protected $router;
    /**
     * @var Swift_Mailer
     */
    protected $mailer;
    /**
     * @var DbReporter
     */
    protected $dbReporter;
    /**
     * @var string
     */
    protected $emailNoreply;
    /**
     * @var string
     */
    protected $emailsReport = [];

    /**
     * @param Twig_Environment $twig
     * @param Swift_Mailer $mailer
     * @param Router $router
     * @param EngineInterface $templating
     * @param DbReporter $dbReporter
     * @param string $emailNoreply
     * @param array $emailsReport
     */
    public function __construct(
        Twig_Environment $twig,
        Swift_Mailer $mailer,
        Router $router,
        EngineInterface $templating,
        DbReporter $dbReporter,
        $emailNoreply,
        array $emailsReport
    ) {
        $this->twig = $twig;
        $this->mailer = $mailer;
        $this->router = $router;
        $this->templating = $templating;
        $this->dbReporter = $dbReporter;
        $this->emailNoreply = $emailNoreply;
        $this->emailsReport = $emailsReport;
    }

    /**
     * @param User $user
     *
     * @return mixed
     */
    public function sendAccountTerminateEmail(User $user)
    {
        $message = Swift_Message::newInstance()
            ->setSubject($this::MAIL_ACCOUNT_TERMINATE)
            ->setFrom($this->emailNoreply)
            ->setTo($user->getEmail())
            ->setBody(
                $this
                    ->templating
                    ->render(
                        'AppBundle:email/user:terminate.email.twig',
                        [
                            'email' => $user->getEmail(),
                            'email_user_to' => $user->getEmail(),
                        ]
                    ),
                'text/html'
            );

        $this->mailer->send($message);
    }

    /**
     * @param Message $message
     * @param User $user
     * @param string $referrer
     */
    public function sendMessageEmail(Message $message, User $user)
    {
        $email = Swift_Message::newInstance()
            ->setSubject($this::MAIL_NEW_MESSAGE)
            ->setTo($user->getEmail())
            ->setFrom($this->emailNoreply)
            ->setBody(
                $this
                    ->templating
                    ->render(
                        'AppBundle:email:message.email.twig',
                        [
                            'message' => $message,
                            'email_user_to' => $user->getEmail(),
                            'link' => self::MESSENGER_URL,
                        ]
                    ),
                'text/html'
            );

        $this->mailer->send($email);
    }

    public function sendDatabaseReportEmail()
    {
        $email = Swift_Message::newInstance()
            ->setSubject($this::MAIL_DATABASE_SUMMARY)
            ->setTo($this->emailsReport)
            ->setFrom($this->emailNoreply)
            ->setBody(
                $this
                    ->templating
                    ->render(
                        'AppBundle:email:dbReport.email.twig',
                        [
                            'summary' => $this->dbReporter->getSummary()
                        ]
                    ),
                'text/html'
            );

        $this->mailer->send($email);
    }

    /**
     * @param User $user
     * @param AccessToken $accessToken
     *
     * @return mixed
     */
    public function sendNewAccountEmail(User $user, AccessToken $accessToken)
    {
        $message = Swift_Message::newInstance()
            ->setSubject($this::MAIL_ACCOUNT_NEW)
            ->setFrom($this->emailNoreply)
            ->setTo($user->getEmail())
            ->setBody(
                $this
                    ->templating
                    ->render(
                        'AppBundle:email/user:new_user.email.twig',
                        [
                            'link' => $this->router->generate('ha_user_terminate_by_token', [
                                'token' => $accessToken->getToken(),
                            ], Router::ABSOLUTE_URL),

                            'email' => $user->getEmail(),
                            'email_user_to' => $user->getEmail(),
                        ]
                    ),
                'text/html'
            );

        $this->mailer->send($message);
    }

    /**
     * @param string $emailTo
     * @param string $plainPassword
     *
     * @return mixed
     */
    public function sendNewPasswordEmail($emailTo, $plainPassword)
    {
        $message = Swift_Message::newInstance()
            ->setSubject($this::MAIL_NEW_PASSWORD)
            ->setFrom($this->emailNoreply)
            ->setTo($emailTo)
            ->setBody(
                $this
                    ->templating
                    ->render(
                        'AppBundle:email/user:new_password.email.twig',
                        [
                            'email' => $emailTo,
                            'email_user_to' => $emailTo,
                            'plainPassword' => $plainPassword,
                        ]
                    ),
                'text/html'
            );

        $this->mailer->send($message);
    }

    /**
     * @param User $user
     *
     * @return mixed
     */
    public function sendBillingPlanUpgrade(User $user)
    {
        $message = Swift_Message::newInstance()
            ->setSubject($this::MAIL_BILLING_UPGRADE)
            ->setFrom($this->emailNoreply)
            ->setTo($user->getEmail())
            ->setBody(
                $this
                    ->templating
                    ->render(
                        'AppBundle:email/billing:plan_upgrade.email.twig',
                        [
                            'user' => $user,
                            'email_user_to' => $user->getEmail(),
                        ]
                    ),
                'text/html'
            );

        $this->mailer->send($message);
    }

    /**
     * @param User $user
     *
     * @return mixed
     */
    public function sendBillingPlanDowngrade(User $user)
    {
        $message = Swift_Message::newInstance()
            ->setSubject($this::MAIL_BILLING_DOWNGRADE)
            ->setFrom($this->emailNoreply)
            ->setTo($user->getEmail())
            ->setBody(
                $this
                    ->templating
                    ->render(
                        'AppBundle:email/billing:plan_downgrade.email.twig',
                        [
                            'user' => $user,
                            'email_user_to' => $user,
                        ]
                    ),
                'text/html'
            );

        $this->mailer->send($message);
    }
}
