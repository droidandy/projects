<?php

namespace AppBundle\Import\Normalizer\Property;

use AppBundle\Entity\Embeddable\Price;
use AppBundle\Entity\User\SourceRef;
use AppBundle\Entity\Property\Property;
use AppBundle\Service\Import\Wellcomemat\WellcomematFeedInterface;
use AppBundle\Service\Import\Wellcomemat\WellcomematFeed;
use AppBundle\Service\Geo\LocaleHelper;
use AppBundle\Entity\Property\PropertyTypes as Type;
use AppBundle\Helper\SprintfLoggerTrait;
use Psr\Log\LoggerInterface;

class PropertyNormalizer
{
    use SprintfLoggerTrait;

    const TYPE_MAP = [
        'Commercial' => Type::COMMERCIAL,
        'Farm And Agriculture' => Type::FARM,
        'Lots And Land' => Type::LAND,
        'Lots & Land' => Type::LAND,
        'Common Interest'      => Type::COMMON_INTEREST,
        'MultiFamily'          => Type::MULTI_FAMILY,
        'Other'                => Type::OTHER,
        'Rental'               => Type::COMMON_INTEREST,
        'Residential'          => Type::RESIDENTIAL,
    ];

    const SUBTYPE_MAP = [
        'Apartment' => Type::APARTMENT,
        'Boatslip' => Type::OTHER,
        'Cabin' => Type::OTHER,
        'Condominium' => Type::APARTMENT,
        'Co-Op' => Type::OTHER,
        'Deeded Parking' => Type::OTHER,
        'Duplex' => Type::APARTMENT,
        'Farm' => Type::FARM,
        'Fractional Ownership' => Type::OTHER,
        'Golf course' => Type::OTHER,
        'Historical' => Type::OTHER,
        'Land -Agricultural (Not Zoned)' => Type::OTHER,
        'Land -Industrial' => Type::OTHER,
        'Land -Multi-Family Acreage' => Type::OTHER,
        'Land -Office' => Type::OTHER,
        'Land -Retail' => Type::OTHER,
        'Land -Single Family Acreage' => Type::OTHER,
        'Manufactured Home' => Type::MOVABLE,
        'Mixed Use' => Type::OTHER,
        'Mobile Home' => Type::MOVABLE,
        'Mobile/Manufactured Hm w Land' => Type::MOVABLE,
        'Multi-Family (2-4 Units)' => Type::OTHER,
        'Other' => Type::OTHER,
        'Other Business Opportunity' => Type::OTHER,
        'Own Your Own' => Type::OTHER,
        'Quadruplex' => Type::APARTMENT,
        'Private Island' => Type::ISLAND,
        'Residential Lot' => Type::OTHER,
        'Single Family Attached' => Type::SEMI_DETACHED,
        'Single Family Detached' => Type::DETACHED,
        'Special Purpose' => Type::OTHER,
        'Stock Cooperative' => Type::OTHER,
        'Timeshare' => Type::OTHER,
        'Time Share' => Type::OTHER,
        'Townhouse' => Type::TOWNHOUSE,
        'Triplex' => Type::APARTMENT,
        'Vacant Land (0-10 Acres)' => Type::OTHER,
        'Vacant Land (10+ Acres)' => Type::OTHER,
        'Vineyard' => Type::OTHER,
        'Winery' => Type::OTHER,
        'Flat' => Type::OTHER,
        'Row' => Type::APARTMENT,
        'Semi-Detached' => Type::SEMI_DETACHED,
        'Industrial' => Type::OTHER,
        'Hacienda' => Type::OTHER,
        'Boat Slip' => Type::OTHER,
        'Multi-Family Home' => Type::OTHER,
        'Hospitality' => Type::OTHER,
        'Mobile/Manufactured Home' => Type::MOVABLE,
        'Farm/Ranch/Plantation' => Type::FARM,
        'Vacant Land' => Type::OTHER,
        'Multi-Family' => Type::OTHER,
        'Office Bldg' => Type::OTHER,
        'Retail' => Type::OTHER,
        'Other Residential' => Type::OTHER,
        'Vineyard-Res' => Type::OTHER,
        'Winery-Res' => Type::OTHER,
    ];

    private $wellcomematVideos = [];
    /**
     * @var WellcomematFeed
     */
    private $wellcomematFeed;
    /**
     * @var LocaleHelper
     */
    private $localeHelper;
    /**
     * @var LoggerInterface
     */
    private $logger;

    private $initialized = false;

    /**
     * @param WellcomematFeedInterface $wellcomematFeed
     * @param LocaleHelper             $localeHelper
     */
    public function __construct(
        WellcomematFeedInterface $wellcomematFeed,
        LocaleHelper $localeHelper,
        LoggerInterface $logger
    ) {
        $this->wellcomematFeed = $wellcomematFeed;
        $this->localeHelper = $localeHelper;
        $this->logger = $logger;
    }

    public function normalize($feedProperty)
    {
        $this->initialize();

        $property = new NormalisedProperty([
            'name' => isset($feedProperty->listingSummary->propertyName)
                                   ? $feedProperty->listingSummary->propertyName
                                   : null,
            'market' => isset($feedProperty->listingSummary->listingType)
                               && false !== strpos('ForRent', $feedProperty->listingSummary->listingType)
                                    ? 'to-rent'
                                    : 'for-sale',
            'status' => !empty($feedProperty->listingSummary->isActive) ? Property::STATUS_ACTIVE : Property::STATUS_INACTIVE,
            'bedrooms' => isset($feedProperty->listingSummary->noOfBedrooms)
                                    ? $feedProperty->listingSummary->noOfBedrooms
                                    : null,
            'totalBathrooms' => isset($feedProperty->listingSummary->totalBath)
                                    ? $feedProperty->listingSummary->totalBath
                                    : null,
            'bathrooms' => isset($feedProperty->fullBath)
                                    ? $feedProperty->fullBath
                                    : null,
            'halfBathrooms' => isset($feedProperty->halfBath)
                                    ? $feedProperty->halfBath
                                    : null,
            'threeQuarterBathrooms' => isset($feedProperty->threeQuarterBath)
                                    ? $feedProperty->threeQuarterBath
                                    : null,
            'street' => isset($feedProperty->listingSummary->propertyAddress->streetAddress)
                                    ? $feedProperty->listingSummary->propertyAddress->streetAddress
                                    : null,
            'aptBldg' => null,
            'townCity' => isset($feedProperty->listingSummary->propertyAddress->city)
                                    ? $feedProperty->listingSummary->propertyAddress->city
                                    : null,
            'neighbourhood' => $this->extractNeighborhood($feedProperty),
            'stateCounty' => isset($feedProperty->listingSummary->propertyAddress->stateProvinceCode)
                                    ? $feedProperty->listingSummary->propertyAddress->stateProvinceCode
                                    : null,
            'country' => isset($feedProperty->listingSummary->propertyAddress->countryCode)
                                    ? $feedProperty->listingSummary->propertyAddress->countryCode
                                    : null,
            'zip' => isset($feedProperty->listingSummary->propertyAddress->postalCode)
                                    ? $feedProperty->listingSummary->propertyAddress->postalCode
                                    : null,
            'addressHidden' => empty($feedProperty->listingSummary->isShowAddressOnInternet),
            'latitude' => null,  // We can't trust Listhub latlngs
            'longitude' => null, // We can't trust Listhub latlngs
            'latitudeFallback' => isset($feedProperty->listingSummary->propertyAddress->latitude)
                                    ? $feedProperty->listingSummary->propertyAddress->latitude
                                    : null, // We can't trust Listhub latlngs
            'longitudeFallback' => isset($feedProperty->listingSummary->propertyAddress->longitude)
                                    ? $feedProperty->listingSummary->propertyAddress->longitude
                                    : null, // We can't trust Listhub latlngs
            'type' => $this->guessType($feedProperty),
            'price' => (object) [
                'amount' => isset($feedProperty->listingSummary->listPrice->amount)
                                    ? $feedProperty->listingSummary->listPrice->amount
                                    : null,
                'currency' => isset($feedProperty->listingSummary->listPrice->currencyCode)
                                    ? $feedProperty->listingSummary->listPrice->currencyCode
                                    : null,
                'period' => $this->extractPeriod($feedProperty),
                'qualifier' => !empty($feedProperty->listingSummary->listPrice->isHideListPrice)
                                    ? Property::PRICE_QUALIFIER_ENQUIRE
                                    : Property::PRICE_QUALIFIER_NONE,
                'priceInUSD' => isset($feedProperty->listingSummary->listPrice->listPriceinUSD)
                                    ? $feedProperty->listingSummary->listPrice->listPriceinUSD
                                    : null,
            ],
            'primaryPhoto' => $this->extractPrimaryPhoto($feedProperty),
            'photos' => $this->getPhotos($feedProperty),
            'videos' => $this->getVideos($feedProperty),
            'videos3d' => $this->getVideos3d($feedProperty),
            'descriptions' => $this->getDescriptions($feedProperty),
            'yearBuilt' => isset($feedProperty->yearBuilt) ? $feedProperty->yearBuilt : null,
            'expirationDate' => null, // a property will be invalidated on sync
            'interiorArea' => $this->getInteriorArea($feedProperty),
            'exteriorArea' => $this->getExteriorArea($feedProperty),
            'sourceUrl' => isset($feedProperty->listingSummary->listingURL)
                                    ? $feedProperty->listingSummary->listingURL
                                    : null,
            'sourceRef' => isset($feedProperty->listingSummary->RFGListingId)
                                    ? sprintf('3yd-RFGSIR-%s', $feedProperty->listingSummary->RFGListingId)
                                    : null,
            'mlsRef' => $this->extractMls($feedProperty),
            'sourceGuid' => $feedProperty->listingSummary->listingId,
            'sourceName' => 'sothebys',
            'sourceType' => 'datasync',
            'user' => null,
            'dateUpdated' => isset($feedProperty->listingSummary->lastUpdateOn)
                                    ? $feedProperty->listingSummary->lastUpdateOn
                                    : null,
            'misc' => [
                'prop_features' => $this->preparePropFeatures($feedProperty),
            ],
            'userRef' => self::extractAgentGuid($feedProperty),
            'userRefType' => SourceRef::TYPE_GUID,
            'companyRef' => self::extractCompanyGuid($feedProperty),
            'companyRefType' => SourceRef::TYPE_GUID,
        ]);

        return $property;
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

    private function guessType($property)
    {
        if (
            !isset($property->listingSummary->propertyType)
            && !isset($property->listingSummary->propertyCategory)
        ) {
            return Type::UNKNOWN;
        }

        $subtype = isset($property->listingSummary->propertyType) ? $property->listingSummary->propertyType : null;
        $type = isset($property->listingSummary->propertyCategory) ? $property->listingSummary->propertyCategory : null;

        if (empty(self::SUBTYPE_MAP[$subtype])) {
            $this->notice(
                '[PROPERTY:%s] Unrecognized type %s',
                $property->listingSummary->listingId,
                $property->listingSummary->propertyType
            );
        }
        if (empty(self::TYPE_MAP[$type])) {
            $this->notice(
                '[PROPERTY:%s] Unrecognized category %s',
                $property->listingSummary->listingId,
                $property->listingSummary->propertyCategory
            );
        }

        if (!empty(self::SUBTYPE_MAP[$subtype])) {
            return self::SUBTYPE_MAP[$subtype];
        }

        if (!empty(self::TYPE_MAP[$type])) {
            return self::TYPE_MAP[$type];
        }

        return Type::OTHER;
    }

    /**
     * Use square footage whenever possible to avoid parsing.
     *
     * @param $property
     *
     * @return float|null
     */
    private function getInteriorArea($property)
    {
        return $this->getArea($property->listingSummary, ['squareFootage', 'SF'], 'buildingArea');
    }

    /**
     * Use totalAcres whenever possible to avoid parsing.
     *
     * @param $property
     *
     * @return float|null
     */
    private function getExteriorArea($property)
    {
        return $this->getArea($property->listingSummary, ['totalAcres', 'AC'], 'lotSize');
    }

    private function getArea($property, $numberAttr, $textAttr)
    {
        list($numberAttrVal, $numberAttrUom) = $numberAttr;
        if (!empty($property->$numberAttrVal)) {
            return $this->convertToSM($property->$numberAttrVal, $numberAttrUom);
        }

        if (!empty($property->$textAttr)) {
            $area = (float) $property->$textAttr;

            $buildingArea = $property->$textAttr;
            switch (true) {
                case preg_match('/SM|Sq\.\s*M/i', $buildingArea):
                    $uom = 'SM'; break;
                case preg_match('/SF|Sq\.\s*Ft\./i', $buildingArea):
                    $uom = 'SF'; break;
                case preg_match('/AC|Acres/i', $buildingArea):
                    $uom = 'AC'; break;
                case preg_match('/HA/i', $buildingArea):
                    $uom = 'HA'; break;
                case preg_match('/PN/i', $buildingArea):
                    $uom = 'PN'; break;
                default:
                    $uom =
                        isset($property->listingSummary->propertyAddress->countryCode)
                        && 'US' == $property->listingSummary->propertyAddress->countryCode
                            ? 'SF'
                            : 'SM'
                    ;
            }

            return $this->convertToSM($area, $uom);
        }

        return null;
    }

    private function convertToSM($area, $uom)
    {
        switch ($uom) {
            case 'AC':
                return $this->localeHelper->acresToSquareMetres($area);
            case 'SF':
                return $this->localeHelper->squareFeetToSquareMetres($area);
            case 'HA':
                return $this->localeHelper->hectaresToSquareMetres($area);
            case 'PN':
                return $this->localeHelper->pingsToSquareMetres($area);
            default:
                return $area;
        }
    }

    private function extractMls($property)
    {
        $mlsInformation = isset($property->mlsInformation) ? $property->mlsInformation : [];

        if (empty($mlsInformation)) {
            return null;
        }

        foreach ($mlsInformation as $mlsNumber) {
            if (!empty($mlsNumber->isPrimary)) {
                return $mlsNumber->number;
            }
        }

        return $mlsInformation[0]->number;
    }

    public function getPhotos($feedProperty)
    {
        if (empty($feedProperty->media)) {
            return [];
        }

        $buffer = [];
        foreach ($feedProperty->media as $mediaItem) {
            if ('image' == strtolower($mediaItem->format)) {
                $category = isset($mediaItem->category) ? $mediaItem->category : '';
                $buffer[$category][] = (object) [
                    'url' => $mediaItem->url,
                    'modified' => $mediaItem->lastUpdateOn,
                    'index' => $mediaItem->sequenceNumber,
                    'caption' => isset($mediaItem->caption) ? $mediaItem->caption : null,
                ];
            }
        }

        $output = [];
        if (isset($buffer['Listing Photo'])) {
            foreach ($buffer['Listing Photo'] as $photo) {
                $output[] = $photo;
            }
            unset($buffer['Listing Photo']);
        }

        $offset = count($output);
        foreach ($buffer as $category => $photos) {
            foreach ($photos as $photo) {
                $photo->index = $offset + $photo->index;
                $output[] = $photo;
            }
            $offset = count($output);
        }

        usort($output, function ($item1, $item2) {
            return $item1->index - $item2->index;
        });

        return $output;
    }

    public function getListingPhotos($feedProperty)
    {
        if (empty($feedProperty->media)) {
            return [];
        }

        $output = [];
        foreach ($feedProperty->media as $mediaItem) {
            if (
                'image' == strtolower($mediaItem->format)
                && !empty($mediaItem->category)
                && 'Listing Photo' == $mediaItem->category
            ) {
                $output[] = (object) [
                    'url' => $mediaItem->url,
                    'modified' => $mediaItem->lastUpdateOn,
                    'index' => $mediaItem->sequenceNumber,
                    'caption' => isset($mediaItem->caption) ? $mediaItem->caption : null,
                ];
            }
        }

        usort($output, function ($item1, $item2) {
            return $item1->index - $item2->index;
        });

        return $output;
    }

    private function getVideos($feedProperty)
    {
        if (empty($feedProperty->media)) {
            return [];
        }

        $output = [];

        foreach ($feedProperty->media as $mediaItem) {
            if ('video' == strtolower($mediaItem->format) && false !== strpos($mediaItem->url, 'youtube.com')) {
                $output[] = (object) [
                    'url' => $this->extractYoutube($mediaItem->url),
                    'modified' => $mediaItem->lastUpdateOn,
                    'index' => $mediaItem->sequenceNumber,
                    'caption' => null,
                    'metadata' => [
                        'media_id' => $mediaItem->mediaID,
                    ],
                ];
            }
        }

        usort($output, function ($item1, $item2) {
            return $item1->index - $item2->index;
        });

        if (isset($feedProperty->listingSummary->RFGListingId)) {
            $listingId = $feedProperty->listingSummary->RFGListingId;

            if (!empty($this->wellcomematVideos[$listingId])) {
                foreach ($this->wellcomematVideos[$listingId] as $media) {
                    $output[] = (object) [
                        'url' => WellcomematFeed::buildEmbedUrl($media['hash']),
                        'modified' => $media['created'],
                        'caption' => null,
                        'metadata' => $media,
                    ];
                }
            }
        }

        return $output;
    }

    private function getVideos3d($feedProperty)
    {
        if (empty($feedProperty->media)) {
            return [];
        }

        $output = [];
        foreach ($feedProperty->media as $mediaItem) {
            if (false !== strpos($mediaItem->url, 'matterport')) {
                $output[] = (object) [
                    'url' => $mediaItem->url,
                    'modified' => $mediaItem->lastUpdateOn,
                    'index' => $mediaItem->sequenceNumber,
                    'caption' => $mediaItem->caption,
                    'metadata' => [
                        'media_id' => $mediaItem->mediaID,
                    ],
                ];
            }
        }
        usort($output, function ($item1, $item2) {
            return $item1->index - $item2->index;
        });

        return $output;
    }

    private function extractYoutube($url)
    {
        return preg_replace(
            "/\s*[a-zA-Z\/\/:\.]*youtube.com\/watch\?v=([a-zA-Z0-9\-_]+)([a-zA-Z0-9\/\*\-\_\?\&\;\%\=\.]*)/i",
            '//www.youtube.com/embed/$1',
            $url
        );
    }

    private function extractWellcomemat($url)
    {
        return preg_replace(
            "/\s*[a-zA-Z\/\/:\.]*wellcomemat.com\/(mls|video|embed|manage-videos\/preview)\/([a-zA-Z0-9]+)/i",
            '//www.wellcomemat.com/embed/$2?or=8ph&hide_title=1',
            $url
        );
    }

    private function extractRackcdn($url)
    {
        return preg_replace(
            "/.*rackcdn.com\/([a-zA-Z0-9]+)_.*/i",
            '//www.wellcomemat.com/embed/$1?or=8ph&hide_title=1',
            $url
        );
    }

    private function getDescriptions($feedProperty)
    {
        if (!isset($feedProperty->remarks)) {
            return [];
        }

        $output = [];
        foreach ($feedProperty->remarks as $description) {
            if ('Property Description' == $description->type) {
                $output[] = (object) [
                    'locale' => strtolower($description->languageCode),
                    'description' => $description->remark,
                ];
            }
        }
        usort($output, function ($desc1, $desc2) {
            $localeCmp = strcmp($desc1->locale, $desc2->locale);
            if (0 !== $localeCmp) {
                return $localeCmp;
            }

            return strcmp($desc1->description, $desc2->description);
        });

        return $output;
    }

    private function preparePropFeatures($feedProperty)
    {
        if (empty($feedProperty->propertyFeatures)) {
            return [];
        }

        $propFeatures = array_map(
            function ($propFeature) {
                return [
                    'group_name' => isset($propFeature->groupName) ? $propFeature->groupName : null,
                    'desc' => $propFeature->description,
                ];
            },
            $feedProperty->propertyFeatures
        );

        usort($propFeatures, function ($propFeature1, $propFeature2) {
            if ($propFeature1['group_name'] != $propFeature2['group_name']) {
                return strcmp($propFeature1['group_name'], $propFeature2['group_name']);
            }

            return strcmp($propFeature1['desc'], $propFeature2['desc']);
        });

        return $propFeatures;
    }

    private function extractNeighborhood($feedProperty)
    {
        if (isset($feedProperty->geographicRegions)) {
            foreach ($feedProperty->geographicRegions as $geographicRegion) {
                if (in_array(strtolower($geographicRegion->type), ['neighborhood', 'neighbourhood'])) {
                    return $geographicRegion->name;
                }
            }
        }

        return null;
    }

    private function extractPeriod($feedProperty)
    {
        if (!isset($feedProperty->listingSummary->rentalFrequency)) {
            return null;
        }

        switch (strtolower($feedProperty->listingSummary->rentalFrequency)) {
            case 'day':
                return Price::PERIOD_DAY;
            case 'week':
                return Price::PERIOD_WEEK;
            case 'month':
                return Price::PERIOD_MONTH;
            case 'year':
                return Price::PERIOD_YEAR;
            case 'seasonal':
                return Price::PERIOD_SEASONAL;
            default:
                return Price::PERIOD_MONTH;
        }
    }

    public static function extractAgentGuid($property)
    {
        $agents = [];

        if (isset($property->listingSummary->agents)) {
            $agents = $property->listingSummary->agents;
        }

        foreach ($agents as $agent) {
            if (!empty($agent->isPrimary)) {
                return $agent->id;
            }
        }

        if ($agents) {
            if (isset($agents[0]->id)) {
                return $agents[0]->id;
            }

            if (isset($agents[0]->office->officeId)) {
                return $agents[0]->office->officeId;
            }
        }
    }

    public static function extractCompanyGuid($property)
    {
        if (isset($property->linkedOffice->officeId)) {
            return $property->linkedOffice->officeId;
        }

        $agents = isset($property->listingSummary->agents) ? $property->listingSummary->agents : [];
        if (empty($agents)) {
            return null;
        }

        foreach ($agents as $agent) {
            if (!empty($agent->isPrimary)) {
                return $agent->office->officeId ?? null;
            }
        }

        return isset($agents[0]->office->officeId) ? $agents[0]->office->officeId : null;
    }

    private function extractPrimaryPhoto($property)
    {
        $primaryPhoto = null;
        $photos = $this->getListingPhotos($property);

        if (isset($property->listingSummary->defaultPhotoURL)) {
            $primaryPhoto = $property->listingSummary->defaultPhotoURL;

            $maxIdx = end($photos) ? end($photos)->index : 0;
            $photos = array_filter($photos, function ($photo) use ($primaryPhoto) {
                return $photo->url == $primaryPhoto;
            });
            if (empty($photos)) {
                $property->media[] = (object) [
                    'format' => 'Image',
                    'category' => 'Listing Photo',
                    'url' => $primaryPhoto,
                    'lastUpdateOn' => null,
                    'sequenceNumber' => $maxIdx + 1,
                ];
            }
        }

        if (!$primaryPhoto) {
            foreach ($photos as $photo) {
                if (!empty($photo->isDefault)) {
                    $primaryPhoto = $photo->url;
                }
            }
        }

        if (!$primaryPhoto && !empty($photos)) {
            $primaryPhoto = reset($photos)->url;
        }

        return $primaryPhoto;
    }

    private function initialize()
    {
        if (!$this->initialized) {
            $this->wellcomematVideos = $this->wellcomematFeed->getVideos();

            $this->initialized = !empty($this->wellcomematVideos);
        }
    }
}
