<?php

namespace AppBundle\Controller\Api\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyPhoto;
use DateTime;

class PropertyController extends Controller
{
    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="property",
     *     class="AppBundle\Entity\Property\Property"
     * )
     *
     * @return JsonResponse
     */
    public function featuredAddAction(Property $property)
    {
        $em = $this->get('em');

        $property->setFeatured(new DateTime());
        $em->persist($property);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    /**
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="user",
     *     class="AppBundle\Entity\Property\Property"
     * )
     *
     * @return JsonResponse
     */
    public function featuredRemoveAction(Property $property)
    {
        $em = $this->get('em');

        /* @var Property $property */
        $property->setFeatured(null);
        $em->persist($property);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function setPrimaryPhotoAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);

        /** @var PropertyPhoto $photo */
        $photo = $this->get('property_photo_repo')->findOneBy([
            'property' => $payload['propertyId'],
            'hash' => $payload['photoHash'],
        ]);

        if (!$photo) {
            throw new \LogicException('Photo was not found');
        }

        $property = $photo->getProperty();

        if (!$property->isUserAllowedToEdit($this->getUser())) {
            throw new \LogicException('User is not allowed to update primary image');
        }

        $property->setPrimaryPhotoManual($photo);
        $this->get('em')->persist($property);
        $this->get('em')->flush();

        return new JsonResponse();
    }
}
