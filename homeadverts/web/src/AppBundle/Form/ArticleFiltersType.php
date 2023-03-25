<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class ArticleFiltersType extends AbstractType
{
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
            ->add('since', 'choice', [
                'required' => false,
                'choices' => [
                    '' => 'search.filter.added.any',
                    '24hrs' => 'search.filter.added.one',
                    '3days' => 'search.filter.added.three',
                    '7days' => 'search.filter.added.seven',
                    '14days' => 'search.filter.added.foreteen',
                    '30days' => 'search.filter.added.thirty',
                ],
            ])
            ->add('sort', 'choice', [
                'choices' => [
                    'publishedAt:asc' => 'search.filters.article.sort.published_at.asc',
                    'publishedAt:desc' => 'search.filters.article.sort.published_at.desc',
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
