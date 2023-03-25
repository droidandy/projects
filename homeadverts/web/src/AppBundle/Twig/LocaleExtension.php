<?php

namespace AppBundle\Twig;

use Twig_Extension;
use AppBundle\Service\Geo\LocaleFactory;

class LocaleExtension extends Twig_Extension
{
    /**
     * @var LocaleFactory
     */
    protected $localeFactory;

    /**
     * LocaleExtension constructor.
     *
     * @param LocaleFactory $localeFactory
     */
    public function __construct(LocaleFactory $localeFactory)
    {
        $this->localeFactory = $localeFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return array(
            'availableLocales' => new \Twig_Function_Method($this, 'availableLocales'),
            'currentLocale' => new \Twig_Function_Method($this, 'currentLocale'),
        );
    }

    /**
     * @return mixed
     */
    public function availableLocales()
    {
        return $this->localeFactory->getAvailableLocales();
    }

    /**
     * @return mixed
     */
    public function currentLocale()
    {
        return $this->localeFactory->getCurrentLocaleDetails();
    }

    /**
     * The extension name.
     *
     * @return string
     */
    public function getName()
    {
        return 'locale_extension';
    }
}
