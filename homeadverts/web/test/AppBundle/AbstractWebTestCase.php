<?php

namespace Test\AppBundle;

use Swift_Message;
use Symfony\Bundle\FrameworkBundle\Client;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use AppBundle\Entity\User\User;

abstract class AbstractWebTestCase extends AbstractTestCase
{
    /**
     * @var Client
     */
    protected $client;
    /**
     * @var string
     */
    protected $xsrf;

    /**
     * @var string
     */
    protected static $httpHost = null;

    /**
     * @param string $httpHost
     */
    public static function setUpBeforeClass($httpHost = 'forbes.homeadverts.dev')
    {
        static::$httpHost = $httpHost;
    }

    /**
     * getSwiftMailMessage.
     *
     * @return Swift_Message $message
     */
    public function getSwiftMailMessage()
    {
        $mailCollector = $this->client->getProfile()->getCollector('swiftmailer');
        $this->assertEquals(1, $mailCollector->getMessageCount());
        $collectedMessages = $mailCollector->getMessages();
        $message = $collectedMessages[0];

        return $message;
    }

    /**
     * @param $name
     * @param array $parameters
     *
     * @return string
     */
    public function generateRoute($name, $parameters = [])
    {
        $route = $this
            ->getContainer()
            ->get('router')
            ->generate($name, $parameters);

        return $route;
    }

    /**
     * @return array
     */
    public function getResponseResult()
    {
        $response = $this->client->getResponse();
        $content = $response->getContent();

        return json_decode($content, true);
    }

    /**
     * @return int
     */
    public function getResponseStatusCode()
    {
        return $this->client->getResponse()->getStatusCode();
    }

    protected function setUp()
    {
        parent::setUp();

        $this->client = static::createClient([], ['HTTP_HOST' => static::$httpHost]);
        $this->xsrf = $this->getCsrfToken();
    }

    protected function tearDown()
    {
        unset($this->client);

        parent::tearDown();
    }

    /**
     * @param array $options
     * @param array $server
     *
     * @return Client
     */
    protected static function createClient(array $options = array(), array $server = array())
    {
        $client = static::$kernel->getContainer()->get('test.client');
        $client->setServerParameters($server);

        return $client;
    }

    /**
     * @param User $user
     */
    protected function logIn(User $user)
    {
        $session = $this->client->getContainer()->get('session');
        $em = $this->client->getContainer()->get('doctrine')->getManager();

        // the firewall context defaults to the firewall name
        $firewallContext = 'main';

        $token = new UsernamePasswordToken(
            $em->getReference(User::class, $user),
            null,
            $firewallContext,
            $user->getRoles()
        );
        $session->set('_security_'.$firewallContext, serialize($token));
        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        $this->client->getCookieJar()->set($cookie);
    }

    /**
     * @return string
     */
    protected function getCsrfToken()
    {
        return $this
            ->getContainer()
            ->get('dunglas_angular_csrf.token_manager')
            ->getToken()
            ->getValue();
    }

    /**
     * @return Crawler
     */
    protected function crawlerFilter($selector)
    {
        return $this->client->getCrawler()->filter($selector);
    }

    /**
     * A request is needed to supply SwifMailer's mail collection
     * http://symfony.com/doc/current/testing/profiling.html.
     */
    protected function issueRequest()
    {
        $this->client->request(
            'GET',
            $this->generateRoute('ha_homepage')
        );
    }
}
