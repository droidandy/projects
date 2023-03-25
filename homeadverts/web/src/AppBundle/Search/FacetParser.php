<?php

namespace AppBundle\Search;

use AppBundle\Entity\Property\PropertyTypes;

class FacetParser
{
    protected $types = [];

    protected $defaults = [
        'type' => '',
        'market' => 'for-sale',
        'status' => 'active',
        'bedrooms' => 0,
        'bathrooms' => 0,
        'priceFrom' => '',
        'priceTo' => '',
        'priceRange' => '', //this NEEDS to be here or the dropdown filter wont work
        'sort' => 'rand:rand',
        'period' => 'month',
        'distance' => '',
        'dateAdded' => '',
    ];

    /**
     * we need the construct to set the right property types for the class as
     * there should only be one location that they are coded.
     */
    public function __construct()
    {
        //get the types from the property type class, but only the slugs, which are array keys
        $this->types = PropertyTypes::getCodeSlugMapping();
    }

    /**
     * Parses a string in the format /from-100/to-1000/3-bed/2-bathroom into
     * a usable array.
     *
     * @param string $facets The string to parse
     *
     * @return mixed false if couldn't parse string, otherwise returns
     *               array of facets
     */
    public function parse($facets)
    {
        $parts = $this->getAllowedFacets();
        $facets = !is_array($facets) ? explode('/', trim($facets, '/')) : $facets;
        $result = [];

        $facets = $this->processPriceRange($facets);

        foreach ($facets as $facet) {
            foreach ($parts as $regex => $type) {
                if (preg_match('/^'.$regex.'$/', $facet, $matches)) {
                    // Dont allow a facet to be defined twice
                    if (isset($result[$type])) {
                        return false;
                    }

                    $result[$type] = $matches[1];
                }
            }
        }

        return new Facets($this->defaults, $result);
    }

    /**
     * The opposite of `parse()`. Takes an array and turns it into a string
     * that can be appended to a URL.
     *
     * @param array $args The array of parameters to concatenate
     *
     * @return mixed returns false if invalid $args are passed in,
     *               otherwise a string
     */
    public function build(array $args)
    {
        $parts = $this->getAllowedFacets();
        $result = [];

        $args = $this->processPriceRange($args);

        // Loop over parts instead of args ensure we always get the same order
        foreach ($parts as $regex => $type) {
            // Ensure that we haven't passed in parts that don't exist
            if (!isset($args[$type])) {
                continue;
            }

            // Swap out everything between parenthesis in regex eg from-([0-9]+) becomes from-1200
            $result[] = preg_replace('/\\((.*)\\)/uis', $args[$type], $regex);
        }

        return implode('/', $result);
    }

    /**
     * helper method to get the to and from price from the price range.
     *
     * @param array $args facets passed to the builder methods
     *
     * @return array
     */
    public function processPriceRange(array $args)
    {
        if (isset($args['priceRange']) && false !== strpos($args['priceRange'], ':')) {
            list($args['priceFrom'], $args['priceTo']) = explode(':', $args['priceRange']);

            if ('' == $args['priceFrom']) {
                unset($args['priceFrom']);
            }

            if ('' == $args['priceTo']) {
                unset($args['priceTo']);
            }

            //we dont need this now
            unset($args['priceRange']);
        }

        return $args;
    }

    /**
     * the formats of the allowed assets.
     *
     * @return array
     */
    protected function getAllowedFacets()
    {
        $types = implode('|', array_map('preg_quote', $this->types));
        $markets = implode('|', array_map('preg_quote', ['all', 'for-sale', 'to-rent']));
        $statuses = implode('|', array_map('preg_quote', ['active', 'inactive', 'invalid', 'featured', 'deleted', 'incomplete']));
        $periods = implode('|', array_map('preg_quote', ['day', 'week', 'month']));

        return [
            '('.$types.')' => 'type',
            'market-('.$markets.')' => 'market',
            '('.$statuses.')' => 'status',
            '([1-9])-bed' => 'bedrooms',
            '([1-9])-bath' => 'bathrooms',
            'from-([0-9]+)' => 'priceFrom',
            'to-([0-9]+)' => 'priceTo',
            'sort-([a-z]+:(asc|desc|rand))' => 'sort',
            'within-(([0-9\.]+)(mile|km)s*)' => 'distance',
            'since-(([0-9]+)(hrs|days))' => 'dateAdded',
            'per-('.$periods.')' => 'period',
            '([0-9]*):([0-9]*)' => 'priceRange',
        ];
    }

    public function setDefault($key, $value)
    {
        $this->defaults[$key] = $value;
    }

    public function setDefaults($defaults)
    {
        $this->defaults = $defaults;
    }
}
