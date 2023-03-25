<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Import\ImportProperty;
use AppBundle\Entity\Property\Property;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Entity\Embeddable\Price;
use AppBundle\Service\CurrencyManager;

/**
 * Automatically translates a property.
 */
class General extends Processor
{
    /**
     * @param NormalisedPropertyInterface $normalised
     * @param Property                    $propertyObj
     */
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        $em = $this->app->get('em');
        $rental = $normalised->getMarket()->isRental();

        // Meta data
        $propertyObj->availability = $rental ? Property::AVAILABILITY_TO_RENT : Property::AVAILABILITY_FOR_SALE;
        $propertyObj->type = $normalised->getType();
        $propertyObj->status = $em->contains($propertyObj) ? $propertyObj->status : Property::STATUS_INCOMPLETE;
        $propertyObj->rental = $rental;
        $propertyObj->dateAdded = !isset($propertyObj->dateAdded) ? new \DateTime() : $propertyObj->dateAdded;
        $propertyObj->dateUpdated = new \DateTime();
        $propertyObj->expirationDate = $normalised->getExpirationDate();

        // Source fields
        $propertyObj->sourceUrl = $normalised->getSourceUrl();
        $propertyObj->sourceRef = $normalised->getSourceRef();
        $propertyObj->mlsRef = $normalised->getMlsRef();
        $propertyObj->sourceGuid = $normalised->getSourceGuid();
        $propertyObj->source = $normalised->getSourceName();
        $propertyObj->setLeadEmail($normalised->getLeadEmail());

        // Property features
        $propertyObj->name = $normalised->getName();
        $propertyObj->bedrooms = $normalised->getBedrooms();
        $propertyObj->bathrooms = $normalised->getBathrooms();
        $propertyObj->halfBathrooms = $normalised->getHalfBathrooms();
        $propertyObj->threeQarterBathrooms = $normalised->getThreeQuarterBathrooms();
        $propertyObj->yearBuilt = $normalised->getYearBuilt();
        $propertyObj->grossLivingArea = $normalised->getInteriorArea();
        $propertyObj->plotArea = $normalised->getExteriorArea();

        // Miscellaneous data
        $propertyObj->misc = $normalised->getMisc();

        // Price
        $price = $this->convertToBaseCurrency($normalised->getPrice());

        // First convert into USD as a base currency
        $propertyObj->currency = $price->getCurrency();
        $propertyObj->price = $price->getAmount();
        $propertyObj->basePrice = $price->getBaseAmount();
        $propertyObj->priceQualifier = $price->getQualifier();
        $propertyObj->period = $price->getPeriod();
        $propertyObj->setDeletedAt(null);

        if ($normalised->getMarket()->isRental()) {
            $propertyObj->baseMonthlyPrice = $price->getBaseMonthlyPrice();
        }

        $em->persist($propertyObj);
        $em->flush();
    }

    protected function convertToBaseCurrency(Price $price)
    {
        /** @var CurrencyManager $converter */
        $converter = $this->app->get('ha.currency.manager');
        $base = $converter->convert($price->getCurrency(), 'USD', $price->getAmount());

        if (!$base) {
            if (false === $base) {
                $this->app->get('monolog.logger.import')->warning(
                    sprintf(
                        'Unsupported currency %s',
                        $price->getCurrency()
                    )
                );
            } elseif (null !== $base) {
                $this->app->get('monolog.logger.import')->warning(
                    sprintf(
                        'Malformed currency calculation for "%s" "%s"',
                        $price->getCurrency(),
                        $price->getAmount()
                    )
                );
            }

            if ($price->getPriceInUSD()) {
                $price = new Price(
                    $price->getPriceInUSD(),
                    'USD',
                    $price->getPeriod(),
                    $price->getQualifier(),
                    $price->getPriceInUSD()
                );

                $price->setBaseAmount($price->getPriceInUSD());
            } else {
                $price->setBaseAmount(null);
            }
        } else {
            $price->setBaseAmount($base);
        }

        return $price;
    }
}
