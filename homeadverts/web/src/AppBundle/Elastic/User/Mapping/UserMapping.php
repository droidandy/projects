<?php

namespace AppBundle\Elastic\User\Mapping;

use AppBundle\Entity\User\CompanyProfile;
use AppBundle\Entity\User\TeamProfile;
use AppBundle\Entity\User\UserProfile;
use AppBundle\Elastic\Integration\Mapping\MappingTemplate;
use AppBundle\Entity\User\User;

class UserMapping extends MappingTemplate
{
    const TYPE = 'user';

    /**
     * @return UserDocumentParser
     */
    public function getDocumentParser()
    {
        return new UserDocumentParser($this->getIndex(), $this->getMapping());
    }

    /**
     * @param object $entity
     *
     * @return bool
     */
    public function support($entity)
    {
        return $entity instanceof User;
    }

    /**
     * @param $id
     * @param \DateTime $deletedAt
     */
    public function markDocumentDeleted($id, \DateTime $deletedAt)
    {
        return $this
            ->client
            ->update([
                'index' => $this->getIndex(),
                'type' => $this->getMapping(),
                'id' => $id,
                'body' => [
                    'doc' => ['deletedAt' => $deletedAt->format('c')],
                ],
            ])
        ;
    }

    /**
     * @return array
     */
    protected function getProperties()
    {
        return [
            'type' => [
                'type' => 'keyword',
            ],
            'roles' => [
                'type' => 'keyword',
            ],
            'hierarchyType' => [
                'type' => 'keyword',
            ],
            'searchBoost' => [
                'type' => 'double',
            ],
            'userProfile' => [
                'type' => 'object',
                'properties' => [
                    'id' => [
                        'type' => 'long',
                    ],
                    'gender' => [
                        'type' => 'keyword',
                    ],
                    'title' => [
                        'type' => 'keyword',
                    ],
                ],
            ],
            'teamProfile' => [
                'type' => 'object',
                'properties' => [
                    'id' => [
                        'type' => 'long',
                    ],
                ],
            ],
            'companyProfile' => [
                'type' => 'object',
                'properties' => [
                    'id' => [
                        'type' => 'long',
                    ],
                    'type' => [
                        'type' => 'keyword',
                    ],
                    'leadEmail' => [
                        'type' => 'keyword',
                    ],
                ],
            ],
            'name' => [
                'type' => 'keyword',
                'fields' => [
                    'autocomplete' => [
                        'type' => 'text',
                        'analyzer' => 'autocomplete',
                        'fielddata' => true,
                    ],
                    'suggest' => [
                        'type' => 'text',
                        'analyzer' => 'suggest',
                    ],
                    'text' => [
                        'type' => 'text',
                    ],
                    'wildcard' => [
                        'type' => 'text',
                        'analyzer' => 'wildcard_index',
                    ],
                    'fullmatch' => [
                        'type' => 'text',
                        'analyzer' => 'fullmatch',
                    ],
                ],
            ],
            'companyName' => [
                'type' => 'keyword',
                'fields' => [
                    'autocomplete' => [
                        'type' => 'text',
                        'analyzer' => 'autocomplete',
                    ],
                    'suggest' => [
                        'type' => 'text',
                        'analyzer' => 'suggest',
                    ],
                    'text' => [
                        'type' => 'text',
                    ],
                    'wildcard' => [
                        'type' => 'text',
                        'analyzer' => 'wildcard_index',
                    ],
                    'fullmatch' => [
                        'type' => 'text',
                        'analyzer' => 'fullmatch',
                    ],
                ],
            ],
            'companyPhone' => [
                'type' => 'keyword',
            ],
            'location' => [
                'type' => 'geo_shape',
            ],
            'email' => [
                'type' => 'keyword',
            ],
            'bio' => [
                'type' => 'keyword',
            ],
            'phone' => [
                'type' => 'keyword',
            ],
            'mobilePhone' => [
                'type' => 'keyword',
            ],
            'homePageUrl' => [
                'type' => 'keyword',
            ],
            'profileImage' => [
                'type' => 'keyword',
            ],
            'primaryLanguage' => [
                'type' => 'keyword',
            ],
            'spokenLanguages' => [
                'type' => 'keyword',
            ],
            'preferredCurrency' => [
                'type' => 'keyword',
            ],
            'status' => [
                'type' => 'byte',
            ],
            'address1' => [
                'type' => 'keyword',
                'fields' => [
                    'suggest' => [
                        'type' => 'text',
                        'analyzer' => 'street_suggest',
                    ],
                    'text' => [
                        'type' => 'text',
                    ],
                ],
            ],
            'townCity' => [
                'type' => 'keyword',
                'fields' => [
                    'suggest' => [
                        'type' => 'text',
                        'analyzer' => 'suggest',
                    ],
                    'text' => [
                        'type' => 'text',
                    ],
                    'lower' => [
                        'type' => 'text',
                        'analyzer' => 'lower_keyword',
                    ],
                ],
            ],
            'county' => [
                'type' => 'keyword',
                'fields' => [
                    'lower' => [
                        'type' => 'text',
                        'analyzer' => 'lower_keyword',
                    ],
                ],
            ],
            'country' => [
                'type' => 'keyword',
                'fields' => [
                    'lower' => [
                        'type' => 'text',
                        'analyzer' => 'lower_keyword',
                    ],
                ],
            ],
            'postcode' => [
                'type' => 'keyword',
                'fields' => [
                    'suggest' => [
                        'type' => 'text',
                        'analyzer' => 'postcode_suggest',
                    ],
                ],
            ],
            'googleLocations' => [
                'type' => 'object',
                'properties' => [
                    'id' => [
                        'type' => 'long',
                    ],
                    'placeId' => [
                        'type' => 'keyword',
                    ],
                ],
            ],
            'plan' => [
                'type' => 'keyword',
            ],
            'planDate' => [
                'type' => 'keyword',
            ],
            'vatNumber' => [
                'type' => 'integer',
            ],
            'vatCountry' => [
                'type' => 'keyword',
            ],
            'marketflag' => [
                'type' => 'byte',
            ],
            'agentCount' => [
                'type' => 'integer',
            ],
            'affiliateCount' => [
                'type' => 'integer',
            ],
            'propertyCount' => [
                'type' => 'integer',
            ],
            'propertyForSaleCount' => [
                'type' => 'integer',
            ],
            'propertyToRentCount' => [
                'type' => 'integer',
            ],
            'articleCount' => [
                'type' => 'integer',
            ],
            'deletedAt' => [
                'type' => 'date',
            ],
        ];
    }

    /**
     * @return array
     */
    protected function getSettings()
    {
        return [
            'analysis' => [
                'analyzer' => [
                    'autocomplete' => [
                        'type' => 'custom',
                        'tokenizer' => 'standard',
                        'filter' => [
                            'standard', 'lowercase', 'stop', 'kstem', 'ngram', 'token_filters',
                        ],
                    ],
                    'suggest' => [
                        'type' => 'custom',
                        'tokenizer' => 'standard',
                        'filter' => [
                            'lowercase',
                            'suggest_filter',
                        ],
                    ],
                    'fullmatch' => [
                        'type' => 'custom',
                        'tokenizer' => 'keyword',
                        'char_filter' => [
                            'keep_alphanum',
                        ],
                        'filter' => [
                            'lowercase',
                        ],
                    ],
                    'wildcard_index' => [
                        'type' => 'custom',
                        'tokenizer' => 'keyword',
                        'char_filter' => [
                            'keep_alphanum',
                        ],
                        'filter' => [
                            'lowercase',
                            'wildcard_filter',
                        ],
                    ],
                    'wildcard_search' => [
                        'type' => 'custom',
                        'tokenizer' => 'keyword',
                        'char_filter' => [
                            'keep_alphanum',
                        ],
                        'filter' => [
                            'lowercase',
                        ],
                    ],
                    'street_suggest' => [
                        'type' => 'custom',
                        'tokenizer' => 'standard',
                        'char_filter' => [
                            'remove_numbers',
                        ],
                        'filter' => [
                            'lowercase',
                            'length' => [
                                'min' => 3,
                            ],
                            'suggest_filter',
                        ],
                    ],
                    'term_suggest' => [
                        'type' => 'custom',
                        'tokenizer' => 'whitespace',
                        'filter' => [
                            'lowercase',
                            'shingle_filter',
                        ],
                    ],
                    'postcode_suggest' => [
                        'type' => 'custom',
                        'tokenizer' => 'keyword',
                        'filter' => [
                            'suggest_filter',
                        ],
                    ],
                    'lower_keyword' => [
                        'type' => 'custom',
                        'tokenizer' => 'keyword',
                        'filter' => [
                            'lowercase',
                        ],
                    ],
                ],
                'filter' => [
                    'ngram' => [
                        'type' => 'ngram',
                        'min_gram' => 1,
                        'max_gram' => 20,
                    ],
                    'token_filters' => [
                        'type' => 'word_delimiter',
                        'preserve_original' => 'true',
                        'catenate_words' => 'true',
                        'stem_english_possessive' => 'true',
                    ],
                    'suggest_filter' => [
                        'type' => 'edge_ngram',
                        'min_gram' => 1,
                        'max_gram' => 20,
                    ],
                    'wildcard_filter' => [
                        'type' => 'edge_ngram',
                        'min_gram' => 1,
                        'max_gram' => 50,
                    ],
                    'shingle_filter' => [
                        'type' => 'shingle',
                        'min_shingle_size' => 2,
                        'max_shingle_size' => 3,
                    ],
                ],
                'char_filter' => [
                    'keep_alphanum' => [
                        'type' => 'pattern_replace',
                        'pattern' => '[^\w ]',
                        'replacement' => '',
                    ],
                    'remove_numbers' => [
                        'type' => 'pattern_replace',
                        'pattern' => '\d',
                        'replacement' => '',
                    ],
                ],
            ],
        ];
    }

    /**
     * @param User $user
     *
     * @return array
     */
    protected function doGetDocument($user)
    {
        return [
            'type' => $user->getType(),
            'roles' => $user->getRoles(),
            'searchBoost' => $user->getSearchBoost(),
            'hierarchyType' => $user->getHierarchyType(),
            'userProfile' => $this->getUserProfile($user->getUserProfile()),
            'teamProfile' => $this->getTeamProfile($user->getTeamProfile()),
            'companyProfile' => $this->getCompanyProfile($user->getCompanyProfile()),
            'location' => [
                'type' => 'point',
                'coordinates' => [(float) $user->address->longitude, (float) $user->address->latitude],
            ],
            'email' => $user->getEmail(),
            'name' => $user->name,
            'bio' => $user->bio,
            'companyName' => $user->companyName,
            'phone' => $user->phone,
            'mobilePhone' => $user->mobilePhone,
            'companyPhone' => $user->companyPhone,
            'homePageUrl' => $user->homePageUrl,
            'profileImage' => $user->profileImage,
            'primaryLanguage' => $user->primaryLanguage,
            'spokenLanguages' => $user->spokenLanguages,
            'preferredCurrency' => $user->preferredCurrency,
            'address1' => $user->address->street,
            'address2' => $user->address->aptBldg,
            'townCity' => $user->address->townCity,
            'county' => $user->address->stateCounty,
            'country' => $user->address->country,
            'postcode' => $user->address->zip,
            'googleLocations' => $this->getGoogleLocations($user),
            'agentCount' => $user->agentCount,
            'affiliateCount' => $user->affiliateCount,
            'propertyCount' => $user->propertyCount,
            'propertyToRentCount' => $user->propertyToRentCount,
            'propertyForSaleCount' => $user->propertyForSaleCount,
            'articleCount' => $user->articleCount,
            'deletedAt' => $user->isDeleted() ? $user->getDeletedAt()->format('c') : null,
        ];
    }

    private function getGoogleLocations(User $user)
    {
        $locations = [];
        foreach ($user->getGoogleLocations() as $googleLocation) {
            $locations[] = [
                'id' => $googleLocation->getId(),
                'placeId' => $googleLocation->getPlaceId(),
            ];
        }

        return $locations;
    }

    private function getUserProfile(UserProfile $userProfile = null)
    {
        return $userProfile
            ? [
                'id' => $userProfile->getId(),
                'gender' => $userProfile->getGender(),
                'title' => $userProfile->getTitle(),
            ]
            : null
        ;
    }

    private function getTeamProfile(TeamProfile $teamProfile = null)
    {
        return $teamProfile
            ? [
                'id' => $teamProfile->getId(),
            ]
            : null
        ;
    }

    private function getCompanyProfile(CompanyProfile $companyProfile = null)
    {
        return $companyProfile
            ? [
                'id' => $companyProfile->getId(),
                'type' => $companyProfile->getType(),
                'openingHours' => $companyProfile->getOpeningHours(),
                'leadEmail' => $companyProfile->getLeadEmail(),
            ]
            : null
        ;
    }
}
