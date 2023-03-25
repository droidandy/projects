<?php

namespace AppBundle\Form\Profile;

use JMS\DiExtraBundle\Annotation\FormType;
use JMS\DiExtraBundle\Annotation\InjectParams;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Entity\Embeddable\Address;

/**
 * @FormType
 */
class AgentContactDetailsType extends AbstractType
{
    protected $locale;
    protected $localeFactory;

    /**
     * @InjectParams
     */
    public function __construct($localeFactory)
    {
        $this->localeFactory = $localeFactory;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('companyName', null, [
                'label' => 'account.contact.company_name',
                'required' => false,
            ])
            ->add('companyPhone', 'number', [
                'label' => 'account.contact.company_phone',
                'required' => false,
                'constraints' => [
                    new Assert\NotNull(),
                ],
            ])
            ->add('username', 'text', [
                'label' => 'Name',
                'required' => true,
                'constraints' => [
                    new Assert\NotNull(),
                ],
            ])
            ->add('phone', 'number', [
                'label' => 'account.contact.phone',
                'required' => true,
            ])
            ->add('mobilePhone', 'number', [
                'label' => 'account.contact.mobile_phone',
                'required' => false,
            ])
            ->add('email', 'email', [
                'label' => 'account.contact.email',
                'required' => true,
                'constraints' => [
                    new Assert\NotNull(),
                ],
            ])
            ->add('homePageUrl', 'url', [
                'label' => 'account.contact.homepage_url',
                'required' => true,
            ])
            ->add(
                'address',
                'add_property_address',
                [
                    'data_class' => Address::class,
                ]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'validation_groups' => array('settings'),
        ));
    }

    public function getName()
    {
        return 'account_profile_contact_agent';
    }
}
