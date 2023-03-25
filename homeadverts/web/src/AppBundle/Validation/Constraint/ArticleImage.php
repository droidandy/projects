<?php

namespace AppBundle\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class ArticleImage extends Constraint
{
    public $message = 'The text should contain only images of the own cloud storage origin. "{{ src }}" provided instead.';

    public function validatedBy()
    {
        return 'article_image_validator';
    }
}
