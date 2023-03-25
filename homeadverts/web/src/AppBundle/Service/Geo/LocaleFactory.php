<?php

namespace AppBundle\Service\Geo;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Request;

class LocaleFactory
{
    /**
     * @var Request
     */
    protected $request;

    /**
     * @var LocaleFactory
     */
    protected $localeFactory;

    /**
     * @var array
     */
    protected $locales;

    /**
     * @param RequestStack $requestStack
     * @param IpToCountry  $ipToCountry
     * @param array        $locales
     */
    public function __construct(RequestStack $requestStack, IpToCountry $ipToCountry, array $locales)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->ipToCountry = $ipToCountry;
        $this->locales = $locales;
    }

    /**
     * @return array
     */
    public function getAvailableLocales()
    {
        $current = $this->getCurrentLocale();
        $locales = [];

        foreach ($this->locales as $language) {
            $language['status'] = $language['iso_code'] == $current ? 'active' : 'inactive';
            $locales[] = $language;
        }

        return $locales;
    }

    /**
     * Get the name of the locale from the current request or the default
     * if there is no current request.
     *
     * @return string
     */
    public function getCurrentLocale()
    {
        if ($this->request) {
            return $this->request->getLocale();
        }

        return substr(\Locale::getDefault(), 0, 2);
    }

    /**
     * @return array
     */
    public function getCurrentLocaleDetails()
    {
        return $this->locales[$this->getCurrentLocale()];
    }

    /**
     * Get theclient IP from the current request or null
     * if there is no current request.
     *
     * @return string
     */
    public function getClientIp()
    {
        if ($this->request) {
            return $this->request->getClientIp();
        }

        return;
    }

    /**
     * Get the country of the current visitor via IP.
     *
     * This is stored in the session so that it's only geocoded once per visit.
     *
     * @return string
     */
    public function getClientCountry()
    {
        if (!$this->request) {
            return IpToCountry::UNKNOWN_COUNTRY;
        }

        $key = 'locale.iso_code';
        $session = $this->request->getSession();

        if (!($country = $session->get($key))) {
            $country = $this->ipToCountry->getCountry($this->request->getClientIp());
            $session->set($key, $country);
        }

        return $country;
    }
}
