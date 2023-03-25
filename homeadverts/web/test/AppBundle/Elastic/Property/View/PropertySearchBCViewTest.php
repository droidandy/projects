<?php

namespace AppBundle\Elastic\Property\View;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Helper\ImageHelper;
use AppBundle\Localisation\AddressTranslator;
use AppBundle\Entity\User\User;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\RandomizeTrait;
use Test\Utils\Traits\UserTrait;

class PropertySearchBCViewTest extends \PHPUnit_Framework_TestCase
{
    use AddressTrait, PropertyTrait, UserTrait, RandomizeTrait;

    private $translatedAddresses = [];
    private $testUser = null;

    protected function doSetUp()
    {
    }

    protected function doTearDown()
    {
    }

    public function testInvoke()
    {
        $properties = $this->getTestProperties();

        $addressTranslator = $this->getAddressTranslator();
        $addressTranslator
            ->expects($this->exactly(3))
            ->method('translate')
            ->withConsecutive(...array_map(
                function (Property $el) {
                    return [$el->getAddress()];
                },
                $properties
            ))
            ->willReturnCallback(
                function (Address $address) {
                    $this->translatedAddresses[] = $translatedAddress = clone $address;
                    $translatedAddress->setStateCounty('translated_'.$address->getStateCounty());

                    return $translatedAddress;
                }
            )
        ;

        $imageHelper = $this->getImageHelper();
        $imageHelper
            ->expects($this->exactly(14))
            ->method('getImagePath')
            ->withConsecutive(
                ['photo_path_11'],
                ['photo_path_11'],
                ['photo_path_12'],
                ['photo_path_13'],
                ['photo_path_14'],
                ['photo_path_15'],
                ['photo_path_21'],
                ['photo_path_21'],
                ['photo_path_22'],
                ['photo_path_23'],
                ['photo_path_31'],
                ['photo_path_31'],
                ['photo_path_32'],
                ['photo_path_33']
            )
            ->willReturnCallback(
                function ($path) {
                    return str_replace('photo', 'image', $path);
                }
            )
        ;

        $cacheManager = $this->getCacheManager();
        $cacheManager
            ->expects($this->exactly(14))
            ->method('getBrowserPath')
            ->withConsecutive(
                ['image_path_11', 'list_thumb_adv'],
                ['image_path_11', 'gallery_thumb_r'],
                ['image_path_12', 'gallery_thumb_r'],
                ['image_path_13', 'gallery_thumb_r'],
                ['image_path_14', 'gallery_thumb_r'],
                ['image_path_15', 'gallery_thumb_r'],
                ['image_path_21', 'list_thumb_adv'],
                ['image_path_21', 'gallery_thumb_r'],
                ['image_path_22', 'gallery_thumb_r'],
                ['image_path_23', 'gallery_thumb_r'],
                ['image_path_31', 'list_thumb_adv'],
                ['image_path_31', 'gallery_thumb_r'],
                ['image_path_32', 'gallery_thumb_r'],
                ['image_path_33', 'gallery_thumb_r']
            )
            ->willReturnCallback(
                function ($path) {
                    return str_replace('image', 'cache', $path);
                }
            )
        ;

        $token = $this->getToken();
        $token
            ->expects($this->once())
            ->method('getUser')
            ->willReturn($this->testUser)
        ;

        $tokenStorage = $this->getTokenStorage();
        $tokenStorage
            ->expects($this->once())
            ->method('getToken')
            ->willReturn($token)
        ;

        $propertySearchView = $this->getPropertySearchView(
            $imageHelper,
            $cacheManager,
            $addressTranslator,
            $tokenStorage
        );
        $properties = $propertySearchView($properties);

        $this->assertEquals($this->getExpectedDocs(), $properties);
    }

    private function getPropertySearchView(
        $imageHelper,
        $cacheManager,
        $addressTranslator,
        $tokenStorage
    ) {
        return new PropertySearchBCView(
            $imageHelper,
            $cacheManager,
            $addressTranslator,
            $tokenStorage
        );
    }

    private function getImageHelper()
    {
        return $this
            ->getMockBuilder(ImageHelper::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getCacheManager()
    {
        return $this
            ->getMockBuilder(CacheManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getAddressTranslator()
    {
        return $this
            ->getMockBuilder(AddressTranslator::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getTokenStorage()
    {
        return $this
            ->getMockBuilder(TokenStorage::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getToken()
    {
        return $this
            ->getMockBuilder(TokenInterface::class)
            ->getMock()
        ;
    }

    public function getEntityManager()
    {
    }

    public function getContainer()
    {
    }

    private function getTestProperties()
    {
        $users = [];
        foreach ([1, 2, 3] as $userId) {
            $users[] = $this->newUser([
                'id' => $userId,
            ]);
        }
        $this->testUser = $users[0];

        $properties = [];
        foreach (
            [
                [
                    'id' => 1,
                    'type' => PropertyTypes::DETACHED,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'source' => 'listhub',
                    'source_ref' => 'listhub_ref_1',
                    'currency' => 'USD',
                    'price' => 1000000,
                    'price_qualifier' => Property::PRICE_QUALIFIER_NONE,
                    'period' => 1,
                    'photos' => [
                        'photo_path_11',
                        'photo_path_12',
                        'photo_path_13',
                        'photo_path_14',
                        'photo_path_15',
                    ],
                    'user' => $users[0],
                    'address' => [
                        'country' => 'US',
                        'state_county' => 'NY',
                        'town_city' => 'New York',
                    ],
                ],
                [
                    'id' => 2,
                    'type' => PropertyTypes::DETACHED,
                    'bedrooms' => 2,
                    'bathrooms' => 3,
                    'source' => 'listhub',
                    'source_ref' => 'listhub_ref_2',
                    'currency' => 'USD',
                    'price' => 2000000,
                    'price_qualifier' => Property::PRICE_QUALIFIER_NONE,
                    'period' => 1,
                    'photos' => [
                        'photo_path_21',
                        'photo_path_22',
                        'photo_path_23',
                    ],
                    'videos' => [
                        [
                            'type' => 'wellcomemat',
                            'url' => 'wellcomemat_url_21',
                        ],
                    ],
                    'user' => $users[1],
                    'address' => [
                        'country' => 'US',
                        'state_county' => 'NY',
                        'town_city' => 'New York',
                    ],
                ],
                [
                    'id' => 3,
                    'type' => PropertyTypes::APARTMENT,
                    'bedrooms' => 7,
                    'bathrooms' => 5,
                    'source' => 'listhub',
                    'source_ref' => 'listhub_ref_3',
                    'currency' => 'USD',
                    'price' => 3000000,
                    'price_qualifier' => Property::PRICE_QUALIFIER_ENQUIRE,
                    'period' => 3,
                    'photos' => [
                        'photo_path_31',
                        'photo_path_32',
                        'photo_path_33',
                    ],
                    'videos' => [
                        [
                            'type' => 'youtube',
                            'url' => 'youtube_url_31',
                        ],
                        [
                            'type' => 'wellcomemat',
                            'url' => 'wellcomemat_url_31',
                        ],
                    ],
                    'user' => $users[2],
                    'address' => [
                        'country' => 'US',
                        'state_county' => 'CA',
                        'town_city' => 'San Francisco',
                    ],
                ],
            ] as $property
        ) {
            $properties[] = $this->newProperty($property);
        }

        return $properties;
    }

    private function getExpectedDocs()
    {
        return [
            [
                '_id' => 1,
                'address' => $this->translatedAddresses[0],
                '_source' => [
                    'type' => 100,
                    'priceHidden' => false,
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'source' => 'listhub',
                    'sourceRef' => 'listhub_ref_1',
                    'currency' => 'USD',
                    'price' => 1000000,
                    'period' => 1,
                    'thumbnail' => 'cache_path_11',
                    'photos' => [
                        [
                            'url' => 'cache_path_11',
                            'lazyload' => 'cache_path_11',
                        ],
                        [
                            'url' => 'cache_path_12',
                            'lazyload' => 'cache_path_12',
                        ],
                        [
                            'url' => 'cache_path_13',
                            'lazyload' => 'cache_path_13',
                        ],
                        [
                            'url' => '#',
                            'lazyload' => 'cache_path_14',
                        ],
                        [
                            'url' => 'cache_path_15',
                            'lazyload' => 'cache_path_15',
                        ],
                    ],
                    'videos' => [],
                    'country' => 'US',
                    'stateCounty' => 'NY',
                    'townCity' => 'New York',
                ],
            ],
            [
                '_id' => 2,
                'address' => $this->translatedAddresses[1],
                '_source' => [
                    'type' => 100,
                    'priceHidden' => false,
                    'bedrooms' => 2,
                    'bathrooms' => 3,
                    'source' => 'listhub',
                    'sourceRef' => 'listhub_ref_2',
                    'currency' => 'USD',
                    'price' => 2000000,
                    'period' => 1,
                    'thumbnail' => 'cache_path_21',
                    'photos' => [
                        [
                            'url' => 'cache_path_21',
                            'lazyload' => 'cache_path_21',
                        ],
                        [
                            'url' => 'cache_path_22',
                            'lazyload' => 'cache_path_22',
                        ],
                        [
                            'url' => 'cache_path_23',
                            'lazyload' => 'cache_path_23',
                        ],
                    ],
                    'videos' => [
                        [
                            'type' => 'wellcomemat',
                            'url' => 'wellcomemat_url_21',
                        ],
                    ],
                    'country' => 'US',
                    'stateCounty' => 'NY',
                    'townCity' => 'New York',
                ],
            ],
            [
                '_id' => 3,
                'address' => $this->translatedAddresses[2],
                '_source' => [
                    'type' => 300,
                    'priceHidden' => true,
                    'bedrooms' => 7,
                    'bathrooms' => 5,
                    'source' => 'listhub',
                    'sourceRef' => 'listhub_ref_3',
                    'currency' => 'USD',
                    'price' => 3000000,
                    'period' => 3,
                    'thumbnail' => 'cache_path_31',
                    'photos' => [
                        [
                            'url' => 'cache_path_31',
                            'lazyload' => 'cache_path_31',
                        ],
                        [
                            'url' => 'cache_path_32',
                            'lazyload' => 'cache_path_32',
                        ],
                        [
                            'url' => 'cache_path_33',
                            'lazyload' => 'cache_path_33',
                        ],
                    ],
                    'videos' => [
                        [
                            'type' => 'youtube',
                            'url' => 'youtube_url_31',
                        ],
                        [
                            'type' => 'wellcomemat',
                            'url' => 'wellcomemat_url_31',
                        ],
                    ],
                    'country' => 'US',
                    'stateCounty' => 'CA',
                    'townCity' => 'San Francisco',
                ],
            ],
        ];
    }
}
