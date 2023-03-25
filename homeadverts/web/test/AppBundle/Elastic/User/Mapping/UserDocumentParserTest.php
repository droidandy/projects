<?php

namespace Test\AppBundle\Elastic\User\Mapping;

use AppBundle\Entity\User\User;
use AppBundle\Elastic\User\Mapping\UserDocumentParser;
use Test\Utils\Traits\DateTrait;

class UserDocumentParserTest extends \PHPUnit_Framework_TestCase
{
    use DateTrait;

    public function testSupport()
    {
        $parser = $this->getDocumentParser();

        $el = [
            '_index' => 'users',
            '_type' => 'user',
        ];
        $this->assertTrue($parser->support($el));

        $el = [
            '_index' => 'users',
            '_type' => 'not_user',
        ];
        $this->assertFalse($parser->support($el));

        $el = [
            '_index' => 'not_users',
            '_type' => 'user',
        ];
        $this->assertFalse($parser->support($el));
    }

    public function testParse()
    {
        $hitElements[] = $this->getUserDoc(1);
        $hitElements[] = $this->getUserDoc(2, [
            '_source' => [
                'spokenLanguages' => ['en_US', 'fr_FR'],
                'plan' => 'premium',
            ],
        ]);
        $hitElements[] = $this->getUserDoc(3, [
            '_source' => [
                'spokenLanguages' => ['en_US', 'fr_FR', 'ru_RU'],
                'plan' => null,
                'propertyCount' => null,
                'propertyToRentCount' => null,
                'propertyForSaleCount' => null,
            ],
        ]);

        $parser = $this->getDocumentParser();

        foreach ($hitElements as $i => $hitElement) {
            $source = $hitElement['_source'];
            /** @var User $user */
            $user = $parser->parse($hitElement);

            $this->assertInstanceOf(User::class, $user);
            $this->assertEquals($hitElement['_id'], $user->getId());
            $this->assertEquals($source['email'], $user->getEmail());
            $this->assertEquals($source['name'], $user->getName());
            $this->assertEquals($source['bio'], $user->bio);
            $this->assertEquals($source['companyName'], $user->getCompanyName());
            $this->assertEquals($source['phone'], $user->phone);
            $this->assertEquals($source['mobilePhone'], $user->mobilePhone);
            $this->assertEquals($source['companyPhone'], $user->companyPhone);
            $this->assertEquals($source['homePageUrl'], $user->homePageUrl);
            $this->assertEquals($source['profileImage'], $user->getProfileImage());
            $this->assertEquals($source['primaryLanguage'], $user->primaryLanguage);
            $this->assertEquals($source['spokenLanguages'], $user->spokenLanguages);
            $this->assertEquals($source['preferredCurrency'], $user->preferredCurrency);
            $this->assertEquals($source['status'], $user->status);
            $this->assertEquals($source['address1'], $user->getAddress()->getStreet());
            $this->assertEquals($source['address2'], $user->getAddress()->getAptBldg());
            $this->assertEquals($source['townCity'], $user->getAddress()->getTownCity());
            $this->assertEquals($source['country'], $user->getAddress()->getCountry());
            $this->assertEquals($source['postcode'], $user->getAddress()->getZip());
            foreach ($user->getGoogleLocations() as $j => $googleLocation) {
                $this->assertEquals($source['googleLocations'][$j]['id'], $googleLocation->getId());
                $this->assertEquals($source['googleLocations'][$j]['placeId'], $googleLocation->getPlaceId());
            }
            $this->assertEquals($source['location']['coordinates'][1], $user->getAddress()->getLatitude());
            $this->assertEquals($source['location']['coordinates'][0], $user->getAddress()->getLongitude());
            if ($source['plan']) {
                $this->assertEquals($source['plan'], $user->getSubscription()->getPlan());
            }
            $this->assertEquals($source['propertyCount'], $user->propertyCount);
            $this->assertEquals($source['propertyToRentCount'], $user->propertyToRentCount);
            $this->assertEquals($source['propertyForSaleCount'], $user->propertyForSaleCount);
            $this->assertEquals($this->getDate()->format('c'), $user->deletedAt->format('c'));
        }
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage Supported index "users" and mapping "user"
     */
    public function testParseFailure()
    {
        $hitElement = $this->getUserDoc(1, [
            '_index' => 'not_users',
            '_type' => 'not_user',
        ]);
        $parser = $this->getDocumentParser();

        $parser->parse($hitElement);
    }

    private function getDocumentParser()
    {
        return new UserDocumentParser('users', 'user');
    }

    private function getUserDoc($id, array $doc = [])
    {
        return array_replace_recursive([
            '_index' => 'users',
            '_type' => 'user',
            '_id' => $id,
            '_source' => [
                'location' => [
                    'type' => 'point',
                    'coordinates' => [-0.1275, 51.507222],
                ],
                'email' => 'user'.$id.'@example.com',
                'name' => 'user'.$id.'_name',
                'bio' => 'user'.$id.'_bio',
                'companyName' => 'company'.$id.'_name',
                'phone' => '+123456789',
                'mobilePhone' => '+123456789',
                'companyPhone' => '+123456789',
                'homePageUrl' => 'home_page_url',
                'profileImage' => 'profile_image_url',
                'primaryLanguage' => 'en_US',
                'spokenLanguages' => ['en_US'],
                'preferredCurrency' => 'USD',
                'status' => 1,
                'address1' => 'Baker Street',
                'address2' => '#2021',
                'townCity' => 'London',
                'county' => 'County of London',
                'country' => 'GB',
                'postcode' => 'NW1 6XE',
                'googleLocations' => [
                    [
                        'id' => 1,
                        'placeId' => 'place_id_1',
                    ],
                    [
                        'id' => 2,
                        'placeId' => 'place_id_2',
                    ],
                    [
                        'id' => 3,
                        'placeId' => 'place_id_3',
                    ],
                ],
                'plan' => 'basic',
                'propertyCount' => 5,
                'propertyToRentCount' => 2,
                'propertyForSaleCount' => 3,
                'deletedAt' => $this->getDate()->format('c'),
            ],
        ], $doc);
    }
}
