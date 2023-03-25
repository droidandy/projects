<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Property\Property;
use Patchwork\Utf8;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Entity\Property\PropertyDescription;

/**
 * Automatically translates a property.
 */
class Translate extends Processor
{
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        $em = $this->app->get('doctrine')->getManager();

        $descriptions = [];

        if (!$normalised->getDescriptions()) {
            return;
        }

        foreach ($normalised->getDescriptions() as $desc) {
            $desc = (object) $desc;

            /** @var Property $propertyObj */
            foreach ($propertyObj->getDescriptions() as $existingDesc) {
                if (strtolower($desc->locale) === strtolower($existingDesc->locale)) {
                    // detect if we need to update it
                    $cleaned = $this->clean($desc->description);
                    if ($cleaned !== $existingDesc->description) {
                        $existingDesc->description = $cleaned;
                    }

                    $descriptions[] = $existingDesc;

                    continue 2;
                }
            }

            // Brand new description!
            $newDesc = new PropertyDescription();
            $newDesc->locale = $desc->locale;
            $newDesc->description = $desc->description;

            $descriptions[] = $newDesc;
        }

        foreach ($descriptions as $desc) {
            $desc->property = $propertyObj;
            $em->persist($desc);
        }
    }

    public function clean($text)
    {
        $text = $this->convert($text);
        $text = html_entity_decode($text, null, 'UTF-8');
        $text = $this->app->get('exercise_html_purifier.default')->purify($text);

        // convert </p> tags to two lines endings
        // <br> converts to a single line ending.
        $text = str_replace(['<br>', '<br />'], "\n", $text);

        // Get rid of any whitespace
        $text = trim($text);

        return $text;
    }

    protected function convert($text)
    {
        return Utf8::filter($text);
    }
}
