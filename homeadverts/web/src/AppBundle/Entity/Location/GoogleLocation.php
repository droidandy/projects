<?php

namespace AppBundle\Entity\Location;

use AppBundle\Entity\Embeddable\Bounds;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Traits\CreatedAtTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="google_location")
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Location\GoogleLocationRepository")
 */
class GoogleLocation
{
    use CreatedAtTrait;

    const STATUS_UNPROCESSED = 'unprocessed';
    const STATUS_PROCESSED = 'processed';
    const STATUS_PROCESSED_WITH_ADDRESS = 'processed_with_address';
    const STATUS_PARTIALLY_PROCESSED = 'partially_processed';
    const STATUS_FAILED = 'failed';

    const ADDRESS_AND_COMPONENT_TYPES = [
        'street_address',
        'route',
        'intersection',
        'political',
        'country',
        'administrative_area_level_1',
        'administrative_area_level_2',
        'administrative_area_level_3',
        'administrative_area_level_4',
        'administrative_area_level_5',
        'colloquial_area',
        'locality',
        'ward',
        'sublocality',
        'sublocality_level_1',
        'sublocality_level_2',
        'sublocality_level_3',
        'sublocality_level_4',
        'sublocality_level_5',
        'neighborhood',
        'premise',
        'subpremise',
        'postal_code',
        'natural_feature',
        'airport',
        'park',
        'point_of_interest',
    ];

    const COMPONENT_TYPES = [
        'floor',
        'establishment',
        'point_of_interest',
        'parking',
        'post_box',
        'postal_town',
        'room',
        'street_number',
        'bus_station',
        'train_station',
        'transit_station',
        'postal_code_prefix',
    ];

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    /**
     * @var ORM\Column(type="json_array")
     */
    private $addressComponents;
    /**
     * @var ORM\Column(type="string")
     */
    private $formattedAddress;
    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Bounds")
     */
    private $geometryBounds;
    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Coords")
     */
    private $geometryLocation;
    /**
     * @var ORM\Column(type="string")
     */
    private $geometryLocationType;
    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Bounds")
     */
    private $geometryViewport;
    /**
     * @ORM\Column(type="string", length=767, unique=true, nullable=false)
     */
    private $placeId;
    /**
     * @ORM\Column(type="simple_array")
     */
    private $types;

    /**
     * @param object
     */
    public function __construct($locationResult = null)
    {
        if (!$locationResult) {
            return;
        }

        $this->addressComponents = $this->convertToArray($locationResult->address_components);
        $this->formattedAddress = $locationResult->formatted_address;

        $geometry = $locationResult->geometry;
        if (isset($geometry->bounds)) {
            $bounds = $geometry->bounds;
            $this->geometryBounds = new Bounds(
                new Coords($bounds->northeast->lat, $bounds->northeast->lng),
                new Coords($bounds->southwest->lat, $bounds->southwest->lng)
            );
        }
        $this->geometryLocation = new Coords($geometry->location->lat, $geometry->location->lng);
        $this->geometryLocationType = $geometry->location_type;
        if (isset($geometry->viewport)) {
            $viewport = $geometry->viewport;
            $this->geometryViewport = new Bounds(
                new Coords($viewport->northeast->lat, $viewport->northeast->lng),
                new Coords($viewport->southwest->lat, $viewport->southwest->lng)
            );
        }

        $this->placeId = $locationResult->place_id;
        $this->types = $locationResult->types;

        $this->createdAt = new \DateTime();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return array
     */
    public function getAddressComponents()
    {
        return $this->addressComponents;
    }

    /**
     * @return string
     */
    public function getFormattedAddress()
    {
        return $this->formattedAddress;
    }

    /**
     * @return Bounds
     */
    public function getGeometryBounds()
    {
        return $this->geometryBounds;
    }

    /**
     * @return Coords
     */
    public function getGeometryLocation()
    {
        return $this->geometryLocation;
    }

    /**
     * @return string
     */
    public function getGeometryLocationType()
    {
        return $this->geometryLocationType;
    }

    /**
     * @return Bounds
     */
    public function getGeometryViewport()
    {
        return $this->geometryViewport;
    }

    /**
     * @return string
     */
    public function getPlaceId()
    {
        return $this->placeId;
    }

    /**
     * @param string
     */
    public function setPlaceId($placeId)
    {
        $this->placeId = $placeId;
    }

    /**
     * @return array
     */
    public function getTypes()
    {
        return $this->types;
    }

    public function __toString()
    {
        return "{$this->id} {$this->types[0]} {$this->formattedAddress}";
    }

    /**
     * @param array $addressComponents
     *
     * @return array
     *
     * @see https://stackoverflow.com/a/18576902/1732559
     * Coerce arrays and stdClasses to array cause json_array type always decode to array
     */
    private function convertToArray($addressComponents)
    {
        return json_decode(json_encode($addressComponents), true);
    }
}
