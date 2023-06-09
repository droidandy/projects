<?php

namespace AppBundle\Entity\Location;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Embeddable\Bounds;

/**
 * Generated by data from Google when somebody does a location search.
 *
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Location\LocationRepository")
 * @ORM\Table(name="location",indexes={@ORM\Index(name="hash_idx", columns={"hash"})})
 */
class Location
{
    const SEARCH_DISTANCE_UNIT = 'm';

    /**
     * @var array|null
     */
    public $geoJson = null;
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $hash;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Coords")
     */
    protected $coords;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    protected $distance;

    /**
     * @ORM\Column(type="string", length=2, nullable=true, options={"fixed":true})
     */
    protected $country;

    /**
     * @ORM\Column(type="simple_array", nullable=true)
     */
    protected $types;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Bounds")
     */
    protected $bounds;

    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Bounds")
     */
    protected $viewport;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $query;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $slug;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $locale;

    /**
     * @ORM\Column(type="simple_array", nullable=true)
     */
    protected $hierarchy;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $createdAt;

    /**
     * Google Places ID.
     *
     * @ORM\Column(type="string", nullable=true)
     */
    protected $placeId;

    /**
     * Location constructor.
     *
     * @param string      $hash
     * @param Coords      $coords
     * @param float       $distance
     * @param string      $country
     * @param array       $types
     * @param Bounds|null $bounds
     * @param Bounds|null $viewport
     * @param $query
     * @param $name
     * @param $slug
     * @param $locale
     * @param array $hierarchy
     * @param $placeId
     */
    public function __construct(
        $hash,
        Coords $coords,
        $distance,
        $country,
        array $types = [],
        Bounds $bounds = null,
        Bounds $viewport = null,
        $query,
        $name,
        $slug,
        $locale,
        array $hierarchy = [],
        $placeId
    ) {
        $this->hash = $hash;
        $this->coords = $coords;
        $this->distance = round($distance, 2);
        $this->country = $country;
        $this->types = $types;
        $this->bounds = $bounds;
        $this->viewport = $viewport;
        $this->query = $query;
        $this->name = $name;
        $this->slug = $slug;
        $this->locale = $locale;
        $this->hierarchy = $hierarchy;
        $this->createdAt = new \DateTime();
        $this->placeId = $placeId;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    public function setId(int $id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getHash()
    {
        return $this->hash;
    }

    /**
     * @return Coords
     */
    public function getCoords()
    {
        return $this->coords;
    }

    /**
     * Gets the distance in km.
     *
     * @return float|null
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
        return $this->types && in_array('country', $this->types);
    }

    /**
     * @return bool
     */
    public function isContinent()
    {
        return $this->types && in_array('continent', $this->types);
    }

    /**
     * @return Bounds
     */
    public function getBounds()
    {
        return $this->bounds;
    }

    /**
     * @return Bounds
     */
    public function getViewport()
    {
        return $this->viewport;
    }

    /**
     * Gets the bounds or the viewport, whichever exists.
     *
     * @return Bounds|null
     */
    public function getArea()
    {
        return $this->getBounds() ?: $this->getViewport();
    }

    /**
     * @return query
     */
    public function getQuery()
    {
        return $this->query;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * @return string
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * @return array|null
     */
    public function getHierarchy()
    {
        return $this->hierarchy;
    }

    /**
     * @return array|null
     */
    public function getTypes()
    {
        return $this->types;
    }

    /**
     * Return the hierarchy tree but without the top level item.
     *
     * @return array|null
     */
    public function getHierarchyWithoutLocation()
    {
        if (!$this->hierarchy || count($this->getHierarchy()) <= 1) {
            return;
        }

        return array_values(array_slice($this->getHierarchy(), 1));
    }

    /**
     * @return string
     */
    public function getLocalityName()
    {
        return $this->getHierarchy()[0];
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Are we searching for a country code.
     *
     * @return bool
     */
    public function isSearchForCountry()
    {
        return strtoupper($this->country) === strtoupper($this->query);
    }

    /**
     * Are we searching for a town, road, area, neighbour etc rather than a state or country.
     *
     * @return bool
     */
    public function isSearchForLocalityOrSmaller()
    {
        return count(array_intersect($this->types, ['route', 'street_address', 'neighborhood', 'colloquial_area', 'locality'])) > 0;
    }

    /**
     * Get the locality name e.g town, street, neighbourhood name.
     *
     * @return string
     */
    public function getLocality()
    {
        // Get everything before the first comma and strip any house numbers from the start
        $locality = trim(explode(',', $this->query)[0]);
        $locality = preg_replace('/^[0-9\\-]+\\s+/um', '', $locality);

        return $locality;
    }

    /**
     * @return string
     */
    public function getSearchTerm()
    {
        if ($this->isSearchForCountry()) {
            return $this->getName();
        } else {
            return $this->getQuery();
        }
    }

    /**
     * @return mixed
     */
    public function getPlaceId()
    {
        return $this->placeId;
    }

    /**
     * @return array|bool
     */
    public function getFallback()
    {
        if (count($this->getHierarchy()) <= 1) {
            return false;
        }

        $parts = array_slice($this->getHierarchy(), 1);

        return [
            'label' => array_values($parts)[0],
            'term' => implode(', ', $parts),
        ];
    }
}
