<?php

namespace AppBundle\Form;

use JMS\DiExtraBundle\Annotation\FormType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

/**
 * @FormType
 */
class TerminateAccountFormType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('save', 'submit');
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'terminate_account';
    }
}
