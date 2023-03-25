<?php

namespace AppBundle\Service;

use NumberFormatter;
use Symfony\Component\Intl\Intl;
use Symfony\Component\HttpFoundation\Session\Session;
use InvalidArgumentException;

class CurrencyManager
{
    const CACHE_NAMESPACE = 'exchange_rates';
    const CACHE_KEY = 'fxrates';
    const CACHE_TTL = 3600;
    const BASE_CURRENCY = 'USD';
    const SESSION_KEY = 'currency';

    protected $rates = [];
    protected $userPreference;
    protected $currency = null;
    protected $localeFactory;

    /**
     * @var Session
     */
    protected $session;

    /**
     * CurrencyManager constructor.
     *
     * @param $cache
     * @param $db
     * @param $localeFactory
     * @param $securityContext
     * @param $requestStack
     * @param Session $session
     */
    public function __construct(
        $cache,
        $db,
        $localeFactory,
        $securityContext,
        $requestStack,
        Session $session
    ) {
        $this->localeFactory = $localeFactory;
        $this->session = $session;

        // Try and load our rates from the DB
//        $cache->setNamespace(self::CACHE_NAMESPACE);
        $cacheKey = self::CACHE_KEY.'-'.$localeFactory->getCurrentLocale();
        if (false === ($data = $cache->fetch($cacheKey))) {
            $data = $this->populateCache($cacheKey, $db, $cache, self::CACHE_TTL);
        }

        $this->rates = $data;

        if ($securityContext) {
            $token = $securityContext->getToken();
            if ($token && ($user = $token->getUser()) && is_object($user)) {
                $this->userPreference = $user->preferredCurrency;
            }
        }
    }

    /**
     * convert from one currency to another.
     *
     * @param string $fromCode
     * @param string $toCode
     * @param int    $fromAmount
     *
     * @return int|false|null
     */
    public function convert($fromCode, $toCode, $fromAmount)
    {
        if (!$fromAmount) {
            return null;
        }

        if (!isset($this->rates[$fromCode]) || !isset($this->rates[$toCode])) {
            return false;
        }

        $fromRate = $this->rates[$fromCode]['rate'];
        $toRate = $this->rates[$toCode]['rate'];

        // convert into our base currency of USD
        $baseAmount = $fromAmount / $fromRate;

        // Now from USD to the desired rate
        $toAmount = $baseAmount * $toRate;

        return $toAmount;
    }

    /**
     * @return array
     */
    public function getDisplayCurrencies()
    {
        return array_filter($this->rates, function ($el) {
            return (bool) $el['display'];
        });
    }

    /**
     * @return array
     */
    public function getAllCurrencies()
    {
        return $this->rates;
    }

    public function getCurrencyForLocale($locale)
    {
        $locale = strtolower($locale);
        $defaults = [
            'en' => 'USD',
            'es' => 'EUR',
            'de' => 'EUR',
            'pt' => 'EUR',
            'fr' => 'EUR',
            'it' => 'EUR',
            'ru' => 'RUB',
            'zh' => 'CNY',
        ];

        if (!array_key_exists($locale, $defaults)) {
            throw new InvalidArgumentException('Wrong locale ID provided');
        }

        return $defaults[$locale];
    }

    /**
     * setCurrency.
     *
     * @param string $currency
     */
    public function setCurrency($currency)
    {
        $all = $this->getAllCurrencies();

        if (!array_key_exists($currency, $all)) {
            throw new InvalidArgumentException('Wrong currency ID provided');
        }

        $this->session->set(self::SESSION_KEY, $currency);
    }

    /**
     * getCurrency.
     *
     * @return string $currency
     */
    public function getCurrency()
    {
        // save temporary
        if (!$this->currency) {
            $this->currency = $this->session->get(self::SESSION_KEY);

            // save inside session
            if (!$this->currency) {
                $this->session->set(self::SESSION_KEY, $this->currency = $this->getDefaultCurrency());
            }
        }

        return $this->currency;
    }

    /**
     * Returns the currency to use for the current user.
     *
     * Checks the following in order:
     *  - User's preferred currency
     *  - Country Default
     *  - Locale Default
     *  - Base currency
     *
     * @return string The currency ID to use
     */
    public function getDefaultCurrency()
    {
        $country = $this->localeFactory->getClientCountry();
        $currencyFromCountry = $this->getCurrencyForCountry($country);
        $currencyFromLocale = $this->getCurrencyForLocale($this->localeFactory->getCurrentLocale());

        if ($this->userPreference) {
            return $this->userPreference;
        }

        if ($country && $currencyFromCountry) {
            return $currencyFromCountry;
        }

        if ($currencyFromLocale) {
            return $currencyFromLocale;
        }

        return $this::BASE_CURRENCY;
    }

    /**
     * @param $amount
     * @param $toCurrency
     * @param bool|false $period
     * @param string     $fromCurrency
     *
     * @return string
     */
    public function formatPrice($amount, $toCurrency, $period = false, $fromCurrency = 'USD')
    {
        $locale = $this->localeFactory->getCurrentLocale();
        $toCurrency = strtoupper($toCurrency);
        $fromCurrency = strtoupper($fromCurrency);

        // Don't convert currency is we pass in false
        if ($fromCurrency) {
            $amount = $this->convert($fromCurrency, $toCurrency, $amount);
        }

        $fmt = new NumberFormatter($locale, NumberFormatter::DECIMAL);
        $fmt->setAttribute(NumberFormatter::FRACTION_DIGITS, 0);

        if ('BTC' === $toCurrency) {
            $fmt->setAttribute(NumberFormatter::MAX_FRACTION_DIGITS, 8);
        } else {
            $fmt->setAttribute(NumberFormatter::MAX_FRACTION_DIGITS, 0);
        }

        return $toCurrency.' '.$fmt->format($amount);
    }

    /**
     * @param $cacheKey
     * @param $db
     * @param $cache
     * @param int $ttl
     *
     * @return array
     */
    protected function populateCache($cacheKey, $db, $cache, $ttl = 3600)
    {
        $rates = [];
        $result = $db->query('SELECT * FROM currency');

        while ($row = $result->fetch()) {
            $rates[$row['id']] = $row;
        }

        $cache->save($cacheKey, $rates, $ttl);

        return $rates;
    }

    /**
     * @return array
     */
    public function getAvailableCurrencies()
    {
        $current = $this->getCurrency();
        $currencies = [];

        foreach ($this->getAllCurrencies() as $currency) {
            if ($currency['display']) {
                $currency['status'] = $current == $currency['id'] ? 'active' : 'inactive';
                $currencies[] = $currency;
            }
        }

        asort($currencies);

        return $currencies;
    }

    /**
     * @param $countryCode
     *
     * @return bool
     */
    public function getCurrencyForCountry($countryCode)
    {
        $lookup = [
            'AD' => 'EUR',
            'AE' => 'AED',
            'AF' => 'AFN',
            'AG' => 'XCD',
            'AI' => 'XCD',
            'AL' => 'ALL',
            'AM' => 'AMD',
            'AO' => 'AOA',
            'AQ' => '',
            'AR' => 'ARS',
            'AS' => 'USD',
            'AT' => 'EUR',
            'AU' => 'AUD',
            'AW' => 'AWG',
            'AX' => 'EUR',
            'AZ' => 'AZN',
            'BA' => 'BAM',
            'BB' => 'BBD',
            'BD' => 'BDT',
            'BE' => 'EUR',
            'BF' => 'XOF',
            'BG' => 'BGN',
            'BH' => 'BHD',
            'BI' => 'BIF',
            'BJ' => 'XOF',
            'BL' => 'EUR',
            'BM' => 'BMD',
            'BN' => 'BND',
            'BO' => 'BOB',
            'BQ' => 'USD',
            'BR' => 'BRL',
            'BS' => 'BSD',
            'BT' => 'BTN',
            'BV' => 'NOK',
            'BW' => 'BWP',
            'BY' => 'BYR',
            'BZ' => 'BZD',
            'CA' => 'CAD',
            'CC' => 'AUD',
            'CD' => 'CDF',
            'CF' => 'XAF',
            'CG' => 'XAF',
            'CH' => 'CHF',
            'CI' => 'XOF',
            'CK' => 'NZD',
            'CL' => 'CLP',
            'CM' => 'XAF',
            'CN' => 'CNY',
            'CO' => 'COP',
            'CR' => 'CRC',
            'CU' => 'CUP',
            'CV' => 'CVE',
            'CW' => 'ANG',
            'CX' => 'AUD',
            'CY' => 'EUR',
            'CZ' => 'CZK',
            'DE' => 'EUR',
            'DJ' => 'DJF',
            'DK' => 'DKK',
            'DM' => 'XCD',
            'DO' => 'DOP',
            'DZ' => 'DZD',
            'EC' => 'USD',
            'EE' => 'EUR',
            'EG' => 'EGP',
            'EH' => 'MAD',
            'ER' => 'ERN',
            'ES' => 'EUR',
            'ET' => 'ETB',
            'FI' => 'EUR',
            'FJ' => 'FJD',
            'FK' => 'FKP',
            'FM' => 'USD',
            'FO' => 'DKK',
            'FR' => 'EUR',
            'GA' => 'XAF',
            'GB' => 'GBP',
            'GD' => 'XCD',
            'GE' => 'GEL',
            'GF' => 'EUR',
            'GG' => 'GBP',
            'GH' => 'GHS',
            'GI' => 'GIP',
            'GL' => 'DKK',
            'GM' => 'GMD',
            'GN' => 'GNF',
            'GP' => 'EUR',
            'GQ' => 'XAF',
            'GR' => 'EUR',
            'GS' => 'GBP',
            'GT' => 'GTQ',
            'GU' => 'USD',
            'GW' => 'XOF',
            'GY' => 'GYD',
            'HK' => 'HKD',
            'HM' => 'AUD',
            'HN' => 'HNL',
            'HR' => 'HRK',
            'HT' => 'HTG',
            'HU' => 'HUF',
            'ID' => 'IDR',
            'IE' => 'EUR',
            'IL' => 'ILS',
            'IM' => 'GBP',
            'IN' => 'INR',
            'IO' => 'USD',
            'IQ' => 'IQD',
            'IR' => 'IRR',
            'IS' => 'ISK',
            'IT' => 'EUR',
            'JE' => 'GBP',
            'JM' => 'JMD',
            'JO' => 'JOD',
            'JP' => 'JPY',
            'KE' => 'KES',
            'KG' => 'KGS',
            'KH' => 'KHR',
            'KI' => 'AUD',
            'KM' => 'KMF',
            'KN' => 'XCD',
            'KP' => 'KPW',
            'KR' => 'KRW',
            'XK' => 'EUR',
            'KW' => 'KWD',
            'KY' => 'KYD',
            'KZ' => 'KZT',
            'LA' => 'LAK',
            'LB' => 'LBP',
            'LC' => 'XCD',
            'LI' => 'CHF',
            'LK' => 'LKR',
            'LR' => 'LRD',
            'LS' => 'LSL',
            'LT' => 'LTL',
            'LU' => 'EUR',
            'LV' => 'LVL',
            'LY' => 'LYD',
            'MA' => 'MAD',
            'MC' => 'EUR',
            'MD' => 'MDL',
            'ME' => 'EUR',
            'MF' => 'EUR',
            'MG' => 'MGA',
            'MH' => 'USD',
            'MK' => 'MKD',
            'ML' => 'XOF',
            'MM' => 'MMK',
            'MN' => 'MNT',
            'MO' => 'MOP',
            'MP' => 'USD',
            'MQ' => 'EUR',
            'MR' => 'MRO',
            'MS' => 'XCD',
            'MT' => 'EUR',
            'MU' => 'MUR',
            'MV' => 'MVR',
            'MW' => 'MWK',
            'MX' => 'MXN',
            'MY' => 'MYR',
            'MZ' => 'MZN',
            'NA' => 'NAD',
            'NC' => 'XPF',
            'NE' => 'XOF',
            'NF' => 'AUD',
            'NG' => 'NGN',
            'NI' => 'NIO',
            'NL' => 'EUR',
            'NO' => 'NOK',
            'NP' => 'NPR',
            'NR' => 'AUD',
            'NU' => 'NZD',
            'NZ' => 'NZD',
            'OM' => 'OMR',
            'PA' => 'PAB',
            'PE' => 'PEN',
            'PF' => 'XPF',
            'PG' => 'PGK',
            'PH' => 'PHP',
            'PK' => 'PKR',
            'PL' => 'PLN',
            'PM' => 'EUR',
            'PN' => 'NZD',
            'PR' => 'USD',
            'PS' => 'ILS',
            'PT' => 'EUR',
            'PW' => 'USD',
            'PY' => 'PYG',
            'QA' => 'QAR',
            'RE' => 'EUR',
            'RO' => 'RON',
            'RS' => 'RSD',
            'RU' => 'RUB',
            'RW' => 'RWF',
            'SA' => 'SAR',
            'SB' => 'SBD',
            'SC' => 'SCR',
            'SD' => 'SDG',
            'SS' => 'SSP',
            'SE' => 'SEK',
            'SG' => 'SGD',
            'SH' => 'SHP',
            'SI' => 'EUR',
            'SJ' => 'NOK',
            'SK' => 'EUR',
            'SL' => 'SLL',
            'SM' => 'EUR',
            'SN' => 'XOF',
            'SO' => 'SOS',
            'SR' => 'SRD',
            'ST' => 'STD',
            'SV' => 'USD',
            'SX' => 'ANG',
            'SY' => 'SYP',
            'SZ' => 'SZL',
            'TC' => 'USD',
            'TD' => 'XAF',
            'TF' => 'EUR',
            'TG' => 'XOF',
            'TH' => 'THB',
            'TJ' => 'TJS',
            'TK' => 'NZD',
            'TL' => 'USD',
            'TM' => 'TMT',
            'TN' => 'TND',
            'TO' => 'TOP',
            'TR' => 'TRY',
            'TT' => 'TTD',
            'TV' => 'AUD',
            'TW' => 'TWD',
            'TZ' => 'TZS',
            'UA' => 'UAH',
            'UG' => 'UGX',
            'UM' => 'USD',
            'US' => 'USD',
            'UY' => 'UYU',
            'UZ' => 'UZS',
            'VA' => 'EUR',
            'VC' => 'XCD',
            'VE' => 'VEF',
            'VG' => 'USD',
            'VI' => 'USD',
            'VN' => 'VND',
            'VU' => 'VUV',
            'WF' => 'XPF',
            'WS' => 'WST',
            'YE' => 'YER',
            'YT' => 'EUR',
            'ZA' => 'ZAR',
            'ZM' => 'ZMK',
            'ZW' => 'ZWL',
            'CS' => 'RSD',
            'AN' => 'ANG',
        ];

        return isset($lookup[$countryCode]) ? $lookup[$countryCode] : false;
    }
}
