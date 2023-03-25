<?php

namespace AppBundle\Geo;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\User\User;
use Predis\Client;

class TraceableAddressGeocoder extends AddressGeocoder
{
    const ADDRESS_GEOCODE_LOG = 'address_geocode_log';
    const ADDRESS_GEOCODE_REQUEST_COUNTER = 'address_geocode_request_counter';
    /**
     * @var Client
     */
    private $redis;

    public function __construct(Geocoder $geocoder, Client $redis)
    {
        parent::__construct($geocoder);

        $this->redis = $redis;
    }

    public function geocode($entity)
    {
        $logName = $this->getLogName($entity);
        $message = $this->getMessage($entity);
        $this->redis->lpush($logName, [json_encode($message)]);
        $this->redis->incr(self::ADDRESS_GEOCODE_REQUEST_COUNTER);

        return parent::geocode($entity);
    }

    private function getLogName($entity)
    {
        if ($entity instanceof Address) {
            return self::ADDRESS_GEOCODE_LOG.'_unspecified';
        }

        if ($entity instanceof User) {
            return self::ADDRESS_GEOCODE_LOG.'_'.$entity->sourceRef;
        }

        if ($entity instanceof NormalisedUserInterface) {
            return self::ADDRESS_GEOCODE_LOG.'_'.$entity->getSourceRef();
        }

        if ($entity instanceof Property) {
            return self::ADDRESS_GEOCODE_LOG.'_'.$entity->getSourceRef();
        }

        if ($entity instanceof NormalisedPropertyInterface) {
            return self::ADDRESS_GEOCODE_LOG.'_'.$entity->getSourceRef();
        }

        throw new \InvalidArgumentException();
    }

    private function getMessage($entity)
    {
        $address = $entity;
        $sourceType = 'address';
        if ($entity instanceof Property) {
            $address = $entity->getAddress();
            $sourceType = 'property';
        } elseif ($entity instanceof NormalisedProperty) {
            $address = $entity->getAddress();
            $sourceType = 'normalised_property';
        } elseif ($entity instanceof User) {
            $address = $entity->getAddress();
            $sourceType = 'user';
        } elseif ($entity instanceof NormalisedUser) {
            $address = $entity->getAddress();
            $sourceType = 'normalised_user';
        }

        return [
            'address' => $address,
            'source_type' => $sourceType,
            'time' => (new \DateTime())->format('Y-m-d H:i:s'),
        ];
    }
}
