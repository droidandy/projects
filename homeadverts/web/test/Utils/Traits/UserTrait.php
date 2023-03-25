<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\User\SourceRef;
use AppBundle\Entity\User\User;

trait UserTrait
{
    /**
     * @var bool
     */
    private $flush = true;
    /**
     * @var callable|null
     */
    private $userDataGenerator;

    /**
     * @var array|null
     *
     * @return User
     */
    public function newUser(array $userData = [])
    {
        $faker = $this->faker;

        if ($this->userDataGenerator) {
            $userDataGenerator = $this->userDataGenerator;
            $userData = array_replace_recursive($userDataGenerator(), $userData);
        }

        $userData = array_merge([
            'id' => null,
            'username' => null,
            'name' => null,
            'company_name' => null,
            'email' => null,
            'phone' => null,
            'source_ref' => null,
            'source_ref_type' => null,
            'source_refs' => [],
            'password' => null,
            'locked' => false,
            'property_count' => 1,
            'property_count_for_sale' => 1,
            'property_count_to_rent' => 0,
            'primary_language' => 'en',
            'spoken_languages' => null,
            'agent' => true,
        ], $userData);

        $user = new User();
        $user->setId($userData['id']);
        $user->setUsername($userData['username'] ?: $faker->userName);
        $user->setName($userData['name'] ?: $faker->name);
        $user->companyName = $userData['company_name'];
        $user->setEmail($userData['email'] ?: $faker->email);
        $user->phone = $userData['phone'] ?: $faker->phoneNumber;
        $user->setPlainPassword($userData['password'] ?: $faker->password);
        $user->setEnabled(isset($userData['enabled']) ? $userData['enabled'] : true);
        $user->setLocked(false);

        $user->sourceRef = $userData['source_ref'];
        $user->sourceRefType = $userData['source_ref_type'];

        $user->propertyCount = $userData['property_count'];
        $user->propertyCountForSale = $userData['property_count_for_sale'];
        $user->propertyCountToRent = $userData['property_count_to_rent'];
        $user->primaryLanguage = $userData['primary_language'];
        $user->spokenLanguages = $userData['spoken_languages'];

        foreach ($userData['source_refs'] as $sourceRefData) {
            $sourceRef = new SourceRef();
            $sourceRef->ref = $sourceRefData['ref'];
            $sourceRef->type = $sourceRefData['type'];
            $sourceRef->user = $user;

            $user->sourceRefs->add($sourceRef);
        }

        if ($userData['agent']) {
            $user->addRole('ROLE_AGENT');
        }

        if (!empty($userData['google_locations'])) {
            $googleLocations = [];
            if (is_array($userData['google_locations'][0])) {
                foreach ($userData['google_locations'] as $googleLocation) {
                    $googleLocations[] = $this->newGoogleLocation($googleLocation);
                }
            } else {
                $googleLocations = $userData['google_locations'];
            }
            $user->setGoogleLocations($googleLocations);
        }

        return $user;
    }

    /**
     * @param string $role
     *
     * @return User
     */
    protected function newUserPersistent($role = 'ROLE_AGENT')
    {
        $user = $this->newUser();
        $user->addRole($role);

        $this->em->persist($user);

        if ($this->flush) {
            $this->em->flush($user);
        }

        return $user;
    }

    /**
     * @return User
     */
    protected function newWriterPersistent()
    {
        return $this->newUserPersistent('ROLE_WRITER');
    }

    /**
     * @return User
     */
    protected function newAdminPersistent()
    {
        return $this->newUserPersistent('ROLE_ADMIN');
    }

    /**
     * @param array|int $userDataOrCount
     *
     * @return User[]
     */
    public function createUsers($userDataOrCount)
    {
        $users = [];
        if (is_int($userDataOrCount)) {
            for ($i = 0; $i < $userDataOrCount; ++$i) {
                $users[] = $this->newUser();
            }
        } elseif (is_array($userDataOrCount)) {
            foreach ($userDataOrCount as $userData) {
                $users[] = $this->newUser($userData);
            }
        }

        return $users;
    }

    /**
     * @param array|int $userDataOrCount
     *
     * @return User[]
     */
    public function createUsersPersistent($userDataOrCount)
    {
        $users = $this->createUsers($userDataOrCount);

        $em = $this->getEntityManager();
        foreach ($users as $user) {
            $em->persist($user);
        }
        if ($this->flush) {
            $em->flush($users);

            $client = $this->getContainer()->get('es_client');
            $client->indices()->refresh(['index' => 'test_agents']);
        }

        return $users;
    }

    /**
     * @param array $locationUserMap
     *
     * @return User[]
     */
    public function createUsersByLocationsPersistent(array $locationUserMap = [])
    {
        $totalUsers = [];
        foreach ($locationUserMap as $location => $userData) {
            $users = $this->createUsers($userData);
            foreach ($users as $i => $user) {
                if (empty($userData[$i]['address'])) {
                    $user->address = $this->createAddressInLocation($location);
                    if ($this->createGoogleLocations) {
                        $user->setGoogleLocations($this->getGoogleLocationsForLocation($location));
                    }
                } else {
                    $user->address = $this->newAddress($userData[$i]['address']);
                }
            }
            $totalUsers = array_merge($totalUsers, $users);
        }

        $em = $this->getEntityManager();
        foreach ($totalUsers as $user) {
            $em->persist($user);
        }
        if ($this->flush) {
            $em->flush($totalUsers);

            $client = $this->getContainer()->get('es_client');
            $client->indices()->refresh(['index' => 'test_agents']);
        }

        return $totalUsers;
    }

    /**
     * @return array
     */
    protected function generateCreditCard()
    {
        $creditCard = [
            'billingAddress' => [
                'streetAddress' => $this->faker->streetAddress,
                'extendedAddress' => $this->faker->address,
                'locality' => $this->faker->postcode,
                'countryCodeAlpha2' => 'US',
            ],
            'cardholderName' => $this->faker->firstName.' '.$this->faker->lastName,
            'number' => 4111111111111111,
            'cvv' => 999,
            'expirationMonth' => 11,
            'expirationYear' => 22,
        ];

        return $creditCard;
    }
}
