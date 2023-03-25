<?php

namespace AppBundle\Search;

class Filters
{
    protected $defaults = [
        'type' => '',
        'market' => 'all',
        'status' => 100,
        'media' => 'all',
        'bedrooms' => '0',
        'bathrooms' => '0',
        'price' => [
            'currency' => 'USD',
            'from' => '',
            'to' => '',
            'range' => '',
        ],
        'sort' => 'rand:rand',
        'period' => 'month',
        'distance' => '',
        'dateAdded' => '',
        'p' => 1, // Current page number
    ];

    protected $lockedValues = [
        'market',
        'status',
    ];

    protected $values = [];

    /**
     * Constructor.
     *
     * @param array $defaults
     */
    public function __construct(array $defaults = [])
    {
        $this->defaults['market'] = new Market($this->defaults['market']);
        $this->defaults = array_replace_recursive($this->defaults, $defaults);
    }

    /**
     * Set filters from an array.
     *
     * @param array|null $parameters
     *
     * @return self
     */
    public function parse(array $parameters = null)
    {
        if (isset($parameters['market']) && !($parameters['market'] instanceof Market)) {
            $parameters['market'] = new Market($parameters['market']);
        }

        if (isset($parameters['sort'])) {
            $parameters['sort'] = urldecode($parameters['sort']);
        }

        // If priceRange is set override the from and to prices
        // Please note: filters on the property search and the agent property listing
        // working slightly differently. On the agent listing priceRange is set but blank
        // and the form turns priceRange into priceTo and priceFrom, where as the property
        // list filters does not.
//        if (!empty($parameters['price']['range']) && trim($parameters['price']['range']) !== '') {
//            list($parameters['price']['from'], $parameters['price']['to']) = explode(':', $parameters['price']['range']);
//        }

        $result = [];
        foreach ($this->defaults as $key => $default) {
            if (is_array($default)) {
                foreach ($default as $subKey => $subDefault) {
                    $result[$key][$subKey] = isset($parameters[$key][$subKey]) ? $parameters[$key][$subKey] : $subDefault;
                }
            } else {
                $result[$key] = isset($parameters[$key]) ? $parameters[$key] : $default;
            }
        }

        $this->values = $result;

        return $this;
    }

    /**
     * Return only filters changed from their defaults.
     *
     * @return array
     */
    public function changed()
    {
        return array_filter($this->values, function ($value, $key) {
            if (is_array($this->defaults[$key])) {
                foreach ($this->defaults[$key] as $subKey => $subDefault) {
                    if (isset($value[$subKey]) && $value[$subKey] !== $subDefault) {
                        return true;
                    }
                }

                return false;
            } else {
                return $value !== $this->defaults[$key];
            }
        }, ARRAY_FILTER_USE_BOTH);
    }

    public function set($key, $value)
    {
        $this->values[$key] = $value;
    }

    public function get($key, $default = null)
    {
        return isset($this->values[$key]) ? $this->values[$key] : $default;
    }

    public function __get($key)
    {
        return $this->get($key);
    }

    /**
     * Checks if any filters have changed from their defaults.
     *
     * @return bool
     */
    public function isFiltered()
    {
        return $this->values == $this->defaults;
    }

    /**
     * Get the market filter.
     *
     * @return string Either 'to-rent' or 'for-sale'
     */
    public function getMarket()
    {
        return $this->values['market'];
    }

    /**
     * Set the market filter.
     *
     * @return self
     */
    public function setMarket(Market $market)
    {
        $this->values['market'] = $market;

        return $this;
    }

    /**
     * Get the type filter.
     *
     * @return string
     */
    public function getType()
    {
        return $this->values['type'];
    }

    /**
     * Set the type filter.
     *
     * @return self
     */
    public function setType($type)
    {
        $this->values['type'] = $type;

        return $this;
    }

    /**
     * Get the status filter.
     *
     * @return int
     */
    public function getStatus()
    {
        return $this->values['status'];
    }

    /**
     * Set the status filter.
     *
     * @return self
     */
    public function setStatus($status)
    {
        $this->values['status'] = $status;

        return $this;
    }

    /**
     * Get the media filter.
     *
     * @return int
     */
    public function getMedia()
    {
        return $this->values['media'];
    }

    /**
     * Set the media filter.
     *
     * @param string $media
     *
     * @return self
     */
    public function setMedia($media)
    {
        $this->values['media'] = $media;

        return $this;
    }

    /**
     * Get the bedrooms filter.
     *
     * @return int
     */
    public function getBedrooms()
    {
        return $this->values['bedrooms'];
    }

    /**
     * Set the bedrooms filter.
     *
     * @param string $bedrooms
     *
     * @return self
     */
    public function setBedrooms($bedrooms)
    {
        $this->values['bedrooms'] = $bedrooms;

        return $this;
    }

    /**
     * Get the bathrooms filter.
     *
     * @return int
     */
    public function getBathrooms()
    {
        return $this->values['bathrooms'];
    }

    /**
     * Set the bathrooms filter.
     *
     * @return self
     */
    public function setBathrooms($bathrooms)
    {
        $this->values['bathrooms'] = $bathrooms;

        return $this;
    }

    /**
     * Get the priceFrom filter.
     *
     * @return int
     */
    public function getPriceFrom()
    {
        return $this->values['priceFrom'];
    }

    /**
     * Set the priceFrom filter.
     *
     * @return self
     */
    public function setPriceFrom($priceFrom)
    {
        $this->values['priceFrom'] = $priceFrom;

        return $this;
    }

    /**
     * Get the priceTo filter.
     *
     * @return int
     */
    public function getPriceTo()
    {
        return $this->values['priceTo'];
    }

    /**
     * Set the priceTo filter.
     *
     * @return self
     */
    public function setPriceTo($priceTo)
    {
        $this->values['priceTo'] = $priceTo;

        return $this;
    }

    /**
     * Get the sort filter.
     *
     * @return string
     */
    public function getSort()
    {
        return $this->values['sort'];
    }

    /**
     * Set the sort filter.
     *
     * @return self
     */
    public function setSort($sort)
    {
        $this->values['sort'] = $sort;

        return $this;
    }

    /**
     * Get the period filter.
     *
     * @return string
     */
    public function getPeriod()
    {
        return $this->values['period'];
    }

    /**
     * Set the period filter.
     *
     * @return self
     */
    public function setPeriod($period)
    {
        $this->values['period'] = $period;

        return $this;
    }

    /**
     * Get the date added.
     *
     * @return string
     */
    public function getDateAdded()
    {
        return $this->values['dateAdded'];
    }

    /**
     * Set the date added.
     *
     * @return self
     */
    public function setDateAdded($dateAdded)
    {
        $this->values['dateAdded'] = $dateAdded;

        return $this;
    }
}
