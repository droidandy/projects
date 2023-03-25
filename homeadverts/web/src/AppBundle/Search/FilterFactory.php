<?php

namespace AppBundle\Search;

use AppBundle\Elastic\Integration\Collection\SearchResults;
use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Inject;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\FormFactory;
use AppBundle\Service\CurrencyManager;
use AppBundle\Form\Type\Filters as FiltersFormType;
use AppBundle\Service\Geo\LocaleFactory;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Creates filters based on request object.
 *
 * @Service("filter_factory")
 */
class FilterFactory
{
    /**
     * @var FormFactory
     */
    protected $formFactory;

    /**
     * @var CurrencyManager
     */
    protected $currencyManager;

    /**
     * @var LocaleFactory
     */
    protected $localeFactory;

    /**
     * @var Session
     */
    protected $session;

    /**
     * Constructor.
     *
     * @InjectParams({
     *     "formFactory" = @Inject("form.factory"),
     * })
     *
     * @param Session         $session
     * @param FormFactory     $formFactory
     * @param CurrencyManager $currencyManager
     * @param LocaleFactory   $localeFactory
     */
    public function __construct(
        Session $session,
        FormFactory $formFactory,
        CurrencyManager $currencyManager,
        LocaleFactory $localeFactory
    ) {
        $this->session = $session;
        $this->formFactory = $formFactory;
        $this->currencyManager = $currencyManager;
        $this->localeFactory = $localeFactory;
    }

    /**
     * Creates filters based on either top level GET or POST data.
     *
     * @param Request $request
     * @param string  $type    request or query
     *
     * @return Filters
     */
    public function createFromRequest(Request $request, $type = 'query')
    {
        return $this->create($request, $request->{$type}->all());
    }

    /**
     * Create filters from a named POST array.
     *
     * @param Request $request
     * @param string  $paramName
     *
     * @return Filters
     */
    public function createFromPostData(Request $request, $paramName = 'filters')
    {
        return $this->create($request, $request->request->get($paramName, []));
    }

    /**
     * Create filters (automatically detecting market from Request).
     * If a market is found within the request data a param converter
     * is used to convert that into a Market instance.
     *
     * @param Request $request
     * @param array   $values
     *
     * @return Filters
     */
    public function create(Request $request, array $values = [])
    {
        $filters = $this->createWithoutMarket($values);

        // Set market based on url slug
        if ($market = $request->attributes->get('market')) {
            $filters->setMarket($market instanceof Market ? $market : new Market($market));
        }

        return $filters;
    }

    /**
     * Create filters based on an array of values.
     *
     * @param array $values
     *
     * @return Filters
     */
    public function createWithoutMarket(array $values = [])
    {
        $filters = new Filters([
            'price' => [
                'currency' => $this->currencyManager->getDefaultCurrency(),
            ],
        ]);
        $filters->parse($values);

        return $filters;
    }

    /**
     * @param array         $query
     * @param SearchResults $searchResultsD
     * @param array         $priceStat
     *
     * @return \Symfony\Component\Form\Form|\Symfony\Component\Form\FormInterface
     */
    public function getFormQuery($query, SearchResults $searchResults, $priceStat)
    {
        $filters = $this->createWithoutMarket($query);

        $filtersFormType = new FiltersFormType($this->currencyManager, $this->localeFactory);

        $filtersFormType->setPriceRange(
            $priceStat['min_price'],
            $priceStat['max_price'],
            $priceStat['avg_price']
        );

        $filtersForm = $this->formFactory->create($filtersFormType, $filters);

        return $filtersForm;
    }
}
