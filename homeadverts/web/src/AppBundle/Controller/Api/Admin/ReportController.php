<?php

namespace AppBundle\Controller\Api\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class ReportController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function summaryAction()
    {
        $summary = $this->get('ha.database_reporter')->getSummary();

        return new JsonResponse($summary);
    }

    /**
     * @param string $type
     *
     * @return JsonResponse
     */
    public function missingAction(string $type)
    {
        if ('property' === $type) {
            $refIds = $this
                ->get('em')
                ->getRepository('AppBundle:Import\ImportLedger')
                ->getMissingPropertiesRefIds();
        } else {
            $refIds = $this
                ->get('em')
                ->getRepository('AppBundle:Import\ImportLedger')
                ->getMissingUserRefIds($type);
        }

        return new JsonResponse($refIds);
    }
}
