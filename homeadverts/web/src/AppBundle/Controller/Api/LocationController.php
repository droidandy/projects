<?php

namespace AppBundle\Controller\Api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Location\Location;
use AppBundle\Entity\User\User;

class LocationController extends Controller
{
    /**
     * @param Location $location
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="location",
     *     class="AppBundle\Entity\Location\Location"
     * )
     *
     * @return JsonResponse
     */
    public function followAction(Location $location)
    {
        $this->get('ha_location.service')->followLocation(
            $this->getUser(),
            $location
        );

        $this->get('em')->flush();

        return new JsonResponse();
    }

    /**
     * @param Location $location
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="location",
     *     class="AppBundle\Entity\Location\Location"
     * )
     *
     * @return JsonResponse
     */
    public function unFollowAction(Location $location)
    {
        $em = $this->get('em');

        /** @var User $user */
        $user = $this->getUser();
        $followedLocation = $user->getFollowedLocationFromLocation($location);

        $em->remove($followedLocation);
        $em->flush();

        return new JsonResponse();
    }
}
