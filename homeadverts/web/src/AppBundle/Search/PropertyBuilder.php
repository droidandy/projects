<?php

namespace AppBundle\Search;

use Doctrine\Common\Collections\ArrayCollection;
use DateTime;
use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyPhoto;
use AppBundle\Entity\Property\PropertyVideo;
use AppBundle\Entity\Property\PropertyLike;
use AppBundle\Entity\User\User;

class PropertyBuilder
{
    /**
     * @param array $document
     *
     * @return Property
     */
    public function build(array $document)
    {
        $source = $document['_source'];

        $property = new Property();

        $property->setId($document['_id']);
        $property->status = $source['status'];
        $property->availability = $source['availability'];
        $property->price = $source['price'];
        $property->currency = $source['currency'];
        $property->basePrice = $source['basePrice'];
        $property->period = $source['period'];
        $property->baseMonthlyPrice = $source['baseMonthlyPrice'];
        $property->type = $source['type'];
        $property->yearBuilt = $source['yearBuilt'];
        $property->grossLivingArea = $source['grossLivingArea'];
        $property->plotArea = $source['plotArea'];
        $property->source = $source['source'];
        $property->sourceUrl = $source['sourceUrl'];
        $property->sourceRef = $source['sourceRef'];
        $property->mlsRef = $source['mlsRef'];
        $property->featured = $source['featured'];
        $property->bedrooms = $source['bedrooms'];
        $property->bathrooms = $source['bathrooms'];
        $property->rental = $source['rental'];
        $property->dateAdded = new DateTime($source['dateAdded']);
        $property->dateUpdated = new DateTime($source['dateUpdated']);

        $property->address = $this->buildAddress($source);
        $property->user = $this->buildUser($source);

        $property->setPhotos($this->buildPhotosCollection($source));
        $property->setVideos($this->buildVideosCollection($source));
        $property->setLikes($this->buildLikesCollection($source));

        return $property;
    }

    /**
     * @param array $source
     *
     * @return Address
     */
    private function buildAddress(array $source)
    {
        $address = new Address();

        $address->street = $source['street'];
        $address->aptBldg = $source['aptBldg'];
        $address->neighbourhood = $source['neighbourhood'];
        $address->zip = $source['zip'];
        $address->townCity = $source['townCity'];
        $address->stateCounty = $source['stateCounty'];
        $address->country = $source['country'];
        $address->hidden = $source['addressHidden'];
        $address->latitude = $source['point']['lat'];
        $address->longitude = $source['point']['lon'];

        return $address;
    }

    /**
     * @param array $source
     *
     * @return User
     */
    private function buildUser(array $source)
    {
        $user = new User();
        $user->id = $source['userID'];
        $user->setName($source['agent']['name']);
        $user->companyName = $source['agent']['companyName'];
        $user->phone = $source['agent']['phone'];

        return $user;
    }

    /**
     * @param array $source
     *
     * @return ArrayCollection
     */
    private function buildPhotosCollection(array $source)
    {
        $collection = new ArrayCollection();

        foreach ($source['photos'] as $url) {
            $photo = new PropertyPhoto();
            $photo->setUrl($url);

            $collection->add($photo);
        }

        return $collection;
    }

    /**
     * @param array $source
     *
     * @return ArrayCollection
     */
    private function buildVideosCollection(array $source)
    {
        $collection = new ArrayCollection();

        foreach ($source['videos'] as $document) {
            $video = new PropertyVideo();
            $video->type = $document['type'];
            $video->url = $document['url'];

            $collection->add($video);
        }

        return $collection;
    }

    /**
     * @param array $source
     *
     * @return ArrayCollection
     */
    private function buildLikesCollection(array $source)
    {
        $collection = new ArrayCollection();

        for ($i = 0; $i < $source['likesCount']; ++$i) {
            $like = new PropertyLike();
            $collection->add($like);
        }

        return $collection;
    }
}
