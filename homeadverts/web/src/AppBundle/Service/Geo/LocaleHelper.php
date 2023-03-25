<?php

namespace AppBundle\Service\Geo;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Intl\Intl;

class LocaleHelper
{
    const METRE_FEET_RATIO = 3.2808399;
    const SQUARE_METRE_FEET_RATIO = 10.76391041671;
    const SQUARE_METRE_ACRE_RATIO = 0.000247105;
    const SQUARE_METRE_HECTARE_RATIO = 0.0001;
    const SQUARE_METRE_PING_RATIO = 0.302571860817;

    public $googleLanguages = [
        'af' => 'Afrikaans',
        'sq' => 'Albanian',
        'ar' => 'Arabic',
        'az' => 'Azerbaijani',
        'eu' => 'Basque',
        'bn' => 'Bengali',
        'be' => 'Belarusian',
        'bg' => 'Bulgarian',
        'ca' => 'Catalan',
        'zh' => 'Chinese',
        'hr' => 'Croatian',
        'cs' => 'Czech',
        'da' => 'Danish',
        'nl' => 'Dutch',
        'en' => 'English',
        'eo' => 'Esperanto',
        'et' => 'Estonian',
        'tl' => 'Filipino',
        'fi' => 'Finnish',
        'fr' => 'French',
        'gl' => 'Galician',
        'ka' => 'Georgian',
        'de' => 'German',
        'el' => 'Greek',
        'gu' => 'Gujarati',
        'ht' => 'Haitian Creole',
        'he' => 'Hebrew',
        'hi' => 'Hindi',
        'hu' => 'Hungarian',
        'is' => 'Icelandic',
        'id' => 'Indonesian',
        'ga' => 'Irish',
        'it' => 'Italian',
        'ja' => 'Japanese',
        'kn' => 'Kannada',
        'ko' => 'Korean',
        'la' => 'Latin',
        'lv' => 'Latvian',
        'lt' => 'Lithuanian',
        'mk' => 'Macedonian',
        'ms' => 'Malay',
        'mt' => 'Maltese',
        'no' => 'Norwegian',
        'fa' => 'Persian',
        'pl' => 'Polish',
        'pt' => 'Portuguese',
        'ro' => 'Romanian',
        'ru' => 'Russian',
        'sr' => 'Serbian',
        'sk' => 'Slovak',
        'sl' => 'Slovenian',
        'es' => 'Spanish',
        'sw' => 'Swahili',
        'sv' => 'Swedish',
        'ta' => 'Tamil',
        'te' => 'Telugu',
        'th' => 'Thai',
        'tr' => 'Turkish',
        'uk' => 'Ukrainian',
        'ur' => 'Urdu',
        'vi' => 'Vietnamese',
        'cy' => 'Welsh',
        'yi' => 'Yiddish',
    ];

    /**
     * @var Container
     */
    protected $container;

    /**
     * @var RequestStack
     */
    protected $requestStack;

    /**
     * LocaleHelper constructor.
     *
     * @param Container    $container
     * @param RequestStack $requestStack
     */
    public function __construct(Container $container, RequestStack $requestStack)
    {
        $this->container = $container;
        $this->requestStack = $requestStack;
    }

    /**
     * Return the languages the i18l routing bundle suports and is setup for.
     *
     * @param bool $getInLanguage
     *
     * @return array
     */
    public function getAvailableLanguages($getInLanguage = true)
    {
        $langs = ['en'];

        $output = [];
        foreach ($langs as $lang) {
            $loc = $getInLanguage
                ? $lang
                : $this->requestStack->getCurrentRequest()->getLocale()
            ;
            $output[$lang] = \Locale::getDisplayLanguage($lang, $loc);
        }

        return $output;
    }


    public function squareFeetToSquareMetres($ft)
    {
        return $ft / self::SQUARE_METRE_FEET_RATIO;
    }

    public function squareMetresToSquareFeet($m)
    {
        return $m * self::SQUARE_METRE_FEET_RATIO;
    }

    public function squareMetresToAcres($ac)
    {
        return $ac * self::SQUARE_METRE_ACRE_RATIO;
    }

    public function acresToSquareMetres($ac)
    {
        return $ac / self::SQUARE_METRE_ACRE_RATIO;
    }

    public function squareMetresToHectares($sm)
    {
        return $sm * self::SQUARE_METRE_HECTARE_RATIO;
    }

    public function hectaresToSquareMetres($ha)
    {
        return $ha / self::SQUARE_METRE_HECTARE_RATIO;
    }

    public function squareMetresToPings($sm)
    {
        return $sm * self::SQUARE_METRE_PING_RATIO;
    }

    public function pingsToSquareMetres($pn)
    {
        return $pn / self::SQUARE_METRE_PING_RATIO;
    }

    public function feetToMetres($ft)
    {
        return $ft / self::METRE_FEET_RATIO;
    }

    public function metresToFeet($m)
    {
        return $m * self::METRE_FEET_RATIO;
    }
}
