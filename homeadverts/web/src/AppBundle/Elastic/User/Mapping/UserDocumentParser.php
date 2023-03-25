<?php

namespace AppBundle\Elastic\User\Mapping;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Entity\User\CompanyProfile;
use AppBundle\Entity\User\TeamProfile;
use AppBundle\Entity\User\UserProfile;
use AppBundle\Elastic\Integration\Mapping\AbstractDocumentParserTemplate;
use AppBundle\Entity\User\User;

class UserDocumentParser extends AbstractDocumentParserTemplate
{
    /**
     * @param array $document
     *
     * @return User
     */
    protected function doParse(array $document)
    {
        $source = $document['_source'];

        $user = new User();
        $user->setId($document['_id']);

        $user->setType($source['type']);
//        $user->setRoles($source['roles']);
        $user
            ->setUserProfile(
                $this->getUserProfile($source['userProfile'])
            )
        ;
        $user
            ->setTeamProfile(
                $this->getTeamProfile($source['teamProfile'])
            )
        ;
        $user
            ->setCompanyProfile(
                $this->getCompanyProfile($source['companyProfile'])
            )
        ;
        $user->setEmail($source['email']);
        $user->setName($source['name']);
        $user->bio = $source['bio'];
        $user->companyName = $source['companyName'];
        $user->phone = $source['phone'];
        $user->mobilePhone = $source['mobilePhone'];
        $user->companyPhone = $source['companyPhone'];
        $user->homePageUrl = $source['homePageUrl'];
        $user->profileImage = $source['profileImage'];
        $user->primaryLanguage = $source['primaryLanguage'];
        $user->spokenLanguages = $source['spokenLanguages'];
        $user->preferredCurrency = $source['preferredCurrency'];
        $user->agentCount = $source['agentCount'];
        $user->affiliateCount = $source['affiliateCount'];
        $user->propertyCount = $source['propertyCount'];
        $user->propertyForSaleCount = $source['propertyForSaleCount'];
        $user->propertyToRentCount = $source['propertyToRentCount'];
        $user->articleCount = $source['articleCount'];
        $user->address = $this->getAddress($source);
        $user->setGoogleLocations(
            $this->getGoogleLocations($source['googleLocations'])
        );
        $user->deletedAt = $source['deletedAt'] ? new \DateTime($source['deletedAt']) : null;

        return $user;
    }

    /**
     * @param $userDoc
     *
     * @return Address
     */
    private function getAddress($userDoc)
    {
        $address = new Address();
        $address->street = $userDoc['address1'];
        $address->aptBldg = $userDoc['address2'];
        $address->townCity = $userDoc['townCity'];
        $address->stateCounty = $userDoc['county'];
        $address->country = $userDoc['country'];
        $address->zip = $userDoc['postcode'];
        $address->latitude = $userDoc['location']['coordinates'][1];
        $address->longitude = $userDoc['location']['coordinates'][0];

        return $address;
    }

    /**
     * @param $googleLocationDocs
     *
     * @return array
     */
    private function getGoogleLocations($googleLocationDocs)
    {
        $googleLocations = [];
        foreach ((array) $googleLocationDocs as $googleLocationDoc) {
            $googleLocations[] = $this->getGoogleLocation($googleLocationDoc);
        }

        return $googleLocations;
    }

    /**
     * @param $googleLocation
     *
     * @return GoogleLocation
     */
    private function getGoogleLocation($googleLocationDoc)
    {
        $googleLocation = new GoogleLocation();
        $googleLocation->setId($googleLocationDoc['id']);
        $googleLocation->setPlaceId($googleLocationDoc['placeId']);

        return $googleLocation;
    }

    /**
     * @param array|null $userProfile
     */
    private function getUserProfile(array $userProfile = null)
    {
        if (!$userProfile) {
            return null;
        }

        $userProfile = new UserProfile();
        $userProfile->setId($userProfile['id']);
        $userProfile->setGender($userProfile['gender']);
        $userProfile->setTitle($userProfile['title']);

        return $userProfile;
    }

    /**
     * @param array|null $teamProfile
     */
    private function getTeamProfile(array $teamProfile = null)
    {
        if (!$teamProfile) {
            return null;
        }

        $teamProfile = new TeamProfile();
        $teamProfile->setId($teamProfile['id']);

        return $teamProfile;
    }

    /**
     * @param array|null $companyProfile
     */
    private function getCompanyProfile(array $companyProfile = null)
    {
        if (!$companyProfile) {
            return null;
        }

        $companyProfile = new CompanyProfile();
        $companyProfile->setId($companyProfile['id']);
        $companyProfile->setType($companyProfile['type']);
        $companyProfile->setOpeningHours($companyProfile['openingHours']);

        return $companyProfile;
    }
}
