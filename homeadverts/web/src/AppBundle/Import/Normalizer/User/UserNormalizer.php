<?php

namespace AppBundle\Import\Normalizer\User;

use AppBundle\Import\User\EmailTypes;
use AppBundle\Entity\User\SourceRef;

class UserNormalizer
{
    const EMAIL_TYPE_MAP = [
        'vanity' => EmailTypes::VANITY,
    ];

    public function normalize($feedUser)
    {
        $user = new NormalisedUser();
        $user->sourceRef = $feedUser->agentSummary->id;
        $user->sourceRefType = SourceRef::TYPE_GUID;
        $user->sourceRefs = [];
        if (isset($feedUser->agentSummary->RFGAgentId)) {
            $user->sourceRefs[] =
                (object) [
                    'ref' => sprintf('3yd-RFGSIR-%s', $feedUser->agentSummary->RFGAgentId),
                    'type' => SourceRef::TYPE_KEY,
                ]
            ;
        }
        if (isset($feedUser->personId)) {
            $user->sourceRefs[] =
                (object) [
                    'ref' => $feedUser->personId,
                    'type' => SourceRef::TYPE_PERSON_ID,
                ]
            ;
        }
//        $user->virtualSourceRefs[] = (object) [
//            'ref' => strtoupper($feedUser->agentSummary->id),
//            'type' => SourceRef::TYPE_GUID,
//        ];
        if (isset($feedUser->agentSummary->office->officeId)) {
            $user->officeSourceRef = $feedUser->agentSummary->office->officeId;
            $user->officeSourceRefType = SourceRef::TYPE_GUID;
        }
        $user->name = $this->prepareName($feedUser);
        $user->phone = $this->getPhone($feedUser);
        $user->email = $this->getEmail($feedUser);
        $user->leadEmail = $this->getLeadEmail($feedUser);
        $user->allEmails = $this->getEmails($feedUser);
        $user->homePageUrl = $this->getUrl($feedUser);
        $user->avatarUrl = $this->getAvatar($feedUser);
        $user->descriptions = $this->getProfileDescriptions($feedUser);
        $user->companyName = $this->prepareCompanyName($feedUser);
        $user->companyPhone = isset($feedUser->agentSummary->office->phoneNumber)
                                ? $feedUser->agentSummary->office->phoneNumber
                                : null
        ;
        $user->street = isset($feedUser->agentSummary->office->officeAddress->streetAddress)
                                ? $feedUser->agentSummary->office->officeAddress->streetAddress
                                : null
        ;
        $user->aptBldg = null;
        $user->townCity = isset($feedUser->agentSummary->office->officeAddress->city)
            ? $feedUser->agentSummary->office->officeAddress->city
            : null
        ;
        $user->country = isset($feedUser->agentSummary->office->officeAddress->countryCode)
            ? $feedUser->agentSummary->office->officeAddress->countryCode
            : null
        ;
        $user->zip = isset($feedUser->agentSummary->office->officeAddress->postalCode)
            ? $feedUser->agentSummary->office->officeAddress->postalCode
            : null
        ;
        $user->stateCounty = isset($feedUser->agentSummary->office->officeAddress->stateProvinceCode)
            ? $feedUser->agentSummary->office->officeAddress->stateProvinceCode
            : null
        ;
        $user->fallbackLatitude = isset($feedUser->agentSummary->office->officeAddress->latitude)
            ? $feedUser->agentSummary->office->officeAddress->latitude
            : null
        ;
        $user->fallbackLongitude = isset($feedUser->agentSummary->office->officeAddress->longitude)
            ? $feedUser->agentSummary->office->officeAddress->longitude
            : null
        ;

        return $user;
    }

    public function prepareName($feedUser)
    {
        $names = [];
        if (isset($feedUser->agentSummary->firstName)) {
            $names[] = $feedUser->agentSummary->firstName;
        }
        if (isset($feedUser->agentSummary->lastName)) {
            $names[] = $feedUser->agentSummary->lastName;
        }

        return !empty($names) ? implode(' ', $names) : null;
    }

    public function prepareCompanyName($feedUser)
    {
        if (!isset($feedUser->agentSummary->office->companyName)) {
            return null;
        }

        $companyName = $feedUser->agentSummary->office->companyName;
        if (false !== stripos($companyName, 'Sotheby\'s International Realty')) {
            return $companyName;
        }

        return sprintf('%s Sotheby\'s International Realty', $companyName);
    }

    public function getPhone($feedUser)
    {
        if (!isset($feedUser->agentSummary->businessPhone)) {
            return null;
        }

        return $feedUser->agentSummary->businessPhone;
    }

    public function getEmail($feedUser)
    {
        if (isset($feedUser->agentSummary->emailAddress)) {
            return $feedUser->agentSummary->emailAddress;
        }

        if (isset($feedUser->agentSummary->leadEmailAddress)) {
            return $feedUser->agentSummary->leadEmailAddress;
        }

        return null;
    }

    public function getLeadEmail($feedUser)
    {
        if (isset($feedUser->agentSummary->leadEmailAddress)) {
            return $feedUser->agentSummary->leadEmailAddress;
        }

        return null;
    }

    public function getEmails($feedUser)
    {
        if (
            empty($feedUser->agentSummary->emailAddress)
            && empty($feedUser->agentSummary->leadEmailAddress)
            && empty($feedUser->addlEmails)
        ) {
            return [];
        }

        $emails = [];
        if (!empty($feedUser->agentSummary->emailAddress)) {
            $emails[] = (object) [
                'type' => EmailTypes::PERSONAL,
                'email' => $feedUser->agentSummary->emailAddress,
            ];
        }
        if (!empty($feedUser->agentSummary->leadEmailAddress)) {
            $emails[] = (object) [
                'type' => EmailTypes::LEAD_ROUTER,
                'email' => $feedUser->agentSummary->leadEmailAddress,
            ];
        }

        if (!empty($feedUser->addlEmails)) {
            $emails = array_merge(
                $emails,
                array_map(
                    function ($el) {
                        return (object) [
                            'type' => self::EMAIL_TYPE_MAP[strtolower($el->type)],
                            'email' => $el->address,
                        ];
                    },
                    array_filter(
                        $feedUser->addlEmails,
                        function ($el) {
                            return 'vanity' == strtolower($el->type);
                        }
                    )
                )
            );
        }

        usort($emails, function ($el1, $el2) {
            return strcmp($el1->type, $el2->type);
        });

        return $emails;
    }

    public function getAvatar($feedUser)
    {
        if (isset($feedUser->defaultPhotoURL)) {
            return $feedUser->defaultPhotoURL;
        }

        if (!isset($feedUser->media)) {
            return [];
        }

        $photos = array_filter($feedUser->media, function ($item) {
            return 'image' == strtolower($item->format);
        });
        usort($photos, function ($val1, $val2) {
            return $val1->sequenceNumber - $val2->sequenceNumber;
        });
        foreach ($photos as $photo) {
            if ('Person Photo' == $photo->category) {
                return $photo->url;
            } elseif ($photo->isDefault) {
                $primaryPhoto = $photo->url;
            }
        }

        if (isset($primaryPhoto)) {
            return $primaryPhoto;
        }

        return isset($photos[0]) ? $photos[0]->url : null;
    }

    public function getUrl($feedUser)
    {
        if (!isset($feedUser->websites)) {
            return null;
        }

        foreach ($feedUser->websites as $website) {
            if ('Personal' == $website->type) {
                return $website->url;
            } elseif ('Business' == $website->type) {
                $businessUrl = $website->url;
            }
        }

        if (isset($businessUrl)) {
            return $businessUrl;
        }

        return isset($feedUser->websites[0]) ? $feedUser->websites[0]->url : null;
    }

    public function getProfileDescriptions($feedUser)
    {
        if (!isset($feedUser->remarks)) {
            return [];
        }

        $output = [];
        foreach ($feedUser->remarks as $description) {
            if ('en' == $description->languageCode) {
                $output[] = (object) [
                    'locale' => $description->languageCode,
                    'description' => $description->remark,
                ];
            }
        }

        return $output;
    }

    private function prepareAptBldg($address2, $address3)
    {
        $address = [];
        if ($address2) {
            $address[] = $address2;
        }
        if ($address3) {
            $address[] = $address3;
        }

        return count($address) ? join(' ', $address) : null;
    }
}
