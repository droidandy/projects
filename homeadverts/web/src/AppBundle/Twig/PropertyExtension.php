<?php

namespace AppBundle\Twig;

use Twig_Extension;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Service\CurrencyManager;
use AppBundle\Entity\Property\Property;
use AppBundle\Service\Paginator;
use AppBundle\Service\PropertyService;
use AppBundle\Service\LocationService;

class PropertyExtension extends Twig_Extension
{
    /**
     * @var Request
     */
    protected $request;
    /**
     * @var CurrencyManager
     */
    protected $currencyManager;
    /**
     * @var PropertyService
     */
    protected $propertyService;
    /**
     * @var Paginator
     */
    protected $paginator;
    /**
     * @var LocationService
     */
    protected $locationService;

    /**
     * @param RequestStack    $requestStack
     * @param CurrencyManager $currencyManager
     * @param PropertyService $propertyService
     * @param LocationService $location
     * @param Paginator       $paginator
     */
    public function __construct(
        RequestStack $requestStack,
        CurrencyManager $currencyManager,
        PropertyService $propertyService,
        LocationService $locationService,
        Paginator $paginator
    ) {
        $this->request = $requestStack->getCurrentRequest();
        $this->currencyManager = $currencyManager;
        $this->propertyService = $propertyService;
        $this->locationService = $locationService;
        $this->paginator = $paginator;
    }

    /**
     * @return array
     */
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('property_carousel_photos', array($this, 'carouselPhotos')),
            new \Twig_SimpleFilter('property_build_gallery', array($this, 'buildGallery')),
            new \Twig_SimpleFilter('property_thumbnail', array($this, 'propertyThumbnail')),
            new \Twig_SimpleFilter('property_subtitle', array($this, 'propertySubtitle')),
            new \Twig_SimpleFilter('property_price', array($this, 'formatPropertyPrice')),
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return array(
            'property_row_limit' => new \Twig_Function_Method($this, 'propertyRowLimit'),
            'property_total_published' => new \Twig_Function_Method($this, 'propertyTotalPublished'),
            'location_total' => new \Twig_Function_Method($this, 'locationTotal'),
        );
    }

    /**
     * @return int
     */
    public function propertyRowLimit()
    {
        return $this->paginator->getRowLimit();
    }

    /**
     * @return int
     */
    public function locationTotal()
    {
        return $this->locationService->getTotalLocationsUsingCache();
    }

    /**
     * @return int
     */
    public function propertyTotalPublished()
    {
        return $this->propertyService->getTotalPublishedPropertiesUsingCache();
    }

    /**
     * @param Property $property
     * @param string $thumbnail
     *
     * @return string
     *
     * @throws \Exception
     */
    public function propertyThumbnail(Property $property, string $thumbnail = Property::FILTER_THUMBNAIL_LARGE)
    {
        return $this->propertyService->getPropertyThumbnail($property, $thumbnail);
    }

    /**
     * @param Property $property
     *
     * @return array
     */
    public function carouselPhotos(Property $property)
    {
        return $this->propertyService->buildCarousel($property);
    }

    /**
     * @param Property $property
     * @param int      $offset
     * @param int      $length
     *
     * @return string
     */
    public function buildGallery(Property $property, int $offset = 1, int $length = 4)
    {
        return $this->propertyService->buildGallery($property, $offset, $length);
    }

    /**
     * @param Property $property
     *
     * @return array
     */
    public function propertySubtitle(Property $property)
    {
        $isSearch = strpos($this->request->getUri(), 'property/search');
        $subtitle = $property->getAddress()->getTownCity();

        if ($isSearch) {
            $subtitle .= ', '.$property->getAddress()->getStateCounty();
        } else {
            $subtitle .= ', '.$property->getAddress()->getCountry();
        }

        if ($property->isPriceHidden()) {
            $subtitle .= ' - Price On Application';
        } else {
            $subtitle .= ' - '.$this->formatPropertyPrice(
                $property->getPrice(),
                $this->currencyManager->getCurrency(),
                $property->getPeriod(),
                $property->getCurrency()
            );
        }

        return $subtitle;
    }

    /**
     * @param $amount
     * @param $toCurrency
     * @param bool|false $period
     * @param string     $fromCurrency
     *
     * @return string
     */
    public function formatPropertyPrice($amount, $toCurrency, $period = false, $fromCurrency = 'USD')
    {
        return $this->currencyManager->formatPrice(
            $amount,
            $toCurrency,
            $period,
            $fromCurrency
        );
    }

    /**
     * The extension name.
     *
     * @return string
     */
    public function getName()
    {
        return 'property_extension';
    }
}
