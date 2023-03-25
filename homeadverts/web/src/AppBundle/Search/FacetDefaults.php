<?php

namespace AppBundle\Search;

class FacetDefaults
{
    protected $defaults = [
        'type' => '',
        'video' => 0,
        'bedrooms' => 0,
        'bathrooms' => 0,
        'priceFrom' => 0,
        'priceTo' => 100000000,
        'sort' => 'rand:rand',
        'status' => 'active',
        'per' => 'month',
        'dateAdded' => '',
    ];

    public function __construct()
    {
        $this->defaults['priceRange'] = (int) $this->defaults['priceFrom'].':'.(int) $this->defaults['priceTo'];
    }

    /**
     * make sure all facets are of the right type etc.
     *
     * @param array $facets
     *
     * @return array
     */
    public function clean($facets)
    {
        $facets['type'] = $facets['type'] ?: false;
        $facets['bedrooms'] = (int) $facets['bedrooms'];
        $facets['bathrooms'] = (int) $facets['bathrooms'];

        $result = [];
        foreach ($facets as $key => $value) {
            if (isset($this->defaults[$key]) && $value != $this->defaults[$key]) {
                $result[$key] = $value;
            }
        }

        return $result;
    }

    /**
     * return the class params, held in $defaults, merged with any added.
     *
     * @param array $overrides
     *
     * @return array
     */
    public function getDefaults(array $overrides = array())
    {
        return array_merge($this->defaults, $overrides);
    }
}
