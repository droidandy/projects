<?php

namespace AppBundle\Service\Billing;

use AppBundle\Entity\User\Billing\Payment;
use AppBundle\Entity\User\Billing\Subscription;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\Billing\CreditCard;
use AppBundle\Service\Email\Mailer;
use CalculateTaxOut;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class Billing
{
    const ROLE_WRITER = 'ROLE_WRITER';
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var BraintreeService
     */
    private $braintreeService;
    /**
     * @var Vat
     */
    private $vat;
    /**
     * @var Mailer
     */
    private $mailer;
    /**
     * @var TokenStorage
     */
    private $tokenStorage;

    /**
     * @param EntityManager    $em
     * @param BraintreeService $braintreeService
     * @param Vat              $vat
     * @param Mailer           $mailer
     * @param TokenStorage     $tokenStorage
     */
    public function __construct(
        EntityManager $em,
        BraintreeService $braintreeService,
        Vat $vat,
        Mailer $mailer,
        TokenStorage $tokenStorage
    ) {
        $this->em = $em;
        $this->braintreeService = $braintreeService;
        $this->vat = $vat;
        $this->mailer = $mailer;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @param User  $user
     * @param array $cc
     *
     * @return CreditCard
     */
    public function processCard(User $user, array $cc)
    {
        $card = $this->updateCard($user, $cc);

        $this->updateSubscription($card);

        $this->promoteRole($user);
    }

    /**
     * @param User   $user
     * @param string $role
     */
    public function promoteRole(User $user, $role = self::ROLE_WRITER)
    {
        if (!$user->hasRole($role)) {
            $user->addRole($role);

            $this->em->persist($user);
        }

        $this->tokenStorage->getToken()->setAuthenticated(false);
        $this->mailer->sendBillingPlanUpgrade($user);
    }

    /**
     * @param User   $user
     * @param string $role
     */
    public function demoteRole(User $user, $role = self::ROLE_WRITER)
    {
        if ($user->hasRole($role)) {
            $user->removeRole($role);

            $this->em->persist($user);
        }

        $this->tokenStorage->getToken()->setAuthenticated(false);
        $this->mailer->sendBillingPlanDowngrade($user);
    }

    /**
     * @param User $user
     *
     * @return Payment[]
     */
    public function getPaymentsForUser(User $user)
    {
        return $this
            ->em
            ->getRepository('AppBundle:User\Billing\Payment')
            ->findBy([
                'user' => $user,
            ]);
    }

    /**
     * @param User  $user
     * @param array $cc
     *
     * @return CreditCard
     */
    private function updateCard(User $user, array $cc)
    {
        $card = $user->getCreditCard();

        if ($card) {
            $response = $this->braintreeService->updateCard($card->getCustomerId(), $cc);
        } else {
            $customerId = $this->braintreeService->addCustomer($user);
            $response = $this->braintreeService->updateCard($customerId, $cc);

            $card = new CreditCard();
            $card->setUser($user);
        }

        $card->setFromBraintree($response->customer->creditCards[0], $cc);

        $this->em->persist($card);

        return $card;
    }

    /**
     * @param CreditCard $card
     * @param array      $cc
     */
    private function updateSubscription(CreditCard $card)
    {
        $vat = $this->vat->getVat($card->getAddress()->getCountry());

        $subscription = $card->getUser()->getSubscription();

        if ($subscription) {
            $response = $this->braintreeService->updateSubscription(
                $subscription->getSubscriptionId(),
                $card->getToken(),
                $this->getFinalPrice($vat)
            );
        } else {
            $response = $this->braintreeService->createSubscription(
                $card->getToken(),
                $this->getFinalPrice($vat)
            );

            $subscription = new Subscription();
            $subscription->setFromBraintree($card, $response, $vat);
            $this->em->persist($subscription);

            $payment = new Payment();
            $payment->setFromBraintree($card, $response, $vat);
            $this->em->persist($payment);
        }
    }

    /**
     * @param CalculateTaxOut $vat
     *
     * @return float
     */
    private function getFinalPrice(CalculateTaxOut $vat)
    {
        return $vat->transaction->tax_amount + $vat->transaction->amount;
    }
}
