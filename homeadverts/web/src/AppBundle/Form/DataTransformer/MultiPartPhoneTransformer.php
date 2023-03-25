<?php

namespace AppBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use libphonenumber\PhoneNumberUtil;

class MultiPartPhoneTransformer implements DataTransformerInterface
{
    protected $country;

    /**
     * Constructor.
     *
     * @param string $country
     */
    public function __construct($country)
    {
        $this->country = $country;
    }

    /**
     * We take the value from the database and turn it into a type that can be used within
     * our form elements - both of them.
     *
     * We are dealing with a compound form type for this form type
     * so we must return an array with matching key names.
     *
     * @param string $data
     *
     * @return array
     */
    public function transform($data)
    {
        if (is_null($data)) {
            return ['telCode' => '', 'telNumber' => ''];
        }

        if (0 === strpos($data, '+')) {
            list($code, $number) = $this->parseNumberWithCountryCode($data);
        } else {
            list($code, $number) = $this->parseNumberWithoutCountryCode($data);
        }

        if ($code && '+' !== $code[0]) {
            $code = '+'.$code;
        }

        return [
            'telCode' => $code,
            'telNumber' => $number,
        ];
    }

    /**
     * We are taking the element from the form and turning it into an element that
     * can be dealt with within the database entity - a single column index.
     *
     * @param array $data
     *
     * @return string
     */
    public function reverseTransform($data)
    {
        if ($data['telCode'] && $data['telNumber']) {
            return $data['telCode'].'-'.$data['telNumber'];
        }

        return '';
    }

    protected function parseNumberWithCountryCode($data)
    {
        // Explode from right to left by reversing string twice.
        $a = array_reverse(array_map('strrev', explode('-', strrev(trim($data, '+')), 2)));

        if (1 == count($a)) {
            $code = '';
            $telephone = $a[0];
        } else {
            $code = $a[0];
            $telephone = $a[1];
        }

        return [$code, $telephone];
    }

    protected function parseNumberWithoutCountryCode($data)
    {
        try {
            $phoneUtil = PhoneNumberUtil::getInstance();
            $number = $phoneUtil->parse($data, $this->country);
        } catch (\Exception $e) {
            return $this->parseNumberWithCountryCode($data);
        }

        return [$number->getCountryCode(), $number->getNationalNumber()];
    }
}
