<?php

namespace AppBundle\Service\Billing;

use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\User\User;

class BraintreeWebhook
{
    /**
     * @var EntityManager
     */
    protected $em;
    /**
     * @var BraintreeService
     */
    protected $braintreeService;

    /**
     * @param EntityManager    $em
     * @param BraintreeService $braintree
     */
    public function __construct(EntityManager $em, BraintreeService $braintreeService)
    {
        $this->em = $em;
        $this->braintreeService = $braintreeService;
    }

    public function handle(Request $request)
    {
        $notification = $this->parse($request);

        $subId = $notification['subject']['subscription']['id'];
        $user = $this->em
            ->getRepository('AppBundle:User\User')
            ->findOneBySubscriptionId($subId);

        if (!$user) {
            return false;
        }

        switch ($notification['kind']) {
            case 'subscription_canceled':
                $this->downgradeUserAccount($user, 'canceled');
                break;

            case 'subscription_expired':
                $this->downgradeUserAccount($user, 'expired');
                break;

            case 'subscription_charged_successfully':
                $this->renew($notification, $user);
                break;
        }

        return true;
    }

    /**
     * Get the braintree data out of the request we receive.
     *
     * @param Request $request
     *
     * @return array
     */
    protected function parse(Request $request)
    {
        $notification = \Braintree_WebhookNotification::parse(
            $request->get('bt_signature'),
            $request->get('bt_payload')
        );

        return $notification->_attributes;
    }

    /**
     * Renew the users account once braintree has acknowledged that the payment was successful.
     *
     * @param array $notification
     * @param User  $user
     */
    protected function renew($notification, User $user)
    {
        $card = $this
            ->em
            ->getRepository('AppBundle:User\Billing\Card')
            ->findOneBy([
                'user' => $user,
            ]);

        $subscription = \Braintree_Subscription::find(
            $notification['subscription']->_attributes['id']
        );

        // If the user is not liable for VAT we should process the payment via the VAT Client
        if ($this->vatHelper->isLiable($user)) {
            $currency = $this->planHelper->getBillableCurrency($user);
            $amount = $this->planHelper->getPrice(User::PLAN_PREMIUM, $currency) / 100;

            $this->vatTransaction->addItem('subscription', $amount);
            $transaction = $this->vatTransaction->createTransaction($user);

            $payment = $this->paymentFactory->createHistoryRecordFromTransaction(
                $this->vatTransaction->confirm($transaction->key),
                $user,
                $card,
                $subscription
            );
        } else {
            $payment = $this->paymentFactory->createHistoryRecord($user, $card, $subscription);
        }

        $this->em->persist($payment);
        $this->em->flush();
    }

    /**
     * @param User   $user
     * @param string $context The type of downgrade that is happening 'expired', (manual) 'downgraded', (manual) 'canceled'
     */
    public function downgradeUserAccount(User $user, $context = 'canceled')
    {
        $card = $this->em->getRepository('AppBundle:Card')->findOneByUser($user);

        if ($card) {
            try {
                $this->braintreeService->deleteCard($card);
                $this->braintreeService->deleteAddress($user);
            } catch (\Braintree_Exception_NotFound $e) {
            }

            $this->em->remove($card);
        }

        // Remove ROLE_WRITER here
    }
}
