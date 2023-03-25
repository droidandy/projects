<?php

namespace AppBundle\Search;

class Facets
{
    protected $defaults;
    protected $selected;

    /**
     * merge our defaults and and the values passed in,
     * as well as dealing with confirming that some values are of the right scalar type.
     *
     * @param array $defaults
     * @param array $selected
     */
    public function __construct($defaults, $selected)
    {
        $this->defaults = $defaults;
        $this->selected = $selected;

        //ensure the following are always integers (for hash comparison)
        if (!empty($this->selected)) {
            foreach (['bedrooms', 'bathrooms', 'priceFrom', 'priceTo', 'priceRange'] as $v) {
                if (!isset($this->selected[$v])) {
                    continue;
                }

                $this->selected[$v] = (int) $this->selected[$v];
            }
        }
    }

    /**
     * add a set of values to the facets.
     *
     * @param array $values
     */
    public function add(array $values)
    {
        foreach ($values as $key => $value) {
            if (!isset($this->defaults[$key])) {
                continue;
            }

            // Remove any where the value matches the default value except if it's
            // currency, because the default is different depending on the locale
            // so we always want to be able to reset it
            if ($this->defaults[$key] == $value && 'currency' !== $key) {
                if (isset($this->selected[$key])) {
                    unset($this->selected[$key]);
                }

                continue;
            }

            $this->selected[$key] = $value;
        }
    }

    /**
     * return a merged array of defaults and selected facets.
     *
     * @return array
     */
    public function getAll()
    {
        if (empty($this->selected) || !is_array($this->selected)) {
            return $this->defaults;
        }

        return array_merge($this->defaults, $this->selected);
    }

    /**
     * return the users selected combination of facets passed in on construction.
     *
     * @return array
     */
    public function getSelected()
    {
        return $this->selected;
    }

    /**
     * Return the detaults passed in on constuction.
     *
     * @return array
     */
    public function getDefaults()
    {
        return $this->defaults;
    }
}
