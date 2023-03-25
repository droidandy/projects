<?php

namespace Test\AppBundle\Controller\Api\User;

use AppBundle\Service\Billing\Billing;
use AppBundle\Service\Email\Mailer;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class BillingControllerTest extends AbstractWebTestCase
{
    use UserTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testCardUpdateAction()
    {
        $data = [
            'email' => $this->faker->email,
            'password' => $this->faker->numberBetween(),
        ];

        $user = $this->newUser($data);
        $this->em->persist($user);
        $this->em->flush($user);

        $this->logIn($user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_billing_card_update'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'cardholderName' => $this->faker->firstName.' '.$this->faker->lastName,
                'number' => 4111111111111111,
                'cvv' => 999,
                'expirationMonth' => 11,
                'expirationYear' => 22,
                'countryCodeAlpha2' => 'US',
                'postalCode' => '10000',
            ])
        );

        $message = $this->getSwiftMailMessage();

        $this->assertEquals(Mailer::MAIL_BILLING_UPGRADE, $message->getSubject());
        $this->assertEquals(200, $this->getResponseStatusCode());
        $this->assertTrue(in_array(Billing::ROLE_WRITER, $user->getRoles()));
    }

    public function testWriterToUserDowngrade()
    {
        $writer = $this->newWriterPersistent();
        $this->logIn($writer);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_billing_user_downgrade'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $message = $this->getSwiftMailMessage();

        $this->assertEquals(Mailer::MAIL_BILLING_DOWNGRADE, $message->getSubject());
        $this->assertEquals(200, $this->getResponseStatusCode());
        $this->assertFalse(in_array(Billing::ROLE_WRITER, $writer->getRoles()));
    }
}
