<?php

namespace AppBundle\Search;

class Location
{
    public $id;
    public $lat;
    public $lng;
    public $dist;
    public $country;
    public $isCountry;
    public $isContinent;
    public $bounds;
    public $query;
    public $name;
    public $slug;
    public $locale;
    public $hierarchy;
    protected $version;
    protected $distance;
    protected $latLng;

    public function __construct(array $values = array())
    {
        foreach ($values as $k => $v) {
            $this->{$k} = $v;
        }

        // Ensure that the following are floats, not strings (for hash comparison)
        $this->distance = (float) $this->distance;

        if (!empty($this->bounds)) {
            foreach ($this->bounds as $k => $v) {
                $this->bounds[$k] = (float) $v;
            }
        }

        //ensure the following are boolean values for hash comparison
        $this->isCountry = (bool) $this->isCountry;
        $this->isContinent = (bool) $this->isContinent;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return LatLng
     */
    public function getLatLng()
    {
        return $this->latLng;
    }

    /**
     * Gets the value of dist.
     *
     * @return mixed
     */
    public function getDistance()
    {
        return $this->distance;
    }

    /**
     * Gets the value of country.
     *
     * @return mixed
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * @return bool
     */
    public function isCountry()
    {
        return $this->isCountry;
    }

    /**
     * Gets the value of isContinent.
     *
     * @return mixed
     */
    public function isContinent()
    {
        return $this->isContinent;
    }

    /**
     * Gets the value of bounds.
     *
     * @return mixed
     */
    public function getBounds()
    {
        return $this->bounds;
    }

    /**
     * Gets the value of query.
     *
     * @return mixed
     */
    public function getQuery()
    {
        return $this->query;
    }

    /**
     * Gets the value of name.
     *
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Gets the value of slug.
     *
     * @return mixed
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * Gets the value of locale.
     *
     * @return mixed
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * Gets the value of hierarchy.
     *
     * @return mixed
     */
    public function getHierarchy()
    {
        return $this->hierarchy;
    }

    /**
     * @return int
     */
    public function getVersion()
    {
        return $this->version;
    }
}
