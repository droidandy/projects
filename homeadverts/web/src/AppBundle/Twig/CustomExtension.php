<?php

namespace AppBundle\Twig;

use AppBundle\Form\Type\Filters;
use Symfony\Component\Form\Form;
use Symfony\Component\Locale\Locale;
use NumberFormatter;
use AppBundle\Entity\User\User;
use Cocur\Slugify\Slugify;
use Symfony\Component\Routing\RouterInterface;
use libphonenumber\PhoneNumberFormat;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Entity\Embeddable\Address;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Twig_Extension;

class CustomExtension extends Twig_Extension
{
    /**
     * @var ContainerInterface
     */
    protected $container;
    protected $router;
    protected $params;

    /**
     * ImageHelper constructor.
     *
     * @param ContainerInterface $container
     * @param RouterInterface    $router
     */
    public function __construct($container, RouterInterface $router)
    {
        $this->container = $container;
        $this->params = $this->container->getParameterBag()->all();
        $this->router = $router;
    }

    /**
     * define our custom filters.
     *
     * @return array
     */
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('type2name', array($this, 'propertyTypeToName')),
            new \Twig_SimpleFilter('convert_price', array($this, 'convertPrice')),
            new \Twig_SimpleFilter('format_currency', array($this, 'formatCurrency')),
            new \Twig_SimpleFilter('format_number', array($this, 'formatNumber')),
            new \Twig_SimpleFilter('country_name', array($this, 'countryName')),
            new \Twig_SimpleFilter('json_decode', array($this, 'jsonDecode')),
            new \Twig_SimpleFilter('choices_to_array', array($this, 'choicesToArray')),
            new \Twig_SimpleFilter('format_property_type', array($this, 'formatPropertyType')),
            new \Twig_SimpleFilter('excerpt', array($this, 'excerpt')),
            new \Twig_SimpleFilter('link', array($this, 'linkLinks')),
            new \Twig_SimpleFilter('hash', array($this, 'linkHashes')),
            new \Twig_SimpleFilter('email', array($this, 'linkEmail')),
            new \Twig_SimpleFilter('mention', array($this, 'linkMentions')),
            new \Twig_SimpleFilter('trim', array($this, 'trim')),
            new \Twig_SimpleFilter('bool_text', array($this, 'boolText')),
            new \Twig_SimpleFilter('month_name', array($this, 'monthName')),
            new \Twig_SimpleFilter('remote_file_exists', array($this, 'remoteFileExists')),
            new \Twig_SimpleFilter('slug', array($this, 'slug')),
            new \Twig_SimpleFilter('full_address', array($this, 'fullAddress')),
            new \Twig_SimpleFilter('process_user_languages', array($this, 'processUserLanguages')),
            new \Twig_SimpleFilter('format_date', array($this, 'formatDate')),
            new \Twig_SimpleFilter('filter', 'array_filter'),
            new \Twig_SimpleFilter('unescape', array($this, 'unescape')),
            new \Twig_SimpleFilter('confirm_external_url', array($this, 'confirmExternalUrl')),
            new \Twig_SimpleFilter('translate_market', array($this, 'translateMarket')),
            new \Twig_SimpleFilter('is_property_active', array($this, 'isPropertyActive')),
            new \Twig_SimpleFilter('format_area', array($this, 'formatArea')),
            new \Twig_SimpleFilter('shorten_price', array($this, 'shortenPrice')),
            new \Twig_SimpleFilter('intl_telephone_format', array($this, 'intlTelephoneFormat')),
        );
    }

    /**
     * Define our custom funtions.
     *
     * Please note: the return array must be in a different format to work properly and register the functions
     *
     * @return array
     */
    public function getFunctions()
    {
        return array(
            'asset_url' => new \Twig_Function_Method($this, 'assetUrl'),
            'image_path' => new \Twig_Function_Method($this, 'getImagePath'),
            'image_cdn_path' => new \Twig_Function_Method($this, 'getImageCdnPath'),
            'card_image' => new \Twig_Function_Method($this, 'cardImage'),
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getTests()
    {
        return [
            new \Twig_SimpleTest('filter_default', [$this, 'filterDefault']),
        ];
    }

    /**
     * is the property active.
     *
     * @param array $esArray An array of data from elasticsearch
     *
     * @return bool
     */
    public function isPropertyActive($esArray)
    {
        if (isset($esArray['_source'])) {
            $esArray = $esArray['_source'];
        }

        if (Property::STATUS_ACTIVE === $esArray['status']) {
            return true;
        }

        return false;
    }

    /**
     * Outut the market from the ES bool.
     *
     * @param bool $rental
     *
     * @return string
     */
    public function translateMarket($rental)
    {
        return (false === $rental) ? 'for-sale' : 'to-rent';
    }

    /**
     * confirm that a url will open an external page.
     *
     * @param string $url
     *
     * @return string
     */
    public function confirmExternalUrl($url)
    {
        if (0 === strpos($url, 'http://')) {
            return $url;
        }
        if (0 === strpos($url, 'https://')) {
            return $url;
        }

        return 'http://'.$url;
    }

    /**
     * return a value that has been unespcaed, rather than using 'raw' which seems a tad dangerous with user content.
     *
     * @param string $value
     *
     * @return string
     */
    public function unescape($value)
    {
        return html_entity_decode($value);
    }

    /**
     * Formats a date using the current locale.
     *
     * @param mixed $date
     *
     * @return string The formatted date
     */
    public function formatDate($date)
    {
        $formatter = new \IntlDateFormatter(
            $this->container->get('locale_factory')->getCurrentLocale(),
            \IntlDateFormatter::SHORT,
            \IntlDateFormatter::NONE
        );

        $date = ('now' === $date) ? time() : $date;

        return $formatter->format($date);
    }

    /**
     * process the users languages into a string.
     *
     * @param array $array
     *
     * @return string
     */
    public function processUserLanguages($user, $delimiter = ' ', $limit = 3, $suffix = '...')
    {
        //if we have a User object we are on the details page
        if ($user instanceof User) {
            $langs = trim(($user->primaryLanguage ?: '').$delimiter.($user->spokenLanguages ?: ''));
        } else {
            //if we just got passed the higher level ES collection data
            if (isset($user['_source'])) {
                $user = $user['_source'];
            }

            $langs = trim(($user['primaryLanguage'] ?: '').$delimiter.($user['spokenLanguages'] ?: ''));
        }

        if ('' === $langs) {
            return false;
        }

        $langs = explode($delimiter, $langs);

        //if the number in the array is less than the number we ideally want, return the max
        //if we just want to return them all, throw -1 into the limit argument
        $offset = count($langs) < $limit && '-1' !== $limit ? count($langs) : $limit;

        $langs = array_unique($langs);

        //return the first couple
        return implode(', ', array_slice($langs, 0, $offset)).$suffix;
    }

    /**
     * Create the users full address.
     *
     * @return string The full address
     */
    public function fullAddress($user, $glue = ', ')
    {
        if ($user instanceof \AppBundle\Entity\Embeddable\Address) {
            $parts = array_filter([$user->street, $user->aptBldg, $user->townCity, $user->stateCounty, $user->zip]);

            return implode(', ', $parts);
        }

        $address = [];
        foreach (['address1', 'address2', 'townCity', 'country', 'postcode'] as $k) {
            //if we have an es array
            if (isset($user['_id'])) {
                if (!isset($user['_source'][$k]) || '' == trim($user['_source'][$k])) {
                    continue;
                }
                $address[] = $user['_source'][$k];

                continue;
            }

            if ('' == trim($user->{$k})) {
                continue;
            }
            $address[] = $user->{$k};
        }

        return implode(', ', $address);
    }

    /**
     * Create a slug for this user.
     *
     * Please note: This function should match that in the UserHelper class
     *
     * @return string The slug
     */
    public function slug($user)
    {
        //if we have an es array
        if (is_array($user)) {
            if (isset($user['_id'])) {
                $user = (isset($user['_source']) ? $user['_source'] : $user);
            }

            return (new Slugify())->slugify($user['name'].('' != $user['companyName'] ? '-'.$user['companyName'] : ''));
        }

        return (new Slugify())->slugify($user->name.('' !== trim($user->companyName) ? '-'.$user->companyName : ''));
    }

    /**
     * Check if a remove file exists.
     *
     * @param string $url
     *
     * @return bool
     */
    public function remoteFileExists($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);

        // don't download content
        curl_setopt($ch, CURLOPT_NOBODY, 1);
        curl_setopt($ch, CURLOPT_FAILONERROR, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        if (false !== curl_exec($ch)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * turns a month number into its name.
     *
     * @param int $month
     *
     * @return string
     */
    public function monthName($month)
    {
        return date('M', mktime(date('H'), date('i'), date('s'), $month));
    }

    /**
     * turns a bool into a text representation.
     *
     * @param bool $bool
     *
     * @return string
     */
    public function boolText($bool)
    {
        return $bool ? 'true' : 'false';
    }

    /**
     * trim a string.
     *
     * @param string $string
     *
     * @return string
     */
    public function trim($string)
    {
        return trim($string);
    }

    /**
     * quick and dirty adding of email html to replace email addresses within text.
     *
     * @param string $string The string to be parsed
     *
     * @return string
     */
    public function linkEmail($string)
    {
        return $string;

        $regex = '/(\S+@\S+\.\S+)/';
        $replace = '<a href="mailto:$1">$1</a>';

        return preg_replace($regex, $replace, $string);
    }

    /**
     * Link hash tags within text.
     *
     * @param string $str    The String to parse
     * @param string $client The client service we are parsing
     *
     * @return string
     */
    public function linkHashes($str, $client)
    {
        switch (strtolower($client)) {
            case 'twitter':
                return preg_replace("/#(\w+)/i", '<a target="_blank" href="https://twitter.com/search?q=$1&src=hash">$0</a>', $str);

            case 'gplus':
                return preg_replace("/#(\w+)/i", '<a target="_blank" href="https://plus.google.com/s/%23$1">$0</a>', $str);

            default:
                return $str;
                break;
        }
    }

    /**
     * link up mentions.
     *
     * @param string $str    The String to parse
     * @param string $client The client service we are parsing
     *
     * @return string
     */
    public function linkMentions($str, $client)
    {
        switch (strtolower($client)) {
            case 'twitter':
                $url = 'https://twitter.com';
                break;

            case 'gplus':
                $url = 'https://plus.google.com';
                break;

            default:
                return $str;
                break;
        }

        return preg_replace("/@(\w+)/i", '<a target="_blank" href="'.$url.'/$1">$0</a>', $str);
    }

    /**
     * Link up href links.
     *
     * @param string $str The string to the parse
     *
     * @return string
     */
    public function linkLinks($str)
    {
        return preg_replace('@(https?://([-\w\.]+[-\w])+(:\d+)?(/([\w/_\.#-]*(\?\S+)?[^\.\s])?)?)@', '<a href="$1" target="_blank">$1</a>', $str);
    }

    /**
     * shorten a string by the number of words required.
     *
     * @param string $string The string to be shortened
     * @param int    $count  The number words required
     *
     * @return string
     */
    public function excerpt($string, $count)
    {
        return implode(' ', array_slice(explode(' ', strip_tags($string)), 0, $count)).'...';
    }

    /**
     * Get the router context. This will default to settings in parameters.yml if there is no active request.
     *
     * router.request_context.base_url is currently defined to start from within the assets folder
     *
     * @param string $path The relative url to the asset
     *
     * @return string
     */
    public function assetUrl($path)
    {
        $context = $this->router->getContext();
        $host = $context->getScheme().'://'.$context->getHost();

        //check if we need to add the port to the url (same setup for dev and production)
        $route = parse_url($this->container->get('request')->getUri());
        if (isset($route['port'])) {
            $host .= ':'.$route['port'];
        }

        return $host.'/assets'.$path;
    }

    /**
     * Get path of url for image.
     *
     * @param string $image The relative url to the asset
     *
     * @return string
     */
    public function getImagePath($image)
    {
        return $this->container->get('ha.image_helper')->getImagePath($image);
    }

    /**
     * @param string
     *
     * @return string
     */
    public function getImageCdnPath($image)
    {
        return  $this->container->get('ha.image_helper')->getCdnImagePath($image);
    }

    /**
     * Decode a property type code into human readable.
     *
     * @param int $type The code
     *
     * @return string
     */
    public function formatPropertyType($type)
    {
        if ('' == trim($type) || 0 == (int) $type) {
            return 'All';
        }

        $tr = $this->container->get('translator');
        $types = array(
            100 => $tr->trans('search.filter.type.detatched'),
            200 => $tr->trans('search.filter.type.semi'),
            300 => $tr->trans('search.filter.type.flat'),
            400 => $tr->trans('search.filter.type.town'),
            500 => $tr->trans('search.filter.type.movable'),
            600 => $tr->trans('search.filter.type.character'),
            700 => $tr->trans('search.filter.type.commercial'),
            800 => $tr->trans('search.filter.type.farm'),
            900 => $tr->trans('search.filter.type.land'),
            1000 => $tr->trans('search.filter.type.other'),
        );

        return ucfirst($types[$type]);
    }

    /**
     * decode a json string.
     *
     * @param string $str
     *
     * @return object
     */
    public function jsonDecode($str)
    {
        return json_decode($str);
    }

    /**
     * decode a json string.
     *
     * @param Form $choiceField
     *
     * @return array
     */
    public function choicesToArray(Form $choiceField)
    {
        return $choiceField
            ->getConfig()
            ->getOption('choice_list')
            ->getStructuredValues()
        ;
    }

    /**
     * return the type of a property from its integer value.
     *
     * @param int $propertyTypeID
     *
     * @return string
     */
    public function propertyTypeToName($propertyTypeID)
    {
        $keys = [
            PropertyTypes::DETACHED => 'search.filter.type.detatched',
            PropertyTypes::SEMI_DETACHED => 'search.filter.type.semi',
            PropertyTypes::APARTMENT => 'search.filter.type.flat',
            PropertyTypes::TOWNHOUSE => 'search.filter.type.town',
            PropertyTypes::MOVABLE => 'search.filter.type.movable',
            PropertyTypes::CHARACTER => 'search.filter.type.character',
            PropertyTypes::COMMERCIAL => 'search.filter.type.commercial',
            PropertyTypes::FARM => 'search.filter.type.farm',
            PropertyTypes::LAND => 'search.filter.type.land',
            PropertyTypes::OTHER => 'search.filter.type.other',
            PropertyTypes::UNKNOWN => 'search.filter.type.unknown',
        ];

        $key = isset($keys[$propertyTypeID]) ? $keys[$propertyTypeID] : $keys[PropertyTypes::UNKNOWN];

        return $this->container->get('translator')->trans($key);
    }

    // This isn't the cleanest way, but means that the translation extraction
    // tool can actually handle it.
    protected function translatePricePeriod($period)
    {
        $translator = $this->container->get('translator');

        // For legacy sake, since the new importer will validate these strings,
        // we should try and guess the intended period
        $period = (false === strpos($period, 'w')) ? $period : 'weekly';
        $period = (false === strpos($period, 'm')) ? $period : 'monthly';
        $period = (false === strpos($period, 'd')) ? $period : 'daily';

        switch ($period) {
            case 'weekly':   return $translator->trans('site.period.weekly');
            case 'monthly':  return $translator->trans('site.period.monthly');
            case 'daily':    return $translator->trans('site.period.daily');
            default:        return '';
        }
    }

    public function formatCurrency($amount, $currencyID)
    {
        $amount /= 100;
        $currencyID = strtoupper($currencyID);
        $locale = $this->container->get('locale_factory')->getCurrentLocale();

        $fmt = new NumberFormatter($locale, NumberFormatter::CURRENCY);

        return $fmt->formatCurrency($amount, $currencyID);
    }

    /**
     * reduce a large number down.
     *
     * @param int    $price    The price to convert
     * @param string $currency Three char code
     *
     * @return string
     */
    public function shortenPrice($price, $currency, $locale = false)
    {
        if (!$locale) {
            $locale = $this->container->get('locale_factory')->getCurrentLocale();
        }
        $tr = $this->container->get('translator');

        $ranges = [
            1000000 => [$tr->trans('alerts.millions'), 1000000],
            10000 => [$tr->trans('alerts.thousands'), 1000],
        ];

        foreach ($ranges as $key => $value) {
            if ($price >= $key) {
                return round($price / $value[1], 2).$value[0];
            }
        }

        return $price;
    }

    public function formatNumber($amount)
    {
        return number_format($amount, 0);
    }

    public function countryName($countryCode, $locale = false)
    {
        if (!$locale) {
            $locale = $this->container->get('locale_factory')->getCurrentLocale();
        }

        $c = Locale::getDisplayCountries($locale);

        return array_key_exists($countryCode, $c) ? $c[$countryCode] : $countryCode;
    }

    protected function trimSearchLocation($locationName, $propertyParts)
    {
        $searchParts = array_filter(array_map('trim', explode(',', $locationName)));

        foreach ($searchParts as $searchPart) {
            $name = $searchPart;
            $found = false;
            $next = false;
            $i = 0;
            $propertyParts = array_reverse(array_filter(array_reverse($propertyParts), function ($item) use ($name, &$next, &$found, &$i) {
                if ($next) {
                    $found = true;
                }

                if (!$found && strtolower($item['name']) === strtolower($name)) {
                    if (0 === $i) {
                        $next = true;
                    } else {
                        $found = true;
                    }
                }

                ++$i;

                return !$found;
            }));
        }

        return $propertyParts;
    }

    public function cardImage($card)
    {
        switch ($card->type) {
            case 'Visa':
                $image = 'visa';
                break;
            case 'MasterCard':
                $image = 'mastercard';
                break;
            case 'American Express':
                $image = 'amex';
                break;
            case 'Discover':
                $image = 'discover';
                break;
            default:
                $image = 'generic_1';
        }

        return '/assets/images/credit_card_icons/'.$image.'.png';
    }

    public function formatArea($number)
    {
        $locale = $this->container->get('locale_factory')->getCurrentLocale();
        $session = $this->container->get('request_stack')->getCurrentRequest()->getSession();
        $country = $this->container->get('locale_factory')->getClientCountry();

        // value is always passed in as meter squared. Decide if we need to format as ft
        if ('US' === $country || 'en_US' === $locale) {
            $number = $this->container->get('ha.locale_helper')->squareMetresToSquareFeet($number);
            $unit = ' sq.ft';
        } else {
            $unit = ' sq.m';
        }

        $fmt = new NumberFormatter($locale, NumberFormatter::DECIMAL);
        $fmt->setAttribute(NumberFormatter::ROUND_HALFUP, 0);

        return $fmt->format($number).$unit;
    }

    /**
     * @param string $number
     * @param string $country
     *
     * @return string
     */
    public function intlTelephoneFormat($number, $country)
    {
        if (!$number) {
            return '';
        }

        $util = $this
            ->container
            ->get('libphonenumber.phone_number_util');

        try {
            $phoneNumber = $util->parse($number, $country);
        } catch (\Exception $e) {
            return $number;
        }

        return $util->format($phoneNumber, PhoneNumberFormat::INTERNATIONAL);
    }

    /**
     * @param mixed $value
     *
     * @return bool
     */
    public function filterDefault($value)
    {
        return in_array($value, Filters::defaultValues(), true);
    }

    /**
     * Give our class a name within symfony.
     *
     * @return string
     */
    public function getName()
    {
        return 'custom_extension';
    }
}
