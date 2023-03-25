<?php

namespace AppBundle\Service\Article\Import;

use AppBundle\Entity\Storage\File;
use AppBundle\Entity\Property\Property;
use AppBundle\Service\File\FileManagerVirtual;
use Symfony\Component\Routing\Router;

class PropertyImporter
{
    /**
     * @var int
     */
    const IMAGE_GALLERY_LIMIT = 11;
    /**
     * @var FileManagerVirtual
     */
    protected $fileManagerVirtual;
    /**
     * @var Router
     */
    protected $router;

    /**
     * @param FileManagerVirtual $fileManager
     * @param Router             $router
     */
    public function __construct(FileManagerVirtual $fileManagerVirtual, Router $router)
    {
        $this->fileManagerVirtual = $fileManagerVirtual;
        $this->router = $router;
    }

    /**
     * @param Property $property
     *
     * @return array
     */
    public function import(Property $property)
    {
        $images = $this->uploadImages($property);

        $body = sprintf(
            '<p>%s %s %s %s %s</p>',
            $this->buildAddress($property),
            $this->buildHeader($images[0]),
            $this->buildBody($property, $images[1]),
            $this->buildGallery(array_slice($images, 2)),
            $this->buildLinkToProperty($property)
        );

        return [
            'title' => $property->getTitle(),
            'body' => $body,
            'images' => $images,
        ];
    }

    /**
     * @param File $image
     *
     * @return string
     */
    private function buildHeader(File $image)
    {
        $header = '
        <div class="medium-insert-images medium-insert-images-cropped" contenteditable="false">
            <figure>
                <img src="'.$image->url.'" class="primary-media">
            </figure>
        </div>'.PHP_EOL.PHP_EOL;

        return $header;
    }

    /**
     * @param Property $property
     *
     * @return string
     */
    private function buildAddress(Property $property)
    {
        $text = sprintf(
            '<p>%s</p>',
            $property->getAddressLine(true)
        );

        return $text;
    }

    /**
     * @param Property $property
     * @param File     $image
     *
     * @return string
     */
    private function buildBody(Property $property, File $image)
    {
        $image = '
            <div class="medium-insert-images medium-insert-images-wide" contenteditable="false">
                <figure contenteditable="false">
                    <img src="'.$image->url.'">
                </figure>
            </div>
        ';

        if (!$property->getOriginalDescription()) {
            return $image;
        }

        $description = $property->getOriginalDescription()->getDescription();
        $center = (strlen($description) / 2) - 1;
        $centerShifted = stripos($description, '.', $center) + 1;

        if ($centerShifted) {
            $center = $centerShifted;
        }

        $parts = str_split($description, $center);
        $body = $parts[0].' '.$image;

        if (isset($parts[1])) {
            $body .= $parts[1];
        }

        return $body;
    }

    /**
     * @param File[] $images
     *
     * @return string
     */
    private function buildGallery(array $images)
    {
        $footer = PHP_EOL.PHP_EOL;
        $rows = array_chunk($images, 3);
        $firstThreeRows = array_slice($rows, 0, 3);

        foreach ($firstThreeRows as $row) {
            $footer .= '<div class="medium-insert-images medium-insert-images-grid">';

            foreach ($row as $image) {
                $footer .=
                    '<figure>
                        <img src="'.$image->url.'">
                    </figure>
                ';
            }

            $footer .= '</div>'.PHP_EOL.PHP_EOL;
        }

        return $footer;
    }

    /**
     * @param Property $property
     *
     * @return string
     */
    private function buildLinkToProperty(Property $property)
    {
        $url = $this->router->generate('property_details', [
            'id' => $property->getId(),
            'slug' => $property->getSlug(),
        ], true);

        return sprintf(
            '<p>The original property, <a href="%s" title="%s">%s</a><p>',
            $url,
            $property->getName(),
            $property->getName()
        );
    }

    /**
     * @param Property $property
     *
     * @return File[]
     */
    private function uploadImages(Property $property)
    {
        $urls = [];

        foreach (array_slice($property->getPhotosOrdered(), 0, self::IMAGE_GALLERY_LIMIT) as $photo) {
            // In case of duplicated photos, possible bug.
            if (!in_array($photo->getUrl(), $urls)) {
                $urls[] = $photo->getUrl();
            }
        }

        $files = $this->fileManagerVirtual->save($urls, 'propertyImport');

        return $files;
    }
}
