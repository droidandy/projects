<?php

namespace AppBundle\Form\Settings;

use JMS\DiExtraBundle\Annotation\FormType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * @FormType
 */
class EnquiriesType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('forwardEnquiries', null, [
                'label' => 'account.enquiries.forward_enquiries',
            ])
        ;
    }

    public function getName()
    {
        return 'account_settings_enquiries';
    }
}
