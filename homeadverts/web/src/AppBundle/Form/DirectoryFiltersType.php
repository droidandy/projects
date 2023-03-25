<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use AppBundle\Search\UserType;

class DirectoryFiltersType extends AbstractType
{

    /**
     * @param array $languages
     */
    public function __construct()
    {
    }

    /**
     * define the form elements we want to present when the form is created.
     *
     * @param FormBuilderInterface $builder
     * @param array                $options
     *
     * @return FormBuilderInterface
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('user_type', 'choice', [
                'choices' => [
                    UserType::AGENT => 'search.filters.directory.type.agent',
                    UserType::BROKERAGE => 'search.filters.directory.type.brokerage',
                ],
            ])
            ->add('sort', 'choice', [
                'choices' => [
                    'name:asc' => 'search.filters.directory.sort.name.asc',
                    'name:desc' => 'search.filters.directory.sort.name.desc',
                ],
            ]);
    }

    /**
     * The unique name of this form.
     *
     * @return string
     */
    public function getName()
    {
        return 'filters';
    }
}
