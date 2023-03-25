<?php

namespace AppBundle\Controller\User;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class BillingController extends Controller
{
    /**
     * @return Response
     */
    public function detailsAction()
    {
        $user = $this->getUser();
        $billing = $this->get('ha_billing');

        $this->get('session')->migrate();

        return $this->render('AppBundle:user/billing:details.html.twig', [
            'payments' => $billing->getPaymentsForUser($user),

            'countries' => $this->getAvailableCountries(),
            'expirationMonths' => $this->getCardExpirationMonth(),
            'expirationYears' => $this->getCardExpirationYears(),
        ]);
    }

    /**
     * @return array
     */
    private function getCardExpirationYears()
    {
        $years = [];

        for ($i = date('Y'); $i <= date('Y') + 8; ++$i) {
            $years[$i] = $i;
        }

        return $years;
    }

    /**
     * @return array
     */
    private function getCardExpirationMonth()
    {
        $months = [];

        for ($i = 1; $i <= 12; ++$i) {
            $months[$i] = $i;
        }

        return $months;
    }

    /**
     * @return array
     */
    private function getAvailableCountries()
    {
        return $this
            ->get('doctrine.dbal.geonames_connection')
            ->executeQuery('
                SELECT
                    countryinfo.iso_alpha2 as iso2,
                    countryinfo.name as name
                FROM
                    countryinfo
            ')
            ->fetchAll();
    }
}
