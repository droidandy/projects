<?php

namespace AppBundle\Form\Type;

use JMS\DiExtraBundle\Annotation\FormType;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Inject;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * @FormType("add_property_address")
 */
class AddPropertyAddressForm extends AbstractType
{
    /**
     * @InjectParams({
     *     "container" = @Inject("service_container")
     * })
     */
    public function __construct($container)
    {
        $this->container = $container;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $defaultCountry = $this->container->get('locale_factory')->getClientCountry();

        $builder
            ->add('country', 'country', [
                'label' => 'account.address.country',
                'required' => true,
                'empty_data' => $defaultCountry,
            ])
            ->add('street', null, [
                'label' => 'account.address.street',
                'required' => true,
            ])
            ->add('aptBldg', null, [
                'label' => 'account.address.aptBldg',
                'required' => false,
            ])
            ->add('townCity', null, [
                'label' => 'account.address.townCity',
                'required' => false,
            ])
            ->add('stateCounty', null, [
                'label' => 'account.address.county',
                'required' => false,
            ])
            ->add('zip', null, [
                'label' => 'account.address.postcode',
                'required' => false,
            ])
            ->add('hidden', 'checkbox', array(
                'label' => 'listing.address.hide',
                'required' => false,
            ))
            ->add('latitude', 'hidden', ['required' => false])
            ->add('longitude', 'hidden', ['required' => false])
        ;
    }

    public function getName()
    {
        return 'add_property_address';
    }
}
