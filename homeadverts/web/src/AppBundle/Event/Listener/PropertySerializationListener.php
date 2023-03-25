<?php

namespace AppBundle\Event\Listener;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\User\User;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Service\PropertyService;
use JMS\Serializer\EventDispatcher\ObjectEvent;
use JMS\Serializer\JsonSerializationVisitor;
use Symfony\Component\Routing\Router;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class PropertySerializationListener extends AbstractSerializationListener
{
    /**
     * @var Router
     */
    protected $router;
    /**
     * @var PropertyService
     */
    protected $propertyService;
    /**
     * @var UserRepository
     */
    protected $userRepository;
    /**
     * @var TokenStorageInterface
     */
    protected $tokenStorage;

    /**
     * @param PropertyService $propertyService
     * @param Router $router
     * @param UserRepository $userRepository
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        PropertyService $propertyService,
        Router $router,
        UserRepository $userRepository,
        TokenStorageInterface $tokenStorage
    )
    {
        $this->propertyService = $propertyService;
        $this->router = $router;
        $this->userRepository = $userRepository;
        $this->tokenStorage = $tokenStorage;
    }

    public function onPostSerialize(ObjectEvent $event)
    {
        $property = $event->getObject();

        if ($property instanceof Property) {
            /** @var JsonSerializationVisitor $visitor */
            /** @var User $me */
            $visitor = $event->getContext()->getVisitor();

            if ($this->doInjectionsFull($event)) {
                $this->injectFull($visitor, $property);
            }

            $thumbnails = [
                'm' => $this->propertyService->getPropertyThumbnail(
                    $property,
                    Property::FILTER_THUMBNAIL_MEDIUM
                ),
                'l' => $this->propertyService->getPropertyThumbnail(
                    $property,
                    Property::FILTER_THUMBNAIL_LARGE
                ),
                'xs' => $this->propertyService->getPropertyThumbnail(
                    $property,
                    Property::FILTER_THUMBNAIL_SMALL_EXTRA
                ),
                's' => $this->propertyService->getPropertyThumbnail(
                    $property,
                    Property::FILTER_THUMBNAIL_SMALL
                ),
            ];

            $visitor->addData('thumbnail', $thumbnails);
        }
    }

    public function injectFull(JsonSerializationVisitor $visitor, Property $property)
    {
        $me = $this->tokenStorage->getToken()->getUser();

        $visitor->addData('url', [
            'details' => $this->router->generate('property_details', [
                'id' => $property->getId(),
                'slug' => $property->getSlug(),
            ], Router::ABSOLUTE_URL),
            'like' => $this->router->generate('ha_property_like_add', [
                'id' => $property->getId(),
            ], Router::ABSOLUTE_URL),
            'country' => $this->router->generate('search_term', [
                'market' => $property->rental ? 'to-rent' : 'for-sale',
                'term' => $property->getAddress()->getCountryName(),
            ], Router::ABSOLUTE_URL),
        ]);

        if ($me instanceof User) {
            $visitor->addData('isLiked', $this->userRepository->isLikedByUser($me, $property));
        } else {
            $visitor->addData('isLiked', false);
        }
    }
}
