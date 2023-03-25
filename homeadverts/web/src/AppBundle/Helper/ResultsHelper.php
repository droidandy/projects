<?php

namespace AppBundle\Helper;

use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Service\PropertyService;
use Symfony\Component\Intl\Intl;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AppBundle\Service\CurrencyManager;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Entity\Property\Property;
use AppBundle\Search\Market;

class ResultsHelper
{
    // Todo: To be rewritten..

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @param ContainerInterface $serviceContainer
     */
    public function __construct(ContainerInterface $serviceContainer)
    {
        $this->container = $serviceContainer;
    }

    /**
     * central point where properties can be parsed into the right format.
     *
     * Please note: Properties must have been decorated with images or errors will occur
     *
     * @param object $properties
     *
     * @return array
     */
    public function parsePropertiesForJsonResponse($properties)
    {
        $currencyManager = $this->container->get('ha.currency.manager');
        $router = $this->container->get('router');
        $propertyService = $this->container->get('ha.property.service');

        $properties = $properties['properties'];
        if ($properties instanceof SearchResults) {
            $properties = iterator_to_array($properties);
        }

        $mapped = array_map(function ($property) use (
            $router,
            $currencyManager,
            $propertyService
        ) {
            /** @var PropertyService $propertyService */
            /** @var CurrencyManager $currencyManager */
            /** @var Property $property */
            $video = [];
            $primaryVideo = $property->getPrimaryVideo();

            if ($primaryVideo) {
                $video['type'] = $primaryVideo->getType();
                $video['url'] = $primaryVideo->getVideoUrl();
            }

            $video3d = [];
            $primaryVideo3d = $property->getPrimaryVideo();

            if ($primaryVideo3d) {
                $video3d['url'] = $primaryVideo3d->url;
            }

            return [
                'id' => $property->getId(),
                'url' => $router->generate('property_details', [
                    'id' => $property->getId(),
                    'slug' => $property->getSlug(),
                ]),
                'location' => [
                    $property->getAddress()->getCoords()->getLatitude(),
                    $property->getAddress()->getCoords()->getLongitude(),
                ],
                'type' => ucwords(PropertyTypes::getById($property->getType())),
                'price' => $currencyManager->formatPrice($property->getPrice(), $property->getCurrency()),
                'address' => $property->address->getPublicAddress(','),
                'photos' => $propertyService->buildCarousel($property),
                'video' => $video,
                'video3d' => $video3d,
                'sourceRef' => $property->getSourceRef(),
            ];
        }, $properties);

        return array_filter($mapped);
    }

    /**
     * @param Market $market
     *
     * @return mixed
     */
    public function getTotalProperties(Market $market)
    {
        $cache = $this->container->get('cache');
//        $cache->setNamespace('ha-search');
        $db = $this->container->get('doctrine.dbal.default_connection');

        $key = 'total-properties:'.$market;

        if (false === ($count = $cache->fetch($key))) {
            $rental = (int) $market->isRental();
            $count = $db->fetchColumn('SELECT COUNT(*) FROM property WHERE status >= 100 AND rental = ?', [$rental], 0);
            $cache->save($key, $count, 3600);
        }

        return $count;
    }

    /**
     * @param Market $market
     *
     * @return mixed
     */
    public function getTotalFeaturedProperties(Market $market)
    {
        $cache = $this->container->get('cache');
//        $cache->setNamespace('ha-search');
        $db = $this->container->get('doctrine.dbal.default_connection');

        $key = 'total-properties-featured:'.$market;

        if (false === ($count = $cache->fetch($key))) {
            $rental = (int) $market->isRental();
            $count = $db->fetchColumn(
                'SELECT COUNT(*)
                           FROM property
                           WHERE status >= 100
                           AND featured IS NOT NULL
                           AND rental = ?',
                [$rental],
                0
            );
            $cache->save($key, $count, 3600);
        }

        return $count;
    }

    /**
     * @param Market $market
     *
     * @return array
     */
    public function getPropertyCountries(Market $market)
    {
        $cache = $this->container->get('cache');
//        $cache->setNamespace('ha-search');
        $db = $this->container->get('doctrine.dbal.default_connection');

        $key = 'property-list-continent-'.\Locale::getDefault().':'.$market;

        if (false === ($possibleCountries = $cache->fetch($key))) {
            $rental = (int) $market->isRental();
            $result = $db->executeQuery('SELECT address_country FROM property WHERE status >= 100 AND rental = ? GROUP BY address_country', [$rental]);

            $foundCountries = [];
            while ($row = $result->fetch()) {
                $foundCountries[$row['address_country']] = true;
            }

            $coll = new \Collator(\Locale::getDefault());

            $possibleCountries = $this->getPossibleCountries(\Locale::getDefault());

            foreach ($possibleCountries as $section => $sections) {
                foreach ($sections as $continent => &$countryList) {
                    $countries = $countryList;
                    $countries = array_filter($countries, function ($isoCode) use ($foundCountries) {
                        return isset($foundCountries[$isoCode]);
                    });

                    foreach ($countries as $index => $isoCode) {
                        $countries[$index] = $isoCode;
                    }

                    $coll->asort($countries);

                    $countryList = $countries;
                }

                $possibleCountries[$section] = array_filter($sections);
            }

            $cache->save($key, $possibleCountries, 3600);
        }

        return $possibleCountries;
    }

    /**
     * @param $locale
     *
     * @return array
     */
    public function getLocalisedCountryNames($locale)
    {
        $db = $this->container->get('doctrine.dbal.geonames_connection');
        $continents = [];

        $result = $db->executeQuery('
            SELECT
                GROUP_CONCAT(alternatename.isPreferredName) AS isPreferredName,
                countryinfo.iso_alpha2,
                countryinfo.continent,
                continentCodes.geonameid,
                GROUP_CONCAT(alternatename.alternateName) AS alternateName
            FROM
                countryinfo
                LEFT JOIN continentCodes ON continentCodes.code = countryinfo.continent
                JOIN alternatename ON continentCodes.geonameid = alternatename.geonameid AND alternatename.isoLanguage = ?
            GROUP BY
                countryinfo.iso_alpha2,
                countryinfo.continent,
                continentCodes.geonameid
            ORDER BY
                countryinfo.continent
        ', [$locale]);

        while ($row = $result->fetch()) {
            if (!isset($continents[$row['continent']])) {
                $isPrefArray = explode(',', $row['isPreferredName']);
                $alternateNameArray = explode(',', $row['alternateName']);
                $alternateName = $alternateNameArray[0];
                foreach ($alternateNameArray as $i => $name) {
                    if (filter_var($isPrefArray[$i], FILTER_VALIDATE_BOOLEAN)) {
                        $alternateName = $name;
                        break;
                    }
                }
                $continents[$row['continent']] = [
                    'name' => $alternateName,
                    'countries' => [],
                ];
            }
            $continents[$row['continent']]['countries'][$row['iso_alpha2']] = $row['iso_alpha2'];
        }

        return $continents;
    }

    /**
     * @param $locale
     *
     * @return array
     */
    protected function getPossibleCountries($locale)
    {
        $continents = $this->getLocalisedCountryNames('en');

        if ('en' !== $locale) {
            $continents = array_replace_recursive($continents, $this->getLocalisedCountryNames($locale));
        }

        return [
            [
                $continents['AF']['name'] => $continents['AF']['countries'],
                $continents['AS']['name'] => $continents['AS']['countries'],
            ],
            [
                $continents['NA']['name'] => $continents['NA']['countries'],
            ],
            [
                $continents['EU']['name'] => $continents['EU']['countries'],
            ],
            [
                $continents['OC']['name'] => $continents['OC']['countries'],
                $continents['SA']['name'] => $continents['SA']['countries'],
            ],
        ];
    }
}
