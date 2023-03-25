<?php

namespace AppBundle\Validation;

use AppBundle\Helper\StringUtils;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class ArticleImageValidator extends ConstraintValidator
{
    private $domains;
    /**
     * @var StringUtils
     */
    private $stringUtils;

    /**
     * @param array $domains
     */
    public function __construct(array $domains)
    {
        $this->domains = $domains;
        $this->stringUtils = new StringUtils();
    }

    public function validate($value, Constraint $constraint)
    {
        $srcs = $this->stringUtils->extractImgSrcs($value);

        foreach ($srcs as $src) {
            if (false === $this->isWhitelisted($src)) {
                $this->context->buildViolation($constraint->message)
                    ->setParameter('{{ src }}', $src)
                    ->addViolation()
                ;
            }
        }
    }

    /**
     * @param string $src
     *
     * @return bool
     */
    private function isWhitelisted($src)
    {
        foreach ($this->domains as $domain) {
            if (false !== strpos($src, $domain)) {
                return true;
            }
        }

        return false;
    }
}
